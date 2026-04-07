import { beforeEach, describe, expect, it } from 'vitest';
import {
  clearFreeWorkoutSetupCache,
  clearFreeWorkoutSetup,
  loadFreeWorkoutSetupCache,
  loadFreeWorkoutSetup,
  loadSessionTargetsMeta,
  loadSessionWorkout,
  saveFreeWorkoutSetupCache,
  saveFreeWorkoutSetup,
  saveSessionTargetsMeta,
  saveSessionWorkout,
} from '@/lib/session-workout';

describe('session-workout', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('stores and loads free workout bootstrap data', () => {
    saveFreeWorkoutSetup({
      sessionMode: 'light',
      source: 'ai',
      encouragement: 'Take it easy.',
      goalSummary: 'Keep the session moving.',
      trendSummary: 'Bench is trending up.',
      targetsByExercise: {
        'Bench Press': { suggestedWeight: 135, suggestedReps: 8 },
      },
      popularExercises: [
        {
          id: 1,
          name: 'Bench Press',
          video_url: null,
          tips: null,
          history_count: 12,
          recent_count: 4,
        },
      ],
      popularSupersets: [
        {
          exercise1: { id: 1, name: 'Bench Press', video_url: null, tips: null },
          exercise2: { id: 2, name: 'Chest Fly', video_url: null, tips: null },
          totalCount: 5,
          recentCount: 2,
          lastUsedAt: '2026-04-01T12:00:00.000Z',
        },
      ],
    });

    expect(loadFreeWorkoutSetup()).toEqual({
      sessionMode: 'light',
      source: 'ai',
      encouragement: 'Take it easy.',
      goalSummary: 'Keep the session moving.',
      trendSummary: 'Bench is trending up.',
      targetsByExercise: {
        'Bench Press': { suggestedWeight: 135, suggestedReps: 8 },
      },
      popularExercises: [
        {
          id: 1,
          name: 'Bench Press',
          video_url: null,
          tips: null,
          history_count: 12,
          recent_count: 4,
        },
      ],
      popularSupersets: [
        {
          exercise1: { id: 1, name: 'Bench Press', video_url: null, tips: null },
          exercise2: { id: 2, name: 'Chest Fly', video_url: null, tips: null },
          totalCount: 5,
          recentCount: 2,
          lastUsedAt: '2026-04-01T12:00:00.000Z',
        },
      ],
    });

    clearFreeWorkoutSetup();
    expect(loadFreeWorkoutSetup()).toBeNull();
  });

  it('keeps workout overrides and targets meta keyed by workout name', () => {
    saveSessionWorkout({
      name: 'Free Workout',
      exercises: [],
      preWorkoutStretches: [],
      postWorkoutStretches: [],
    }, null);
    saveSessionTargetsMeta('Free Workout', null, {
      encouragement: 'Ready.',
      goalSummary: 'Move fast.',
      trendSummary: null,
      source: 'ai',
      sessionMode: 'progress',
    });

    expect(loadSessionWorkout('Free Workout', null)?.name).toBe('Free Workout');
    expect(loadSessionTargetsMeta('Free Workout', null)?.sessionMode).toBe('progress');
  });

  it('stores and clears free workout caches by mode', () => {
    saveFreeWorkoutSetupCache('progress', {
      sessionMode: 'progress',
      source: 'fallback',
      encouragement: 'Ready.',
      goalSummary: 'Progress mode cache.',
      trendSummary: null,
      targetsByExercise: {},
      popularExercises: [],
      popularSupersets: [],
    });

    expect(loadFreeWorkoutSetupCache('progress')?.sessionMode).toBe('progress');
    clearFreeWorkoutSetupCache('progress');
    expect(loadFreeWorkoutSetupCache('progress')).toBeNull();
  });
});
