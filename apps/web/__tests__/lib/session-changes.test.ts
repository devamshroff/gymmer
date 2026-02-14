import { beforeEach, describe, expect, it } from 'vitest';
import {
  addSessionExerciseChange,
  addSessionStretchChange,
  clearSessionChanges,
  hasSessionChanges,
  loadSessionChanges,
  removeSessionExerciseChange,
  removeSessionStretchChange,
} from '@/lib/session-changes';

describe('session-changes', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('stores and removes exercise changes', () => {
    addSessionExerciseChange({
      workoutName: 'E2E Routine',
      routineId: '12',
      mode: 'single',
      origin: 'add',
      exercise1: { id: 101, name: 'Landmine Press' },
    });

    const stored = loadSessionChanges('E2E Routine', '12');
    expect(stored?.exercises).toHaveLength(1);
    expect(stored?.exercises[0].exercise1.name).toBe('Landmine Press');
    expect(hasSessionChanges(stored)).toBe(true);

    const next = removeSessionExerciseChange({
      workoutName: 'E2E Routine',
      routineId: '12',
      changeId: stored?.exercises[0].id ?? '',
    });
    expect(next.exercises).toHaveLength(0);
    expect(hasSessionChanges(next)).toBe(false);
  });

  it('tracks pre and post stretch changes separately', () => {
    addSessionStretchChange({
      workoutName: 'E2E Routine',
      routineId: '9',
      stretchType: 'pre',
      origin: 'add',
      stretch: { id: 201, name: 'Chest Opener', timer_seconds: 30, muscle_groups: null },
    });
    addSessionStretchChange({
      workoutName: 'E2E Routine',
      routineId: '9',
      stretchType: 'post',
      origin: 'add',
      stretch: { id: 202, name: 'Quad Stretch', timer_seconds: 45, muscle_groups: null },
    });

    const stored = loadSessionChanges('E2E Routine', '9');
    expect(stored?.preStretches).toHaveLength(1);
    expect(stored?.postStretches).toHaveLength(1);

    const next = removeSessionStretchChange({
      workoutName: 'E2E Routine',
      routineId: '9',
      changeId: stored?.preStretches[0].id ?? '',
      stretchType: 'pre',
    });

    expect(next.preStretches).toHaveLength(0);
    expect(next.postStretches).toHaveLength(1);
  });

  it('clears session changes by key', () => {
    addSessionExerciseChange({
      workoutName: 'Leg Day',
      routineId: '3',
      mode: 'single',
      origin: 'add',
      exercise1: { id: 11, name: 'Split Squat' },
    });

    clearSessionChanges('Leg Day', '3');
    expect(loadSessionChanges('Leg Day', '3')).toBeNull();
  });
});
