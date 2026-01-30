import { getWorkoutSession, setWorkoutSessionId } from '@/lib/workout-session';

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

type AutosaveStatus = 'saving' | 'success' | 'error';

function emitAutosave(status: AutosaveStatus, eventType: string) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('workout-autosave', {
    detail: {
      status,
      eventType,
      at: Date.now(),
    }
  }));
}

export async function autosaveWorkout(event: AutosaveEvent): Promise<void> {
  if (typeof window === 'undefined') return;
  const session = getWorkoutSession();
  if (!session) return;

  emitAutosave('saving', event.type);

  try {
    const response = await fetch('/api/workout-autosave', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: session.sessionId ?? null,
        workoutName: session.workoutName,
        routineId: session.routineId ?? null,
        sessionMode: session.sessionMode,
        startTime: session.startTime,
        event,
      }),
    });

    if (!response.ok) {
      emitAutosave('error', event.type);
      return;
    }

    const data = await response.json();
    if (typeof data?.sessionId === 'number') {
      setWorkoutSessionId(data.sessionId);
    }
    emitAutosave('success', event.type);
  } catch (error) {
    console.error('Autosave failed:', error);
    emitAutosave('error', event.type);
  }
}
