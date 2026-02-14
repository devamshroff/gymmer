// app/api/workout/[name]/route.ts
import { NextResponse } from 'next/server';
import { createHash } from 'crypto';
import fs from 'fs';
import path from 'path';
import { B2BExercise, WorkoutPlan } from '@/lib/types';
import {
  getRoutineByName,
  getRoutineExercises,
  getRoutineStretches,
  getDatabase,
  getRoutineById,
  isFavorited,
  getUserSettings,
  getLastExerciseLog,
  getLatestWorkoutReportForWorkoutName,
} from '@/lib/database';
import { requireAuth } from '@/lib/auth-utils';
import { EXERCISE_PRIMARY_METRICS, EXERCISE_TYPES } from '@/lib/constants';

function withWarmupFlags(workout: WorkoutPlan): WorkoutPlan {
  const exercises = workout.exercises.map((exercise) => {
    if (exercise.type === EXERCISE_TYPES.single) {
      const isBodyweight = exercise.isBodyweight ?? false;
      const hasWarmup = exercise.hasWarmup ?? !isBodyweight;
      const isMachine = exercise.isMachine ?? false;
      const primaryMetric = exercise.primaryMetric ?? (
        isBodyweight ? EXERCISE_PRIMARY_METRICS.repsOnly : EXERCISE_PRIMARY_METRICS.weight
      );
      const metricUnit = exercise.metricUnit ?? null;
      return { ...exercise, isBodyweight, hasWarmup, isMachine, primaryMetric, metricUnit };
    }
    const exercisesWithFlags = exercise.exercises.map((item) => {
      const isBodyweight = item.isBodyweight ?? false;
      const isMachine = item.isMachine ?? false;
      const primaryMetric = item.primaryMetric ?? (
        isBodyweight ? EXERCISE_PRIMARY_METRICS.repsOnly : EXERCISE_PRIMARY_METRICS.weight
      );
      const metricUnit = item.metricUnit ?? null;
      return { ...item, isBodyweight, hasWarmup: false, isMachine, primaryMetric, metricUnit };
    }) as typeof exercise.exercises;
    return {
      ...exercise,
      exercises: exercisesWithFlags,
    };
  });
  return { ...workout, exercises };
}

function normalizeStretches(stretches: Array<any> | undefined): WorkoutPlan['preWorkoutStretches'] {
  if (!Array.isArray(stretches)) return [];
  return stretches.map((stretch) => ({
    name: stretch.name,
    timerSeconds: Number.isFinite(Number(stretch.timerSeconds)) && Number(stretch.timerSeconds) > 0
      ? Math.round(Number(stretch.timerSeconds))
      : 0,
    videoUrl: stretch.videoUrl || '',
    tips: stretch.tips || ''
  }));
}

type RoutineMeta = {
  id?: number | null;
  name: string;
  updatedAt?: string | null;
  isPublic?: boolean | null;
  checksum?: string | null;
};

function collectExerciseNames(workout: WorkoutPlan): string[] {
  const names = new Set<string>();
  for (const exercise of workout.exercises) {
    if (exercise.type === EXERCISE_TYPES.single) {
      names.add(exercise.name);
    } else {
      const [ex1, ex2] = exercise.exercises;
      names.add(ex1.name);
      names.add(ex2.name);
    }
  }
  return Array.from(names);
}

