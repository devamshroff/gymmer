// app/api/workout/[name]/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { WorkoutPlan } from '@/lib/types';
import { getRoutineByName, getRoutineExercises, getRoutineStretches, getDatabase, getRoutineById, isFavorited, getUserSettings } from '@/lib/database';
import { requireAuth } from '@/lib/auth-utils';
import { EXERCISE_TYPES } from '@/lib/constants';

function withWarmupFlags(workout: WorkoutPlan): WorkoutPlan {
  const exercises = workout.exercises.map((exercise) => {
    if (exercise.type === EXERCISE_TYPES.single) {
      const isBodyweight = exercise.isBodyweight ?? false;
      const hasWarmup = exercise.hasWarmup ?? !isBodyweight;
      return { ...exercise, isBodyweight, hasWarmup };
    }
    const exercisesWithFlags = exercise.exercises.map((item) => {
      const isBodyweight = item.isBodyweight ?? false;
      return { ...item, isBodyweight, hasWarmup: false };
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
            return NextResponse.json({ workout });
          }
        }
      }
    }

    // First, check if routine exists in database for this user
    const routine = await getRoutineByName(workoutName, user.id);

    if (routine) {
      // Load from database
      const workout = await loadRoutineFromDatabase(routine.id, workoutName, user.id);
      return NextResponse.json({ workout });
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
      return NextResponse.json({ workout });
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
        return NextResponse.json({ workout: withWarmupFlags(normalizedWorkout) });
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

    if (!isSuperset) {
      return {
        type: EXERCISE_TYPES.single,
        name: re.exercise_name,
        sets: defaultSets,
        targetReps: defaultTargetReps,
        targetWeight: defaultTargetWeight,
        warmupWeight: defaultWarmupWeight,
        hasWarmup: !isBodyweight,
        restTime: restTimeSeconds,
        videoUrl: re.video_url || '',
        tips: re.tips || '',
        isBodyweight
      };
    }

    return {
      type: EXERCISE_TYPES.b2b,
      restTime: supersetRestSeconds,
      exercises: [
        {
          name: re.exercise_name,
          sets: defaultSets,
          targetReps: defaultTargetReps,
          targetWeight: defaultTargetWeight,
          warmupWeight: defaultWarmupWeight,
          hasWarmup: false,
          videoUrl: re.video_url || '',
          tips: re.tips || '',
          isBodyweight
        },
        {
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
            : false
        }
      ] as [{
        name: string;
        sets: number;
        targetReps: number;
        targetWeight: number;
        warmupWeight: number;
        hasWarmup?: boolean;
        videoUrl: string;
        tips: string;
        isBodyweight?: boolean;
      }, {
        name: string;
        sets: number;
        targetReps: number;
        targetWeight: number;
        warmupWeight: number;
        hasWarmup?: boolean;
        videoUrl: string;
        tips: string;
        isBodyweight?: boolean;
      }]
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
