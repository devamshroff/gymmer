import type { WorkoutPlan, WorkoutExerciseLog } from '@/lib/types';
import type { HeightUnit, WeightUnit } from '@/lib/units';

export type BootstrapUserSettings = {
  restTimeSeconds: number;
  supersetRestSeconds: number;
  weightUnit: WeightUnit;
  heightUnit: HeightUnit;
  timerSoundEnabled: boolean;
  timerVibrateEnabled: boolean;
};

export type LastSetSummary =
  | (WorkoutExerciseLog & { completed_at?: string; matched_role?: string })
  | null;

export type RoutineMeta = {
  id?: number | null;
  name: string;
  updatedAt?: string | null;
  checksum?: string | null;
};

export type WorkoutBootstrapPayload = {
  workout: WorkoutPlan;
  settings: BootstrapUserSettings;
  lastSetSummaries: Record<string, LastSetSummary>;
  lastWorkoutReport: string | null;
  routineMeta?: RoutineMeta;
};

type WorkoutBootstrapCacheEntry = WorkoutBootstrapPayload & {
  cachedAt: string;
  editVersionId?: string | null;
  editVersionName?: string | null;
};

const BOOTSTRAP_PREFIX = 'workout_bootstrap';
const EDIT_PREFIX = 'routine_edit_version';

function buildCacheKey(workoutName: string, routineId?: string | null): string {
  const safeName = encodeURIComponent(workoutName);
  const safeRoutine = routineId ? encodeURIComponent(routineId) : 'default';
  return `${BOOTSTRAP_PREFIX}:${safeName}:${safeRoutine}`;
}

function buildEditKey(scope: string): string {
  return `${EDIT_PREFIX}:${scope}`;
}

function getEditVersionById(routineId?: string | number | null): string | null {
  if (typeof window === 'undefined' || routineId === null || routineId === undefined) return null;
  const key = buildEditKey(`id:${routineId}`);
  return localStorage.getItem(key) ?? '0';
}

function getEditVersionByName(workoutName?: string | null): string | null {
  if (typeof window === 'undefined' || !workoutName) return null;
  const key = buildEditKey(`name:${encodeURIComponent(workoutName)}`);
  return localStorage.getItem(key) ?? '0';
}

function isCacheEntryValid(
  entry: WorkoutBootstrapCacheEntry,
  workoutName: string,
  routineId?: string | null
): boolean {
  const currentIdVersion = getEditVersionById(routineId);
  if (entry.editVersionId && currentIdVersion && entry.editVersionId !== currentIdVersion) {
    return false;
  }
  const currentNameVersion = getEditVersionByName(workoutName);
  if (entry.editVersionName && currentNameVersion && entry.editVersionName !== currentNameVersion) {
    return false;
  }
  return true;
}

export function loadWorkoutBootstrapCache(params: {
  workoutName: string;
  routineId?: string | null;
}): WorkoutBootstrapCacheEntry | null {
  if (typeof window === 'undefined') return null;
  const { workoutName, routineId } = params;
  const keys = [buildCacheKey(workoutName, routineId)];
  if (routineId) {
    keys.push(buildCacheKey(workoutName, null));
  }

  for (const key of keys) {
    const stored = sessionStorage.getItem(key);
    if (!stored) continue;
    try {
      const entry = JSON.parse(stored) as WorkoutBootstrapCacheEntry;
      if (!isCacheEntryValid(entry, workoutName, routineId)) {
        sessionStorage.removeItem(key);
        continue;
      }
      return entry;
    } catch (error) {
      console.error('Failed to parse workout bootstrap cache:', error);
      sessionStorage.removeItem(key);
    }
  }

  return null;
}

export function saveWorkoutBootstrapCache(params: {
  workoutName: string;
  routineId?: string | null;
  payload: WorkoutBootstrapPayload;
}): void {
  if (typeof window === 'undefined') return;
  const { workoutName, routineId, payload } = params;
  const entry: WorkoutBootstrapCacheEntry = {
    ...payload,
    cachedAt: new Date().toISOString(),
    editVersionId: getEditVersionById(routineId),
    editVersionName: getEditVersionByName(workoutName),
  };
  const serialized = JSON.stringify(entry);
  sessionStorage.setItem(buildCacheKey(workoutName, routineId), serialized);
  if (routineId) {
    sessionStorage.setItem(buildCacheKey(workoutName, null), serialized);
  }
}

export function clearWorkoutBootstrapCache(params: {
  workoutName: string;
  routineId?: string | null;
}): void {
  if (typeof window === 'undefined') return;
  const { workoutName, routineId } = params;
  sessionStorage.removeItem(buildCacheKey(workoutName, routineId));
  if (routineId) {
    sessionStorage.removeItem(buildCacheKey(workoutName, null));
  }
}

export function bumpRoutineEditVersion(params: {
  routineId?: string | number | null;
  routineName?: string | null;
}): void {
  if (typeof window === 'undefined') return;
  const stamp = String(Date.now());
  if (params.routineId !== null && params.routineId !== undefined) {
    localStorage.setItem(buildEditKey(`id:${params.routineId}`), stamp);
  }
  if (params.routineName) {
    localStorage.setItem(buildEditKey(`name:${encodeURIComponent(params.routineName)}`), stamp);
  }
}

export function invalidateWorkoutBootstrapCache(params: {
  routineId?: string | number | null;
  routineName?: string | null;
}): void {
  bumpRoutineEditVersion(params);
  if (!params.routineName) return;
  clearWorkoutBootstrapCache({
    workoutName: params.routineName,
    routineId: params.routineId ? String(params.routineId) : null,
  });
}
