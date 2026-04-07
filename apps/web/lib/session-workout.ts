import type { WorkoutPlan } from '@/lib/types';

const SESSION_PREFIX = 'session_workout_override';
const WARNING_PREFIX = 'session_workout_change_ack';
const TARGETS_META_PREFIX = 'session_workout_targets_meta';
const FREE_WORKOUT_SETUP_KEY = 'free_workout_setup';
const FREE_WORKOUT_SETUP_CACHE_PREFIX = 'free_workout_setup_cache';

type TargetsSource = 'ai' | 'fallback' | null;

export type SessionTargetsMeta = {
  encouragement: string | null;
  goalSummary: string | null;
  trendSummary: string | null;
  source: TargetsSource;
  sessionMode?: string | null;
};

export type SessionExerciseTarget = {
  suggestedWeight?: number | null;
  suggestedReps?: number | null;
  rationale?: string | null;
};

export type FreeWorkoutRecommendedExercise = {
  id: number;
  name: string;
  video_url: string | null;
  tips: string | null;
  equipment?: string | null;
  is_bodyweight?: number | null;
  is_machine?: number | null;
  primary_metric?: string | null;
  metric_unit?: string | null;
  muscle_groups?: string | null;
  history_count?: number | null;
  recent_count?: number | null;
  last_used_at?: string | null;
};

export type FreeWorkoutRecommendedSuperset = {
  exercise1: FreeWorkoutRecommendedExercise;
  exercise2: FreeWorkoutRecommendedExercise;
  totalCount: number;
  recentCount: number;
  lastUsedAt: string | null;
};

export type FreeWorkoutSetup = {
  sessionMode: string | null;
  source: TargetsSource;
  encouragement: string | null;
  goalSummary: string | null;
  trendSummary: string | null;
  targetsByExercise: Record<string, SessionExerciseTarget>;
  popularExercises: FreeWorkoutRecommendedExercise[];
  popularSupersets: FreeWorkoutRecommendedSuperset[];
};

type FreeWorkoutSetupCacheEntry = {
  cachedAt: string;
  setup: FreeWorkoutSetup;
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

export function loadFreeWorkoutSetup(): FreeWorkoutSetup | null {
  if (typeof window === 'undefined') return null;
  const stored = sessionStorage.getItem(FREE_WORKOUT_SETUP_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as FreeWorkoutSetup;
  } catch (error) {
    console.error('Failed to parse free workout setup:', error);
    return null;
  }
}

export function saveFreeWorkoutSetup(setup: FreeWorkoutSetup): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(FREE_WORKOUT_SETUP_KEY, JSON.stringify(setup));
}

export function clearFreeWorkoutSetup(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(FREE_WORKOUT_SETUP_KEY);
}

function buildFreeWorkoutSetupCacheKey(sessionMode: string): string {
  return `${FREE_WORKOUT_SETUP_CACHE_PREFIX}:${sessionMode}`;
}

export function loadFreeWorkoutSetupCache(sessionMode: string): FreeWorkoutSetup | null {
  if (typeof window === 'undefined') return null;
  const stored = sessionStorage.getItem(buildFreeWorkoutSetupCacheKey(sessionMode));
  if (!stored) return null;
  try {
    const entry = JSON.parse(stored) as FreeWorkoutSetupCacheEntry;
    return entry.setup ?? null;
  } catch (error) {
    console.error('Failed to parse free workout setup cache:', error);
    return null;
  }
}

export function saveFreeWorkoutSetupCache(sessionMode: string, setup: FreeWorkoutSetup): void {
  if (typeof window === 'undefined') return;
  const entry: FreeWorkoutSetupCacheEntry = {
    cachedAt: new Date().toISOString(),
    setup,
  };
  sessionStorage.setItem(buildFreeWorkoutSetupCacheKey(sessionMode), JSON.stringify(entry));
}

export function clearFreeWorkoutSetupCache(sessionMode?: string): void {
  if (typeof window === 'undefined') return;
  if (sessionMode) {
    sessionStorage.removeItem(buildFreeWorkoutSetupCacheKey(sessionMode));
    return;
  }

  const keysToRemove: string[] = [];
  for (let index = 0; index < sessionStorage.length; index += 1) {
    const key = sessionStorage.key(index);
    if (!key) continue;
    if (key.startsWith(`${FREE_WORKOUT_SETUP_CACHE_PREFIX}:`)) {
      keysToRemove.push(key);
    }
  }

  for (const key of keysToRemove) {
    sessionStorage.removeItem(key);
  }
}
