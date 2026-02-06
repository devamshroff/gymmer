import { beforeEach, describe, expect, it } from 'vitest';
import {
  addExerciseToSession,
  getWorkoutSession,
  initWorkoutSession,
  updateExerciseInSession,
  updateWorkoutFlowState,
} from '@/lib/workout-session';
import { EXERCISE_TYPES } from '@/lib/constants';

describe('workout-session', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns the session index when adding an exercise', () => {
    initWorkoutSession('Leg Day', null);

    const index = addExerciseToSession({
      name: 'Back Squat',
      type: EXERCISE_TYPES.single,
      sets: [{ weight: 100, reps: 8 }],
    });

    const session = getWorkoutSession();
    expect(index).toBe(0);
    expect(session?.exercises.length).toBe(1);
    expect(session?.exercises[0].name).toBe('Back Squat');
  });

  it('updates a session exercise in place', () => {
    initWorkoutSession('Push Day', null);

    addExerciseToSession({
      name: 'Bench Press',
      type: EXERCISE_TYPES.single,
      warmup: { weight: 45, reps: 10 },
      sets: [{ weight: 135, reps: 8 }],
    });

    updateExerciseInSession(0, (exercise) => ({
      ...exercise,
      warmup: { weight: 65, reps: 8 },
      sets: [{ weight: 155, reps: 6 }],
    }));

    const session = getWorkoutSession();
    expect(session?.exercises[0].warmup).toEqual({ weight: 65, reps: 8 });
    expect(session?.exercises[0].sets[0]).toEqual({ weight: 155, reps: 6 });
  });

  it('returns a stable snapshot when storage does not change', () => {
    initWorkoutSession('Core Day', null);

    const first = getWorkoutSession();
    const second = getWorkoutSession();

    expect(first).toBe(second);
  });

  it('returns a new snapshot after flow updates', () => {
    initWorkoutSession('Core Day', null);

    const first = getWorkoutSession();
    updateWorkoutFlowState((state) => ({
      ...state,
      currentExerciseIndex: state.currentExerciseIndex + 1,
    }));
    const second = getWorkoutSession();

    expect(first).not.toBe(second);
    expect(second?.flow?.currentExerciseIndex).toBe(1);
  });
});
