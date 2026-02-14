import type { WorkoutSessionData } from '@/lib/workout-session';

export type ActiveRoutineEntry = {
  sessionKey: string;
  userId?: string | null;
  workoutName: string;
  routineId: number | null;
  resumeIndex: number;
  startTime: string;
  lastActiveAt: string;
  sessionId?: number | null;
  sessionData?: WorkoutSessionData | null;
};

export const ACTIVE_ROUTINES_STORAGE_KEY = 'active_routines_v1';
export const ACTIVE_ROUTINE_TTL_MS = 24 * 60 * 60 * 1000;

type RawActiveRoutine = Partial<ActiveRoutineEntry> & {
  sessionKey?: unknown;
  userId?: unknown;
  routineId?: unknown;
  resumeIndex?: unknown;
  sessionId?: unknown;
  sessionData?: unknown;
};

const toNumberOrNull = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const toIndex = (value: unknown): number => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return Math.floor(parsed);
};

const normalizeEntry = (entry: RawActiveRoutine): ActiveRoutineEntry | null => {
  if (!entry) return null;
  const workoutName = typeof entry.workoutName === 'string' ? entry.workoutName : null;
  if (!workoutName) return null;
  const userId = typeof entry.userId === 'string' ? entry.userId : null;
  const sessionKey = typeof entry.sessionKey === 'string'
    ? entry.sessionKey
    : typeof entry.startTime === 'string'
      ? entry.startTime
      : null;
  if (!sessionKey) return null;
  const startTime = typeof entry.startTime === 'string' ? entry.startTime : sessionKey;
  const lastActiveAt = typeof entry.lastActiveAt === 'string' ? entry.lastActiveAt : startTime;
  const routineId = toNumberOrNull(entry.routineId);
  const resumeIndex = toIndex(entry.resumeIndex);
  const sessionId = toNumberOrNull(entry.sessionId);
  const sessionData = entry.sessionData && typeof entry.sessionData === 'object'
    ? (entry.sessionData as WorkoutSessionData)
    : null;

  return {
    sessionKey,
    userId,
    workoutName,
    routineId,
    resumeIndex,
    startTime,
    lastActiveAt,
    sessionId,
    sessionData,
  };
};

const isExpired = (entry: ActiveRoutineEntry): boolean => {
  const stamp = Date.parse(entry.lastActiveAt || entry.startTime);
  if (!Number.isFinite(stamp)) return true;
  return Date.now() - stamp > ACTIVE_ROUTINE_TTL_MS;
};

const buildStorageKey = (userId?: string | null): string => {
  if (userId) return `${ACTIVE_ROUTINES_STORAGE_KEY}:${userId}`;
  return ACTIVE_ROUTINES_STORAGE_KEY;
};

const readEntries = (userId?: string | null): ActiveRoutineEntry[] => {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(buildStorageKey(userId));
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeEntry).filter((entry): entry is ActiveRoutineEntry => !!entry);
  } catch (error) {
    console.error('Failed to parse active routines:', error);
    return [];
  }
};

const writeEntries = (entries: ActiveRoutineEntry[], userId?: string | null): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(buildStorageKey(userId), JSON.stringify(entries));
};

const sortByLastActive = (entries: ActiveRoutineEntry[]): ActiveRoutineEntry[] => {
  return entries.sort((a, b) => {
    const aStamp = Date.parse(a.lastActiveAt);
    const bStamp = Date.parse(b.lastActiveAt);
    const safeA = Number.isFinite(aStamp) ? aStamp : 0;
    const safeB = Number.isFinite(bStamp) ? bStamp : 0;
    return safeB - safeA;
  });
};

export const getActiveRoutines = (userId?: string | null): ActiveRoutineEntry[] => {
  const entries = readEntries(userId).filter((entry) => (
    userId ? entry.userId === userId : true
  ));
  const filtered = entries.filter((entry) => !isExpired(entry));
  const changed = filtered.length !== entries.length;
  if (changed) {
    writeEntries(filtered, userId);
  }
  return sortByLastActive(filtered);
};

type TouchInput = {
  sessionKey?: string | null;
  userId?: string | null;
  workoutName: string;
  routineId?: number | null;
  resumeIndex?: number | null;
  sessionId?: number | null;
  sessionData?: WorkoutSessionData | null;
};

export const touchActiveRoutine = (input: TouchInput): ActiveRoutineEntry[] => {
  if (typeof window === 'undefined') return [];
  const userId = typeof input.userId === 'string' ? input.userId : null;
  if (!userId) return [];
  const sessionKey = typeof input.sessionKey === 'string' ? input.sessionKey : null;
  if (!sessionKey || !input.workoutName) return getActiveRoutines(userId);
  const now = new Date().toISOString();
  const entries = readEntries(userId).filter((entry) => !isExpired(entry));
  const existingIndex = entries.findIndex((entry) => entry.sessionKey === sessionKey);
  const nextEntry: ActiveRoutineEntry = {
    sessionKey,
    userId,
    workoutName: input.workoutName,
    routineId: input.routineId ?? null,
    resumeIndex: toIndex(input.resumeIndex),
    startTime: sessionKey,
    lastActiveAt: now,
    sessionId: input.sessionId ?? null,
    sessionData: input.sessionData ?? null,
  };

  if (existingIndex >= 0) {
    const existing = entries[existingIndex];
    entries[existingIndex] = {
      ...existing,
      ...nextEntry,
      startTime: existing.startTime || nextEntry.startTime,
      sessionData: nextEntry.sessionData ?? existing.sessionData ?? null,
    };
  } else {
    entries.push(nextEntry);
  }

  writeEntries(entries, userId);
  return sortByLastActive(entries);
};

export const removeActiveRoutine = (sessionKey: string, userId?: string | null): ActiveRoutineEntry[] => {
  if (typeof window === 'undefined') return [];
  const entries = readEntries(userId);
  const filtered = entries.filter((entry) => entry.sessionKey !== sessionKey);
  if (filtered.length !== entries.length) {
    writeEntries(filtered, userId);
  }
  return sortByLastActive(filtered);
};

type RemoveMatch = {
  sessionKey?: string | null;
  userId?: string | null;
  workoutName?: string | null;
  routineId?: number | null;
};

export const removeActiveRoutineForSession = (match: RemoveMatch): ActiveRoutineEntry[] => {
  if (typeof window === 'undefined') return [];
  const userId = typeof match.userId === 'string' ? match.userId : null;
  const entries = readEntries(userId);
  let filtered = entries;
  let removed = false;

  const sessionKey = typeof match.sessionKey === 'string' ? match.sessionKey : null;
  if (sessionKey) {
    filtered = filtered.filter((entry) => entry.sessionKey !== sessionKey);
    removed = filtered.length !== entries.length;
  }

  if (!removed && match.workoutName) {
    const routineId = match.routineId ?? null;
    const candidates = entries.filter((entry) => (
      entry.workoutName === match.workoutName
      && (entry.routineId ?? null) === routineId
    ));
    if (candidates.length > 0) {
      const [latest] = sortByLastActive([...candidates]);
      if (latest?.sessionKey) {
        filtered = entries.filter((entry) => entry.sessionKey !== latest.sessionKey);
        removed = true;
      }
    }
  }

  if (removed) {
    writeEntries(filtered, userId);
  }

  return sortByLastActive(filtered);
};
