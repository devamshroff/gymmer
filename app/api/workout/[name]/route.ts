// app/api/workout/[name]/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { WorkoutPlan } from '@/lib/types';
import { getRoutineByName, getRoutineExercises, getRoutineStretches, getDatabase, getRoutineById, isFavorited } from '@/lib/database';
import { requireAuth } from '@/lib/auth-utils';

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
            const workout = await loadRoutineFromDatabase(routine.id, routine.name);
            return NextResponse.json({ workout });
          }
        }
      }
    }

    // First, check if routine exists in database for this user
    const routine = await getRoutineByName(workoutName, user.id);

    if (routine) {
      // Load from database
      const workout = await loadRoutineFromDatabase(routine.id, workoutName);
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
      const workout = await loadRoutineFromDatabase(routine.id, workoutName);
      return NextResponse.json({ workout });
    }

    // Fall back to JSON files (for backwards compatibility during migration)
    const workoutPlansDir = path.join(process.cwd(), 'public', 'workout-plans');
    const files = fs.readdirSync(workoutPlansDir).filter(file => file.endsWith('.json'));

    for (const file of files) {
      const filePath = path.join(workoutPlansDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const workout = JSON.parse(fileContent) as WorkoutPlan;

      if (workout.name === workoutName) {
        return NextResponse.json({ workout });
      }
    }

    return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
  } catch (error) {
    console.error('Error fetching workout:', error);
    return NextResponse.json({ error: 'Failed to fetch workout' }, { status: 500 });
  }
}

async function loadRoutineFromDatabase(routineId: number, name: string): Promise<WorkoutPlan> {
  const db = getDatabase();

  // Get exercises
  const routineExercises = await getRoutineExercises(routineId);
  const exercises = routineExercises.map((re: any) => {
    if (re.exercise_type === 'single') {
      return {
        type: 'single' as const,
        name: re.exercise_name,
        sets: re.sets || 3,
        targetReps: re.target_reps || 10,
        targetWeight: re.target_weight || 0,
        warmupWeight: re.warmup_weight || 0,
        restTime: re.rest_time || 60,
        videoUrl: re.video_url || '',
        tips: re.tips || ''
      };
    } else {
      // B2B exercise
      return {
        type: 'b2b' as const,
        restTime: re.rest_time || 30,
        exercises: [
          {
            name: re.exercise_name,
            sets: re.sets || 3,
            targetReps: re.target_reps || 10,
            targetWeight: re.target_weight || 0,
            warmupWeight: re.warmup_weight || 0,
            videoUrl: re.video_url || '',
            tips: re.tips || ''
          },
          {
            name: re.b2b_partner_name,
            sets: re.b2b_sets || 3,
            targetReps: re.b2b_target_reps || 10,
            targetWeight: re.b2b_target_weight || 0,
            warmupWeight: re.b2b_warmup_weight || 0,
            videoUrl: re.b2b_video_url || '',
            tips: re.b2b_tips || ''
          }
        ] as [{
          name: string;
          sets: number;
          targetReps: number;
          targetWeight: number;
          warmupWeight: number;
          videoUrl: string;
          tips: string;
        }, {
          name: string;
          sets: number;
          targetReps: number;
          targetWeight: number;
          warmupWeight: number;
          videoUrl: string;
          tips: string;
        }]
      };
    }
  });

  // Get pre-workout stretches
  const preStretches = await getRoutineStretches(routineId, 'pre');
  const preWorkoutStretches = preStretches.map((s: any) => ({
    name: s.name,
    duration: s.duration,
    timerSeconds: s.timer_seconds || 0,
    videoUrl: s.video_url || '',
    tips: s.tips || ''
  }));

  // Get post-workout stretches
  const postStretches = await getRoutineStretches(routineId, 'post');
  const postWorkoutStretches = postStretches.map((s: any) => ({
    name: s.name,
    duration: s.duration,
    timerSeconds: s.timer_seconds || 0,
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
    name,
    exercises,
    preWorkoutStretches,
    postWorkoutStretches,
    ...(cardio && { cardio })
  };
}
