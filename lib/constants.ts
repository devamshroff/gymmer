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

// Workout session modes (preview-only target selection).
export const SESSION_MODES = {
  progress: 'progress',
  maintenance: 'maintenance',
  light: 'light',
} as const;

export type SessionMode = typeof SESSION_MODES[keyof typeof SESSION_MODES];

export const SESSION_MODE_LABELS: Record<SessionMode, string> = {
  [SESSION_MODES.progress]: 'Progress',
  [SESSION_MODES.maintenance]: 'Maintenance',
  [SESSION_MODES.light]: 'Light',
};

export const SESSION_MODE_DESCRIPTIONS: Record<SessionMode, string> = {
  [SESSION_MODES.progress]: 'Push for small, steady improvements.',
  [SESSION_MODES.maintenance]: 'Hold steady and focus on form.',
  [SESSION_MODES.light]: 'Easy effort today.',
};
