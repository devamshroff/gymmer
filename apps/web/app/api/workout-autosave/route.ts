import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import {
  createWorkoutSession,
  getRoutineById,
  getWorkoutSessionById,
  getWorkoutSessionByKey,
  touchWorkoutSession,
  upsertWorkoutExerciseLog
} from '@/lib/database';
import { EXERCISE_TYPES } from '@/lib/constants';

type AutosaveEvent =
  | {
      type: 'start' | 'stretch' | 'exercise_skip' | 'exercise_end';
      phase?: 'pre' | 'post';
      index?: number;
    }
  | {
      type: 'single_set';
      exerciseName: string;
      setIndex: number;
      weight: number;
      reps: number;
      isWarmup?: boolean;
    }
  | {
      type: 'b2b_set';
      exerciseName: string;
      partnerName: string;
      setIndex: number;
      weight: number;
      reps: number;
      partnerWeight: number;
      partnerReps: number;
    };

type AutosavePayload = {
  sessionId?: number | null;
  workoutName?: string;
  routineId?: number | null;
  startTime?: string | null;
  event?: AutosaveEvent;
};

export async function POST(request: NextRequest) {
  const authResult = await requireAuth();
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const body = (await request.json()) as AutosavePayload;
    const routineId = typeof body.routineId === 'number' ? body.routineId : null;
    const workoutName = typeof body.workoutName === 'string' ? body.workoutName : '';
    const event = body.event;
    const sessionKey = typeof body.startTime === 'string' ? body.startTime : null;

    if (!workoutName) {
      return NextResponse.json({ error: 'workoutName is required' }, { status: 400 });
    }

    let sessionId = typeof body.sessionId === 'number' ? body.sessionId : null;
    let session = sessionId ? await getWorkoutSessionById(sessionId, user.id) : null;

    if (!session && sessionKey) {
      const existingByKey = await getWorkoutSessionByKey(user.id, sessionKey);
      if (existingByKey) {
        session = existingByKey;
        sessionId = Number(existingByKey.id);
      }
    }

    if (!session) {
      let finalWorkoutName = workoutName;
      if (routineId !== null) {
        const routine = await getRoutineById(routineId);
        if (routine?.name) {
          finalWorkoutName = routine.name;
        }
      }

      try {
        sessionId = await createWorkoutSession({
          user_id: user.id,
          routine_id: routineId,
          session_key: sessionKey,
          workout_plan_name: finalWorkoutName,
          date_completed: sessionKey || new Date().toISOString(),
        });
      } catch (error: any) {
        const message = String(error?.message || error);
        if (message.includes('UNIQUE') && sessionKey) {
          const existingByKey = await getWorkoutSessionByKey(user.id, sessionKey);
          if (existingByKey) {
            sessionId = Number(existingByKey.id);
          }
        } else {
          throw error;
        }
      }

      if (sessionId !== null) {
        session = await getWorkoutSessionById(sessionId, user.id);
      }
    }

    if (!session || sessionId === null) {
      return NextResponse.json({ error: 'Failed to start session' }, { status: 500 });
    }

    await touchWorkoutSession(sessionId, user.id, {
      routine_id: routineId,
      workout_plan_name: workoutName,
    });

    if (event?.type === 'single_set') {
      const setIndex = Math.max(0, Math.min(4, Number(event.setIndex)));
      if (event.isWarmup) {
        await upsertWorkoutExerciseLog({
          session_id: sessionId,
          exercise_name: event.exerciseName,
          exercise_type: EXERCISE_TYPES.single,
          warmup_weight: event.weight,
          warmup_reps: event.reps,
        });
      } else if (setIndex >= 1) {
        await upsertWorkoutExerciseLog({
          session_id: sessionId,
          exercise_name: event.exerciseName,
          exercise_type: EXERCISE_TYPES.single,
          [`set${setIndex}_weight`]: event.weight,
          [`set${setIndex}_reps`]: event.reps,
        });
      }
    }

    if (event?.type === 'b2b_set') {
      const setIndex = Math.max(1, Math.min(4, Number(event.setIndex)));
      await upsertWorkoutExerciseLog({
        session_id: sessionId,
        exercise_name: event.exerciseName,
        exercise_type: EXERCISE_TYPES.b2b,
        b2b_partner_name: event.partnerName,
        [`set${setIndex}_weight`]: event.weight,
        [`set${setIndex}_reps`]: event.reps,
        [`b2b_set${setIndex}_weight`]: event.partnerWeight,
        [`b2b_set${setIndex}_reps`]: event.partnerReps,
      });
    }

    return NextResponse.json({ success: true, sessionId });
  } catch (error) {
    console.error('Error autosaving workout:', error);
    return NextResponse.json({ error: 'Failed to autosave workout' }, { status: 500 });
  }
}
