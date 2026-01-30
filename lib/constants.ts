// lib/constants.ts

// Exercise type identifiers used across workouts, routines, and storage.
export const EXERCISE_TYPES = {
  single: 'single',
  b2b: 'b2b',
  circuit: 'circuit',
} as const;

export type ExerciseType = typeof EXERCISE_TYPES[keyof typeof EXERCISE_TYPES];

// Exercise history display modes (primary metric axis).
export const EXERCISE_HISTORY_DISPLAY_MODES = {
  weight: 'weight',
  reps: 'reps',
} as const;

export type ExerciseHistoryDisplayMode =
  typeof EXERCISE_HISTORY_DISPLAY_MODES[keyof typeof EXERCISE_HISTORY_DISPLAY_MODES];

// Exercise history aggregation modes (how points are summarized).
export const EXERCISE_HISTORY_AGGREGATION_MODES = {
  max: 'max',
  avg: 'avg',
} as const;

export type ExerciseHistoryAggregationMode =
  typeof EXERCISE_HISTORY_AGGREGATION_MODES[keyof typeof EXERCISE_HISTORY_AGGREGATION_MODES];
