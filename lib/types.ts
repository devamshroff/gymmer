// lib/types.ts

import { EXERCISE_TYPES, ExercisePrimaryMetric, ExerciseType } from '@/lib/constants';

export interface Stretch {
  name: string;
  timerSeconds: number;  // Hold time in seconds
  videoUrl: string;
  tips: string;
}

export interface SingleExercise {
  type: typeof EXERCISE_TYPES.single;
  name: string;
  sets: number;
  targetReps: number;
  targetWeight: number;
  warmupWeight: number;
  hasWarmup?: boolean;
  restTime: number;  // seconds
  videoUrl: string;
  tips: string;
  isBodyweight?: boolean;
  isMachine?: boolean;
  primaryMetric?: ExercisePrimaryMetric;
  metricUnit?: string | null;
}

export interface B2BExercise {
  type: typeof EXERCISE_TYPES.b2b;
  exercises: [
    {
      name: string;
      sets: number;
      targetReps: number;
      targetWeight: number;
      warmupWeight: number;
      hasWarmup?: boolean;
      videoUrl: string;
      tips: string;
      isBodyweight?: boolean;
      isMachine?: boolean;
      primaryMetric?: ExercisePrimaryMetric;
      metricUnit?: string | null;
    },
    {
      name: string;
      sets: number;
      targetReps: number;
      targetWeight: number;
      warmupWeight: number;
      hasWarmup?: boolean;
      videoUrl: string;
      tips: string;
      isBodyweight?: boolean;
      isMachine?: boolean;
      primaryMetric?: ExercisePrimaryMetric;
      metricUnit?: string | null;
    }
  ];
  restTime: number;  // seconds between pairs
}

export type Exercise = SingleExercise | B2BExercise;

export interface Cardio {
  type: string;  // e.g., "Incline Walk", "Bike", "Stairmaster"
  duration: string;  // e.g., "15 min"
  intensity: string;  // e.g., "12% incline, 3.0 mph"
  tips: string;
}

export interface WorkoutPlan {
  name: string;
  preWorkoutStretches: Stretch[];
  postWorkoutStretches: Stretch[];
  exercises: Exercise[];
  cardio?: Cardio;  // Optional cardio section
}

export interface SetLog {
  setNumber: number;
  weight: number;
  reps: number;
}

export interface ExerciseHistory {
  exerciseName: string;
  lastSession: {
    date: string;
    sets: SetLog[];
    totalVolume: number;  // weight * reps * sets
  } | null;
}

// Database Types (v1.0)
export interface WorkoutSession {
  id: number;
  routine_id?: number | null;
  session_key?: string | null;
  workout_plan_name: string;
  date_completed: string; // ISO 8601
  total_duration_minutes: number | null;
  total_strain: number | null;
  workout_report?: string | null;
  created_at: string;
}

export interface WorkoutExerciseLog {
  id: number;
  session_id: number;
  exercise_name: string;
  exercise_type: ExerciseType;

  // Warmup
  warmup_weight: number | null;
  warmup_reps: number | null;

  // Working sets (1-4)
  set1_weight: number | null;
  set1_reps: number | null;
  set2_weight: number | null;
  set2_reps: number | null;
  set3_weight: number | null;
  set3_reps: number | null;
  set4_weight: number | null;
  set4_reps: number | null;

  // B2B partner exercise
  b2b_partner_name: string | null;
  b2b_warmup_weight: number | null;
  b2b_warmup_reps: number | null;
  b2b_set1_weight: number | null;
  b2b_set1_reps: number | null;
  b2b_set2_weight: number | null;
  b2b_set2_reps: number | null;
  b2b_set3_weight: number | null;
  b2b_set3_reps: number | null;
  b2b_set4_weight: number | null;
  b2b_set4_reps: number | null;

  created_at: string;
}

export interface WorkoutCardioLog {
  id: number;
  session_id: number;
  cardio_type: string;
  time: string; // e.g. "15 min"
  created_at: string;
}

// Routine Builder Types (v2.0)
export interface ExerciseDB {
  id: number;
  name: string;
  video_url: string | null;
  tips: string | null;
  muscle_groups: string | null;  // JSON string
  equipment: string | null;
  is_bodyweight?: number | null;
  is_machine?: number | null;
  primary_metric?: string | null;
  metric_unit?: string | null;
  difficulty: string | null;
  created_at: string;
}

export interface StretchDB {
  id: number;
  name: string;
  timer_seconds?: number | null;
  video_url: string | null;
  tips: string | null;
  muscle_groups: string | null;  // JSON array: ["hamstrings", "glutes", "lower back"]
  created_at: string;
}

export interface CustomRoutine {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface RoutineExerciseConfig {
  id: number;
  routine_id: number;
  exercise_id1: number;
  exercise_id2: number | null;
  order_index: number;
}

export interface RoutineCardio {
  id: number;
  routine_id: number;
  cardio_type: string;
  duration: string;
  intensity: string | null;
  tips: string | null;
}

export interface FullRoutineData {
  routine: CustomRoutine;
  preWorkoutStretches: StretchDB[];
  exercises: Array<{
    config: RoutineExerciseConfig;
    exercise: ExerciseDB;
    exercise2?: ExerciseDB;
  }>;
  postWorkoutStretches: StretchDB[];
  cardio?: RoutineCardio;
}
