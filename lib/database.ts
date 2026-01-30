// lib/database.ts
import { createClient, Client } from '@libsql/client';
import type { WorkoutSession, WorkoutExerciseLog, WorkoutCardioLog } from './types';

// Initialize database connection
let db: Client | null = null;
let workoutSessionModeColumnReady: boolean | null = null;
let workoutSessionRoutineIdColumnReady: boolean | null = null;
let workoutSessionKeyColumnReady: boolean | null = null;
const DEFAULT_REST_TIME_SECONDS = 60;
const DEFAULT_SUPERSET_REST_TIME_SECONDS = 15;

export function getDatabase(): Client {
  if (!db) {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;
    if (!url) {
      throw new Error('Missing TURSO_DATABASE_URL');
    }
    const isFile = url.startsWith('file:');
    if (!isFile && !authToken) {
      throw new Error('Missing TURSO_AUTH_TOKEN');
    }
    db = createClient({
      url,
      ...(isFile ? {} : { authToken })
    });
  }
  return db;
}

// ============================================================================
// User Management Functions
// ============================================================================

export async function upsertUser(data: {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
}): Promise<void> {
  const db = getDatabase();
  await db.execute({
    sql: `
      INSERT INTO users (id, email, name, image, updated_at)
      VALUES (?, ?, ?, ?, datetime('now'))
      ON CONFLICT(id) DO UPDATE SET
        email = excluded.email,
        name = excluded.name,
        image = excluded.image,
        updated_at = datetime('now')
    `,
    args: [data.id, data.email, data.name || null, data.image || null]
  });
}

export async function getUserById(id: string): Promise<any | null> {
  const db = getDatabase();
  const result = await db.execute({
    sql: 'SELECT * FROM users WHERE id = ?',
    args: [id]
  });
  return result.rows[0] as any || null;
}

export async function getUserByEmail(email: string): Promise<any | null> {
  const db = getDatabase();
  const result = await db.execute({
    sql: 'SELECT * FROM users WHERE email = ?',
    args: [email]
  });
  return result.rows[0] as any || null;
}


async function hasWorkoutSessionModeColumn(): Promise<boolean> {
  if (workoutSessionModeColumnReady !== null) return workoutSessionModeColumnReady;
  const db = getDatabase();
  try {
    const result = await db.execute({
      sql: 'PRAGMA table_info(workout_sessions)'
    });
    workoutSessionModeColumnReady = result.rows.some((row: any) => row.name === 'session_mode');
  } catch (error) {
    console.warn('Failed to inspect workout_sessions schema:', error);
    workoutSessionModeColumnReady = false;
  }
  return workoutSessionModeColumnReady;
}

async function hasWorkoutSessionRoutineIdColumn(): Promise<boolean> {
  if (workoutSessionRoutineIdColumnReady !== null) return workoutSessionRoutineIdColumnReady;
  const db = getDatabase();
  try {
    const result = await db.execute({
      sql: 'PRAGMA table_info(workout_sessions)'
    });
    workoutSessionRoutineIdColumnReady = result.rows.some((row: any) => row.name === 'routine_id');
  } catch (error) {
    console.warn('Failed to inspect workout_sessions routine_id schema:', error);
    workoutSessionRoutineIdColumnReady = false;
  }
  return workoutSessionRoutineIdColumnReady;
}

async function hasWorkoutSessionKeyColumn(): Promise<boolean> {
  if (workoutSessionKeyColumnReady !== null) return workoutSessionKeyColumnReady;
  const db = getDatabase();
  try {
    const result = await db.execute({
      sql: 'PRAGMA table_info(workout_sessions)'
    });
    workoutSessionKeyColumnReady = result.rows.some((row: any) => row.name === 'session_key');
  } catch (error) {
    console.warn('Failed to inspect workout_sessions session_key schema:', error);
    workoutSessionKeyColumnReady = false;
  }
  return workoutSessionKeyColumnReady;
}

async function ensureWorkoutSessionKeyColumn(): Promise<boolean> {
  const hasColumn = await hasWorkoutSessionKeyColumn();
  if (hasColumn) return true;
  const db = getDatabase();
  try {
    await db.execute({
      sql: 'ALTER TABLE workout_sessions ADD COLUMN session_key TEXT'
    });
    workoutSessionKeyColumnReady = true;
  } catch (error: any) {
    const message = String(error?.message || error);
    if (message.toLowerCase().includes('duplicate') || message.toLowerCase().includes('already exists')) {
      workoutSessionKeyColumnReady = true;
    } else {
      console.warn('Failed to add session_key column to workout_sessions:', error);
      workoutSessionKeyColumnReady = false;
      return false;
    }
  }

  try {
    await db.execute({
      sql: 'CREATE UNIQUE INDEX IF NOT EXISTS idx_sessions_user_key ON workout_sessions(user_id, session_key)'
    });
  } catch (error) {
    console.warn('Failed to create session_key index:', error);
  }

  return workoutSessionKeyColumnReady === true;
}

async function ensureWorkoutSessionRoutineIdColumn(): Promise<boolean> {
  const hasColumn = await hasWorkoutSessionRoutineIdColumn();
  if (hasColumn) return true;
  const db = getDatabase();
  try {
    await db.execute({
      sql: 'ALTER TABLE workout_sessions ADD COLUMN routine_id INTEGER'
    });
    workoutSessionRoutineIdColumnReady = true;
    return true;
  } catch (error: any) {
    const message = String(error?.message || error);
    if (message.toLowerCase().includes('duplicate') || message.toLowerCase().includes('already exists')) {
      workoutSessionRoutineIdColumnReady = true;
      return true;
    }
    console.warn('Failed to add routine_id column to workout_sessions:', error);
    workoutSessionRoutineIdColumnReady = false;
    return false;
  }
}

async function backfillWorkoutSessionRoutineIds(userId: string): Promise<void> {
  const hasColumn = await ensureWorkoutSessionRoutineIdColumn();
  if (!hasColumn) return;
  const db = getDatabase();
  await db.execute({
    sql: `
      UPDATE workout_sessions
      SET routine_id = (
        SELECT r.id
        FROM routines r
        WHERE r.user_id = workout_sessions.user_id
          AND r.name = workout_sessions.workout_plan_name
        LIMIT 1
      )
      WHERE routine_id IS NULL AND user_id = ?
    `,
    args: [userId]
  });
}

