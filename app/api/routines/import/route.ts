// app/api/routines/import/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';
import { requireAuth } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  const authResult = await requireAuth();
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const body = await request.json();
    const { workoutPlan, fileName } = body;

    if (!workoutPlan || !workoutPlan.name || !workoutPlan.exercises) {
      return NextResponse.json(
        { error: 'Invalid workout plan format' },
        { status: 400 }
      );
    }

    const db = getDatabase();

    // Check if routine already exists for this user
    const existing = await db.execute({
      sql: 'SELECT id FROM routines WHERE name = ? AND user_id = ?',
      args: [workoutPlan.name, user.id]
    });

    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: `A routine named "${workoutPlan.name}" already exists` },
        { status: 409 }
      );
    }

    // Create routine for this user
    const routineResult = await db.execute({
      sql: `INSERT INTO routines (name, user_id, description)
            VALUES (?, ?, ?)`,
      args: [workoutPlan.name, user.id, workoutPlan.description || null]
    });
    const routineId = Number(routineResult.lastInsertRowid);

    // Import exercises
    for (let i = 0; i < workoutPlan.exercises.length; i++) {
      const exercise = workoutPlan.exercises[i];

      if (exercise.type === 'single' && exercise.name) {
        const exerciseId = await getOrCreateExercise(db, exercise.name);

        await db.execute({
          sql: `INSERT INTO routine_exercises (
            routine_id, exercise_id, order_index, exercise_type,
            sets, target_reps, target_weight, warmup_weight, rest_time
          ) VALUES (?, ?, ?, 'single', ?, ?, ?, ?, ?)`,
          args: [
            routineId,
            exerciseId,
            i,
            exercise.sets || null,
            exercise.targetReps || null,
            exercise.targetWeight || null,
            exercise.warmupWeight || null,
            exercise.restTime || null
          ]
        });
      } else if (exercise.type === 'b2b' && exercise.exercises && exercise.exercises.length >= 2) {
        const ex1 = exercise.exercises[0];
        const ex2 = exercise.exercises[1];

        const exerciseId1 = await getOrCreateExercise(db, ex1.name);
        const exerciseId2 = await getOrCreateExercise(db, ex2.name);

        await db.execute({
          sql: `INSERT INTO routine_exercises (
            routine_id, exercise_id, order_index, exercise_type,
            sets, target_reps, target_weight, warmup_weight,
            b2b_partner_id, b2b_sets, b2b_target_reps, b2b_target_weight, b2b_warmup_weight
          ) VALUES (?, ?, ?, 'b2b', ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            routineId,
            exerciseId1,
            i,
            ex1.sets || null,
            ex1.targetReps || null,
            ex1.targetWeight || null,
            ex1.warmupWeight || null,
            exerciseId2,
            ex2.sets || null,
            ex2.targetReps || null,
            ex2.targetWeight || null,
            ex2.warmupWeight || null
          ]
        });
      }
    }

    // Import stretches
    if (workoutPlan.preWorkoutStretches) {
      for (let i = 0; i < workoutPlan.preWorkoutStretches.length; i++) {
        const stretch = workoutPlan.preWorkoutStretches[i];
        const stretchId = await getOrCreateStretch(db, stretch, 'pre_workout');
        await db.execute({
          sql: 'INSERT INTO routine_pre_stretches (routine_id, stretch_id, order_index) VALUES (?, ?, ?)',
          args: [routineId, stretchId, i]
        });
      }
    }

    if (workoutPlan.postWorkoutStretches) {
      for (let i = 0; i < workoutPlan.postWorkoutStretches.length; i++) {
        const stretch = workoutPlan.postWorkoutStretches[i];
        const stretchId = await getOrCreateStretch(db, stretch, 'post_workout');
        await db.execute({
          sql: 'INSERT INTO routine_post_stretches (routine_id, stretch_id, order_index) VALUES (?, ?, ?)',
          args: [routineId, stretchId, i]
        });
      }
    }

    // Import cardio
    if (workoutPlan.cardio) {
      await db.execute({
        sql: `INSERT INTO routine_cardio (routine_id, cardio_type, duration, intensity, tips)
              VALUES (?, ?, ?, ?, ?)`,
        args: [
          routineId,
          workoutPlan.cardio.type,
          workoutPlan.cardio.duration,
          workoutPlan.cardio.intensity || null,
          workoutPlan.cardio.tips || null
        ]
      });
    }

    return NextResponse.json({
      id: routineId,
      name: workoutPlan.name,
      success: true
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error importing routine:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to import routine' },
      { status: 500 }
    );
  }
}

async function getOrCreateExercise(db: any, name: string): Promise<number> {
  const existing = await db.execute({
    sql: 'SELECT id FROM exercises WHERE name = ?',
    args: [name]
  });

  if (existing.rows.length > 0) {
    return existing.rows[0].id;
  }

  const result = await db.execute({
    sql: 'INSERT INTO exercises (name) VALUES (?)',
    args: [name]
  });

  return Number(result.lastInsertRowid);
}

async function getOrCreateStretch(db: any, stretch: any, type: string): Promise<number> {
  const existing = await db.execute({
    sql: 'SELECT id FROM stretches WHERE name = ?',
    args: [stretch.name]
  });

  if (existing.rows.length > 0) {
    return existing.rows[0].id;
  }

  const result = await db.execute({
    sql: `INSERT INTO stretches (name, duration, type, video_url, tips)
          VALUES (?, ?, ?, ?, ?)`,
    args: [
      stretch.name,
      stretch.duration,
      type,
      stretch.videoUrl || null,
      stretch.tips || null
    ]
  });

  return Number(result.lastInsertRowid);
}
