import type { WorkoutPlan } from '@/lib/types';

const SESSION_PREFIX = 'session_workout_override';
const WARNING_PREFIX = 'session_workout_change_ack';
const TARGETS_META_PREFIX = 'session_workout_targets_meta';

type TargetsSource = 'ai' | 'fallback' | null;

export type SessionTargetsMeta = {
  encouragement: string | null;
  goalSummary: string | null;
  trendSummary: string | null;
  source: TargetsSource;
  sessionMode?: string | null;
};

function buildKey(prefix: string, workoutName: string, routineId?: string | null): string {
  const safeName = encodeURIComponent(workoutName);
  const safeRoutine = routineId ? encodeURIComponent(routineId) : 'default';
  return `${prefix}:${safeName}:${safeRoutine}`;
}

export function loadSessionWorkout(workoutName: string, routineId?: string | null): WorkoutPlan | null {
  if (typeof window === 'undefined') return null;
  const key = buildKey(SESSION_PREFIX, workoutName, routineId);
  const stored = sessionStorage.getItem(key);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as WorkoutPlan;
  } catch (error) {
    console.error('Failed to parse session workout override:', error);
    return null;
  }
}

export function saveSessionWorkout(plan: WorkoutPlan, routineId?: string | null): void {
  if (typeof window === 'undefined') return;
  const key = buildKey(SESSION_PREFIX, plan.name, routineId);
  sessionStorage.setItem(key, JSON.stringify(plan));
}

export function clearSessionWorkout(workoutName: string, routineId?: string | null): void {
  if (typeof window === 'undefined') return;
  const key = buildKey(SESSION_PREFIX, workoutName, routineId);
  sessionStorage.removeItem(key);
}

export function loadSessionTargetsMeta(
  workoutName: string,
  routineId?: string | null
): SessionTargetsMeta | null {
  if (typeof window === 'undefined') return null;
  const key = buildKey(TARGETS_META_PREFIX, workoutName, routineId);
  const stored = sessionStorage.getItem(key);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as SessionTargetsMeta;
  } catch (error) {
    console.error('Failed to parse session targets meta:', error);
    return null;
  }
}

export function saveSessionTargetsMeta(
  workoutName: string,
  routineId: string | null | undefined,
  meta: SessionTargetsMeta | null
): void {
  if (typeof window === 'undefined') return;
  const key = buildKey(TARGETS_META_PREFIX, workoutName, routineId);
  if (!meta) {
    sessionStorage.removeItem(key);
    return;
  }
  sessionStorage.setItem(key, JSON.stringify(meta));
}

export function clearSessionTargetsMeta(workoutName: string, routineId?: string | null): void {
  if (typeof window === 'undefined') return;
  const key = buildKey(TARGETS_META_PREFIX, workoutName, routineId);
  sessionStorage.removeItem(key);
}

export function hasChangeWarningAck(workoutName: string, routineId?: string | null): boolean {
  if (typeof window === 'undefined') return false;
  const key = buildKey(WARNING_PREFIX, workoutName, routineId);
  return sessionStorage.getItem(key) === '1';
}

export function acknowledgeChangeWarning(workoutName: string, routineId?: string | null): void {
  if (typeof window === 'undefined') return;
  const key = buildKey(WARNING_PREFIX, workoutName, routineId);
  sessionStorage.setItem(key, '1');
}