export async function getUserGoals(userId: string): Promise<string | null> {
  const db = getDatabase();
  const result = await db.execute({
    sql: 'SELECT goals_text FROM users WHERE id = ?',
    args: [userId]
  });
  const row = result.rows[0] as any;
  return row?.goals_text ?? null;
}

export async function upsertUserGoals(userId: string, goalsText: string | null): Promise<void> {
  const db = getDatabase();
  await db.execute({
    sql: `UPDATE users SET goals_text = ?, updated_at = datetime('now') WHERE id = ?`,
    args: [goalsText, userId]
  });
}

async function ensureUserSettingsTable(): Promise<void> {
  const db = getDatabase();
  await db.execute({
    sql: `
      CREATE TABLE IF NOT EXISTS user_settings (
        user_id TEXT PRIMARY KEY,
        rest_time_seconds INTEGER DEFAULT 60,
        superset_rest_seconds INTEGER DEFAULT 15,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `
  });
}

export async function getUserSettings(userId: string): Promise<{
  restTimeSeconds: number;
  supersetRestSeconds: number;
}> {
  await ensureUserSettingsTable();
  const db = getDatabase();
  const result = await db.execute({
    sql: 'SELECT rest_time_seconds, superset_rest_seconds FROM user_settings WHERE user_id = ?',
    args: [userId]
  });
  const row = result.rows[0] as any | undefined;
  const restTimeSeconds = Number(row?.rest_time_seconds);
  const supersetRestSeconds = Number(row?.superset_rest_seconds);

  return {
    restTimeSeconds: Number.isFinite(restTimeSeconds) ? restTimeSeconds : DEFAULT_REST_TIME_SECONDS,
    supersetRestSeconds: Number.isFinite(supersetRestSeconds)
      ? supersetRestSeconds
      : DEFAULT_SUPERSET_REST_TIME_SECONDS
  };
}

export async function upsertUserSettings(userId: string, data: {
  restTimeSeconds: number;
  supersetRestSeconds: number;
}): Promise<void> {
  await ensureUserSettingsTable();
  const db = getDatabase();
  await db.execute({
    sql: `
      INSERT INTO user_settings (user_id, rest_time_seconds, superset_rest_seconds, updated_at)
      VALUES (?, ?, ?, datetime('now'))
      ON CONFLICT(user_id) DO UPDATE SET
        rest_time_seconds = excluded.rest_time_seconds,
        superset_rest_seconds = excluded.superset_rest_seconds,
        updated_at = datetime('now')
    `,
    args: [userId, data.restTimeSeconds, data.supersetRestSeconds]
  });
}

// ============================================================================
// Workout History Functions
// ============================================================================

export async function createWorkoutSession(data: {
  user_id: string;
  routine_id?: number | null;
  session_key?: string | null;
  workout_plan_name: string;
  date_completed: string;
  total_duration_minutes?: number;
  total_strain?: number;
  session_mode?: string | null;
}): Promise<number> {
  const db = getDatabase();
  const hasRoutineIdColumn = await ensureWorkoutSessionRoutineIdColumn();
  const hasSessionModeColumn = await hasWorkoutSessionModeColumn();
  const includeSessionKey = data.session_key !== undefined
    ? await ensureWorkoutSessionKeyColumn()
    : await hasWorkoutSessionKeyColumn();
  const routineIdValue = data.routine_id ?? null;
  const sessionKeyValue = data.session_key ?? null;
  const columns = ['user_id'];
  const args: any[] = [data.user_id];

  if (hasRoutineIdColumn) {
    columns.push('routine_id');
    args.push(routineIdValue);
  }

  if (includeSessionKey) {
    columns.push('session_key');
    args.push(sessionKeyValue);
  }

  columns.push('workout_plan_name', 'date_completed', 'total_duration_minutes', 'total_strain');
  args.push(
    data.workout_plan_name,
    data.date_completed,
    data.total_duration_minutes || null,
    data.total_strain || null
  );

  if (hasSessionModeColumn) {
    columns.push('session_mode');
    args.push(data.session_mode || null);
  }
  const result = await db.execute({
    sql: `
      INSERT INTO workout_sessions (${columns.join(', ')})
      VALUES (${columns.map(() => '?').join(', ')})
    `,
    args
  });

  return Number(result.lastInsertRowid);
}

export async function getWorkoutSessionById(id: number, userId: string): Promise<any | null> {
  const db = getDatabase();
  const result = await db.execute({
    sql: 'SELECT * FROM workout_sessions WHERE id = ? AND user_id = ?',
    args: [id, userId]
  });
  return result.rows[0] as any || null;
}

export async function getWorkoutSessionByKey(userId: string, sessionKey: string): Promise<any | null> {
  const db = getDatabase();
  const hasKeyColumn = await hasWorkoutSessionKeyColumn();
  if (!hasKeyColumn) return null;
  const result = await db.execute({
    sql: 'SELECT * FROM workout_sessions WHERE user_id = ? AND session_key = ? LIMIT 1',
    args: [userId, sessionKey]
  });
  return result.rows[0] as any || null;
}

export async function touchWorkoutSession(
  id: number,
  userId: string,
  data: {
    routine_id?: number | null;
    workout_plan_name?: string;
    session_mode?: string | null;
  }
): Promise<void> {
  const db = getDatabase();
  const updates: string[] = ['date_completed = ?'];
  const args: any[] = [new Date().toISOString()];

  if (data.routine_id !== undefined) {
    updates.push('routine_id = ?');
    args.push(data.routine_id);
  }

  if (data.workout_plan_name) {
    updates.push('workout_plan_name = ?');
    args.push(data.workout_plan_name);
  }

  if (data.session_mode !== undefined) {
    const hasSessionModeColumn = await hasWorkoutSessionModeColumn();
    if (hasSessionModeColumn) {
      updates.push('session_mode = ?');
      args.push(data.session_mode);
    }
  }

  args.push(id, userId);

  await db.execute({
    sql: `UPDATE workout_sessions SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`,
    args
  });
}

