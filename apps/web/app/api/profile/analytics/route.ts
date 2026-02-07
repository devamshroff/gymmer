import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { getDatabase } from '@/lib/database';

const MS_PER_DAY = 86400000;

type CalendarDayEntry = {
  date: string;
  count: number;
  workoutNames: string[];
};

type CalendarPayload = {
  year: number;
  month: number;
  startWeekday: number;
  days: CalendarDayEntry[];
};

type ProgressLeader = {
  name: string;
  delta: number;
  recentAvg: number | null;
  previousAvg: number | null;
  lastPerformed: string | null;
};

type ExerciseSummary = {
  name: string;
  lastPerformed: string | null;
  sessions: number;
};

function parseRangeDays(value: string | null): number {
  if (!value) return 30;
  if (value === '30d') return 30;
  if (value === '90d') return 90;
  if (value === '6mo') return 180;
  if (value === '1y') return 365;
  const numeric = Number(value);
  if (Number.isFinite(numeric) && numeric > 0 && numeric <= 365) return Math.round(numeric);
  return 30;
}

function parseMonthOffset(value: string | null): number {
  if (!value) return 0;
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  const rounded = Math.trunc(numeric);
  return Math.max(-24, Math.min(24, rounded));
}

function startOfDayUtc(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function toDayString(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  return date.toISOString().slice(0, 10);
}

function buildDateRange(start: Date, days: number): string[] {
  const dates: string[] = [];
  for (let i = 0; i < days; i += 1) {
    dates.push(toDayString(new Date(start.getTime() + i * MS_PER_DAY)));
  }
  return dates;
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function asNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

export async function GET(request: NextRequest) {
  const authResult = await requireAuth();
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const searchParams = request.nextUrl.searchParams;
    const rangeDays = parseRangeDays(searchParams.get('range'));
    const monthOffset = parseMonthOffset(searchParams.get('monthOffset'));

    const today = startOfDayUtc(new Date());
    const rangeStart = new Date(today.getTime() - (rangeDays - 1) * MS_PER_DAY);
    const rangeEndExclusive = new Date(today.getTime() + MS_PER_DAY);
    const rangeStartIso = rangeStart.toISOString();
    const rangeEndIso = rangeEndExclusive.toISOString();

    const progressStart = new Date(rangeStart.getTime() - rangeDays * MS_PER_DAY);
    const progressStartIso = progressStart.toISOString();

    const monthStart = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + monthOffset, 1));
    const monthEndExclusive = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + monthOffset + 1, 1));
    const monthStartIso = monthStart.toISOString();
    const monthEndIso = monthEndExclusive.toISOString();

    const prevMonthStart = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + monthOffset - 1, 1));
    const prevMonthEndExclusive = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + monthOffset, 1));
    const prevMonthStartIso = prevMonthStart.toISOString();
    const prevMonthEndIso = prevMonthEndExclusive.toISOString();

    const db = getDatabase();

    const rangeSessionsResult = await db.execute({
      sql: `
        SELECT workout_plan_name, date_completed, total_duration_minutes
        FROM workout_sessions
        WHERE user_id = ?
          AND date_completed >= ?
          AND date_completed < ?
        ORDER BY date_completed ASC
      `,
      args: [user.id, rangeStartIso, rangeEndIso]
    });

    const monthSessionsResult = await db.execute({
      sql: `
        SELECT workout_plan_name, date_completed
        FROM workout_sessions
        WHERE user_id = ?
          AND date_completed >= ?
          AND date_completed < ?
        ORDER BY date_completed ASC
      `,
      args: [user.id, monthStartIso, monthEndIso]
    });

    const prevMonthSessionsResult = await db.execute({
      sql: `
        SELECT workout_plan_name, date_completed
        FROM workout_sessions
        WHERE user_id = ?
          AND date_completed >= ?
          AND date_completed < ?
        ORDER BY date_completed ASC
      `,
      args: [user.id, prevMonthStartIso, prevMonthEndIso]
    });

    const exerciseLogsResult = await db.execute({
      sql: `
        SELECT
          ws.date_completed as date_completed,
          el.exercise_name,
          el.b2b_partner_name,
          ws.id as session_id,
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
      `,
      args: [user.id, progressStartIso, rangeEndIso]
    });

    const allExerciseLogsResult = await db.execute({
      sql: `
        SELECT
          ws.date_completed as date_completed,
          ws.id as session_id,
          el.exercise_name as name
        FROM workout_exercise_logs el
        JOIN workout_sessions ws ON ws.id = el.session_id
        WHERE ws.user_id = ?
        UNION ALL
        SELECT
          ws.date_completed as date_completed,
          ws.id as session_id,
          el.b2b_partner_name as name
        FROM workout_exercise_logs el
        JOIN workout_sessions ws ON ws.id = el.session_id
        WHERE ws.user_id = ? AND el.b2b_partner_name IS NOT NULL
      `,
      args: [user.id, user.id]
    });

    const rangeSessions = rangeSessionsResult.rows
      .map((row) => ({
        workout_plan_name: asString((row as any).workout_plan_name),
        date_completed: asString((row as any).date_completed),
        total_duration_minutes: asNumber((row as any).total_duration_minutes)
      }))
      .filter((row) => row.workout_plan_name && row.date_completed);

    const monthSessions = monthSessionsResult.rows
      .map((row) => ({
        workout_plan_name: asString((row as any).workout_plan_name),
        date_completed: asString((row as any).date_completed)
      }))
      .filter((row) => row.workout_plan_name && row.date_completed);

    const prevMonthSessions = prevMonthSessionsResult.rows
      .map((row) => ({
        workout_plan_name: asString((row as any).workout_plan_name),
        date_completed: asString((row as any).date_completed)
      }))
      .filter((row) => row.workout_plan_name && row.date_completed);

    const dayCounts = new Map<string, number>();
    const dayWorkouts = new Map<string, Set<string>>();
    const dayWorkoutCounts = new Map<string, number>();
    const prevDayWorkouts = new Map<string, Set<string>>();
    const prevDayWorkoutCounts = new Map<string, number>();
    const workoutCounts = new Map<string, { count: number; lastCompleted: string }>();
    const durationValues: number[] = [];

    for (const session of rangeSessions) {
      const day = toDayString(session.date_completed);
      dayCounts.set(day, (dayCounts.get(day) || 0) + 1);

      if (typeof session.total_duration_minutes === 'number') {
        durationValues.push(session.total_duration_minutes);
      }

      const entry = workoutCounts.get(session.workout_plan_name) || { count: 0, lastCompleted: session.date_completed };
      entry.count += 1;
      entry.lastCompleted = session.date_completed > entry.lastCompleted
        ? session.date_completed
        : entry.lastCompleted;
      workoutCounts.set(session.workout_plan_name, entry);
    }

    for (const session of monthSessions) {
      const day = toDayString(session.date_completed);
      dayWorkoutCounts.set(day, (dayWorkoutCounts.get(day) || 0) + 1);
      if (!dayWorkouts.has(day)) {
        dayWorkouts.set(day, new Set());
      }
      dayWorkouts.get(day)?.add(session.workout_plan_name);
    }

    for (const session of prevMonthSessions) {
      const day = toDayString(session.date_completed);
      prevDayWorkoutCounts.set(day, (prevDayWorkoutCounts.get(day) || 0) + 1);
      if (!prevDayWorkouts.has(day)) {
        prevDayWorkouts.set(day, new Set());
      }
      prevDayWorkouts.get(day)?.add(session.workout_plan_name);
    }

    const trendDays = buildDateRange(rangeStart, rangeDays);
    const trend = trendDays.map((day) => ({ day, count: dayCounts.get(day) || 0 }));

    let longestStreak = 0;
    let currentStreak = 0;
    for (const entry of trend) {
      if (entry.count > 0) {
        currentStreak += 1;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    const avgDuration = durationValues.length > 0
      ? durationValues.reduce((sum, value) => sum + value, 0) / durationValues.length
      : null;

    const topWorkouts = Array.from(workoutCounts.entries())
      .map(([name, stats]) => ({
        name,
        count: stats.count,
        lastCompleted: stats.lastCompleted
      }))
      .sort((a, b) => b.count - a.count || b.lastCompleted.localeCompare(a.lastCompleted));

    const buildCalendar = (start: Date, dayCounts: Map<string, number>, dayNames: Map<string, Set<string>>): CalendarPayload => {
      const calendarDays: CalendarDayEntry[] = [];
      const monthDays = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 0)).getUTCDate();
      for (let day = 1; day <= monthDays; day += 1) {
        const date = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), day));
        const key = toDayString(date);
        const workouts = Array.from(dayNames.get(key) || []);
        const count = dayCounts.get(key) || 0;
        calendarDays.push({
          date: key,
          count,
          workoutNames: workouts
        });
      }
      return {
        year: start.getUTCFullYear(),
        month: start.getUTCMonth() + 1,
        startWeekday: start.getUTCDay(),
        days: calendarDays
      };
    };

    const calendar = buildCalendar(monthStart, dayWorkoutCounts, dayWorkouts);
    const calendarPrev = buildCalendar(prevMonthStart, prevDayWorkoutCounts, prevDayWorkouts);

    const exerciseRows = exerciseLogsResult.rows.map((row) => ({
      date_completed: asString((row as any).date_completed),
      exercise_name: (row as any).exercise_name ?? null,
      b2b_partner_name: (row as any).b2b_partner_name ?? null,
      session_id: (row as any).session_id ?? null,
      set1_weight: asNumber((row as any).set1_weight),
      set1_reps: asNumber((row as any).set1_reps),
      set2_weight: asNumber((row as any).set2_weight),
      set2_reps: asNumber((row as any).set2_reps),
      set3_weight: asNumber((row as any).set3_weight),
      set3_reps: asNumber((row as any).set3_reps),
      set4_weight: asNumber((row as any).set4_weight),
      set4_reps: asNumber((row as any).set4_reps),
      b2b_set1_weight: asNumber((row as any).b2b_set1_weight),
      b2b_set1_reps: asNumber((row as any).b2b_set1_reps),
      b2b_set2_weight: asNumber((row as any).b2b_set2_weight),
      b2b_set2_reps: asNumber((row as any).b2b_set2_reps),
      b2b_set3_weight: asNumber((row as any).b2b_set3_weight),
      b2b_set3_reps: asNumber((row as any).b2b_set3_reps),
      b2b_set4_weight: asNumber((row as any).b2b_set4_weight),
      b2b_set4_reps: asNumber((row as any).b2b_set4_reps),
    }));
    const allExerciseRows = allExerciseLogsResult.rows.map((row) => ({
      date_completed: asString((row as any).date_completed),
      session_id: (row as any).session_id ?? null,
      name: (row as any).name ?? null
    }));
    const exerciseDayMap = new Map<string, Map<string, { volume: number; maxWeight: number }>>();
    const exerciseLastPerformed = new Map<string, string>();
    const exerciseSessions = new Map<string, Set<number>>();

    const collectMetrics = (row: Record<string, any>, prefix: string) => {
      let volume = 0;
      let maxWeight = 0;
      for (let i = 1; i <= 4; i += 1) {
        const weight = row[`${prefix}set${i}_weight`];
        const reps = row[`${prefix}set${i}_reps`];
        if (typeof weight === 'number') {
          maxWeight = Math.max(maxWeight, weight);
        }
        if (typeof weight === 'number' && typeof reps === 'number') {
          volume += weight * reps;
        }
      }
      return { volume, maxWeight };
    };

    const pushExerciseMetrics = (name: string | null, day: string, metrics: { volume: number; maxWeight: number }) => {
      if (!name) return;
      if (!exerciseDayMap.has(name)) {
        exerciseDayMap.set(name, new Map());
      }
      const dayMap = exerciseDayMap.get(name)!;
      const existing = dayMap.get(day) || { volume: 0, maxWeight: 0 };
      dayMap.set(day, {
        volume: existing.volume + metrics.volume,
        maxWeight: Math.max(existing.maxWeight, metrics.maxWeight)
      });
      const lastPerformed = exerciseLastPerformed.get(name);
      if (!lastPerformed || day > lastPerformed) {
        exerciseLastPerformed.set(name, day);
      }
    };

    for (const row of exerciseRows) {
      const day = toDayString(row.date_completed);
      pushExerciseMetrics(row.exercise_name, day, collectMetrics(row, ''));
      if (row.b2b_partner_name) {
        pushExerciseMetrics(row.b2b_partner_name, day, collectMetrics(row, 'b2b_'));
      }
    }

    for (const row of allExerciseRows) {
      const name = row.name as string | null;
      if (!name) continue;
      const day = toDayString(row.date_completed);
      const sessionId = Number(row.session_id);
      if (!exerciseSessions.has(name)) {
        exerciseSessions.set(name, new Set());
      }
      if (Number.isFinite(sessionId)) {
        exerciseSessions.get(name)!.add(sessionId);
      }
      const last = exerciseLastPerformed.get(name);
      if (!last || day > last) {
        exerciseLastPerformed.set(name, day);
      }
    }

    const previousStart = new Date(rangeStart.getTime() - rangeDays * MS_PER_DAY);
    const previousEnd = rangeStart;

    const volumeLeaders: ProgressLeader[] = [];
    const maxWeightLeaders: ProgressLeader[] = [];
    const exerciseSummaries: ExerciseSummary[] = [];

    for (const [exerciseName, dayMap] of exerciseDayMap.entries()) {
      let recentVolumeSum = 0;
      let recentVolumeDays = 0;
      let prevVolumeSum = 0;
      let prevVolumeDays = 0;
      let recentMaxSum = 0;
      let recentMaxDays = 0;
      let prevMaxSum = 0;
      let prevMaxDays = 0;

      for (const [day, metrics] of dayMap.entries()) {
        const dayDate = new Date(`${day}T00:00:00.000Z`);
        if (dayDate >= rangeStart && dayDate < rangeEndExclusive) {
          if (metrics.volume > 0) {
            recentVolumeSum += metrics.volume;
            recentVolumeDays += 1;
          }
          if (metrics.maxWeight > 0) {
            recentMaxSum += metrics.maxWeight;
            recentMaxDays += 1;
          }
        } else if (dayDate >= previousStart && dayDate < previousEnd) {
          if (metrics.volume > 0) {
            prevVolumeSum += metrics.volume;
            prevVolumeDays += 1;
          }
          if (metrics.maxWeight > 0) {
            prevMaxSum += metrics.maxWeight;
            prevMaxDays += 1;
          }
        }
      }

      const recentVolumeAvg = recentVolumeDays > 0 ? recentVolumeSum / recentVolumeDays : null;
      const prevVolumeAvg = prevVolumeDays > 0 ? prevVolumeSum / prevVolumeDays : null;
      const recentMaxAvg = recentMaxDays > 0 ? recentMaxSum / recentMaxDays : null;
      const prevMaxAvg = prevMaxDays > 0 ? prevMaxSum / prevMaxDays : null;

      if (recentVolumeAvg !== null) {
        volumeLeaders.push({
          name: exerciseName,
          delta: recentVolumeAvg - (prevVolumeAvg ?? 0),
          recentAvg: recentVolumeAvg,
          previousAvg: prevVolumeAvg,
          lastPerformed: exerciseLastPerformed.get(exerciseName) || null
        });
      }

      if (recentMaxAvg !== null) {
        maxWeightLeaders.push({
          name: exerciseName,
          delta: recentMaxAvg - (prevMaxAvg ?? 0),
          recentAvg: recentMaxAvg,
          previousAvg: prevMaxAvg,
          lastPerformed: exerciseLastPerformed.get(exerciseName) || null
        });
      }

    }

    for (const [exerciseName, sessions] of exerciseSessions.entries()) {
      exerciseSummaries.push({
        name: exerciseName,
        lastPerformed: exerciseLastPerformed.get(exerciseName) || null,
        sessions: sessions.size
      });
    }

    const topVolumeLeaders = volumeLeaders
      .filter((entry) => entry.delta > 0)
      .sort((a, b) => b.delta - a.delta)
      .slice(0, 5);

    const topMaxWeightLeaders = maxWeightLeaders
      .filter((entry) => entry.delta > 0)
      .sort((a, b) => b.delta - a.delta)
      .slice(0, 5);

    const exercises = exerciseSummaries
      .sort((a, b) => (b.lastPerformed || '').localeCompare(a.lastPerformed || ''))
      .map((entry) => ({
        ...entry,
        lastPerformed: entry.lastPerformed
      }));

    return NextResponse.json({
      rangeDays,
      calendar,
      calendarPrev,
      summary: {
        workoutsLogged: rangeSessions.length,
        avgDuration,
        longestStreak,
        trend
      },
      topWorkouts,
      progressLeaders: {
        volume: topVolumeLeaders,
        maxWeight: topMaxWeightLeaders
      },
      exercises
    });
  } catch (error) {
    console.error('Error fetching profile analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
