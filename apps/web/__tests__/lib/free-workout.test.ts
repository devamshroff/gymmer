import { describe, expect, it } from 'vitest';
import { EXERCISE_TYPES } from '@/lib/constants';
import type { WorkoutPlan } from '@/lib/types';
import { extractRoutineExerciseDrafts, resolveRoutineExerciseIds } from '@/lib/free-workout';

function buildPlan(): WorkoutPlan {
  return {
    name: 'Test Plan',
    preWorkoutStretches: [],
    postWorkoutStretches: [],
    exercises: [
      {
        type: EXERCISE_TYPES.single,
        exerciseId: 11,
        name: 'Squat',
        sets: 3,
        targetReps: 10,
        targetWeight: 0,
        warmupWeight: 0,
        restTime: 60,
        videoUrl: '',
        tips: '',
      },
      {
        type: EXERCISE_TYPES.b2b,
        restTime: 30,
        exercises: [
          {
            exerciseId: 22,
            name: 'Push-up',
            sets: 3,
            targetReps: 10,
            targetWeight: 0,
            warmupWeight: 0,
            hasWarmup: false,
            videoUrl: '',
            tips: '',
          },
          {
            exerciseId: 33,
            name: 'Row',
            sets: 3,
            targetReps: 10,
            targetWeight: 0,
            warmupWeight: 0,
            hasWarmup: false,
            videoUrl: '',
            tips: '',
          },
        ],
      },
    ],
  };
}

describe('extractRoutineExerciseDrafts', () => {
  it('maps exercise ids and names from a workout plan', () => {
    const plan = buildPlan();
    const drafts = extractRoutineExerciseDrafts(plan);
    expect(drafts).toEqual([
      { exerciseId1: 11, exerciseId2: null, name1: 'Squat', name2: null },
      { exerciseId1: 22, exerciseId2: 33, name1: 'Push-up', name2: 'Row' },
    ]);
  });
});

describe('resolveRoutineExerciseIds', () => {
  it('fills missing ids from a name map', () => {
    const drafts = [
      { exerciseId1: null, exerciseId2: null, name1: 'Squat', name2: null },
      { exerciseId1: 22, exerciseId2: null, name1: 'Push-up', name2: 'Row' },
    ];
    const map = new Map<string, number>([
      ['squat', 11],
      ['row', 33],
    ]);
    const resolved = resolveRoutineExerciseIds(drafts, map);
    expect(resolved.missing).toEqual([]);
    expect(resolved.resolved).toEqual([
      { exerciseId1: 11, exerciseId2: null },
      { exerciseId1: 22, exerciseId2: 33 },
    ]);
  });

  it('reports missing exercises when ids cannot be resolved', () => {
    const drafts = [
      { exerciseId1: null, exerciseId2: null, name1: 'Unknown', name2: null },
    ];
    const resolved = resolveRoutineExerciseIds(drafts, new Map());
    expect(resolved.missing).toEqual(['Unknown']);
  });
});