function computeWorkoutChecksum(workout: WorkoutPlan): string {
  const payload = JSON.stringify(workout);
  return createHash('sha256').update(payload).digest('hex');
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const authResult = await requireAuth();
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const { name } = await params;
    const workoutName = decodeURIComponent(name);

    // Check for routineId query param (used when starting public/favorited routines)
    const url = new URL(request.url);
    const routineIdParam = url.searchParams.get('routineId');
    const isBootstrap = url.searchParams.get('bootstrap') === '1';

    const buildResponse = async (workout: WorkoutPlan, routineMeta?: RoutineMeta) => {
      if (!isBootstrap) {
        return NextResponse.json({ workout });
      }

      const settings = await getUserSettings(user.id);
      const exerciseNames = collectExerciseNames(workout);
      const lastSetEntries = await Promise.all(
        exerciseNames.map(async (exerciseName) => [
          exerciseName,
          await getLastExerciseLog(exerciseName, user.id),
        ] as const)
      );
      const lastSetSummaries = Object.fromEntries(lastSetEntries);
      const lastWorkoutReport = await getLatestWorkoutReportForWorkoutName(user.id, workout.name);
      const checksum = computeWorkoutChecksum(workout);
      const resolvedMeta: RoutineMeta = {
        name: workout.name,
        ...routineMeta,
        checksum,
      };

      return NextResponse.json({
        workout,
        settings,
        lastSetSummaries,
        lastWorkoutReport: lastWorkoutReport || null,
        routineMeta: resolvedMeta,
      });
    };

    if (routineIdParam) {
      const routineId = parseInt(routineIdParam);
      if (!isNaN(routineId)) {
        const routine = await getRoutineById(routineId);
        if (routine) {
          // Allow access if: user owns it, it's public, or user has favorited it
          const isOwner = routine.user_id === user.id;
          const isPublic = routine.is_public === 1;
          const hasFavorited = await isFavorited(user.id, routineId);

          if (isOwner || isPublic || hasFavorited) {
            const workout = await loadRoutineFromDatabase(routine.id, routine.name, user.id);
            return buildResponse(workout, {
              id: routine.id,
              name: routine.name,
              updatedAt: routine.updated_at ?? null,
              isPublic: routine.is_public ?? null,
            });
          }
        }
      }
    }

    // First, check if routine exists in database for this user
    const routine = await getRoutineByName(workoutName, user.id);

    if (routine) {
      // Load from database
      const workout = await loadRoutineFromDatabase(routine.id, workoutName, user.id);
      return buildResponse(workout, {
        id: routine.id,
        name: routine.name,
        updatedAt: routine.updated_at ?? null,
        isPublic: routine.is_public ?? null,
      });
    }

    // Check if it's a favorited routine by name
    const db = getDatabase();
    const favoritedRoutine = await db.execute({
      sql: `SELECT r.* FROM routines r
            JOIN routine_favorites rf ON r.id = rf.routine_id
            WHERE r.name = ? AND rf.user_id = ?`,
      args: [workoutName, user.id]
    });

    if (favoritedRoutine.rows.length > 0) {
      const routine = favoritedRoutine.rows[0] as any;
      const workout = await loadRoutineFromDatabase(routine.id, workoutName, user.id);
      return buildResponse(workout, {
        id: routine.id,
        name: routine.name,
        updatedAt: routine.updated_at ?? null,
        isPublic: routine.is_public ?? null,
      });
    }

    // Fall back to JSON files (for backwards compatibility during migration)
    const workoutPlansDir = path.join(process.cwd(), 'public', 'workout-plans');
    const files = fs.readdirSync(workoutPlansDir).filter(file => file.endsWith('.json'));

    for (const file of files) {
      const filePath = path.join(workoutPlansDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const workout = JSON.parse(fileContent) as any;

      if (workout.name === workoutName) {
        const normalizedWorkout: WorkoutPlan = {
          name: workout.name,
          exercises: workout.exercises,
          preWorkoutStretches: normalizeStretches(workout.preWorkoutStretches),
          postWorkoutStretches: normalizeStretches(workout.postWorkoutStretches),
          ...(workout.cardio ? { cardio: workout.cardio } : {})
        };
        return buildResponse(withWarmupFlags(normalizedWorkout), {
          id: null,
          name: workout.name,
          updatedAt: null,
          isPublic: null,
        });
      }
    }

    return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
  } catch (error) {
    console.error('Error fetching workout:', error);
    return NextResponse.json({ error: 'Failed to fetch workout' }, { status: 500 });
  }
}

