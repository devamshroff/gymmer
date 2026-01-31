// app/api/save-workout/route.ts
import { NextResponse } from 'next/server';
import { createWorkoutSession, logCardio, getRoutineById, getWorkoutSessionById, updateWorkoutSession, upsertWorkoutExerciseLog } from '@/lib/database';
import { WorkoutSessionData } from '@/lib/workout-session';
import { requireAuth } from '@/lib/auth-utils';

export async function POST(request: Request) {
  const authResult = await requireAuth();
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const sessionData: WorkoutSessionData = await request.json();
    const routineIdCandidate = typeof sessionData.routineId === 'number'
      ? sessionData.routineId
      : Number(sessionData.routineId);
    const routineId = Number.isFinite(routineIdCandidate) ? routineIdCandidate : null;
    const sessionIdCandidate = typeof sessionData.sessionId === 'number'
      ? sessionData.sessionId
      : Number(sessionData.sessionId);
    const sessionId = Number.isFinite(sessionIdCandidate) ? sessionIdCandidate : null;
    let workoutName = sessionData.workoutName;

    if (routineId !== null) {
      const routine = await getRoutineById(routineId);
      if (routine?.name) {
        workoutName = routine.name;
      }
    }

    // Calculate total duration in minutes
    const startTime = new Date(sessionData.startTime);
    const endTime = new Date();
    const totalDurationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 60000);

    // Calculate total strain (sum of all volume)
    let totalStrain = 0;
    for (const exercise of sessionData.exercises) {
      if (exercise.warmup) {
        totalStrain += exercise.warmup.weight * exercise.warmup.reps;
      }
      for (const set of exercise.sets) {
        totalStrain += set.weight * set.reps;
      }
      if (exercise.b2bPartner) {
        if (exercise.b2bPartner.warmup) {
          totalStrain += exercise.b2bPartner.warmup.weight * exercise.b2bPartner.warmup.reps;
        }
        for (const set of exercise.b2bPartner.sets) {
          totalStrain += set.weight * set.reps;
        }
      }
    }

    // Create workout session
    let activeSessionId = sessionId;
    if (activeSessionId !== null) {
      const existing = await getWorkoutSessionById(activeSessionId, user.id);
      if (!existing) {
        activeSessionId = null;
      }
    }

    if (activeSessionId === null) {
      activeSessionId = await createWorkoutSession({
        user_id: user.id,
        routine_id: routineId,
        session_key: sessionData.startTime,
        workout_plan_name: workoutName,
        date_completed: endTime.toISOString(),
        total_duration_minutes: totalDurationMinutes,
        total_strain: Math.round(totalStrain),
      });
    } else {
      await updateWorkoutSession(activeSessionId, user.id, {
        routine_id: routineId,
        workout_plan_name: workoutName,
        date_completed: endTime.toISOString(),
        total_duration_minutes: totalDurationMinutes,
        total_strain: Math.round(totalStrain),
      });
    }

    // Log all exercises
    for (const exercise of sessionData.exercises) {
      const exerciseLog: any = {
        session_id: activeSessionId,
        exercise_name: exercise.name,
        exercise_type: exercise.type,
      };

      // Add warmup if present
      if (exercise.warmup) {
        exerciseLog.warmup_weight = exercise.warmup.weight;
        exerciseLog.warmup_reps = exercise.warmup.reps;
      }

      // Add working sets (up to 4)
      exercise.sets.forEach((set, index) => {
        if (index < 4) {
          exerciseLog[`set${index + 1}_weight`] = set.weight;
          exerciseLog[`set${index + 1}_reps`] = set.reps;
        }
      });

      // Add B2B partner data if present
      if (exercise.b2bPartner) {
        exerciseLog.b2b_partner_name = exercise.b2bPartner.name;

        if (exercise.b2bPartner.warmup) {
          exerciseLog.b2b_warmup_weight = exercise.b2bPartner.warmup.weight;
          exerciseLog.b2b_warmup_reps = exercise.b2bPartner.warmup.reps;
        }

        exercise.b2bPartner.sets.forEach((set, index) => {
          if (index < 4) {
            exerciseLog[`b2b_set${index + 1}_weight`] = set.weight;
            exerciseLog[`b2b_set${index + 1}_reps`] = set.reps;
          }
        });
      }

      await upsertWorkoutExerciseLog(exerciseLog);
    }

    // Log cardio if present
    if (sessionData.cardio) {
      await logCardio({
        session_id: activeSessionId,
        cardio_type: sessionData.cardio.type,
        time: sessionData.cardio.time,
        speed: sessionData.cardio.speed,
        incline: sessionData.cardio.incline,
      });
    }

    return NextResponse.json({
      success: true,
      sessionId: activeSessionId,
      totalDurationMinutes,
      totalStrain: Math.round(totalStrain),
    });
  } catch (error) {
    console.error('Error saving workout session:', error);
    return NextResponse.json(
      { error: 'Failed to save workout session' },
      { status: 500 }
    );
  }
}
