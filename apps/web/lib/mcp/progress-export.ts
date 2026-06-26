import { getDatabase } from '@/lib/database';

const MS_PER_DAY = 86400000;
const DEFAULT_RANGE_DAYS = 90;
const MAX_RANGE_DAYS = 365;
const DEFAULT_PAGE_LIMIT = 20;
const MAX_PAGE_LIMIT = 50;

type DbRow = Record<string, unknown>;

export type DateRangeInput = {
  from?: string | null;
  to?: string | null;
};

export type DateRange = {
  from: string;
  to: string;
  fromIso: string;
  toExclusiveIso: string;
  days: number;
};

function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function toDayString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function parseDay(value: string, label: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`${label} must use YYYY-MM-DD format`);
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || toDayString(date) !== value) {
    throw new Error(`${label} must be a valid calendar date`);
  }
  return date;
}

export function resolveDateRange(input: DateRangeInput = {}, now: Date = new Date()): DateRange {
  const today = startOfUtcDay(now);
  const toDate = input.to ? parseDay(input.to, 'to') : today;
  const fromDate = input.from
    ? parseDay(input.from, 'from')
    : new Date(toDate.getTime() - (DEFAULT_RANGE_DAYS - 1) * MS_PER_DAY);

  if (fromDate.getTime() > toDate.getTime()) {
    throw new Error('from must be on or before to');
  }

  const days = Math.floor((toDate.getTime() - fromDate.getTime()) / MS_PER_DAY) + 1;
  if (days > MAX_RANGE_DAYS) {
    throw new Error(`date range cannot exceed ${MAX_RANGE_DAYS} days`);
  }

  return {
    from: toDayString(fromDate),
    to: toDayString(toDate),
    fromIso: fromDate.toISOString(),
    toExclusiveIso: new Date(toDate.getTime() + MS_PER_DAY).toISOString(),
    days,
  };
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function asNullableString(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function asNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function clampLimit(limit: unknown): number {
  if (typeof limit !== 'number' || !Number.isFinite(limit)) return DEFAULT_PAGE_LIMIT;
  return Math.max(1, Math.min(MAX_PAGE_LIMIT, Math.trunc(limit)));
}

function parseCursor(cursor: unknown): number {
  if (typeof cursor !== 'string' || cursor.length === 0) return 0;
  const parsed = Number(cursor);
  if (!Number.isInteger(parsed) || parsed < 0) return 0;
  return parsed;
}

function readSetPairs(row: DbRow, prefix = ''): Array<{ weight: number | null; reps: number | null }> {
  const sets: Array<{ weight: number | null; reps: number | null }> = [];
  for (let i = 1; i <= 4; i += 1) {
    const weight = asNumber(row[`${prefix}set${i}_weight`]);
    const reps = asNumber(row[`${prefix}set${i}_reps`]);
    if (weight !== null || reps !== null) {
      sets.push({ weight, reps });
    }
  }
  return sets;
}

function estimateVolume(sets: Array<{ weight: number | null; reps: number | null }>): number {
  return sets.reduce((total, set) => {
    if (typeof set.weight === 'number' && typeof set.reps === 'number') {
      return total + set.weight * set.reps;
    }
    return total;
  }, 0);
}

function parseMinutes(value: unknown): number | null {
  if (typeof value !== 'string') return null;
  const match = value.match(/(\d+(?:\.\d+)?)/);
  if (!match) return null;
  const parsed = Number(match[1]);
  return Number.isFinite(parsed) ? parsed : null;
}

function buildStreaks(days: string[], counts: Map<string, number>): { current: number; longest: number } {
  let longest = 0;
  let running = 0;

  for (const day of days) {
    if ((counts.get(day) || 0) > 0) {
      running += 1;
      longest = Math.max(longest, running);
    } else {
      running = 0;
    }
  }

  let current = 0;
  for (let i = days.length - 1; i >= 0; i -= 1) {
    if ((counts.get(days[i]) || 0) === 0) break;
    current += 1;
  }

  return { current, longest };
}

function buildDayRange(range: DateRange): string[] {
  const start = new Date(range.fromIso);
  return Array.from({ length: range.days }, (_, index) => (
    toDayString(new Date(start.getTime() + index * MS_PER_DAY))
  ));
}

export async function getMcpProgressSummary(userId: string, input: DateRangeInput = {}) {
  const range = resolveDateRange(input);
  const db = getDatabase();

  const sessionsResult = await db.execute({
    sql: `
      SELECT id, workout_plan_name, date_completed, total_duration_minutes, total_strain, workout_report
      FROM workout_sessions
      WHERE user_id = ?
        AND date_completed >= ?
        AND date_completed < ?
      ORDER BY date_completed ASC
    `,
    args: [userId, range.fromIso, range.toExclusiveIso],
  });

  const exerciseLogsResult = await db.execute({
    sql: `
      SELECT
        ws.id as session_id,
        ws.workout_plan_name,
        ws.date_completed,
        el.exercise_name,
        el.b2b_partner_name,
        el.set1_weight, el.set1_reps,
        el.set2_weight, el.set2_reps,
        el.set3_weight, el.set3_reps,
        el.set4_weight, el.set4_reps,
        el.b2b_set1_weight, el.b2b_set1_reps,
        el.b2b_set2_weight, el.b2b_set2_reps,
        el.b2b_set3_weight, el.b2b_set3_reps,
        el.b2b_set4_weight, el.b2b_set4_reps
      FROM workout_exercise_logs el
      JOIN workout_sessions ws ON ws.id = el.session_id
      WHERE ws.user_id = ?
        AND ws.date_completed >= ?
        AND ws.date_completed < ?
      ORDER BY ws.date_completed ASC, el.id ASC
    `,
    args: [userId, range.fromIso, range.toExclusiveIso],
  });

  const cardioResult = await db.execute({
    sql: `
      SELECT wc.cardio_type, wc.time, wc.speed, wc.incline, ws.date_completed, ws.id as session_id
      FROM workout_cardio_logs wc
      JOIN workout_sessions ws ON ws.id = wc.session_id
      WHERE ws.user_id = ?
        AND ws.date_completed >= ?
        AND ws.date_completed < ?
      ORDER BY ws.date_completed ASC, wc.id ASC
    `,
    args: [userId, range.fromIso, range.toExclusiveIso],
  });

  const dayCounts = new Map<string, number>();
  const workoutCounts = new Map<string, { count: number; lastCompleted: string }>();
  let totalDurationMinutes = 0;
  let durationCount = 0;
  let totalStrain = 0;
  let strainCount = 0;

  const sessions = sessionsResult.rows.map((row) => {
    const session = {
      id: Number((row as DbRow).id),
      workoutName: asString((row as DbRow).workout_plan_name),
      completedAt: asString((row as DbRow).date_completed),
      durationMinutes: asNumber((row as DbRow).total_duration_minutes),
      strain: asNumber((row as DbRow).total_strain),
      hasReport: Boolean((row as DbRow).workout_report),
    };

    const day = session.completedAt.slice(0, 10);
    dayCounts.set(day, (dayCounts.get(day) || 0) + 1);

    const workoutEntry = workoutCounts.get(session.workoutName) || {
      count: 0,
      lastCompleted: session.completedAt,
    };
    workoutEntry.count += 1;
    workoutEntry.lastCompleted = session.completedAt > workoutEntry.lastCompleted
      ? session.completedAt
      : workoutEntry.lastCompleted;
    workoutCounts.set(session.workoutName, workoutEntry);

    if (typeof session.durationMinutes === 'number') {
      totalDurationMinutes += session.durationMinutes;
      durationCount += 1;
    }
    if (typeof session.strain === 'number') {
      totalStrain += session.strain;
      strainCount += 1;
    }

    return session;
  });

  const exerciseMap = new Map<string, {
    name: string;
    sessions: Set<number>;
    lastPerformed: string | null;
    estimatedVolume: number;
    maxWeight: number | null;
    maxReps: number | null;
  }>();

  function recordExercise(name: string, sessionId: number, completedAt: string, sets: Array<{ weight: number | null; reps: number | null }>) {
    if (!name) return;
    const entry = exerciseMap.get(name) || {
      name,
      sessions: new Set<number>(),
      lastPerformed: null,
      estimatedVolume: 0,
      maxWeight: null,
      maxReps: null,
    };
    entry.sessions.add(sessionId);
    entry.lastPerformed = !entry.lastPerformed || completedAt > entry.lastPerformed ? completedAt : entry.lastPerformed;
    entry.estimatedVolume += estimateVolume(sets);
    for (const set of sets) {
      if (typeof set.weight === 'number') {
        entry.maxWeight = entry.maxWeight === null ? set.weight : Math.max(entry.maxWeight, set.weight);
      }
      if (typeof set.reps === 'number') {
        entry.maxReps = entry.maxReps === null ? set.reps : Math.max(entry.maxReps, set.reps);
      }
    }
    exerciseMap.set(name, entry);
  }

  for (const row of exerciseLogsResult.rows) {
    const rowData = row as DbRow;
    const sessionId = Number(rowData.session_id);
    const completedAt = asString(rowData.date_completed);
    recordExercise(asString(rowData.exercise_name), sessionId, completedAt, readSetPairs(rowData));
    recordExercise(asString(rowData.b2b_partner_name), sessionId, completedAt, readSetPairs(rowData, 'b2b_'));
  }

  let cardioMinutes = 0;
  let cardioMinutesCount = 0;
  const cardioByType = new Map<string, number>();
  for (const row of cardioResult.rows) {
    const type = asString((row as DbRow).cardio_type) || 'Cardio';
    cardioByType.set(type, (cardioByType.get(type) || 0) + 1);
    const minutes = parseMinutes((row as DbRow).time);
    if (minutes !== null) {
      cardioMinutes += minutes;
      cardioMinutesCount += 1;
    }
  }

  const days = buildDayRange(range);
  const streaks = buildStreaks(days, dayCounts);

  const exerciseLeaders = Array.from(exerciseMap.values())
    .map((entry) => ({
      name: entry.name,
      sessions: entry.sessions.size,
      lastPerformed: entry.lastPerformed,
      estimatedVolume: Number(entry.estimatedVolume.toFixed(2)),
      maxWeight: entry.maxWeight,
      maxReps: entry.maxReps,
    }))
    .sort((a, b) => b.sessions - a.sessions || b.estimatedVolume - a.estimatedVolume || a.name.localeCompare(b.name))
    .slice(0, 12);

  const workoutBreakdown = Array.from(workoutCounts.entries())
    .map(([name, entry]) => ({ name, count: entry.count, lastCompleted: entry.lastCompleted }))
    .sort((a, b) => b.count - a.count || b.lastCompleted.localeCompare(a.lastCompleted));

  const latestReports = sessionsResult.rows
    .filter((row) => asNullableString((row as DbRow).workout_report))
    .slice(-5)
    .reverse()
    .map((row) => ({
      sessionId: Number((row as DbRow).id),
      workoutName: asString((row as DbRow).workout_plan_name),
      completedAt: asString((row as DbRow).date_completed),
      report: asString((row as DbRow).workout_report),
    }));

  return {
    range: {
      from: range.from,
      to: range.to,
      days: range.days,
      generatedAt: new Date().toISOString(),
    },
    summary: {
      sessionCount: sessions.length,
      workoutDays: dayCounts.size,
      currentStreakDays: streaks.current,
      longestStreakDays: streaks.longest,
      totalDurationMinutes,
      averageDurationMinutes: durationCount > 0 ? Math.round(totalDurationMinutes / durationCount) : null,
      totalStrain: strainCount > 0 ? totalStrain : null,
      averageStrain: strainCount > 0 ? Number((totalStrain / strainCount).toFixed(1)) : null,
    },
    trend: days.map((day) => ({ day, sessions: dayCounts.get(day) || 0 })),
    workoutBreakdown,
    exerciseLeaders,
    cardio: {
      sessionCount: cardioResult.rows.length,
      totalMinutes: cardioMinutesCount > 0 ? cardioMinutes : null,
      byType: Array.from(cardioByType.entries()).map(([type, count]) => ({ type, count })),
    },
    recentSessions: sessions.slice(-10).reverse(),
    latestReports,
  };
}

export async function listMcpWorkoutSessions(userId: string, input: DateRangeInput & {
  limit?: number | null;
  cursor?: string | null;
} = {}) {
  const range = resolveDateRange(input);
  const limit = clampLimit(input.limit);
  const offset = parseCursor(input.cursor);
  const db = getDatabase();

  const result = await db.execute({
    sql: `
      SELECT id, workout_plan_name, date_completed, total_duration_minutes, total_strain, routine_id, session_key, workout_report
      FROM workout_sessions
      WHERE user_id = ?
        AND date_completed >= ?
        AND date_completed < ?
      ORDER BY date_completed DESC, id DESC
      LIMIT ?
      OFFSET ?
    `,
    args: [userId, range.fromIso, range.toExclusiveIso, limit + 1, offset],
  });

  const rows = result.rows.slice(0, limit);
  return {
    range: { from: range.from, to: range.to, days: range.days },
    sessions: rows.map((row) => ({
      id: Number((row as DbRow).id),
      workoutName: asString((row as DbRow).workout_plan_name),
      completedAt: asString((row as DbRow).date_completed),
      durationMinutes: asNumber((row as DbRow).total_duration_minutes),
      strain: asNumber((row as DbRow).total_strain),
      routineId: asNumber((row as DbRow).routine_id),
      sessionKey: asNullableString((row as DbRow).session_key),
      report: asNullableString((row as DbRow).workout_report),
    })),
    nextCursor: result.rows.length > limit ? String(offset + limit) : null,
  };
}

export async function getMcpWorkoutSession(userId: string, sessionId: number) {
  if (!Number.isInteger(sessionId) || sessionId <= 0) {
    throw new Error('sessionId must be a positive integer');
  }

  const db = getDatabase();
  const sessionResult = await db.execute({
    sql: `
      SELECT id, workout_plan_name, date_completed, total_duration_minutes, total_strain, routine_id, session_key, workout_report
      FROM workout_sessions
      WHERE id = ? AND user_id = ?
      LIMIT 1
    `,
    args: [sessionId, userId],
  });

  const sessionRow = sessionResult.rows[0] as DbRow | undefined;
  if (!sessionRow) {
    throw new Error('workout session not found');
  }

  const exercisesResult = await db.execute({
    sql: `
      SELECT *
      FROM workout_exercise_logs
      WHERE session_id = ?
      ORDER BY id ASC
    `,
    args: [sessionId],
  });

  const cardioResult = await db.execute({
    sql: `
      SELECT *
      FROM workout_cardio_logs
      WHERE session_id = ?
      ORDER BY id ASC
    `,
    args: [sessionId],
  });

  return {
    session: {
      id: Number(sessionRow.id),
      workoutName: asString(sessionRow.workout_plan_name),
      completedAt: asString(sessionRow.date_completed),
      durationMinutes: asNumber(sessionRow.total_duration_minutes),
      strain: asNumber(sessionRow.total_strain),
      routineId: asNumber(sessionRow.routine_id),
      sessionKey: asNullableString(sessionRow.session_key),
      report: asNullableString(sessionRow.workout_report),
    },
    exercises: exercisesResult.rows.map((row) => {
      const rowData = row as DbRow;
      return {
        id: Number(rowData.id),
        exerciseName: asString(rowData.exercise_name),
        exerciseType: asString(rowData.exercise_type),
        warmup: {
          weight: asNumber(rowData.warmup_weight),
          reps: asNumber(rowData.warmup_reps),
        },
        sets: readSetPairs(rowData),
        b2bPartnerName: asNullableString(rowData.b2b_partner_name),
        b2bWarmup: {
          weight: asNumber(rowData.b2b_warmup_weight),
          reps: asNumber(rowData.b2b_warmup_reps),
        },
        b2bSets: readSetPairs(rowData, 'b2b_'),
      };
    }),
    cardio: cardioResult.rows.map((row) => ({
      id: Number((row as DbRow).id),
      cardioType: asString((row as DbRow).cardio_type),
      time: asString((row as DbRow).time),
      speed: asNumber((row as DbRow).speed),
      incline: asNumber((row as DbRow).incline),
    })),
  };
}

export async function getMcpExerciseProgress(userId: string, input: DateRangeInput & {
  exerciseName: string;
}) {
  const exerciseName = input.exerciseName?.trim();
  if (!exerciseName) {
    throw new Error('exerciseName is required');
  }

  const range = resolveDateRange(input);
  const db = getDatabase();
  const result = await db.execute({
    sql: `
      SELECT
        ws.id as session_id,
        ws.workout_plan_name,
        ws.date_completed,
        el.exercise_name,
        el.b2b_partner_name,
        el.warmup_weight, el.warmup_reps,
        el.set1_weight, el.set1_reps,
        el.set2_weight, el.set2_reps,
        el.set3_weight, el.set3_reps,
        el.set4_weight, el.set4_reps,
        el.b2b_warmup_weight, el.b2b_warmup_reps,
        el.b2b_set1_weight, el.b2b_set1_reps,
        el.b2b_set2_weight, el.b2b_set2_reps,
        el.b2b_set3_weight, el.b2b_set3_reps,
        el.b2b_set4_weight, el.b2b_set4_reps
      FROM workout_exercise_logs el
      JOIN workout_sessions ws ON ws.id = el.session_id
      WHERE ws.user_id = ?
        AND ws.date_completed >= ?
        AND ws.date_completed < ?
        AND (el.exercise_name = ? OR el.b2b_partner_name = ?)
      ORDER BY ws.date_completed ASC, el.id ASC
    `,
    args: [userId, range.fromIso, range.toExclusiveIso, exerciseName, exerciseName],
  });

  const sessions = result.rows.map((row) => {
    const rowData = row as DbRow;
    const matchedPartner = asString(rowData.b2b_partner_name) === exerciseName && asString(rowData.exercise_name) !== exerciseName;
    const sets = matchedPartner ? readSetPairs(rowData, 'b2b_') : readSetPairs(rowData);
    const warmup = matchedPartner
      ? { weight: asNumber(rowData.b2b_warmup_weight), reps: asNumber(rowData.b2b_warmup_reps) }
      : { weight: asNumber(rowData.warmup_weight), reps: asNumber(rowData.warmup_reps) };

    return {
      sessionId: Number(rowData.session_id),
      workoutName: asString(rowData.workout_plan_name),
      completedAt: asString(rowData.date_completed),
      matchedRole: matchedPartner ? 'b2b_partner' : 'primary',
      warmup,
      sets,
      estimatedVolume: Number(estimateVolume(sets).toFixed(2)),
    };
  });

  return {
    exerciseName,
    range: { from: range.from, to: range.to, days: range.days },
    sessionCount: sessions.length,
    sessions,
  };
}

export async function getMcpRoutinesSnapshot(userId: string) {
  const db = getDatabase();
  const routinesResult = await db.execute({
    sql: `
      SELECT r.*, MAX(ws.date_completed) as last_workout_date
      FROM routines r
      LEFT JOIN workout_sessions ws
        ON ws.user_id = ? AND ws.routine_id = r.id
      WHERE r.user_id = ?
      GROUP BY r.id
      ORDER BY COALESCE(r.order_index, 0) ASC, r.created_at DESC
    `,
    args: [userId, userId],
  });

  const snapshots = await Promise.all(routinesResult.rows.map(async (routineRow) => {
    const routine = routineRow as DbRow;
    const routineId = Number(routine.id);
    const [exercisesResult, preStretchesResult, postStretchesResult, cardioResult] = await Promise.all([
      db.execute({
        sql: `
          SELECT re.*,
                 e1.name as exercise_name,
                 e1.primary_metric as exercise_primary_metric,
                 e1.metric_unit as exercise_metric_unit,
                 e2.name as exercise2_name
          FROM routine_exercises re
          JOIN exercises e1 ON re.exercise_id1 = e1.id
          LEFT JOIN exercises e2 ON re.exercise_id2 = e2.id
          WHERE re.routine_id = ?
          ORDER BY re.order_index
        `,
        args: [routineId],
      }),
      db.execute({
        sql: `
          SELECT rs.*, s.name, s.timer_seconds
          FROM routine_pre_stretches rs
          JOIN stretches s ON rs.stretch_id = s.id
          WHERE rs.routine_id = ?
          ORDER BY rs.order_index
        `,
        args: [routineId],
      }),
      db.execute({
        sql: `
          SELECT rs.*, s.name, s.timer_seconds
          FROM routine_post_stretches rs
          JOIN stretches s ON rs.stretch_id = s.id
          WHERE rs.routine_id = ?
          ORDER BY rs.order_index
        `,
        args: [routineId],
      }),
      db.execute({
        sql: 'SELECT cardio_type, duration, intensity, tips FROM routine_cardio WHERE routine_id = ? LIMIT 1',
        args: [routineId],
      }),
    ]);

    return {
      id: routineId,
      name: asString(routine.name),
      description: asNullableString(routine.description),
      isPublic: Number(routine.is_public ?? 0) === 1,
      orderIndex: asNumber(routine.order_index),
      lastWorkoutDate: asNullableString(routine.last_workout_date),
      exercises: exercisesResult.rows.map((exerciseRow) => {
        const exercise = exerciseRow as DbRow;
        return {
          id: Number(exercise.id),
          exerciseName: asString(exercise.exercise_name),
          b2bPartnerName: asNullableString(exercise.exercise2_name),
          orderIndex: asNumber(exercise.order_index),
          primaryMetric: asNullableString(exercise.exercise_primary_metric),
          metricUnit: asNullableString(exercise.exercise_metric_unit),
        };
      }),
      preStretches: preStretchesResult.rows.map((stretchRow) => {
        const stretch = stretchRow as DbRow;
        return {
          name: asString(stretch.name),
          timerSeconds: asNumber(stretch.timer_seconds),
          orderIndex: asNumber(stretch.order_index),
        };
      }),
      postStretches: postStretchesResult.rows.map((stretchRow) => {
        const stretch = stretchRow as DbRow;
        return {
          name: asString(stretch.name),
          timerSeconds: asNumber(stretch.timer_seconds),
          orderIndex: asNumber(stretch.order_index),
        };
      }),
      cardio: cardioResult.rows[0] ? {
        cardioType: asString((cardioResult.rows[0] as DbRow).cardio_type),
        duration: asString((cardioResult.rows[0] as DbRow).duration),
        intensity: asNullableString((cardioResult.rows[0] as DbRow).intensity),
        tips: asNullableString((cardioResult.rows[0] as DbRow).tips),
      } : null,
    };
  }));

  return {
    generatedAt: new Date().toISOString(),
    routineCount: snapshots.length,
    routines: snapshots,
  };
}
