import {
  createWorkoutSession,
  getAllExercises,
  getRoutineById,
  getWorkoutSessionById,
  logCardio,
  updateWorkoutSession,
  updateWorkoutSessionReport,
  upsertWorkoutExerciseLog,
} from '@/lib/database';
import { EXERCISE_TYPES } from '@/lib/constants';
import { FREE_WORKOUT_NAME } from '@/lib/free-workout';
import { isWeightMetric, resolvePrimaryMetric } from '@/lib/metric-utils';
import type { WorkoutSessionData } from '@/lib/workout-session';
import type { ExercisePrimaryMetric } from '@/lib/constants';

type SaveWorkoutSessionOptions = {
  completedAt?: Date;
  durationMinutes?: number | null;
  deriveDurationFromStart?: boolean;
  sessionKey?: string | null;
  workoutReport?: string | null;
};

export type SavedWorkoutSessionSummary = {
  success: true;
  sessionId: number;
  workoutName: string;
  completedAt: string;
  totalDurationMinutes: number | null;
  totalStrain: number | null;
};

export type McpWorkoutSetInput = {
  weight: number;
  reps: number;
  isWarmup?: boolean;
};

export type McpWorkoutExerciseInput = {
  name: string;
  sets: McpWorkoutSetInput[];
};

export type CreateMcpWorkoutSessionInput = {
  date: string;
  exercises: McpWorkoutExerciseInput[];
  durationMinutes?: number;
  notes?: string;
};

export type CreateMcpWorkoutSessionResult = SavedWorkoutSessionSummary & {
  notes: string | null;
  notesStoredAs: 'workout_report' | null;
  exercises: Array<{
    name: string;
    catalogMatched: boolean;
    warmup: { weight: number | null; reps: number | null };
    sets: Array<{ weight: number; reps: number }>;
  }>;
};

type ExerciseCatalogRow = {
  name?: unknown;
  is_machine?: unknown;
  primary_metric?: unknown;
  metric_unit?: unknown;
};

type NormalizedMcpExercise = {
  name: string;
  type: typeof EXERCISE_TYPES.single;
  isMachine: boolean;
  primaryMetric: ExercisePrimaryMetric;
  metricUnit: string | null;
  warmup?: { weight: number; reps: number };
  sets: Array<{ weight: number; reps: number }>;
  catalogMatched: boolean;
};

function toFiniteNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function toNullableFiniteNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeDateToNoonUtc(date: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error('date must use YYYY-MM-DD format');
  }
  const completedAt = new Date(`${date}T12:00:00.000Z`);
  if (Number.isNaN(completedAt.getTime()) || completedAt.toISOString().slice(0, 10) !== date) {
    throw new Error('date must be a valid YYYY-MM-DD date');
  }
  return completedAt;
}

function calculateTotalStrain(sessionData: WorkoutSessionData): number {
  let totalStrain = 0;

  for (const exercise of sessionData.exercises) {
    const primaryMetric = resolvePrimaryMetric(exercise.primaryMetric);
    if (isWeightMetric(primaryMetric)) {
      if (exercise.warmup) {
        totalStrain += exercise.warmup.weight * exercise.warmup.reps;
      }
      for (const set of exercise.sets) {
        totalStrain += set.weight * set.reps;
      }
    }

    if (exercise.b2bPartner) {
      const partnerMetric = resolvePrimaryMetric(exercise.b2bPartner.primaryMetric);
      if (isWeightMetric(partnerMetric)) {
        if (exercise.b2bPartner.warmup) {
          totalStrain += exercise.b2bPartner.warmup.weight * exercise.b2bPartner.warmup.reps;
        }
        for (const set of exercise.b2bPartner.sets) {
          totalStrain += set.weight * set.reps;
        }
      }
    }
  }

  return Math.round(totalStrain);
}