async function loadRoutineFromDatabase(
  routineId: number,
  name: string,
  userId: string
): Promise<WorkoutPlan> {
  const db = getDatabase();
  const { restTimeSeconds, supersetRestSeconds } = await getUserSettings(userId);
  const defaultSets = 3;
  const defaultTargetReps = 10;
  const defaultTargetWeight = 0;
  const defaultWarmupWeight = 0;

  // Get exercises
  const routineExercises = await getRoutineExercises(routineId);
  const exercises = routineExercises.map((re: any) => {
    const isSuperset = Boolean(re.exercise_id2);
    const isBodyweight = typeof re.exercise_is_bodyweight === 'number'
      ? re.exercise_is_bodyweight === 1
      : false;
    const isMachine = typeof re.exercise_is_machine === 'number'
      ? re.exercise_is_machine === 1
      : false;
    const primaryMetric = typeof re.exercise_primary_metric === 'string'
      ? re.exercise_primary_metric
      : undefined;
    const metricUnit = typeof re.exercise_metric_unit === 'string'
      ? re.exercise_metric_unit
      : null;

    if (!isSuperset) {
      return {
        type: EXERCISE_TYPES.single,
        exerciseId: typeof re.exercise_id1 === 'number' ? re.exercise_id1 : undefined,
        name: re.exercise_name,
        sets: defaultSets,
        targetReps: defaultTargetReps,
        targetWeight: defaultTargetWeight,
        warmupWeight: defaultWarmupWeight,
        hasWarmup: !isBodyweight,
        restTime: restTimeSeconds,
        videoUrl: re.video_url || '',
        tips: re.tips || '',
        isBodyweight,
        isMachine,
        primaryMetric,
        metricUnit
      };
    }

    return {
      type: EXERCISE_TYPES.b2b,
      restTime: supersetRestSeconds,
      exercises: [
        {
          exerciseId: typeof re.exercise_id1 === 'number' ? re.exercise_id1 : undefined,
          name: re.exercise_name,
          sets: defaultSets,
          targetReps: defaultTargetReps,
          targetWeight: defaultTargetWeight,
          warmupWeight: defaultWarmupWeight,
          hasWarmup: false,
          videoUrl: re.video_url || '',
          tips: re.tips || '',
          isBodyweight,
          isMachine,
          primaryMetric,
          metricUnit
        },
        {
          exerciseId: typeof re.exercise_id2 === 'number' ? re.exercise_id2 : undefined,
          name: re.exercise2_name || '',
          sets: defaultSets,
          targetReps: defaultTargetReps,
          targetWeight: defaultTargetWeight,
          warmupWeight: defaultWarmupWeight,
          hasWarmup: false,
          videoUrl: re.exercise2_video_url || '',
          tips: re.exercise2_tips || '',
          isBodyweight: typeof re.exercise2_is_bodyweight === 'number'
            ? re.exercise2_is_bodyweight === 1
            : false,
          isMachine: typeof re.exercise2_is_machine === 'number'
            ? re.exercise2_is_machine === 1
            : false,
          primaryMetric: typeof re.exercise2_primary_metric === 'string'
            ? re.exercise2_primary_metric
            : undefined,
          metricUnit: typeof re.exercise2_metric_unit === 'string'
            ? re.exercise2_metric_unit
            : null
        }
      ] as B2BExercise['exercises']
    };
  });

  // Get pre-workout stretches
  const preStretches = await getRoutineStretches(routineId, 'pre');
  const preWorkoutStretches = preStretches.map((s: any) => ({
    name: s.name,
    timerSeconds: s.timer_seconds ?? 0,
    videoUrl: s.video_url || '',
    tips: s.tips || ''
  }));

  // Get post-workout stretches
  const postStretches = await getRoutineStretches(routineId, 'post');
  const postWorkoutStretches = postStretches.map((s: any) => ({
    name: s.name,
    timerSeconds: s.timer_seconds ?? 0,
    videoUrl: s.video_url || '',
    tips: s.tips || ''
  }));

  // Get cardio
  const cardioResult = await db.execute({
    sql: 'SELECT * FROM routine_cardio WHERE routine_id = ?',
    args: [routineId]
  });

  const cardio = cardioResult.rows[0] ? {
    type: (cardioResult.rows[0] as any).cardio_type,
    duration: (cardioResult.rows[0] as any).duration,
    intensity: (cardioResult.rows[0] as any).intensity || '',
    tips: (cardioResult.rows[0] as any).tips || ''
  } : undefined;

  return {
    ...withWarmupFlags({
      name,
      exercises,
      preWorkoutStretches,
      postWorkoutStretches,
      ...(cardio && { cardio })
    })
  };
}