export async function updateWorkoutSession(
  id: number,
  userId: string,
  data: {
    routine_id?: number | null;
    workout_plan_name?: string;
    date_completed?: string;
    total_duration_minutes?: number | null;
    total_strain?: number | null;
    session_mode?: string | null;
  }
): Promise<void> {
  const db = getDatabase();
  const updates: string[] = [];
  const args: any[] = [];

  if (data.routine_id !== undefined) {
    updates.push('routine_id = ?');
    args.push(data.routine_id);
  }

  if (data.workout_plan_name) {
    updates.push('workout_plan_name = ?');
    args.push(data.workout_plan_name);
  }

  if (data.date_completed) {
    updates.push('date_completed = ?');
    args.push(data.date_completed);
  }

  if (data.total_duration_minutes !== undefined) {
    updates.push('total_duration_minutes = ?');
    args.push(data.total_duration_minutes);
  }

  if (data.total_strain !== undefined) {
    updates.push('total_strain = ?');
    args.push(data.total_strain);
  }

  if (data.session_mode !== undefined) {
    const hasSessionModeColumn = await hasWorkoutSessionModeColumn();
    if (hasSessionModeColumn) {
      updates.push('session_mode = ?');
      args.push(data.session_mode);
    }
  }

  if (updates.length === 0) return;

  args.push(id, userId);

  await db.execute({
    sql: `UPDATE workout_sessions SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`,
    args
  });
}

export async function logExercise(data: {
  session_id: number;
  exercise_name: string;
  exercise_type: 'single' | 'b2b' | 'circuit';
  warmup_weight?: number | null;
  warmup_reps?: number | null;
  set1_weight?: number | null;
  set1_reps?: number | null;
  set2_weight?: number | null;
  set2_reps?: number | null;
  set3_weight?: number | null;
  set3_reps?: number | null;
  set4_weight?: number | null;
  set4_reps?: number | null;
  b2b_partner_name?: string | null;
  b2b_warmup_weight?: number | null;
  b2b_warmup_reps?: number | null;
  b2b_set1_weight?: number | null;
  b2b_set1_reps?: number | null;
  b2b_set2_weight?: number | null;
  b2b_set2_reps?: number | null;
  b2b_set3_weight?: number | null;
  b2b_set3_reps?: number | null;
  b2b_set4_weight?: number | null;
  b2b_set4_reps?: number | null;
}): Promise<number> {
  return upsertWorkoutExerciseLog(data);
}

type WorkoutExerciseLogUpsert = {
  session_id: number;
  exercise_name: string;
  exercise_type: 'single' | 'b2b' | 'circuit';
  warmup_weight?: number | null;
  warmup_reps?: number | null;
  set1_weight?: number | null;
  set1_reps?: number | null;
  set2_weight?: number | null;
  set2_reps?: number | null;
  set3_weight?: number | null;
  set3_reps?: number | null;
  set4_weight?: number | null;
  set4_reps?: number | null;
  b2b_partner_name?: string | null;
  b2b_warmup_weight?: number | null;
  b2b_warmup_reps?: number | null;
  b2b_set1_weight?: number | null;
  b2b_set1_reps?: number | null;
  b2b_set2_weight?: number | null;
  b2b_set2_reps?: number | null;
  b2b_set3_weight?: number | null;
  b2b_set3_reps?: number | null;
  b2b_set4_weight?: number | null;
  b2b_set4_reps?: number | null;
};

export async function upsertWorkoutExerciseLog(data: WorkoutExerciseLogUpsert): Promise<number> {
  const db = getDatabase();
  const partnerName = data.b2b_partner_name ?? null;
  const existing = await db.execute({
    sql: `
      SELECT id FROM workout_exercise_logs
      WHERE session_id = ? AND exercise_name = ?
        AND (b2b_partner_name IS ? OR b2b_partner_name = ?)
      LIMIT 1
    `,
    args: [data.session_id, data.exercise_name, partnerName, partnerName]
  });

  const updateFields: Array<[string, any]> = [];
  const columns: Array<keyof WorkoutExerciseLogUpsert> = [
    'exercise_type',
    'warmup_weight',
    'warmup_reps',
    'set1_weight',
    'set1_reps',
    'set2_weight',
    'set2_reps',
    'set3_weight',
    'set3_reps',
    'set4_weight',
    'set4_reps',
    'b2b_partner_name',
    'b2b_warmup_weight',
    'b2b_warmup_reps',
    'b2b_set1_weight',
    'b2b_set1_reps',
    'b2b_set2_weight',
    'b2b_set2_reps',
    'b2b_set3_weight',
    'b2b_set3_reps',
    'b2b_set4_weight',
    'b2b_set4_reps',
  ];

  for (const column of columns) {
    if (data[column] !== undefined) {
      updateFields.push([column, (data as any)[column]]);
    }
  }

  if (existing.rows.length > 0) {
    if (updateFields.length === 0) {
      return Number((existing.rows[0] as any).id);
    }
    const assignments = updateFields.map(([column]) => `${column} = ?`).join(', ');
    const args = updateFields.map(([, value]) => value);
    args.push((existing.rows[0] as any).id);
    await db.execute({
      sql: `UPDATE workout_exercise_logs SET ${assignments} WHERE id = ?`,
      args
    });
    return Number((existing.rows[0] as any).id);
  }

  const insertColumns = ['session_id', 'exercise_name', ...updateFields.map(([column]) => column)];
  const insertArgs = [data.session_id, data.exercise_name, ...updateFields.map(([, value]) => value)];

  const result = await db.execute({
    sql: `
      INSERT INTO workout_exercise_logs (${insertColumns.join(', ')})
      VALUES (${insertColumns.map(() => '?').join(', ')})
    `,
    args: insertArgs
  });

  return Number(result.lastInsertRowid);
}

export async function logCardio(data: {
  session_id: number;
  cardio_type: string;
  time: string;
  speed?: number;
  incline?: number;
}): Promise<number> {
  const db = getDatabase();
  const result = await db.execute({
    sql: `
      INSERT INTO workout_cardio_logs (session_id, cardio_type, time, speed, incline)
      VALUES (?, ?, ?, ?, ?)
    `,
    args: [data.session_id, data.cardio_type, data.time, data.speed ?? null, data.incline ?? null]
  });

  return Number(result.lastInsertRowid);
}

