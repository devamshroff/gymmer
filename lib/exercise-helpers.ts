/**
 * Exercise Type Helpers
 *
 * Type guards and utility functions for working with exercises.
 * Handles the distinction between single exercises and B2B (back-to-back) supersets.
 */

// Re-export types from the main types file for convenience
export interface SingleExercise {
  type: 'single';
  name: string;
  sets: number;
  targetReps: number;
  targetWeight: number;
  warmupWeight: number;
  hasWarmup?: boolean;
  isBodyweight?: boolean;
  restTime: number;
  tips: string;
  videoUrl: string;
}

export interface B2BExerciseItem {
  name: string;
  sets: number;
  targetReps: number;
  targetWeight: number;
  tips: string;
  videoUrl: string;
}

export interface B2BExercise {
  type: 'b2b';
  exercises: [B2BExerciseItem, B2BExerciseItem];
}

export type Exercise = SingleExercise | B2BExercise;

/**
 * Type guard to check if an exercise is a B2B superset
 */
export function isB2BExercise(exercise: Exercise): exercise is B2BExercise {
  return exercise.type === 'b2b';
}

/**
 * Type guard to check if an exercise is a single exercise
 */
export function isSingleExercise(exercise: Exercise): exercise is SingleExercise {
  return exercise.type === 'single';
}

/**
 * Get the display name for an exercise
 *
 * @param exercise - The exercise to get the name for
 * @param primaryOnly - If true, only return the first exercise name for B2B
 */
export function getExerciseName(exercise: Exercise, primaryOnly = false): string {
  if (isSingleExercise(exercise)) {
    return exercise.name;
  }

  // B2B exercise
  if (primaryOnly) {
    return exercise.exercises[0].name;
  }
  return `${exercise.exercises[0].name} / ${exercise.exercises[1].name}`;
}

/**
 * Single exercise display info
 */
export interface SingleExerciseDisplayInfo {
  type: 'single';
  name: string;
  sets: number;
  targetReps: number;
  targetWeight: number;
  warmupWeight: number;
  restTime: number;
  tips: string;
  videoUrl: string;
  hasWarmup: boolean;
}

/**
 * B2B exercise display info
 */
export interface B2BExerciseDisplayInfo {
  type: 'b2b';
  name: string;
  sets: number;
  exercise1: {
    name: string;
    targetReps: number;
    targetWeight: number;
    tips: string;
    videoUrl: string;
  };
  exercise2: {
    name: string;
    targetReps: number;
    targetWeight: number;
    tips: string;
    videoUrl: string;
  };
}

export type ExerciseDisplayInfo = SingleExerciseDisplayInfo | B2BExerciseDisplayInfo;

/**
 * Get display information for an exercise, with computed properties
 */
export function getExerciseDisplayInfo(exercise: Exercise): ExerciseDisplayInfo {
  if (isSingleExercise(exercise)) {
    const hasWarmup = typeof exercise.hasWarmup === 'boolean'
      ? exercise.hasWarmup
      : !exercise.isBodyweight;
    return {
      type: 'single',
      name: exercise.name,
      sets: exercise.sets,
      targetReps: exercise.targetReps,
      targetWeight: exercise.targetWeight,
      warmupWeight: exercise.warmupWeight,
      restTime: exercise.restTime,
      tips: exercise.tips,
      videoUrl: exercise.videoUrl,
      hasWarmup,
    };
  }

  // B2B exercise
  const ex1 = exercise.exercises[0];
  const ex2 = exercise.exercises[1];

  return {
    type: 'b2b',
    name: `${ex1.name} / ${ex2.name}`,
    sets: ex1.sets,
    exercise1: {
      name: ex1.name,
      targetReps: ex1.targetReps,
      targetWeight: ex1.targetWeight,
      tips: ex1.tips,
      videoUrl: ex1.videoUrl,
    },
    exercise2: {
      name: ex2.name,
      targetReps: ex2.targetReps,
      targetWeight: ex2.targetWeight,
      tips: ex2.tips,
      videoUrl: ex2.videoUrl,
    },
  };
}

/**
 * Safely get exercise at index, with type checking
 * Returns the exercise and a type-safe way to access its properties
 */
export function getExerciseAtIndex(
  exercises: Exercise[],
  index: number
): Exercise | null {
  if (index < 0 || index >= exercises.length) {
    return null;
  }
  return exercises[index];
}
