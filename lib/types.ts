// lib/types.ts

export interface Stretch {
  name: string;
  duration: string;
  videoUrl: string;
  tips: string;
}

export interface SingleExercise {
  type: 'single';
  name: string;
  sets: number;
  targetReps: number;
  targetWeight: number;
  warmupWeight: number;
  restTime: number;  // seconds
  videoUrl: string;
  tips: string;
}

export interface B2BExercise {
  type: 'b2b';
  exercises: [
    {
      name: string;
      sets: number;
      targetReps: number;
      targetWeight: number;
      warmupWeight: number;
      videoUrl: string;
      tips: string;
    },
    {
      name: string;
      sets: number;
      targetReps: number;
      targetWeight: number;
      warmupWeight: number;
      videoUrl: string;
      tips: string;
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
