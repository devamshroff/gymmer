import { describe, it, expect } from 'vitest';
import {
  calculateWorkoutProgress,
  type WorkoutProgressInput,
  type WorkoutSection,
} from '@/lib/workout-progress';

describe('Workout Progress Calculation', () => {
  const mockWorkout: WorkoutProgressInput = {
    preWorkoutStretches: [{ id: 1 }, { id: 2 }, { id: 3 }], // 3 pre-stretches
    exercises: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }], // 4 exercises
    postWorkoutStretches: [{ id: 1 }, { id: 2 }], // 2 post-stretches
    hasCardio: true,
  };

  describe('Total Items Calculation', () => {
    it('calculates total items correctly with all sections', () => {
      const result = calculateWorkoutProgress(mockWorkout, 'pre-stretch', 0);
      // 3 pre + 4 exercises + 1 cardio + 2 post = 10
      expect(result.totalItems).toBe(10);
    });

    it('calculates total items without cardio', () => {
      const workoutNoCardio = { ...mockWorkout, hasCardio: false };
      const result = calculateWorkoutProgress(workoutNoCardio, 'pre-stretch', 0);
      // 3 pre + 4 exercises + 0 cardio + 2 post = 9
      expect(result.totalItems).toBe(9);
    });

    it('handles empty pre-workout stretches', () => {
      const workoutNoPreStretches = { ...mockWorkout, preWorkoutStretches: [] };
      const result = calculateWorkoutProgress(workoutNoPreStretches, 'exercise', 0);
      // 0 pre + 4 exercises + 1 cardio + 2 post = 7
      expect(result.totalItems).toBe(7);
    });

    it('handles empty post-workout stretches', () => {
      const workoutNoPostStretches = { ...mockWorkout, postWorkoutStretches: [] };
      const result = calculateWorkoutProgress(workoutNoPostStretches, 'exercise', 0);
      // 3 pre + 4 exercises + 1 cardio + 0 post = 8
      expect(result.totalItems).toBe(8);
    });
  });

  describe('Pre-Workout Stretch Progress', () => {
    it('calculates progress for first pre-workout stretch', () => {
      const result = calculateWorkoutProgress(mockWorkout, 'pre-stretch', 0);
      expect(result.currentProgress).toBe(1);
      expect(result.progressPercentage).toBe(10); // 1/10 = 10%
    });

    it('calculates progress for second pre-workout stretch', () => {
      const result = calculateWorkoutProgress(mockWorkout, 'pre-stretch', 1);
      expect(result.currentProgress).toBe(2);
      expect(result.progressPercentage).toBe(20);
    });

    it('calculates progress for last pre-workout stretch', () => {
      const result = calculateWorkoutProgress(mockWorkout, 'pre-stretch', 2);
      expect(result.currentProgress).toBe(3);
      expect(result.progressPercentage).toBe(30);
    });
  });

  describe('Exercise Progress', () => {
    it('calculates progress for first exercise', () => {
      const result = calculateWorkoutProgress(mockWorkout, 'exercise', 0);
      // 3 pre-stretches + 1 (first exercise) = 4
      expect(result.currentProgress).toBe(4);
      expect(result.progressPercentage).toBe(40);
    });

    it('calculates progress for middle exercise', () => {
      const result = calculateWorkoutProgress(mockWorkout, 'exercise', 1);
      expect(result.currentProgress).toBe(5);
      expect(result.progressPercentage).toBe(50);
    });

    it('calculates progress for last exercise', () => {
      const result = calculateWorkoutProgress(mockWorkout, 'exercise', 3);
      // 3 pre + 4 exercises = 7
      expect(result.currentProgress).toBe(7);
      expect(result.progressPercentage).toBe(70);
    });
  });

  describe('Cardio Progress', () => {
    it('calculates progress for cardio', () => {
      const result = calculateWorkoutProgress(mockWorkout, 'cardio', 0);
      // 3 pre + 4 exercises + 1 cardio = 8
      expect(result.currentProgress).toBe(8);
      expect(result.progressPercentage).toBe(80);
    });
  });

  describe('Post-Workout Stretch Progress', () => {
    it('calculates progress for first post-workout stretch', () => {
      const result = calculateWorkoutProgress(mockWorkout, 'post-stretch', 0);
      // 3 pre + 4 exercises + 1 cardio + 1 = 9
      expect(result.currentProgress).toBe(9);
      expect(result.progressPercentage).toBe(90);
    });

    it('calculates progress for last post-workout stretch', () => {
      const result = calculateWorkoutProgress(mockWorkout, 'post-stretch', 1);
      // 3 pre + 4 exercises + 1 cardio + 2 = 10
      expect(result.currentProgress).toBe(10);
      expect(result.progressPercentage).toBe(100);
    });
  });

  describe('Edge Cases', () => {
    it('handles workout with only exercises', () => {
      const minimalWorkout: WorkoutProgressInput = {
        preWorkoutStretches: [],
        exercises: [{ id: 1 }, { id: 2 }],
        postWorkoutStretches: [],
        hasCardio: false,
      };
      const result = calculateWorkoutProgress(minimalWorkout, 'exercise', 0);
      expect(result.totalItems).toBe(2);
      expect(result.currentProgress).toBe(1);
      expect(result.progressPercentage).toBe(50);
    });

    it('returns 0 percentage for empty workout', () => {
      const emptyWorkout: WorkoutProgressInput = {
        preWorkoutStretches: [],
        exercises: [],
        postWorkoutStretches: [],
        hasCardio: false,
      };
      const result = calculateWorkoutProgress(emptyWorkout, 'exercise', 0);
      expect(result.totalItems).toBe(0);
      expect(result.progressPercentage).toBe(0);
    });
  });
});