export async function getWorkoutSession(sessionId: number): Promise<(WorkoutSession & {
  exercises: WorkoutExerciseLog[];
  cardio: WorkoutCardioLog[];
}) | null> {
  const db = getDatabase();

  const sessionResult = await db.execute({
    sql: `SELECT * FROM workout_sessions WHERE id = ?`,
    args: [sessionId]
  });

  if (sessionResult.rows.length === 0) return null;

  const session = sessionResult.rows[0] as any as WorkoutSession;

  const exercisesResult = await db.execute({
    sql: `SELECT * FROM workout_exercise_logs WHERE session_id = ?`,
    args: [sessionId]
  });

  const cardioResult = await db.execute({
    sql: `SELECT * FROM workout_cardio_logs WHERE session_id = ?`,
    args: [sessionId]
  });

  const exercises = exercisesResult.rows as any as WorkoutExerciseLog[];
  const cardio = cardioResult.rows as any as WorkoutCardioLog[];

  return { ...session, exercises, cardio };
}

export async function getLastExerciseLog(
  exerciseName: string,
  userId?: string
): Promise<WorkoutExerciseLog | null> {
  const db = getDatabase();

  const sql = userId
    ? `
      SELECT el.*,
        ws.date_completed as completed_at,
        CASE
          WHEN el.exercise_name = ? THEN 'primary'
          WHEN el.b2b_partner_name = ? THEN 'partner'
        END AS matched_role
      FROM workout_exercise_logs el
      JOIN workout_sessions ws ON el.session_id = ws.id
      WHERE ws.user_id = ? AND (el.exercise_name = ? OR el.b2b_partner_name = ?)
      ORDER BY ws.date_completed DESC
      LIMIT 1
    `
    : `
      SELECT el.*,
        ws.date_completed as completed_at,
        CASE
          WHEN el.exercise_name = ? THEN 'primary'
          WHEN el.b2b_partner_name = ? THEN 'partner'
        END AS matched_role
      FROM workout_exercise_logs el
      JOIN workout_sessions ws ON el.session_id = ws.id
      WHERE el.exercise_name = ? OR el.b2b_partner_name = ?
      ORDER BY ws.date_completed DESC
      LIMIT 1
    `;

  const args = userId
    ? [exerciseName, exerciseName, userId, exerciseName, exerciseName]
    : [exerciseName, exerciseName, exerciseName, exerciseName];
  const result = await db.execute({ sql, args });
  const row = result.rows[0] as any;

  if (!row) return null;

  if (row.matched_role === 'partner') {
    return {
      ...row,
      exercise_name: exerciseName,
      warmup_weight: row.b2b_warmup_weight,
      warmup_reps: row.b2b_warmup_reps,
      set1_weight: row.b2b_set1_weight,
      set1_reps: row.b2b_set1_reps,
      set2_weight: row.b2b_set2_weight,
      set2_reps: row.b2b_set2_reps,
      set3_weight: row.b2b_set3_weight,
      set3_reps: row.b2b_set3_reps,
      set4_weight: row.b2b_set4_weight,
      set4_reps: row.b2b_set4_reps,
    } as WorkoutExerciseLog;
  }

  return row as WorkoutExerciseLog;
}

export async function getRecentExerciseLogs(
  exerciseName: string,
  userId: string,
  limit: number = 5,
  options?: { excludeSessionMode?: 'light' }
): Promise<Array<WorkoutExerciseLog & { completed_at?: string; matched_role?: string }>> {
  const db = getDatabase();
  const excludeMode = options?.excludeSessionMode;
  const hasSessionMode = excludeMode ? await hasWorkoutSessionModeColumn() : false;
  const modeClause = excludeMode && hasSessionMode
    ? 'AND (ws.session_mode IS NULL OR ws.session_mode != ?)'
    : '';

  const result = await db.execute({
    sql: `
      SELECT el.*,
        ws.date_completed as completed_at,
        CASE
          WHEN el.exercise_name = ? THEN 'primary'
          WHEN el.b2b_partner_name = ? THEN 'partner'
        END AS matched_role
      FROM workout_exercise_logs el
      JOIN workout_sessions ws ON el.session_id = ws.id
      WHERE ws.user_id = ? AND (el.exercise_name = ? OR el.b2b_partner_name = ?)
      ${modeClause}
      ORDER BY ws.date_completed DESC
      LIMIT ?
    `,
    args: excludeMode && hasSessionMode
      ? [exerciseName, exerciseName, userId, exerciseName, exerciseName, excludeMode, limit]
      : [exerciseName, exerciseName, userId, exerciseName, exerciseName, limit]
  });

  return result.rows as unknown as Array<WorkoutExerciseLog & { completed_at?: string; matched_role?: string }>;
}

export type ExerciseHistoryPoint = {
  day: string;
  weight_max: number | null;
  weight_avg: number | null;
  volume: number | null;
  reps_max: number | null;
  reps_avg: number | null;
  reps_total: number | null;
};

export type ExerciseHistorySeries = {
  display_mode: 'weight' | 'reps';
  points: ExerciseHistoryPoint[];
};

