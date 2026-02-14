import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  ACTIVE_ROUTINE_TTL_MS,
  ACTIVE_ROUTINES_STORAGE_KEY,
  getActiveRoutines,
  removeActiveRoutine,
  removeActiveRoutineForSession,
  touchActiveRoutine,
} from '@/lib/active-routines';

describe('active-routines', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-31T10:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('stores and returns active routines', () => {
    const entries = touchActiveRoutine({
      sessionKey: '2026-01-31T10:00:00.000Z',
      userId: 'user-1',
      workoutName: 'Leg Day',
      routineId: 12,
      resumeIndex: 2,
      sessionId: 55,
      sessionData: {
        workoutName: 'Leg Day',
        routineId: 12,
        sessionId: 55,
        startTime: '2026-01-31T10:00:00.000Z',
        exercises: [],
        flow: null,
      },
    });

    expect(entries).toHaveLength(1);
    expect(entries[0]?.workoutName).toBe('Leg Day');
    expect(entries[0]?.resumeIndex).toBe(2);

    const stored = JSON.parse(localStorage.getItem(`${ACTIVE_ROUTINES_STORAGE_KEY}:user-1`) || '[]');
    expect(stored).toHaveLength(1);

    const fetched = getActiveRoutines('user-1');
    expect(fetched).toHaveLength(1);
    expect(fetched[0]?.sessionId).toBe(55);
  });

  it('filters out expired entries', () => {
    const past = new Date(Date.now() - (ACTIVE_ROUTINE_TTL_MS + 5 * 60 * 1000)).toISOString();
    localStorage.setItem(`${ACTIVE_ROUTINES_STORAGE_KEY}:user-1`, JSON.stringify([{
      sessionKey: '2026-01-30T10:00:00.000Z',
      userId: 'user-1',
      workoutName: 'Push Day',
      routineId: null,
      resumeIndex: 1,
      startTime: '2026-01-30T10:00:00.000Z',
      lastActiveAt: past,
    }]));

    const fetched = getActiveRoutines('user-1');
    expect(fetched).toHaveLength(0);
    expect(JSON.parse(localStorage.getItem(`${ACTIVE_ROUTINES_STORAGE_KEY}:user-1`) || '[]')).toHaveLength(0);
  });

  it('removes a specific entry', () => {
    touchActiveRoutine({
      sessionKey: '2026-01-31T10:00:00.000Z',
      userId: 'user-1',
      workoutName: 'Leg Day',
      resumeIndex: 0,
    });
    touchActiveRoutine({
      sessionKey: '2026-01-31T11:00:00.000Z',
      userId: 'user-1',
      workoutName: 'Pull Day',
      resumeIndex: 1,
    });

    const remaining = removeActiveRoutine('2026-01-31T10:00:00.000Z', 'user-1');
    expect(remaining).toHaveLength(1);
    expect(remaining[0]?.workoutName).toBe('Pull Day');
  });

  it('removes the latest matching routine when session key is missing', () => {
    touchActiveRoutine({
      sessionKey: '2026-01-31T10:00:00.000Z',
      userId: 'user-1',
      workoutName: 'Leg Day',
      routineId: null,
      resumeIndex: 0,
    });

    const remaining = removeActiveRoutineForSession({
      sessionKey: 'missing-key',
      userId: 'user-1',
      workoutName: 'Leg Day',
      routineId: null,
    });

    expect(remaining).toHaveLength(0);
  });
});
