import { describe, it, expect } from 'vitest';
import {
  isB2BExercise,
  isSingleExercise,
  getExerciseName,
  getExerciseDisplayInfo,
  type Exercise,
  type SingleExercise,
  type B2BExercise,
} from '@/lib/exercise-helpers';

describe('Exercise Type Helpers', () => {
  const singleExercise: SingleExercise = {
    type: 'single',
    name: 'Bench Press',
    sets: 3,
    targetReps: 10,
    targetWeight: 185,
    warmupWeight: 135,
    restTime: 90,
    tips: 'Keep your back flat',
    videoUrl: 'https://youtube.com/watch?v=123',
  };

  const b2bExercise: B2BExercise = {
    type: 'b2b',
    exercises: [
      {
        name: 'Lateral Raises',
        sets: 3,
        targetReps: 12,
        targetWeight: 20,
        tips: 'Control the movement',
        videoUrl: 'https://youtube.com/watch?v=456',
      },
      {
        name: 'Front Raises',
        sets: 3,
        targetReps: 12,
        targetWeight: 15,
        tips: 'Keep arms straight',
        videoUrl: 'https://youtube.com/watch?v=789',
      },
    ],
  };

  describe('isB2BExercise', () => {
    it('returns true for B2B exercise', () => {
      expect(isB2BExercise(b2bExercise)).toBe(true);
    });

    it('returns false for single exercise', () => {
      expect(isB2BExercise(singleExercise)).toBe(false);
    });
  });

  describe('isSingleExercise', () => {
    it('returns true for single exercise', () => {
      expect(isSingleExercise(singleExercise)).toBe(true);
    });

    it('returns false for B2B exercise', () => {
      expect(isSingleExercise(b2bExercise)).toBe(false);
    });
  });

  describe('getExerciseName', () => {
    it('returns name for single exercise', () => {
      expect(getExerciseName(singleExercise)).toBe('Bench Press');
    });

    it('returns combined name for B2B exercise', () => {
      expect(getExerciseName(b2bExercise)).toBe('Lateral Raises / Front Raises');
    });

    it('returns first exercise name for B2B with primaryOnly flag', () => {
      expect(getExerciseName(b2bExercise, true)).toBe('Lateral Raises');
    });
  });

  describe('getExerciseDisplayInfo', () => {
    it('returns correct display info for single exercise', () => {
      const info = getExerciseDisplayInfo(singleExercise);
      expect(info).toEqual({
        type: 'single',
        name: 'Bench Press',
        sets: 3,
        targetReps: 10,
        targetWeight: 185,
        warmupWeight: 135,
        restTime: 90,
        tips: 'Keep your back flat',
        videoUrl: 'https://youtube.com/watch?v=123',
        hasWarmup: true,
      });
    });

    it('returns correct display info for B2B exercise', () => {
      const info = getExerciseDisplayInfo(b2bExercise);
      expect(info).toEqual({
        type: 'b2b',
        name: 'Lateral Raises / Front Raises',
        sets: 3,
        exercise1: {
          name: 'Lateral Raises',
          targetReps: 12,
          targetWeight: 20,
          tips: 'Control the movement',
          videoUrl: 'https://youtube.com/watch?v=456',
        },
        exercise2: {
          name: 'Front Raises',
          targetReps: 12,
          targetWeight: 15,
          tips: 'Keep arms straight',
          videoUrl: 'https://youtube.com/watch?v=789',
        },
      });
    });

    it('correctly identifies when warmup is not needed', () => {
      const noWarmupExercise: SingleExercise = {
        ...singleExercise,
        warmupWeight: 185, // Same as target weight
      };
      const info = getExerciseDisplayInfo(noWarmupExercise);
      expect(info.hasWarmup).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('handles single exercise with missing optional fields', () => {
      const minimalExercise: SingleExercise = {
        type: 'single',
        name: 'Squats',
        sets: 3,
        targetReps: 8,
        targetWeight: 225,
        warmupWeight: 225,
        restTime: 120,
        tips: '',
        videoUrl: '',
      };
      const info = getExerciseDisplayInfo(minimalExercise);
      expect(info.name).toBe('Squats');
      expect(info.hasWarmup).toBe(false);
    });
  });
});

describe('Exercise Type Guards for Review Mode', () => {
  // These tests ensure the fix for the B2B review mode bug works correctly
  const exercises: Exercise[] = [
    {
      type: 'single',
      name: 'Exercise 1',
      sets: 3,
      targetReps: 10,
      targetWeight: 100,
      warmupWeight: 50,
      restTime: 60,
      tips: '',
      videoUrl: '',
    },
    {
      type: 'b2b',
      exercises: [
        { name: 'B2B Ex 1', sets: 3, targetReps: 10, targetWeight: 20, tips: '', videoUrl: '' },
        { name: 'B2B Ex 2', sets: 3, targetReps: 10, targetWeight: 20, tips: '', videoUrl: '' },
      ],
    },
    {
      type: 'single',
      name: 'Exercise 3',
      sets: 3,
      targetReps: 10,
      targetWeight: 150,
      warmupWeight: 75,
      restTime: 60,
      tips: '',
      videoUrl: '',
    },
  ];

  it('correctly identifies exercise types when navigating through mixed list', () => {
    // Simulating review mode navigation
    expect(isSingleExercise(exercises[0])).toBe(true);
    expect(isB2BExercise(exercises[0])).toBe(false);

    expect(isSingleExercise(exercises[1])).toBe(false);
    expect(isB2BExercise(exercises[1])).toBe(true);

    expect(isSingleExercise(exercises[2])).toBe(true);
    expect(isB2BExercise(exercises[2])).toBe(false);
  });

  it('safely accesses B2B exercise properties only for B2B type', () => {
    exercises.forEach((exercise, index) => {
      if (isB2BExercise(exercise)) {
        // TypeScript should narrow this to B2BExercise
        expect(exercise.exercises).toBeDefined();
        expect(exercise.exercises.length).toBe(2);
      } else if (isSingleExercise(exercise)) {
        // TypeScript should narrow this to SingleExercise
        expect(exercise.name).toBeDefined();
        expect(exercise.warmupWeight).toBeDefined();
      }
    });
  });
});
