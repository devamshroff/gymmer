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

export type SessionMode = 'incremental' | 'maintenance' | 'light';

export interface WorkoutSessionData {
  workoutName: string;
  startTime: string;
  sessionMode: SessionMode;
  exercises: SessionExerciseData[];
  cardio?: {
    type: string;
    time: string;
    speed?: number;
    incline?: number;
  };
}

const STORAGE_KEY = 'current_workout_session';

export function isSessionMode(value: string | null | undefined): value is SessionMode {
  return value === 'incremental' || value === 'maintenance' || value === 'light';
}

export function resolveSessionMode(value: string | null | undefined, fallback: SessionMode = 'incremental'): SessionMode {
  return isSessionMode(value) ? value : fallback;
}

export function initWorkoutSession(workoutName: string, sessionMode: SessionMode = 'incremental'): void {
  const session: WorkoutSessionData = {
    workoutName,
    startTime: new Date().toISOString(),
    sessionMode,
    exercises: [],
  };
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }
}

export function getWorkoutSession(): WorkoutSessionData | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return null;
  const parsed = JSON.parse(data) as WorkoutSessionData;
  parsed.sessionMode = resolveSessionMode(parsed.sessionMode, 'incremental');
  return parsed;
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

export function setWorkoutSessionMode(mode: SessionMode): void {
  const session = getWorkoutSession();
  if (!session) return;
  session.sessionMode = mode;
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }
}

export function clearWorkoutSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}