export async function getExerciseHistory(
  userId: string,
  exerciseName: string,
  range: 'week' | 'month' | 'all'
): Promise<ExerciseHistorySeries> {
  const db = getDatabase();
  const daysBack = range === 'week' ? 7 : range === 'month' ? 30 : null;
  const cutoff = daysBack ? new Date(Date.now() - (daysBack - 1) * 86400000).toISOString() : null;
  const rangeClause = cutoff ? 'AND ws.date_completed >= ?' : '';
  const hasSessionMode = await hasWorkoutSessionModeColumn();
  const modeClause = hasSessionMode ? 'AND (ws.session_mode IS NULL OR ws.session_mode != ?)' : '';

  const sql = `
    WITH matched AS (
      SELECT
        ws.date_completed as date_completed,
        date(ws.date_completed) as day,
        CASE
          WHEN el.exercise_name = ? THEN el.set1_weight
          WHEN el.b2b_partner_name = ? THEN el.b2b_set1_weight
        END as set1_weight,
        CASE
          WHEN el.exercise_name = ? THEN el.set1_reps
          WHEN el.b2b_partner_name = ? THEN el.b2b_set1_reps
        END as set1_reps,
        CASE
          WHEN el.exercise_name = ? THEN el.set2_weight
          WHEN el.b2b_partner_name = ? THEN el.b2b_set2_weight
        END as set2_weight,
        CASE
          WHEN el.exercise_name = ? THEN el.set2_reps
          WHEN el.b2b_partner_name = ? THEN el.b2b_set2_reps
        END as set2_reps,
        CASE
          WHEN el.exercise_name = ? THEN el.set3_weight
          WHEN el.b2b_partner_name = ? THEN el.b2b_set3_weight
        END as set3_weight,
        CASE
          WHEN el.exercise_name = ? THEN el.set3_reps
          WHEN el.b2b_partner_name = ? THEN el.b2b_set3_reps
        END as set3_reps,
        CASE
          WHEN el.exercise_name = ? THEN el.set4_weight
          WHEN el.b2b_partner_name = ? THEN el.b2b_set4_weight
        END as set4_weight,
        CASE
          WHEN el.exercise_name = ? THEN el.set4_reps
          WHEN el.b2b_partner_name = ? THEN el.b2b_set4_reps
        END as set4_reps
      FROM workout_exercise_logs el
      JOIN workout_sessions ws ON el.session_id = ws.id
      WHERE ws.user_id = ? AND (el.exercise_name = ? OR el.b2b_partner_name = ?)
      ${modeClause}
      ${rangeClause}
    ),
    scored AS (
      SELECT
        *,
        CASE WHEN set1_weight IS NOT NULL AND set1_reps IS NOT NULL THEN 1 ELSE 0 END as s1,
        CASE WHEN set2_weight IS NOT NULL AND set2_reps IS NOT NULL THEN 1 ELSE 0 END as s2,
        CASE WHEN set3_weight IS NOT NULL AND set3_reps IS NOT NULL THEN 1 ELSE 0 END as s3,
        CASE WHEN set4_weight IS NOT NULL AND set4_reps IS NOT NULL THEN 1 ELSE 0 END as s4
      FROM matched
    ),
    metrics AS (
      SELECT
        day,
        date_completed,
        (s1 + s2 + s3 + s4) as set_count,
        max(
          CASE WHEN s1 = 1 THEN set1_weight ELSE -1 END,
          CASE WHEN s2 = 1 THEN set2_weight ELSE -1 END,
          CASE WHEN s3 = 1 THEN set3_weight ELSE -1 END,
          CASE WHEN s4 = 1 THEN set4_weight ELSE -1 END
        ) as raw_max,
        (CASE WHEN s1 = 1 THEN set1_weight ELSE 0 END
          + CASE WHEN s2 = 1 THEN set2_weight ELSE 0 END
          + CASE WHEN s3 = 1 THEN set3_weight ELSE 0 END
          + CASE WHEN s4 = 1 THEN set4_weight ELSE 0 END) as weight_sum,
        max(
          CASE WHEN s1 = 1 THEN set1_reps ELSE -1 END,
          CASE WHEN s2 = 1 THEN set2_reps ELSE -1 END,
          CASE WHEN s3 = 1 THEN set3_reps ELSE -1 END,
          CASE WHEN s4 = 1 THEN set4_reps ELSE -1 END
        ) as reps_max_raw,
        (CASE WHEN s1 = 1 THEN set1_reps ELSE 0 END
          + CASE WHEN s2 = 1 THEN set2_reps ELSE 0 END
          + CASE WHEN s3 = 1 THEN set3_reps ELSE 0 END
          + CASE WHEN s4 = 1 THEN set4_reps ELSE 0 END) as reps_sum,
        (CASE WHEN s1 = 1 THEN set1_weight * set1_reps ELSE 0 END
          + CASE WHEN s2 = 1 THEN set2_weight * set2_reps ELSE 0 END
          + CASE WHEN s3 = 1 THEN set3_weight * set3_reps ELSE 0 END
          + CASE WHEN s4 = 1 THEN set4_weight * set4_reps ELSE 0 END) as volume
      FROM scored
    ),
    ranked AS (
      SELECT
        day,
        date_completed,
        CASE WHEN set_count > 0 THEN NULLIF(raw_max, -1) ELSE NULL END as weight_max,
        CASE WHEN set_count > 0 THEN weight_sum / set_count ELSE NULL END as weight_avg,
        CASE WHEN set_count > 0 THEN NULLIF(reps_max_raw, -1) ELSE NULL END as reps_max,
        CASE WHEN set_count > 0 THEN reps_sum / set_count ELSE NULL END as reps_avg,
        CASE WHEN set_count > 0 THEN reps_sum ELSE NULL END as reps_total,
        CASE WHEN set_count > 0 THEN volume ELSE NULL END as volume,
        ROW_NUMBER() OVER (PARTITION BY day ORDER BY date_completed DESC) as rn
      FROM metrics
    )
    SELECT day, weight_max, weight_avg, volume, reps_max, reps_avg, reps_total
    FROM ranked
    WHERE rn = 1
    ORDER BY day ASC
  `;

  const args = [
    exerciseName, exerciseName,
    exerciseName, exerciseName,
    exerciseName, exerciseName,
    exerciseName, exerciseName,
    exerciseName, exerciseName,
    exerciseName, exerciseName,
    exerciseName, exerciseName,
    exerciseName, exerciseName,
    userId,
    exerciseName,
    exerciseName,
  ];
  if (hasSessionMode) {
    args.push('light');
  }
  if (cutoff) {
    args.push(cutoff);
  }

  const result = await db.execute({ sql, args });
  const points = result.rows.map((row: any) => ({
    day: String(row.day),
    weight_max: row.weight_max ?? null,
    weight_avg: row.weight_avg ?? null,
    volume: row.volume ?? null,
    reps_max: row.reps_max ?? null,
    reps_avg: row.reps_avg ?? null,
    reps_total: row.reps_total ?? null
  })) as ExerciseHistoryPoint[];

  const equipmentResult = await db.execute({
    sql: 'SELECT equipment, is_bodyweight FROM exercises WHERE name = ? LIMIT 1',
    args: [exerciseName]
  });
  const row = equipmentResult.rows[0] as any;
  const isBodyweight = row?.is_bodyweight === 1;
  const displayMode: ExerciseHistorySeries['display_mode'] = isBodyweight ? 'reps' : 'weight';

  return { display_mode: displayMode, points };
}

// ============================================================================
// Routine Builder Database Functions (v2.0)
// ============================================================================

