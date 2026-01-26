// lib/workout-session.ts
// Client-side storage for current workout session

export interface SessionExerciseData {
  name: string;
  type: 'single' | 'b2b';
  warmup?: { weight: number; reps: number };
  sets: Array<{ weight: number; reps: number }>;
  b2bPartner?: {
    name: string;
    warmup?: { weight: number; reps: number };
    sets: Array<{ weight: number; reps: number }>;
  };
}

export interface WorkoutSessionData {
  workoutName: string;
  startTime: string;
  exercises: SessionExerciseData[];
  cardio?: {
    type: string;
    time: string;
    speed?: number;
    incline?: number;
  };
}

const STORAGE_KEY = 'current_workout_session';

export function initWorkoutSession(workoutName: string): void {
  const session: WorkoutSessionData = {
    workoutName,
    startTime: new Date().toISOString(),
    exercises: [],
  };
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }
}

export function getWorkoutSession(): WorkoutSessionData | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
}

export function addExerciseToSession(exercise: SessionExerciseData): void {
  const session = getWorkoutSession();
  if (!session) return;

  session.exercises.push(exercise);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }
}

export function addCardioToSession(cardio: { type: string; time: string; speed?: number; incline?: number }): void {
  const session = getWorkoutSession();
  if (!session) return;

  session.cardio = cardio;
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }
}

export function clearWorkoutSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}
