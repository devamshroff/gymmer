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

// `weight` stores the primary metric value (e.g., seconds for time-based exercises).
type SessionSetData = { weight: number; reps: number };

export interface WorkoutFlowState {
  initialized: boolean;
  currentExerciseIndex: number;
  viewingExerciseIndex: number;
  showSetReview: boolean;
  currentSetIndex: number;
  currentExerciseInPair: number;
  completedSets: SessionSetData[];
  completedPairs: Array<{ ex1: SessionSetData; ex2: SessionSetData }>;
  extraSetsByExerciseIndex: Record<number, number>;
  setData: SessionSetData;
  setData1: SessionSetData;
  setData2: SessionSetData;
  warmupDecision: 'pending' | 'include' | 'skip';
  warmupCompleted: boolean;
  machineOnly: boolean;
  machineOnly1: boolean;
  machineOnly2: boolean;
  isResting: boolean;
  restTimeRemaining: number;
  restTimeSeconds: number;
  supersetRestSeconds: number;
  isTransitioning: boolean;
  transitionTimeRemaining: number;
}

export interface WorkoutSessionData {
  workoutName: string;
  routineId?: number | null;
  sessionId?: number | null;
  startTime: string;
  exercises: SessionExerciseData[];
  flow?: WorkoutFlowState | null;
  cardio?: {
    type: string;
    time: string;
    speed?: number;
    incline?: number;
  };
}

const STORAGE_KEY = 'current_workout_session';
const listeners = new Set<() => void>();
let cachedSession: WorkoutSessionData | null = null;
let cachedSessionRaw: string | null = null;

export const DEFAULT_WORKOUT_FLOW_STATE: WorkoutFlowState = {
  initialized: false,
  currentExerciseIndex: 0,
  viewingExerciseIndex: 0,
  showSetReview: false,
  currentSetIndex: 0,
  currentExerciseInPair: 0,
  completedSets: [],
  completedPairs: [],
  extraSetsByExerciseIndex: {},
  setData: { weight: 0, reps: 0 },
  setData1: { weight: 0, reps: 0 },
  setData2: { weight: 0, reps: 0 },
  warmupDecision: 'pending',
  warmupCompleted: false,
  machineOnly: false,
  machineOnly1: false,
  machineOnly2: false,
  isResting: false,
  restTimeRemaining: 0,
  restTimeSeconds: 60,
  supersetRestSeconds: 15,
  isTransitioning: false,
  transitionTimeRemaining: 60,
};

function notify(): void {
  for (const listener of listeners) {
    listener();
  }
}

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
    flow: { ...DEFAULT_WORKOUT_FLOW_STATE },
  };
  if (typeof window !== 'undefined') {
    const raw = JSON.stringify(session);
    localStorage.setItem(STORAGE_KEY, raw);
    cachedSession = JSON.parse(raw) as WorkoutSessionData;
    cachedSessionRaw = raw;
  }
  notify();
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
  if (!data) {
    cachedSession = null;
    cachedSessionRaw = null;
    return null;
  }
  if (data === cachedSessionRaw && cachedSession) {
    return cachedSession;
  }

  const parsed = JSON.parse(data) as WorkoutSessionData;
  const rawRoutineId = (parsed as { routineId?: unknown }).routineId;
  const nextRoutineId = typeof rawRoutineId === 'number' ? rawRoutineId : Number(rawRoutineId);
  parsed.routineId = Number.isFinite(nextRoutineId) ? nextRoutineId : null;
  const rawSessionId = (parsed as { sessionId?: unknown }).sessionId;
  const nextSessionId = typeof rawSessionId === 'number' ? rawSessionId : Number(rawSessionId);
  parsed.sessionId = Number.isFinite(nextSessionId) ? nextSessionId : null;
  if (!parsed.flow) {
    parsed.flow = { ...DEFAULT_WORKOUT_FLOW_STATE };
  } else {
    parsed.flow = { ...DEFAULT_WORKOUT_FLOW_STATE, ...parsed.flow };
  }
  cachedSession = parsed;
  cachedSessionRaw = data;
  return parsed;
}

export function setWorkoutSessionId(sessionId: number): void {
  if (typeof window === 'undefined') return;
  const session = getWorkoutSession();
  if (!session) return;
  if (session.sessionId === sessionId) return;
  session.sessionId = sessionId;
  const raw = JSON.stringify(session);
  localStorage.setItem(STORAGE_KEY, raw);
  cachedSession = JSON.parse(raw) as WorkoutSessionData;
  cachedSessionRaw = raw;
  notify();
}

export function addExerciseToSession(exercise: SessionExerciseData): number | null {
  const session = getWorkoutSession();
  if (!session) return null;

  session.exercises.push(exercise);
  if (typeof window !== 'undefined') {
    const raw = JSON.stringify(session);
    localStorage.setItem(STORAGE_KEY, raw);
    cachedSession = JSON.parse(raw) as WorkoutSessionData;
    cachedSessionRaw = raw;
  }
  notify();

  return session.exercises.length - 1;
}

export function setWorkoutFlowState(state: WorkoutFlowState | null): void {
  const session = getWorkoutSession();
  if (!session) return;
  session.flow = state;
  if (typeof window !== 'undefined') {
    const raw = JSON.stringify(session);
    localStorage.setItem(STORAGE_KEY, raw);
    cachedSession = JSON.parse(raw) as WorkoutSessionData;
    cachedSessionRaw = raw;
  }
  notify();
}

export function getWorkoutFlowState(): WorkoutFlowState | null {
  const session = getWorkoutSession();
  if (!session) return null;
  return session.flow ?? null;
}

export function updateWorkoutFlowState(
  updater: (state: WorkoutFlowState) => WorkoutFlowState
): void {
  const session = getWorkoutSession();
  if (!session) return;
  const current = session.flow ?? { ...DEFAULT_WORKOUT_FLOW_STATE };
  session.flow = updater(current);
  if (typeof window !== 'undefined') {
    const raw = JSON.stringify(session);
    localStorage.setItem(STORAGE_KEY, raw);
    cachedSession = JSON.parse(raw) as WorkoutSessionData;
    cachedSessionRaw = raw;
  }
  notify();
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
    const raw = JSON.stringify(session);
    localStorage.setItem(STORAGE_KEY, raw);
    cachedSession = JSON.parse(raw) as WorkoutSessionData;
    cachedSessionRaw = raw;
  }
  notify();
}

export function addCardioToSession(cardio: { type: string; time: string; speed?: number; incline?: number }): void {
  const session = getWorkoutSession();
  if (!session) return;

  session.cardio = cardio;
  if (typeof window !== 'undefined') {
    const raw = JSON.stringify(session);
    localStorage.setItem(STORAGE_KEY, raw);
    cachedSession = JSON.parse(raw) as WorkoutSessionData;
    cachedSessionRaw = raw;
  }
  notify();
}

export function clearWorkoutSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
  cachedSession = null;
  cachedSessionRaw = null;
  notify();
}

export function subscribeWorkoutSession(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