function resolveDurationMinutes(
  sessionData: WorkoutSessionData,
  completedAt: Date,
  options: SaveWorkoutSessionOptions
): number | null {
  if (options.durationMinutes !== undefined) {
    return options.durationMinutes;
  }

  if (options.deriveDurationFromStart === false) {
    return null;
  }

  const startTime = new Date(sessionData.startTime);
  if (Number.isNaN(startTime.getTime())) {
    throw new Error('session startTime must be a valid date');
  }
  return Math.round((completedAt.getTime() - startTime.getTime()) / 60000);
}

export async function saveWorkoutSessionForUser(
  userId: string,
  sessionData: WorkoutSessionData,
  options: SaveWorkoutSessionOptions = {}
): Promise<SavedWorkoutSessionSummary> {
  const routineId = toNullableFiniteNumber(sessionData.routineId);
  const sessionId = toNullableFiniteNumber(sessionData.sessionId);
  let workoutName = sessionData.workoutName;

  if (routineId !== null) {
    const routine = await getRoutineById(routineId);
    if (routine?.name) {
      workoutName = routine.name;
    }
  }

  const completedAt = options.completedAt ?? new Date();
  const completedAtIso = completedAt.toISOString();
  const totalDurationMinutes = resolveDurationMinutes(sessionData, completedAt, options);
  const totalStrain = calculateTotalStrain(sessionData);
  const storedStrain = totalStrain > 0 ? totalStrain : null;

  let activeSessionId = sessionId;
  if (activeSessionId !== null) {
    const existing = await getWorkoutSessionById(activeSessionId, userId);
    if (!existing) {
      activeSessionId = null;
    }
  }

  if (activeSessionId === null) {
    activeSessionId = await createWorkoutSession({
      user_id: userId,
      routine_id: routineId,
      session_key: options.sessionKey === undefined ? sessionData.startTime : options.sessionKey,
      workout_plan_name: workoutName,
      date_completed: completedAtIso,
      total_duration_minutes: totalDurationMinutes,
      total_strain: storedStrain,
    });
  } else {
    await updateWorkoutSession(activeSessionId, userId, {
      routine_id: routineId,
      workout_plan_name: workoutName,
      date_completed: completedAtIso,
      total_duration_minutes: totalDurationMinutes,
      total_strain: storedStrain,
    });
  }

  for (const exercise of sessionData.exercises) {
    const exerciseLog: Record<string, unknown> = {
      session_id: activeSessionId,
      exercise_name: exercise.name,
      exercise_type: exercise.type,
    };

    if (exercise.warmup) {
      exerciseLog.warmup_weight = exercise.warmup.weight;
      exerciseLog.warmup_reps = exercise.warmup.reps;
    }

    exercise.sets.forEach((set, index) => {
      if (index < 4) {
        exerciseLog[`set${index + 1}_weight`] = set.weight;
        exerciseLog[`set${index + 1}_reps`] = set.reps;
      }
    });

    if (exercise.b2bPartner) {
      exerciseLog.b2b_partner_name = exercise.b2bPartner.name;

      if (exercise.b2bPartner.warmup) {
        exerciseLog.b2b_warmup_weight = exercise.b2bPartner.warmup.weight;
        exerciseLog.b2b_warmup_reps = exercise.b2bPartner.warmup.reps;
      }

      exercise.b2bPartner.sets.forEach((set, index) => {
        if (index < 4) {
          exerciseLog[`b2b_set${index + 1}_weight`] = set.weight;
          exerciseLog[`b2b_set${index + 1}_reps`] = set.reps;
        }
      });
    }

    await upsertWorkoutExerciseLog(exerciseLog as Parameters<typeof upsertWorkoutExerciseLog>[0]);
  }

  if (sessionData.cardio) {
    await logCardio({
      session_id: activeSessionId,
      cardio_type: sessionData.cardio.type,
      time: sessionData.cardio.time,
      speed: sessionData.cardio.speed,
      incline: sessionData.cardio.incline,
    });
  }

  if (options.workoutReport !== undefined) {
    await updateWorkoutSessionReport({
      userId,
      sessionId: activeSessionId,
      report: options.workoutReport,
    });
  }

  return {
    success: true,
    sessionId: activeSessionId,
    workoutName,
    completedAt: completedAtIso,
    totalDurationMinutes,
    totalStrain: storedStrain,
  };
}