// Exercise CRUD
export async function createExercise(data: {
  name: string;
  videoUrl?: string;
  tips?: string;
  muscleGroups?: string[];
  exerciseTypes?: string[];
  equipment?: string;
  isBodyweight?: boolean;
  difficulty?: string;
}): Promise<number> {
  const db = getDatabase();
  const result = await db.execute({
    sql: `
      INSERT INTO exercises (name, video_url, tips, muscle_groups, exercise_type, equipment, is_bodyweight, difficulty)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      data.name,
      data.videoUrl || null,
      data.tips || null,
      data.muscleGroups ? JSON.stringify(data.muscleGroups) : null,
      data.exerciseTypes ? JSON.stringify(data.exerciseTypes) : null,
      data.equipment || null,
      typeof data.isBodyweight === 'boolean' ? (data.isBodyweight ? 1 : 0) : null,
      data.difficulty || null
    ]
  });
  return Number(result.lastInsertRowid);
}

export async function getAllExercises(): Promise<any[]> {
  const db = getDatabase();
  const result = await db.execute('SELECT * FROM exercises ORDER BY name');
  return result.rows as any[];
}

export async function searchExercises(query: string): Promise<any[]> {
  const db = getDatabase();
  const result = await db.execute({
    sql: 'SELECT * FROM exercises WHERE name LIKE ? ORDER BY name',
    args: [`%${query}%`]
  });
  return result.rows as any[];
}

export async function getExerciseById(id: number): Promise<any | null> {
  const db = getDatabase();
  const result = await db.execute({
    sql: 'SELECT * FROM exercises WHERE id = ?',
    args: [id]
  });
  return result.rows[0] as any || null;
}

// Routine CRUD
export async function createRoutine(name: string, userId: string, isPublic: boolean = true): Promise<number> {
  const db = getDatabase();
  const result = await db.execute({
    sql: 'INSERT INTO routines (name, user_id, is_public) VALUES (?, ?, ?)',
    args: [name, userId, isPublic ? 1 : 0]
  });
  return Number(result.lastInsertRowid);
}

export async function getAllRoutines(userId: string): Promise<any[]> {
  const db = getDatabase();
  await backfillWorkoutSessionRoutineIds(userId);
  const result = await db.execute({
    sql: `
      SELECT r.*, MAX(ws.date_completed) as last_workout_date
      FROM routines r
      LEFT JOIN workout_sessions ws
        ON ws.user_id = ? AND ws.routine_id = r.id
      WHERE r.user_id = ?
      GROUP BY r.id
      ORDER BY r.created_at DESC
    `,
    args: [userId, userId]
  });
  return result.rows as any[];
}

export async function getRoutineById(id: number, userId?: string): Promise<any | null> {
  const db = getDatabase();

  // If userId provided, verify ownership
  const sql = userId
    ? 'SELECT * FROM routines WHERE id = ? AND user_id = ?'
    : 'SELECT * FROM routines WHERE id = ?';

  const args = userId ? [id, userId] : [id];
  const result = await db.execute({ sql, args });
  return result.rows[0] as any || null;
}

export async function getRoutineByName(name: string, userId: string): Promise<any | null> {
  const db = getDatabase();
  const result = await db.execute({
    sql: 'SELECT * FROM routines WHERE name = ? AND user_id = ?',
    args: [name, userId]
  });
  return result.rows[0] as any || null;
}

export async function deleteRoutine(id: number, userId: string): Promise<void> {
  const db = getDatabase();
  // Only delete if the routine belongs to the user
  await db.execute({
    sql: 'DELETE FROM routines WHERE id = ? AND user_id = ?',
    args: [id, userId]
  });
}

export async function updateRoutineName(id: number, newName: string, userId: string): Promise<void> {
  const db = getDatabase();

  // Get the old name first (verify ownership)
  const oldRoutine = await db.execute({
    sql: 'SELECT name FROM routines WHERE id = ? AND user_id = ?',
    args: [id, userId]
  });

  if (oldRoutine.rows.length === 0) {
    throw new Error('Routine not found or you do not have permission');
  }

  // Update the routine name
  await db.execute({
    sql: 'UPDATE routines SET name = ?, updated_at = datetime(\'now\') WHERE id = ? AND user_id = ?',
    args: [newName, id, userId]
  });

  await backfillWorkoutSessionRoutineIds(userId);

  // Update workout history to use the new name (only for this user)
  await db.execute({
    sql: 'UPDATE workout_sessions SET workout_plan_name = ? WHERE routine_id = ? AND user_id = ?',
    args: [newName, id, userId]
  });
}

export async function updateRoutineNotes(id: number, notes: string | null, userId: string): Promise<void> {
  const db = getDatabase();
  await db.execute({
    sql: 'UPDATE routines SET notes = ?, updated_at = datetime(\'now\') WHERE id = ? AND user_id = ?',
    args: [notes, id, userId]
  });
}

// Routine exercise management
export async function addExerciseToRoutine(data: {
  routineId: number;
  exerciseId: number;
  orderIndex: number;
  exerciseType: 'single' | 'b2b';
  sets?: number;
  targetReps?: number;
  targetWeight?: number;
  warmupWeight?: number;
  restTime?: number;
  b2bPartnerId?: number;
  b2bSets?: number;
  b2bTargetReps?: number;
  b2bTargetWeight?: number;
  b2bWarmupWeight?: number;
}): Promise<number> {
  const db = getDatabase();
  const result = await db.execute({
    sql: `
      INSERT INTO routine_exercises (
        routine_id, exercise_id, order_index, exercise_type,
        sets, target_reps, target_weight, warmup_weight, rest_time,
        b2b_partner_id, b2b_sets, b2b_target_reps, b2b_target_weight, b2b_warmup_weight
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      data.routineId,
      data.exerciseId,
      data.orderIndex,
      data.exerciseType,
      data.sets ?? null,
      data.targetReps ?? null,
      data.targetWeight ?? null,
      data.warmupWeight ?? null,
      data.restTime ?? null,
      data.b2bPartnerId ?? null,
      data.b2bSets ?? null,
      data.b2bTargetReps ?? null,
      data.b2bTargetWeight ?? null,
      data.b2bWarmupWeight ?? null
    ]
  });
  return Number(result.lastInsertRowid);
}

