/**
 * Workout Progress Calculation Utility
 *
 * Centralizes the progress bar calculation logic used across multiple workout pages.
 * This replaces duplicated code in:
 * - app/stretches/[workoutName]/page.tsx
 * - app/workout/[name]/active/page.tsx
 * - app/workout/[name]/cardio/page.tsx
 * - app/workout/[name]/post-stretches/page.tsx
 */

export type WorkoutSection = 'pre-stretch' | 'exercise' | 'cardio' | 'post-stretch';

export interface WorkoutProgressInput {
  preWorkoutStretches: { id?: number }[];
  exercises: { id?: number }[];
  postWorkoutStretches: { id?: number }[];
  hasCardio: boolean;
}

export interface WorkoutProgressResult {
  totalItems: number;
  currentProgress: number;
  progressPercentage: number;
}

/**
 * Calculate workout progress for any section of the workout flow.
 *
 * @param workout - The workout data with stretch and exercise counts
 * @param section - Which section of the workout we're currently in
 * @param indexInSection - The current index within that section (0-based)
 * @returns Progress information including total, current, and percentage
 */
export function calculateWorkoutProgress(
  workout: WorkoutProgressInput,
  section: WorkoutSection,
  indexInSection: number
): WorkoutProgressResult {
  const preStretchCount = workout.preWorkoutStretches.length;
  const exerciseCount = workout.exercises.length;
  const cardioCount = workout.hasCardio ? 1 : 0;
  const postStretchCount = workout.postWorkoutStretches.length;

  const totalItems = preStretchCount + exerciseCount + cardioCount + postStretchCount;

  // Handle edge case of empty workout
  if (totalItems === 0) {
    return {
      totalItems: 0,
      currentProgress: 0,
      progressPercentage: 0,
    };
  }

  let currentProgress: number;

  switch (section) {
    case 'pre-stretch':
      // Progress = index + 1 (1-based position)
      currentProgress = indexInSection + 1;
      break;

    case 'exercise':
      // Progress = all pre-stretches + index + 1
      currentProgress = preStretchCount + indexInSection + 1;
      break;

    case 'cardio':
      // Progress = all pre-stretches + all exercises + 1
      currentProgress = preStretchCount + exerciseCount + 1;
      break;

    case 'post-stretch':
      // Progress = all pre-stretches + all exercises + cardio + index + 1
      currentProgress = preStretchCount + exerciseCount + cardioCount + indexInSection + 1;
      break;

    default:
      currentProgress = 0;
  }

  const progressPercentage = Math.round((currentProgress / totalItems) * 100);

  return {
    totalItems,
    currentProgress,
    progressPercentage,
  };
}

/**
 * Helper to convert WorkoutPlan to WorkoutProgressInput
 * Use this when you have a full WorkoutPlan from the API
 */
export function workoutToProgressInput(workout: {
  preWorkoutStretches?: any[];
  exercises: any[];
  postWorkoutStretches?: any[];
  cardio?: any;
}): WorkoutProgressInput {
  return {
    preWorkoutStretches: workout.preWorkoutStretches || [],
    exercises: workout.exercises,
    postWorkoutStretches: workout.postWorkoutStretches || [],
    hasCardio: true, // Always count cardio for progress (even if skipped)
  };
}