async function getCatalogByNormalizedName(): Promise<Map<string, ExerciseCatalogRow>> {
  const exercises = await getAllExercises();
  const byName = new Map<string, ExerciseCatalogRow>();

  for (const exercise of exercises as ExerciseCatalogRow[]) {
    if (typeof exercise.name !== 'string') continue;
    const key = exercise.name.trim().toLowerCase();
    if (key && !byName.has(key)) {
      byName.set(key, exercise);
    }
  }

  return byName;
}

function normalizeMcpExercise(
  input: McpWorkoutExerciseInput,
  catalogExercise?: ExerciseCatalogRow
): NormalizedMcpExercise {
  const name = input.name.trim();
  if (!name) {
    throw new Error('exercise name is required');
  }

  const warmupSets = input.sets.filter((set) => set.isWarmup);
  if (warmupSets.length > 1) {
    throw new Error(`${name} has multiple warmup sets; Gymmer sessions support one warmup set per exercise`);
  }

  const workingSets = input.sets.filter((set) => !set.isWarmup);
  if (workingSets.length > 4) {
    throw new Error(`${name} has ${workingSets.length} working sets; Gymmer stores up to 4 working sets per exercise`);
  }

  const canonicalName = typeof catalogExercise?.name === 'string' && catalogExercise.name.trim()
    ? catalogExercise.name.trim()
    : name;
  const primaryMetric = resolvePrimaryMetric(catalogExercise?.primary_metric) as ExercisePrimaryMetric;
  const warmup = warmupSets[0]
    ? { weight: warmupSets[0].weight, reps: warmupSets[0].reps }
    : undefined;
  const sets = workingSets.map((set) => ({ weight: set.weight, reps: set.reps }));

  return {
    name: canonicalName,
    type: EXERCISE_TYPES.single,
    isMachine: catalogExercise?.is_machine === 1,
    primaryMetric,
    metricUnit: typeof catalogExercise?.metric_unit === 'string' ? catalogExercise.metric_unit : null,
    warmup,
    sets,
    catalogMatched: Boolean(catalogExercise),
  };
}

export async function createWorkoutSessionFromMcp(
  userId: string,
  input: CreateMcpWorkoutSessionInput
): Promise<CreateMcpWorkoutSessionResult> {
  const completedAt = normalizeDateToNoonUtc(input.date);
  const catalog = await getCatalogByNormalizedName();
  const normalizedExercises = input.exercises.map((exercise) => {
    const key = exercise.name.trim().toLowerCase();
    return normalizeMcpExercise(exercise, catalog.get(key));
  });
  const notes = typeof input.notes === 'string' ? input.notes.trim() : undefined;

  const sessionData: WorkoutSessionData = {
    workoutName: FREE_WORKOUT_NAME,
    routineId: null,
    sessionId: null,
    startTime: completedAt.toISOString(),
    exercises: normalizedExercises.map((exercise) => ({
      name: exercise.name,
      type: EXERCISE_TYPES.single,
      isMachine: exercise.isMachine,
      primaryMetric: exercise.primaryMetric,
      metricUnit: exercise.metricUnit,
      warmup: exercise.warmup,
      sets: exercise.sets,
    })),
  };

  const saved = await saveWorkoutSessionForUser(userId, sessionData, {
    completedAt,
    durationMinutes: toFiniteNumber(input.durationMinutes),
    deriveDurationFromStart: false,
    sessionKey: null,
    workoutReport: notes || undefined,
  });

  return {
    ...saved,
    notes: notes || null,
    notesStoredAs: notes ? 'workout_report' : null,
    exercises: normalizedExercises.map((exercise) => ({
      name: exercise.name,
      catalogMatched: exercise.catalogMatched,
      warmup: {
        weight: exercise.warmup?.weight ?? null,
        reps: exercise.warmup?.reps ?? null,
      },
      sets: exercise.sets,
    })),
  };
}
