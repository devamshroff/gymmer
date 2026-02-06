// lib/workout-session.ts
// Client-side storage for current workout session

import { EXERCISE_TYPES, SESSION_MODES, type ExercisePrimaryMetric, type SessionMode } from '@/lib/constants';

export interface SessionExerciseData {
  name: string;
  type: typeof EXERCISE_TYPES.single | typeof EXERCISE_TYPES.b2b;
  isMachine?: boolean;
  primaryMetric?: ExercisePrimaryMetric;
  metricUnit?: string | null;
  warmup?: { weight: number; reps: number };
  sets: Array<{ weight: number; reps: number }>;
  b2bPartner?: {
    name: string;
    isMachine?: boolean;
    primaryMetric?: ExercisePrimaryMetric;
    metricUnit?: string | null;
    warmup?: { weight: number; reps: number };
    sets: Array<{ weight: number; reps: number }>;
  };
}

type SessionSetData = { weight: number; reps: number };

export interface InProgressExerciseState {
  exerciseIndex: number;
  type: typeof EXERCISE_TYPES.single | typeof EXERCISE_TYPES.b2b;
  completedSets?: SessionSetData[];
  completedPairs?: Array<{ ex1: SessionSetData; ex2: SessionSetData }>;
  warmupDecision?: 'pending' | 'include' | 'skip';
  warmupCompleted?: boolean;
  currentSetIndex?: number;
  currentExerciseInPair?: number;
  setData?: SessionSetData;
  setData1?: SessionSetData;
  setData2?: SessionSetData;
  machineOnly?: boolean;
  machineOnly1?: boolean;
  machineOnly2?: boolean;
}

export interface WorkoutSessionData {
  workoutName: string;
  routineId?: number | null;
  sessionId?: number | null;
  startTime: string;
  exercises: SessionExerciseData[];
  inProgress?: InProgressExerciseState | null;
  cardio?: {
    type: string;
    time: string;
    speed?: number;
    incline?: number;
  };
}

const STORAGE_KEY = 'current_workout_session';

export function isSessionMode(value: string | null | undefined): value is SessionMode {
  return value === SESSION_MODES.progress
    || value === SESSION_MODES.maintenance
    || value === SESSION_MODES.light;
}

export function resolveSessionMode(
  value: string | null | undefined,
  fallback: SessionMode = SESSION_MODES.progress
): SessionMode {
  return isSessionMode(value) ? value : fallback;
}

export function initWorkoutSession(
  workoutName: string,
  routineId?: number | null
): void {
  const session: WorkoutSessionData = {
    workoutName,
    routineId: routineId ?? null,
    sessionId: null,
    startTime: new Date().toISOString(),
    exercises: [],
  };
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }
}

export function ensureWorkoutSession(
  workoutName: string,
  routineId?: number | null
): void {
  const existing = getWorkoutSession();
  const normalizedRoutineId = routineId ?? null;
  if (!existing) {
    initWorkoutSession(workoutName, normalizedRoutineId);
    return;
  }
  if (existing.workoutName !== workoutName || (existing.routineId ?? null) !== normalizedRoutineId) {
    initWorkoutSession(workoutName, normalizedRoutineId);
  }
}

export function getWorkoutSession(): WorkoutSessionData | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return null;
  const parsed = JSON.parse(data) as WorkoutSessionData;
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

export function addExerciseToSession(exercise: SessionExerciseData): number | null {
  const session = getWorkoutSession();
  if (!session) return null;

  session.exercises.push(exercise);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }

  return session.exercises.length - 1;
}

export function setInProgressExercise(state: InProgressExerciseState | null): void {
  const session = getWorkoutSession();
  if (!session) return;

  session.inProgress = state;
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }
}

export function getInProgressExercise(): InProgressExerciseState | null {
  const session = getWorkoutSession();
  if (!session) return null;
  return session.inProgress ?? null;
}

export function updateExerciseInSession(
  sessionIndex: number,
  updater: (exercise: SessionExerciseData) => SessionExerciseData
): void {
  const session = getWorkoutSession();
  if (!session) return;
  if (!Number.isFinite(sessionIndex)) return;
  if (sessionIndex < 0 || sessionIndex >= session.exercises.length) return;

  const updatedExercise = updater(session.exercises[sessionIndex]);
  session.exercises[sessionIndex] = updatedExercise;
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