export async function getRoutineExercises(routineId: number): Promise<any[]> {
  const db = getDatabase();
  const result = await db.execute({
    sql: `
      SELECT re.*, e.name as exercise_name, e.video_url, e.tips,
             e.equipment as exercise_equipment,
             e.is_bodyweight as exercise_is_bodyweight,
             e2.name as b2b_partner_name, e2.video_url as b2b_video_url, e2.tips as b2b_tips,
             e2.equipment as b2b_partner_equipment,
             e2.is_bodyweight as b2b_partner_is_bodyweight
      FROM routine_exercises re
      JOIN exercises e ON re.exercise_id = e.id
      LEFT JOIN exercises e2 ON re.b2b_partner_id = e2.id
      WHERE re.routine_id = ?
      ORDER BY re.order_index
    `,
    args: [routineId]
  });
  return result.rows as any[];
}

export async function removeExerciseFromRoutine(routineExerciseId: number): Promise<void> {
  const db = getDatabase();
  await db.execute({
    sql: 'DELETE FROM routine_exercises WHERE id = ?',
    args: [routineExerciseId]
  });
}

// Stretch CRUD
export async function createStretch(data: {
  name: string;
  duration: string;
  timerSeconds?: number;
  sideCount?: number;
  videoUrl?: string;
  tips?: string;
  muscleGroups?: string[];
}): Promise<number> {
  const db = getDatabase();
  const result = await db.execute({
    sql: `
      INSERT INTO stretches (name, duration, timer_seconds, side_count, video_url, tips, muscle_groups)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      data.name,
      data.duration,
      typeof data.timerSeconds === 'number' ? data.timerSeconds : 0,
      typeof data.sideCount === 'number' ? data.sideCount : 1,
      data.videoUrl || null,
      data.tips || null,
      data.muscleGroups ? JSON.stringify(data.muscleGroups) : null
    ]
  });
  return Number(result.lastInsertRowid);
}

export async function getAllStretches(): Promise<any[]> {
  const db = getDatabase();
  const result = await db.execute('SELECT * FROM stretches ORDER BY name');
  return result.rows as any[];
}

export async function getStretchById(id: number): Promise<any | null> {
  const db = getDatabase();
  const result = await db.execute({
    sql: 'SELECT * FROM stretches WHERE id = ?',
    args: [id]
  });
  return result.rows[0] as any || null;
}

// Routine stretch management
export async function addStretchToRoutine(
  routineId: number,
  stretchId: number,
  type: 'pre' | 'post',
  orderIndex: number
): Promise<number> {
  const db = getDatabase();
  const tableName = type === 'pre' ? 'routine_pre_stretches' : 'routine_post_stretches';
  const result = await db.execute({
    sql: `INSERT INTO ${tableName} (routine_id, stretch_id, order_index) VALUES (?, ?, ?)`,
    args: [routineId, stretchId, orderIndex]
  });
  return Number(result.lastInsertRowid);
}

export async function removeStretchFromRoutine(
  routineId: number,
  stretchId: number,
  type: 'pre' | 'post'
): Promise<void> {
  const db = getDatabase();
  const tableName = type === 'pre' ? 'routine_pre_stretches' : 'routine_post_stretches';
  await db.execute({
    sql: `DELETE FROM ${tableName} WHERE routine_id = ? AND stretch_id = ?`,
    args: [routineId, stretchId]
  });
}

export async function getRoutineStretches(routineId: number, type: 'pre' | 'post'): Promise<any[]> {
  const db = getDatabase();
  const tableName = type === 'pre' ? 'routine_pre_stretches' : 'routine_post_stretches';
  const result = await db.execute({
    sql: `
      SELECT rs.*, s.name, s.duration, s.timer_seconds, s.side_count, s.video_url, s.tips, s.muscle_groups
      FROM ${tableName} rs
      JOIN stretches s ON rs.stretch_id = s.id
      WHERE rs.routine_id = ?
      ORDER BY rs.order_index
    `,
    args: [routineId]
  });
  return result.rows as any[];
}

// Reorder exercises in a routine
export async function reorderRoutineExercises(
  routineId: number,
  exerciseOrder: number[] // Array of routine_exercise IDs in new order
): Promise<void> {
  const db = getDatabase();
  for (let i = 0; i < exerciseOrder.length; i++) {
    await db.execute({
      sql: 'UPDATE routine_exercises SET order_index = ? WHERE id = ? AND routine_id = ?',
      args: [i, exerciseOrder[i], routineId]
    });
  }
}

// Reorder stretches in a routine
export async function reorderRoutineStretches(
  routineId: number,
  type: 'pre' | 'post',
  stretchOrder: number[] // Array of stretch IDs in new order
): Promise<void> {
  const db = getDatabase();
  const tableName = type === 'pre' ? 'routine_pre_stretches' : 'routine_post_stretches';

  // Delete existing and re-insert in new order
  await db.execute({
    sql: `DELETE FROM ${tableName} WHERE routine_id = ?`,
    args: [routineId]
  });

  for (let i = 0; i < stretchOrder.length; i++) {
    await db.execute({
      sql: `INSERT INTO ${tableName} (routine_id, stretch_id, order_index) VALUES (?, ?, ?)`,
      args: [routineId, stretchOrder[i], i]
    });
  }
}

// Close database connection (for cleanup)
export async function closeDatabase() {
  if (db) {
    await db.close();
    db = null;
  }
}

// ============================================================================
// Phase 2: Username & Sharing Functions
// ============================================================================

// Username management
export async function setUsername(userId: string, username: string): Promise<void> {
  const db = getDatabase();
  await db.execute({
    sql: `UPDATE users SET username = ?, updated_at = datetime('now') WHERE id = ?`,
    args: [username, userId]
  });
}

export async function getUsernameExists(username: string): Promise<boolean> {
  const db = getDatabase();
  const result = await db.execute({
    sql: 'SELECT 1 FROM users WHERE username = ?',
    args: [username]
  });
  return result.rows.length > 0;
}

export async function getUserWithUsername(userId: string): Promise<any | null> {
  const db = getDatabase();
  const result = await db.execute({
    sql: 'SELECT id, email, username, name, image FROM users WHERE id = ?',
    args: [userId]
  });
  return result.rows[0] as any || null;
}

// Public routines
export async function getPublicRoutines(excludeUserId?: string): Promise<any[]> {
  const db = getDatabase();
  if (excludeUserId) {
    await backfillWorkoutSessionRoutineIds(excludeUserId);
  }

  const sql = excludeUserId
    ? `SELECT r.*, u.username as creator_username, u.name as creator_name,
         MAX(ws.date_completed) as last_workout_date
       FROM routines r
       JOIN users u ON r.user_id = u.id
       LEFT JOIN workout_sessions ws
         ON ws.user_id = ? AND ws.routine_id = r.id
       WHERE r.is_public = 1 AND r.user_id != ?
       GROUP BY r.id
       ORDER BY r.created_at DESC`
    : `SELECT r.*, u.username as creator_username, u.name as creator_name,
         NULL as last_workout_date
       FROM routines r
       JOIN users u ON r.user_id = u.id
       WHERE r.is_public = 1
       ORDER BY r.created_at DESC`;

  const args = excludeUserId ? [excludeUserId, excludeUserId] : [];
  const result = await db.execute({ sql, args });
  return result.rows as any[];
}

// Favorites management
export async function addFavorite(userId: string, routineId: number): Promise<void> {
  const db = getDatabase();
  await db.execute({
    sql: `INSERT OR IGNORE INTO routine_favorites (user_id, routine_id) VALUES (?, ?)`,
    args: [userId, routineId]
  });
}

export async function removeFavorite(userId: string, routineId: number): Promise<void> {
  const db = getDatabase();
  await db.execute({
    sql: `DELETE FROM routine_favorites WHERE user_id = ? AND routine_id = ?`,
    args: [userId, routineId]
  });
}

export async function isFavorited(userId: string, routineId: number): Promise<boolean> {
  const db = getDatabase();
  const result = await db.execute({
    sql: 'SELECT 1 FROM routine_favorites WHERE user_id = ? AND routine_id = ?',
    args: [userId, routineId]
  });
  return result.rows.length > 0;
}

export async function getFavoritedRoutines(userId: string): Promise<any[]> {
  const db = getDatabase();
  await backfillWorkoutSessionRoutineIds(userId);
  const result = await db.execute({
    sql: `SELECT r.*, u.username as creator_username, u.name as creator_name, 1 as is_favorited,
            MAX(ws.date_completed) as last_workout_date
          FROM routine_favorites rf
          JOIN routines r ON rf.routine_id = r.id
          JOIN users u ON r.user_id = u.id
          LEFT JOIN workout_sessions ws
            ON ws.user_id = ? AND ws.routine_id = r.id
          WHERE rf.user_id = ?
          GROUP BY r.id
          ORDER BY rf.created_at DESC`,
    args: [userId, userId]
  });
  return result.rows as any[];
}

// Clone a routine to a new user
export async function cloneRoutine(routineId: number, newUserId: string, newName?: string): Promise<number> {
  const db = getDatabase();

  // Get the original routine
  const original = await db.execute({
    sql: 'SELECT * FROM routines WHERE id = ?',
    args: [routineId]
  });

  if (original.rows.length === 0) {
    throw new Error('Routine not found');
  }

  const routine = original.rows[0] as any;
  let baseName = newName || routine.name;

  // Find a unique name for this user
  let clonedName = baseName;
  let suffix = 1;
  while (true) {
    const existing = await db.execute({
      sql: 'SELECT id FROM routines WHERE name = ? AND user_id = ?',
      args: [clonedName, newUserId]
    });
    if (existing.rows.length === 0) break;
    suffix++;
    clonedName = `${baseName} (${suffix})`;
  }

  // Create the new routine
  const newRoutineResult = await db.execute({
    sql: `INSERT INTO routines (user_id, name, description, is_public, created_at, updated_at)
          VALUES (?, ?, ?, 0, datetime('now'), datetime('now'))`,
    args: [newUserId, clonedName, routine.description]
  });
  const newRoutineId = Number(newRoutineResult.lastInsertRowid);

  // Clone exercises
  const exercises = await db.execute({
    sql: 'SELECT * FROM routine_exercises WHERE routine_id = ?',
    args: [routineId]
  });

  for (const ex of exercises.rows) {
    const e = ex as any;
    await db.execute({
      sql: `INSERT INTO routine_exercises (
        routine_id, exercise_id, order_index, exercise_type,
        sets, target_reps, target_weight, warmup_weight, rest_time,
        b2b_partner_id, b2b_sets, b2b_target_reps, b2b_target_weight, b2b_warmup_weight
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        newRoutineId, e.exercise_id, e.order_index, e.exercise_type,
        e.sets, e.target_reps, e.target_weight, e.warmup_weight, e.rest_time,
        e.b2b_partner_id, e.b2b_sets, e.b2b_target_reps, e.b2b_target_weight, e.b2b_warmup_weight
      ]
    });
  }

  // Clone pre-workout stretches
  const preStretches = await db.execute({
    sql: 'SELECT * FROM routine_pre_stretches WHERE routine_id = ?',
    args: [routineId]
  });

  for (const s of preStretches.rows) {
    const stretch = s as any;
    await db.execute({
      sql: 'INSERT INTO routine_pre_stretches (routine_id, stretch_id, order_index) VALUES (?, ?, ?)',
      args: [newRoutineId, stretch.stretch_id, stretch.order_index]
    });
  }

  // Clone post-workout stretches
  const postStretches = await db.execute({
    sql: 'SELECT * FROM routine_post_stretches WHERE routine_id = ?',
    args: [routineId]
  });

  for (const s of postStretches.rows) {
    const stretch = s as any;
    await db.execute({
      sql: 'INSERT INTO routine_post_stretches (routine_id, stretch_id, order_index) VALUES (?, ?, ?)',
      args: [newRoutineId, stretch.stretch_id, stretch.order_index]
    });
  }

  // Clone cardio
  const cardio = await db.execute({
    sql: 'SELECT * FROM routine_cardio WHERE routine_id = ?',
    args: [routineId]
  });

  if (cardio.rows.length > 0) {
    const c = cardio.rows[0] as any;
    await db.execute({
      sql: `INSERT INTO routine_cardio (routine_id, cardio_type, duration, intensity, tips)
            VALUES (?, ?, ?, ?, ?)`,
      args: [newRoutineId, c.cardio_type, c.duration, c.intensity, c.tips]
    });
  }

  return newRoutineId;
}

// Update routine privacy
export async function setRoutinePublic(routineId: number, userId: string, isPublic: boolean): Promise<void> {
  const db = getDatabase();
  await db.execute({
    sql: `UPDATE routines SET is_public = ?, updated_at = datetime('now') WHERE id = ? AND user_id = ?`,
    args: [isPublic ? 1 : 0, routineId, userId]
  });
}
