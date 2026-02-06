// lib/workout-navigation.ts
// Unified navigation logic for workout flow

import { WorkoutPlan } from './types';

export type WorkoutSection = 'pre-stretches' | 'exercises' | 'cardio' | 'post-stretches' | 'summary';

export interface WorkoutPosition {
  section: WorkoutSection;
  index: number; // Index within section (0 for cardio/summary which are single items)
}

export interface WorkoutNavigation {
  previousUrl: string | null;
  nextUrl: string | null;
  exitUrl: string;
  canGoPrevious: boolean;
  canGoNext: boolean;
  // For display
  currentLabel: string;
  totalInSection: number;
}

/**
 * Calculate navigation URLs based on current position in workout
 */
export function getWorkoutNavigation(
  workout: WorkoutPlan,
  currentSection: WorkoutSection,
  currentIndex: number
): WorkoutNavigation {
  const workoutName = encodeURIComponent(workout.name);
  const exitUrl = `/workout/${workoutName}`;

  // Calculate section sizes
  const preStretchCount = workout.preWorkoutStretches?.length || 0;
  const exerciseCount = workout.exercises?.length || 0;
  const hasCardio = !!workout.cardio;
  const postStretchCount = workout.postWorkoutStretches?.length || 0;

  // Build the linear flow of all items
  const flow: WorkoutPosition[] = [];

  // Pre-stretches
  for (let i = 0; i < preStretchCount; i++) {
    flow.push({ section: 'pre-stretches', index: i });
  }

  // Exercises
  for (let i = 0; i < exerciseCount; i++) {
    flow.push({ section: 'exercises', index: i });
  }

  // Cardio (always in flow, even if optional - page handles skip)
  flow.push({ section: 'cardio', index: 0 });

  // Post-stretches
  for (let i = 0; i < postStretchCount; i++) {
    flow.push({ section: 'post-stretches', index: i });
  }

  // Summary
  flow.push({ section: 'summary', index: 0 });

  // Find current position in flow
  const currentFlowIndex = flow.findIndex(
    pos => pos.section === currentSection && pos.index === currentIndex
  );

  // Calculate previous URL
  let previousUrl: string | null = null;
  if (currentFlowIndex > 0) {
    const prev = flow[currentFlowIndex - 1];
    previousUrl = getUrlForPosition(workoutName, prev, workout);
  }

  // Calculate next URL
  let nextUrl: string | null = null;
  if (currentFlowIndex < flow.length - 1) {
    const next = flow[currentFlowIndex + 1];
    nextUrl = getUrlForPosition(workoutName, next, workout);
  }

  // Get section-specific info
  let totalInSection = 1;
  let currentLabel = '';

  switch (currentSection) {
    case 'pre-stretches':
      totalInSection = preStretchCount;
      currentLabel = `Pre-Stretch ${currentIndex + 1}/${totalInSection}`;
      break;
    case 'exercises':
      totalInSection = exerciseCount;
      currentLabel = `Exercise ${currentIndex + 1}/${totalInSection}`;
      break;
    case 'cardio':
      currentLabel = 'Cardio';
      break;
    case 'post-stretches':
      totalInSection = postStretchCount;
      currentLabel = `Post-Stretch ${currentIndex + 1}/${totalInSection}`;
      break;
    case 'summary':
      currentLabel = 'Summary';
      break;
  }

  return {
    previousUrl,
    nextUrl,
    exitUrl,
    canGoPrevious: previousUrl !== null,
    canGoNext: nextUrl !== null,
    currentLabel,
    totalInSection,
  };
}

/**
 * Convert a workout position to its URL
 */
function getUrlForPosition(
  workoutName: string,
  position: WorkoutPosition,
  workout: WorkoutPlan
): string {
  const hasCardio = !!workout.cardio;
  const postStretchCount = workout.postWorkoutStretches?.length || 0;

  switch (position.section) {
    case 'pre-stretches':
      // Pre-stretches page handles its own index via state
      // Return URL with index as query param
      return `/stretches/${workoutName}?index=${position.index}`;

    case 'exercises':
      // Active workout page handles its own index via state
      return `/workout/${workoutName}/active?index=${position.index}`;

    case 'cardio':
      return `/workout/${workoutName}/cardio`;

    case 'post-stretches':
      return `/workout/${workoutName}/post-stretches?index=${position.index}`;

    case 'summary':
      return `/workout/${workoutName}/summary`;

    default:
      return `/workout/${workoutName}`;
  }
}

/**
 * Get the previous section's last URL (for when at index 0 of current section)
 */
export function getPreviousSectionUrl(
  workout: WorkoutPlan,
  currentSection: WorkoutSection
): string | null {
  const workoutName = encodeURIComponent(workout.name);
  const preStretchCount = workout.preWorkoutStretches?.length || 0;
  const exerciseCount = workout.exercises?.length || 0;
  const hasCardio = !!workout.cardio;
  const postStretchCount = workout.postWorkoutStretches?.length || 0;

  switch (currentSection) {
    case 'pre-stretches':
      // No previous section
      return null;

    case 'exercises':
      // Go to last pre-stretch
      if (preStretchCount > 0) {
        return `/stretches/${workoutName}?index=${preStretchCount - 1}`;
      }
      return null;

    case 'cardio':
      // Go to last exercise
      if (exerciseCount > 0) {
        return `/workout/${workoutName}/active?index=${exerciseCount - 1}`;
      }
      // Or last pre-stretch if no exercises
      if (preStretchCount > 0) {
        return `/stretches/${workoutName}?index=${preStretchCount - 1}`;
      }
      return null;

    case 'post-stretches':
      // Go to cardio
      return `/workout/${workoutName}/cardio`;

    case 'summary':
      // Go to last post-stretch
      if (postStretchCount > 0) {
        return `/workout/${workoutName}/post-stretches?index=${postStretchCount - 1}`;
      }
      // Or cardio
      return `/workout/${workoutName}/cardio`;

    default:
      return null;
  }
}
