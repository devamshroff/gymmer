type ExerciseChangeMode = 'single' | 'superset';
type ChangeOrigin = 'add' | 'replace';
type StretchChangeType = 'pre' | 'post';

export type SessionExerciseChange = {
  id: string;
  mode: ExerciseChangeMode;
  origin: ChangeOrigin;
  exercise1: { id: number; name: string };
  exercise2?: { id: number; name: string };
  replacedName?: string | null;
  createdAt: string;
};

export type SessionStretchChange = {
  id: string;
  stretchType: StretchChangeType;
  origin: ChangeOrigin;
  stretch: {
    id: number;
    name: string;
    timer_seconds?: number | null;
    muscle_groups?: string | null;
  };
  replacedName?: string | null;
  createdAt: string;
};

export type SessionChanges = {
  exercises: SessionExerciseChange[];
  preStretches: SessionStretchChange[];
  postStretches: SessionStretchChange[];
};

const CHANGES_PREFIX = 'session_workout_changes';

function buildKey(workoutName: string, routineId?: string | null): string {
  const safeName = encodeURIComponent(workoutName);
  const safeRoutine = routineId ? encodeURIComponent(routineId) : 'default';
  return `${CHANGES_PREFIX}:${safeName}:${safeRoutine}`;
}

function getDefaultChanges(): SessionChanges {
  return { exercises: [], preStretches: [], postStretches: [] };
}

function writeChanges(workoutName: string, routineId: string | null | undefined, changes: SessionChanges): void {
  if (typeof window === 'undefined') return;
  const key = buildKey(workoutName, routineId ?? null);
  sessionStorage.setItem(key, JSON.stringify(changes));
}

function readChanges(workoutName: string, routineId: string | null | undefined): SessionChanges | null {
  if (typeof window === 'undefined') return null;
  const key = buildKey(workoutName, routineId ?? null);
  const raw = sessionStorage.getItem(key);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as SessionChanges;
    return {
      exercises: Array.isArray(parsed.exercises) ? parsed.exercises : [],
      preStretches: Array.isArray(parsed.preStretches) ? parsed.preStretches : [],
      postStretches: Array.isArray(parsed.postStretches) ? parsed.postStretches : [],
    };
  } catch (error) {
    console.error('Failed to parse session changes:', error);
    sessionStorage.removeItem(key);
    return null;
  }
}

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function loadSessionChanges(workoutName: string, routineId?: string | null): SessionChanges | null {
  return readChanges(workoutName, routineId ?? null);
}

export function saveSessionChanges(
  workoutName: string,
  routineId: string | null | undefined,
  changes: SessionChanges
): void {
  writeChanges(workoutName, routineId ?? null, changes);
}

export function clearSessionChanges(workoutName: string, routineId?: string | null): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(buildKey(workoutName, routineId ?? null));
}

export function addSessionExerciseChange(params: {
  workoutName: string;
  routineId?: string | null;
  mode: ExerciseChangeMode;
  origin: ChangeOrigin;
  exercise1: { id: number; name: string };
  exercise2?: { id: number; name: string };
  replacedName?: string | null;
}): SessionChanges {
  const current = readChanges(params.workoutName, params.routineId) ?? getDefaultChanges();
  const next: SessionChanges = {
    ...current,
    exercises: [
      ...current.exercises,
      {
        id: createId(),
        mode: params.mode,
        origin: params.origin,
        exercise1: params.exercise1,
        exercise2: params.exercise2,
        replacedName: params.replacedName ?? null,
        createdAt: new Date().toISOString(),
      }
    ]
  };
  writeChanges(params.workoutName, params.routineId ?? null, next);
  return next;
}

export function addSessionStretchChange(params: {
  workoutName: string;
  routineId?: string | null;
  stretchType: StretchChangeType;
  origin: ChangeOrigin;
  stretch: {
    id: number;
    name: string;
    timer_seconds?: number | null;
    muscle_groups?: string | null;
  };
  replacedName?: string | null;
}): SessionChanges {
  const current = readChanges(params.workoutName, params.routineId) ?? getDefaultChanges();
  const newEntry: SessionStretchChange = {
    id: createId(),
    stretchType: params.stretchType,
    origin: params.origin,
    stretch: params.stretch,
    replacedName: params.replacedName ?? null,
    createdAt: new Date().toISOString(),
  };

  const next: SessionChanges = {
    ...current,
    preStretches: params.stretchType === 'pre' ? [...current.preStretches, newEntry] : current.preStretches,
    postStretches: params.stretchType === 'post' ? [...current.postStretches, newEntry] : current.postStretches,
  };

  writeChanges(params.workoutName, params.routineId ?? null, next);
  return next;
}

export function removeSessionExerciseChange(params: {
  workoutName: string;
  routineId?: string | null;
  changeId: string;
}): SessionChanges {
  const current = readChanges(params.workoutName, params.routineId) ?? getDefaultChanges();
  const next: SessionChanges = {
    ...current,
    exercises: current.exercises.filter((entry) => entry.id !== params.changeId),
  };
  writeChanges(params.workoutName, params.routineId ?? null, next);
  return next;
}

export function removeSessionStretchChange(params: {
  workoutName: string;
  routineId?: string | null;
  changeId: string;
  stretchType: StretchChangeType;
}): SessionChanges {
  const current = readChanges(params.workoutName, params.routineId) ?? getDefaultChanges();
  const next: SessionChanges = {
    ...current,
    preStretches: params.stretchType === 'pre'
      ? current.preStretches.filter((entry) => entry.id !== params.changeId)
      : current.preStretches,
    postStretches: params.stretchType === 'post'
      ? current.postStretches.filter((entry) => entry.id !== params.changeId)
      : current.postStretches,
  };
  writeChanges(params.workoutName, params.routineId ?? null, next);
  return next;
}

export function hasSessionChanges(changes: SessionChanges | null): boolean {
  if (!changes) return false;
  return changes.exercises.length > 0
    || changes.preStretches.length > 0
    || changes.postStretches.length > 0;
}
