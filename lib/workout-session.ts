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
  routineId?: number | null;
  sessionId?: number | null;
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

export function initWorkoutSession(
  workoutName: string,
  sessionMode: SessionMode = 'incremental',
  routineId?: number | null
): void {
  const session: WorkoutSessionData = {
    workoutName,
    routineId: routineId ?? null,
    sessionId: null,
    startTime: new Date().toISOString(),
    sessionMode,
    exercises: [],
  };
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }
}

export function ensureWorkoutSession(
  workoutName: string,
  sessionMode: SessionMode = 'incremental',
  routineId?: number | null
): void {
  const existing = getWorkoutSession();
  const normalizedRoutineId = routineId ?? null;
  if (!existing) {
    initWorkoutSession(workoutName, sessionMode, normalizedRoutineId);
    return;
  }
  if (existing.workoutName !== workoutName || (existing.routineId ?? null) !== normalizedRoutineId) {
    initWorkoutSession(workoutName, sessionMode, normalizedRoutineId);
    return;
  }
  if (existing.sessionMode !== sessionMode) {
    setWorkoutSessionMode(sessionMode);
  }
}

export function getWorkoutSession(): WorkoutSessionData | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return null;
  const parsed = JSON.parse(data) as WorkoutSessionData;
  parsed.sessionMode = resolveSessionMode(parsed.sessionMode, 'incremental');
  const rawRoutineId = (parsed as { routineId?: unknown }).routineId;
  const nextRoutineId = typeof rawRoutineId === 'number' ? rawRoutineId : Number(rawRoutineId);
  parsed.routineId = Number.isFinite(nextRoutineId) ? nextRoutineId : null;
  const rawSessionId = (parsed as { sessionId?: unknown }).sessionId;
  const nextSessionId = typeof rawSessionId === 'number' ? rawSessionId : Number(rawSessionId);
  parsed.sessionId = Number.isFinite(nextSessionId) ? nextSessionId : null;
  return parsed;
}

export function setWorkoutSessionId(sessionId: number): void {
  if (typeof window === 'undefined') return;
  const session = getWorkoutSession();
  if (!session) return;
  if (session.sessionId === sessionId) return;
  session.sessionId = sessionId;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
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
