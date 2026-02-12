// lib/database.ts
import { createClient, Client } from '@libsql/client';
import type { WorkoutSession, WorkoutExerciseLog, WorkoutCardioLog } from './types';
import {
  EXERCISE_HISTORY_DISPLAY_MODES,
  EXERCISE_PRIMARY_METRICS,
  ExerciseHistoryDisplayMode,
  ExerciseType,
} from './constants';
import { normalizeHeightUnit, normalizeWeightUnit } from './units';
import type { HeightUnit, WeightUnit } from './units';

// Initialize database connection
let db: Client | null = null;
let workoutSessionRoutineIdColumnReady: boolean | null = null;
let workoutSessionKeyColumnReady: boolean | null = null;
let workoutSessionReportColumnReady: boolean | null = null;
let routineLikeCountColumnReady: boolean | null = null;
let routineCloneCountColumnReady: boolean | null = null;
let routineOrderColumnReady: boolean | null = null;
let routineStretchTablesReady: boolean | null = null;
let stretchRecommendationCacheReady: boolean | null = null;
let stretchVersionTableReady: boolean | null = null;
let exerciseColumnsReady: boolean | null = null;
const DEFAULT_REST_TIME_SECONDS = 60;
const DEFAULT_SUPERSET_REST_TIME_SECONDS = 15;
const DEFAULT_TIMER_SOUND_ENABLED = true;
const DEFAULT_TIMER_VIBRATE_ENABLED = true;

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

async function hasWorkoutSessionReportColumn(): Promise<boolean> {
  if (workoutSessionReportColumnReady !== null) return workoutSessionReportColumnReady;
  const db = getDatabase();
  try {
    const result = await db.execute({
      sql: 'PRAGMA table_info(workout_sessions)'
    });
    workoutSessionReportColumnReady = result.rows.some((row: any) => row.name === 'workout_report');
  } catch (error) {
    console.warn('Failed to inspect workout_sessions workout_report schema:', error);
    workoutSessionReportColumnReady = false;
  }
  return workoutSessionReportColumnReady;
}

async function hasRoutineLikeCountColumn(): Promise<boolean> {
  if (routineLikeCountColumnReady !== null) return routineLikeCountColumnReady;
  const db = getDatabase();
  try {
    const result = await db.execute({
      sql: 'PRAGMA table_info(routines)'
    });
    routineLikeCountColumnReady = result.rows.some((row: any) => row.name === 'like_count');
  } catch (error) {
    console.warn('Failed to inspect routines like_count schema:', error);
    routineLikeCountColumnReady = false;
  }
  return routineLikeCountColumnReady;
}

async function hasRoutineCloneCountColumn(): Promise<boolean> {
  if (routineCloneCountColumnReady !== null) return routineCloneCountColumnReady;
  const db = getDatabase();
  try {
    const result = await db.execute({
      sql: 'PRAGMA table_info(routines)'
    });
    routineCloneCountColumnReady = result.rows.some((row: any) => row.name === 'clone_count');
  } catch (error) {
    console.warn('Failed to inspect routines clone_count schema:', error);
    routineCloneCountColumnReady = false;
  }
  return routineCloneCountColumnReady;
}

async function hasRoutineOrderColumn(): Promise<boolean> {
  if (routineOrderColumnReady !== null) return routineOrderColumnReady;
  const db = getDatabase();
  try {
    const result = await db.execute({
      sql: 'PRAGMA table_info(routines)'
    });
    routineOrderColumnReady = result.rows.some((row: any) => row.name === 'order_index');
  } catch (error) {
    console.warn('Failed to inspect routines order_index schema:', error);
    routineOrderColumnReady = false;
  }
  return routineOrderColumnReady;
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

async function ensureWorkoutSessionReportColumn(): Promise<boolean> {
  const hasColumn = await hasWorkoutSessionReportColumn();
  if (hasColumn) return true;
  const db = getDatabase();
  try {
    await db.execute({
      sql: 'ALTER TABLE workout_sessions ADD COLUMN workout_report TEXT'
    });
    workoutSessionReportColumnReady = true;
    return true;
  } catch (error: any) {
    const message = String(error?.message || error);
    if (message.toLowerCase().includes('duplicate') || message.toLowerCase().includes('already exists')) {
      workoutSessionReportColumnReady = true;
      return true;
    }
    console.warn('Failed to add workout_report column to workout_sessions:', error);
    workoutSessionReportColumnReady = false;
    return false;
  }
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

async function ensureRoutineLikeCountColumn(): Promise<{ ready: boolean; added: boolean }> {
  const hasColumn = await hasRoutineLikeCountColumn();
  if (hasColumn) return { ready: true, added: false };
  const db = getDatabase();
  try {
    await db.execute({
      sql: 'ALTER TABLE routines ADD COLUMN like_count INTEGER DEFAULT 0'
    });
    routineLikeCountColumnReady = true;
    return { ready: true, added: true };
  } catch (error: any) {
    const message = String(error?.message || error);
    if (message.toLowerCase().includes('duplicate') || message.toLowerCase().includes('already exists')) {
      routineLikeCountColumnReady = true;
      return { ready: true, added: false };
    }
    console.warn('Failed to add like_count column to routines:', error);
    routineLikeCountColumnReady = false;
    return { ready: false, added: false };
  }
}

async function ensureRoutineCloneCountColumn(): Promise<{ ready: boolean; added: boolean }> {
  const hasColumn = await hasRoutineCloneCountColumn();
  if (hasColumn) return { ready: true, added: false };
  const db = getDatabase();
  try {
    await db.execute({
      sql: 'ALTER TABLE routines ADD COLUMN clone_count INTEGER DEFAULT 0'
    });
    routineCloneCountColumnReady = true;
    return { ready: true, added: true };
  } catch (error: any) {
    const message = String(error?.message || error);
    if (message.toLowerCase().includes('duplicate') || message.toLowerCase().includes('already exists')) {
      routineCloneCountColumnReady = true;
      return { ready: true, added: false };
    }
    console.warn('Failed to add clone_count column to routines:', error);
    routineCloneCountColumnReady = false;
    return { ready: false, added: false };
  }
}

async function ensureRoutineOrderColumn(): Promise<boolean> {
  const hasColumn = await hasRoutineOrderColumn();
  if (hasColumn) return true;
  const db = getDatabase();
  try {
    await db.execute({
      sql: 'ALTER TABLE routines ADD COLUMN order_index INTEGER DEFAULT 0'
    });
    routineOrderColumnReady = true;
    return true;
  } catch (error: any) {
    const message = String(error?.message || error);
    if (message.toLowerCase().includes('duplicate') || message.toLowerCase().includes('already exists')) {
      routineOrderColumnReady = true;
      return true;
    }
    console.warn('Failed to add order_index column to routines:', error);
    routineOrderColumnReady = false;
    return false;
  }
}

async function backfillRoutineOrderForUser(userId: string): Promise<void> {
  const db = getDatabase();
  const hasOrderColumn = await ensureRoutineOrderColumn();
  if (!hasOrderColumn) return;
  const result = await db.execute({
    sql: `
      SELECT
        COUNT(*) as total_count,
        SUM(CASE WHEN order_index != 0 THEN 1 ELSE 0 END) as non_zero_count
      FROM routines
      WHERE user_id = ?
    `,
    args: [userId]
  });
  const total = Number((result.rows[0] as any)?.total_count ?? 0);
  const nonZero = Number((result.rows[0] as any)?.non_zero_count ?? 0);
  if (total === 0 || nonZero > 0) return;
  await db.execute({
    sql: `
      WITH ordered AS (
        SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC) - 1 as rn
        FROM routines
        WHERE user_id = ?
      )
      UPDATE routines
      SET order_index = (SELECT rn FROM ordered WHERE ordered.id = routines.id)
      WHERE user_id = ?
    `,
    args: [userId, userId]
  });
}

async function backfillRoutineLikeCounts(): Promise<void> {
  const db = getDatabase();
  await db.execute({
    sql: `
      UPDATE routines
      SET like_count = (
        SELECT COUNT(*)
        FROM routine_favorites rf
        WHERE rf.routine_id = routines.id
      )
    `
  });
}

async function ensureRoutineCounts(): Promise<void> {
  const likeResult = await ensureRoutineLikeCountColumn();
  if (likeResult.ready && likeResult.added) {
    await backfillRoutineLikeCounts();
  }
  await ensureRoutineCloneCountColumn();
}

async function getNextRoutineOrderIndex(userId: string): Promise<number | null> {
  const db = getDatabase();
  const hasOrderColumn = await ensureRoutineOrderColumn();
  if (!hasOrderColumn) return null;
  const result = await db.execute({
    sql: 'SELECT COALESCE(MIN(order_index), 0) as min_order FROM routines WHERE user_id = ?',
    args: [userId]
  });
  const minOrder = Number((result.rows[0] as any)?.min_order ?? 0);
  return minOrder - 1;
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
        weight_unit TEXT DEFAULT 'lbs',
        height_unit TEXT DEFAULT 'in',
        timer_sound_enabled INTEGER DEFAULT 1,
        timer_vibrate_enabled INTEGER DEFAULT 1,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `
  });
  await ensureUserSettingsColumns();
}

async function ensureUserSettingsColumns(): Promise<void> {
  const db = getDatabase();
  try {
    const result = await db.execute({
      sql: 'PRAGMA table_info(user_settings)'
    });
    const columns = new Set(result.rows.map((row: any) => row.name));
    if (!columns.has('weight_unit')) {
      await db.execute("ALTER TABLE user_settings ADD COLUMN weight_unit TEXT DEFAULT 'lbs'");
    }
    if (!columns.has('height_unit')) {
      await db.execute("ALTER TABLE user_settings ADD COLUMN height_unit TEXT DEFAULT 'in'");
    }
    if (!columns.has('timer_sound_enabled')) {
      await db.execute('ALTER TABLE user_settings ADD COLUMN timer_sound_enabled INTEGER DEFAULT 1');
    }
    if (!columns.has('timer_vibrate_enabled')) {
      await db.execute('ALTER TABLE user_settings ADD COLUMN timer_vibrate_enabled INTEGER DEFAULT 1');
    }
  } catch (error) {
    console.warn('Failed to inspect user_settings schema:', error);
  }
}

async function ensureExerciseColumns(): Promise<void> {
  if (exerciseColumnsReady) return;
  const db = getDatabase();
  try {
    const result = await db.execute({
      sql: 'PRAGMA table_info(exercises)'
    });
    const columns = new Set(result.rows.map((row: any) => row.name));
    if (!columns.has('primary_metric')) {
      await db.execute("ALTER TABLE exercises ADD COLUMN primary_metric TEXT DEFAULT 'weight'");
    }
    if (!columns.has('metric_unit')) {
      await db.execute('ALTER TABLE exercises ADD COLUMN metric_unit TEXT');
    }
    exerciseColumnsReady = true;
  } catch (error) {
    console.warn('Failed to inspect exercises schema:', error);
    exerciseColumnsReady = false;
  }
}

async function ensureRoutineStretchTables(): Promise<void> {
  if (routineStretchTablesReady) return;
  const db = getDatabase();

  const tableExists = async (tableName: string): Promise<boolean> => {
    const result = await db.execute({
      sql: "SELECT name FROM sqlite_master WHERE type='table' AND name = ?",
      args: [tableName]
    });
    return result.rows.length > 0;
  };

  const hasLegacyStretchFk = async (tableName: string): Promise<boolean> => {
    if (!(await tableExists(tableName))) return false;
    const result = await db.execute(`PRAGMA foreign_key_list(${tableName})`);
    return result.rows.some((row: any) => row?.table === 'stretches_old');
  };

  const rebuildRoutineStretchTable = async (tableName: 'routine_pre_stretches' | 'routine_post_stretches') => {
    const exists = await tableExists(tableName);
    const oldName = `${tableName}_old`;
    if (exists) {
      await db.execute(`ALTER TABLE ${tableName} RENAME TO ${oldName}`);
    }
    await db.execute(`
      CREATE TABLE ${tableName} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        routine_id INTEGER NOT NULL,
        stretch_id INTEGER NOT NULL,
        order_index INTEGER NOT NULL,
        FOREIGN KEY (routine_id) REFERENCES routines(id) ON DELETE CASCADE,
        FOREIGN KEY (stretch_id) REFERENCES stretches(id) ON DELETE CASCADE
      )
    `);
    if (exists) {
      await db.execute(`INSERT INTO ${tableName} SELECT * FROM ${oldName}`);
      await db.execute(`DROP TABLE ${oldName}`);
    }
  };

  const needsPreFix = await hasLegacyStretchFk('routine_pre_stretches');
  const needsPostFix = await hasLegacyStretchFk('routine_post_stretches');

  if (needsPreFix) {
    await rebuildRoutineStretchTable('routine_pre_stretches');
  } else if (!(await tableExists('routine_pre_stretches'))) {
    await rebuildRoutineStretchTable('routine_pre_stretches');
  }

  if (needsPostFix) {
    await rebuildRoutineStretchTable('routine_post_stretches');
  } else if (!(await tableExists('routine_post_stretches'))) {
    await rebuildRoutineStretchTable('routine_post_stretches');
  }

  routineStretchTablesReady = true;
}

async function ensureStretchVersionTable(): Promise<void> {
  if (stretchVersionTableReady) return;
  const db = getDatabase();
  await db.execute({
    sql: `
      CREATE TABLE IF NOT EXISTS stretch_version (
        id INTEGER PRIMARY KEY,
        version INTEGER NOT NULL,
        updated_at TEXT DEFAULT (datetime('now'))
      )
    `
  });
  stretchVersionTableReady = true;
}

async function ensureStretchRecommendationCacheTable(): Promise<void> {
  if (stretchRecommendationCacheReady) return;
  const db = getDatabase();
  await db.execute({
    sql: `
      CREATE TABLE IF NOT EXISTS routine_stretch_recommendation_cache (
        routine_id INTEGER NOT NULL,
        user_id TEXT NOT NULL,
        signature TEXT NOT NULL,
        recommended_pre_ids TEXT NOT NULL,
        recommended_post_ids TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now')),
        PRIMARY KEY (routine_id, user_id, signature)
      )
    `
  });
  stretchRecommendationCacheReady = true;
}

export async function getUserSettings(userId: string): Promise<{
  restTimeSeconds: number;
  supersetRestSeconds: number;
  weightUnit: WeightUnit;
  heightUnit: HeightUnit;
  timerSoundEnabled: boolean;
  timerVibrateEnabled: boolean;
}> {
  await ensureUserSettingsTable();
  const db = getDatabase();
  const result = await db.execute({
    sql: `
      SELECT
        rest_time_seconds,
        superset_rest_seconds,
        weight_unit,
        height_unit,
        timer_sound_enabled,
        timer_vibrate_enabled
      FROM user_settings
      WHERE user_id = ?
    `,
    args: [userId]
  });
  const row = result.rows[0] as any | undefined;
  const restTimeSeconds = Number(row?.rest_time_seconds);
  const supersetRestSeconds = Number(row?.superset_rest_seconds);
  const weightUnit = normalizeWeightUnit(row?.weight_unit);
  const heightUnit = normalizeHeightUnit(row?.height_unit);
  const resolveBoolean = (value: unknown, fallback: boolean) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value !== 0;
    return fallback;
  };
  const timerSoundEnabled = resolveBoolean(row?.timer_sound_enabled, DEFAULT_TIMER_SOUND_ENABLED);
  const timerVibrateEnabled = resolveBoolean(row?.timer_vibrate_enabled, DEFAULT_TIMER_VIBRATE_ENABLED);

  return {
    restTimeSeconds: Number.isFinite(restTimeSeconds) ? restTimeSeconds : DEFAULT_REST_TIME_SECONDS,
    supersetRestSeconds: Number.isFinite(supersetRestSeconds)
      ? supersetRestSeconds
      : DEFAULT_SUPERSET_REST_TIME_SECONDS,
    weightUnit,
    heightUnit,
    timerSoundEnabled,
    timerVibrateEnabled,
  };
}

export async function upsertUserSettings(userId: string, data: {
  restTimeSeconds: number;
  supersetRestSeconds: number;
  weightUnit: WeightUnit;
  heightUnit: HeightUnit;
  timerSoundEnabled: boolean;
  timerVibrateEnabled: boolean;
}): Promise<void> {
  await ensureUserSettingsTable();
  const db = getDatabase();
  await db.execute({
    sql: `
      INSERT INTO user_settings (
        user_id,
        rest_time_seconds,
        superset_rest_seconds,
        weight_unit,
        height_unit,
        timer_sound_enabled,
        timer_vibrate_enabled,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
      ON CONFLICT(user_id) DO UPDATE SET
        rest_time_seconds = excluded.rest_time_seconds,
        superset_rest_seconds = excluded.superset_rest_seconds,
        weight_unit = excluded.weight_unit,
        height_unit = excluded.height_unit,
        timer_sound_enabled = excluded.timer_sound_enabled,
        timer_vibrate_enabled = excluded.timer_vibrate_enabled,
        updated_at = datetime('now')
    `,
    args: [
      userId,
      data.restTimeSeconds,
      data.supersetRestSeconds,
      data.weightUnit,
      data.heightUnit,
      data.timerSoundEnabled ? 1 : 0,
      data.timerVibrateEnabled ? 1 : 0,
    ]
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
}): Promise<number> {
  const db = getDatabase();
  const hasRoutineIdColumn = await ensureWorkoutSessionRoutineIdColumn();
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

  if (updates.length === 0) return;

  args.push(id, userId);

  await db.execute({
    sql: `UPDATE workout_sessions SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`,
    args
  });
}

export async function updateWorkoutSessionReport(data: {
  userId: string;
  sessionId?: number | null;
  sessionKey?: string | null;
  report: string | null;
}): Promise<void> {
  const hasReportColumn = await ensureWorkoutSessionReportColumn();
  if (!hasReportColumn) return;
  const db = getDatabase();

  if (typeof data.sessionId === 'number') {
    await db.execute({
      sql: 'UPDATE workout_sessions SET workout_report = ? WHERE id = ? AND user_id = ?',
      args: [data.report, data.sessionId, data.userId]
    });
    return;
  }

  if (data.sessionKey) {
    const hasKeyColumn = await hasWorkoutSessionKeyColumn();
    if (!hasKeyColumn) {
      console.warn('Missing session_key column; cannot save workout report by key.');
      return;
    }
    await db.execute({
      sql: 'UPDATE workout_sessions SET workout_report = ? WHERE session_key = ? AND user_id = ?',
      args: [data.report, data.sessionKey, data.userId]
    });
    return;
  }

  console.warn('Missing session id/key; workout report not saved.');
}

export async function getWorkoutSessionReportById(
  userId: string,
  sessionId: number
): Promise<string | null> {
  const hasReportColumn = await ensureWorkoutSessionReportColumn();
  if (!hasReportColumn) return null;
  const db = getDatabase();
  const result = await db.execute({
    sql: 'SELECT workout_report FROM workout_sessions WHERE id = ? AND user_id = ? LIMIT 1',
    args: [sessionId, userId]
  });
  const row = result.rows[0] as any;
  return row?.workout_report ?? null;
}

export async function getWorkoutSessionReportByKey(
  userId: string,
  sessionKey: string
): Promise<string | null> {
  const hasReportColumn = await ensureWorkoutSessionReportColumn();
  if (!hasReportColumn) return null;
  const hasKeyColumn = await hasWorkoutSessionKeyColumn();
  if (!hasKeyColumn) return null;
  const db = getDatabase();
  const result = await db.execute({
    sql: 'SELECT workout_report FROM workout_sessions WHERE session_key = ? AND user_id = ? LIMIT 1',
    args: [sessionKey, userId]
  });
  const row = result.rows[0] as any;
  return row?.workout_report ?? null;
}

export async function getLatestWorkoutReportForWorkoutName(
  userId: string,
  workoutName: string
): Promise<string | null> {
  const hasReportColumn = await ensureWorkoutSessionReportColumn();
  if (!hasReportColumn) return null;
  const db = getDatabase();
  const result = await db.execute({
    sql: `
      SELECT workout_report
      FROM workout_sessions
      WHERE user_id = ? AND workout_plan_name = ? AND workout_report IS NOT NULL
      ORDER BY date_completed DESC
      LIMIT 1
    `,
    args: [userId, workoutName]
  });
  const row = result.rows[0] as any;
  return row?.workout_report ?? null;
}

export async function logExercise(data: {
  session_id: number;
  exercise_name: string;
  exercise_type: ExerciseType;
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
  exercise_type: ExerciseType;
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
  limit: number = 5
): Promise<Array<WorkoutExerciseLog & { completed_at?: string; matched_role?: string }>> {
  const db = getDatabase();

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
      ORDER BY ws.date_completed DESC
      LIMIT ?
    `,
    args: [exerciseName, exerciseName, userId, exerciseName, exerciseName, limit]
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
  display_mode: ExerciseHistoryDisplayMode;
  is_machine?: boolean;
  primary_metric?: string | null;
  metric_unit?: string | null;
  points: ExerciseHistoryPoint[];
};

export async function getExerciseHistory(
  userId: string,
  exerciseName: string,
  range: 'week' | 'month' | 'all'
): Promise<ExerciseHistorySeries> {
  await ensureExerciseColumns();
  const db = getDatabase();
  const daysBack = range === 'week' ? 7 : range === 'month' ? 30 : null;
  const cutoff = daysBack ? new Date(Date.now() - (daysBack - 1) * 86400000).toISOString() : null;
  const rangeClause = cutoff ? 'AND ws.date_completed >= ?' : '';

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
    sql: 'SELECT equipment, is_bodyweight, is_machine, primary_metric, metric_unit FROM exercises WHERE name = ? LIMIT 1',
    args: [exerciseName]
  });
  const row = equipmentResult.rows[0] as any;
  const isBodyweight = row?.is_bodyweight === 1;
  const isMachine = row?.is_machine === 1;
  const primaryMetric = typeof row?.primary_metric === 'string'
    ? row.primary_metric
    : EXERCISE_PRIMARY_METRICS.weight;
  const metricUnit = typeof row?.metric_unit === 'string' ? row.metric_unit : null;
  const displayMode: ExerciseHistorySeries['display_mode'] = primaryMetric === EXERCISE_PRIMARY_METRICS.repsOnly || isBodyweight
    ? EXERCISE_HISTORY_DISPLAY_MODES.reps
    : EXERCISE_HISTORY_DISPLAY_MODES.weight;
  const normalizedPoints = primaryMetric === EXERCISE_PRIMARY_METRICS.weight
    ? points
    : points.map((point) => ({ ...point, volume: null }));

  return {
    display_mode: displayMode,
    is_machine: isMachine,
    primary_metric: primaryMetric,
    metric_unit: metricUnit,
    points: normalizedPoints,
  };
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
  equipment?: string;
  isBodyweight?: boolean;
  isMachine?: boolean;
  difficulty?: string;
  primaryMetric?: string;
  metricUnit?: string | null;
}): Promise<number> {
  await ensureExerciseColumns();
  const db = getDatabase();
  const result = await db.execute({
    sql: `
      INSERT INTO exercises (
        name,
        video_url,
        tips,
        muscle_groups,
        equipment,
        is_bodyweight,
        is_machine,
        difficulty,
        primary_metric,
        metric_unit
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      data.name,
      data.videoUrl || null,
      data.tips || null,
      data.muscleGroups ? JSON.stringify(data.muscleGroups) : null,
      data.equipment || null,
      typeof data.isBodyweight === 'boolean' ? (data.isBodyweight ? 1 : 0) : null,
      typeof data.isMachine === 'boolean' ? (data.isMachine ? 1 : 0) : null,
      data.difficulty || null,
      data.primaryMetric || 'weight',
      data.metricUnit || null
    ]
  });
  return Number(result.lastInsertRowid);
}

export async function getAllExercises(): Promise<any[]> {
  await ensureExerciseColumns();
  const db = getDatabase();
  const result = await db.execute('SELECT * FROM exercises ORDER BY name');
  return result.rows as any[];
}

export async function searchExercises(query: string): Promise<any[]> {
  await ensureExerciseColumns();
  const db = getDatabase();
  const result = await db.execute({
    sql: 'SELECT * FROM exercises WHERE name LIKE ? ORDER BY name',
    args: [`%${query}%`]
  });
  return result.rows as any[];
}

export async function getExerciseById(id: number): Promise<any | null> {
  await ensureExerciseColumns();
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
  const orderIndex = await getNextRoutineOrderIndex(userId);
  const result = orderIndex === null
    ? await db.execute({
        sql: 'INSERT INTO routines (name, user_id, is_public) VALUES (?, ?, ?)',
        args: [name, userId, isPublic ? 1 : 0]
      })
    : await db.execute({
        sql: 'INSERT INTO routines (name, user_id, is_public, order_index) VALUES (?, ?, ?, ?)',
        args: [name, userId, isPublic ? 1 : 0, orderIndex]
      });
  return Number(result.lastInsertRowid);
}

export async function getAllRoutines(userId: string): Promise<any[]> {
  const db = getDatabase();
  const hasOrderColumn = await ensureRoutineOrderColumn();
  await ensureRoutineCounts();
  await backfillWorkoutSessionRoutineIds(userId);
  if (hasOrderColumn) {
    await backfillRoutineOrderForUser(userId);
  }
  const orderClause = hasOrderColumn
    ? 'ORDER BY COALESCE(r.order_index, 0) ASC, r.created_at DESC'
    : 'ORDER BY r.created_at DESC';
  const result = await db.execute({
    sql: `
      SELECT r.*, MAX(ws.date_completed) as last_workout_date
      FROM routines r
      LEFT JOIN workout_sessions ws
        ON ws.user_id = ? AND ws.routine_id = r.id
      WHERE r.user_id = ?
      GROUP BY r.id
      ${orderClause}
    `,
    args: [userId, userId]
  });
  return result.rows as any[];
}

export async function reorderUserRoutines(userId: string, routineOrder: number[]): Promise<void> {
  if (!routineOrder.length) return;
  const db = getDatabase();
  const hasOrderColumn = await ensureRoutineOrderColumn();
  if (!hasOrderColumn) return;
  for (let i = 0; i < routineOrder.length; i++) {
    await db.execute({
      sql: 'UPDATE routines SET order_index = ? WHERE id = ? AND user_id = ?',
      args: [i, routineOrder[i], userId]
    });
  }
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
  exerciseId1: number;
  exerciseId2?: number | null;
  orderIndex: number;
}): Promise<number> {
  const db = getDatabase();
  const result = await db.execute({
    sql: `
      INSERT INTO routine_exercises (
        routine_id, exercise_id1, exercise_id2, order_index
      ) VALUES (?, ?, ?, ?)
    `,
    args: [
      data.routineId,
      data.exerciseId1,
      data.exerciseId2 ?? null,
      data.orderIndex
    ]
  });
  return Number(result.lastInsertRowid);
}

export async function getRoutineExercises(routineId: number): Promise<any[]> {
  await ensureExerciseColumns();
  const db = getDatabase();
  const result = await db.execute({
    sql: `
      SELECT re.*,
             e1.name as exercise_name, e1.video_url, e1.tips,
             e1.equipment as exercise_equipment,
             e1.is_bodyweight as exercise_is_bodyweight,
             e1.is_machine as exercise_is_machine,
             e1.primary_metric as exercise_primary_metric,
             e1.metric_unit as exercise_metric_unit,
             e2.name as exercise2_name, e2.video_url as exercise2_video_url, e2.tips as exercise2_tips,
             e2.equipment as exercise2_equipment,
             e2.is_bodyweight as exercise2_is_bodyweight,
             e2.is_machine as exercise2_is_machine,
             e2.primary_metric as exercise2_primary_metric,
             e2.metric_unit as exercise2_metric_unit
      FROM routine_exercises re
      JOIN exercises e1 ON re.exercise_id1 = e1.id
      LEFT JOIN exercises e2 ON re.exercise_id2 = e2.id
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
  timerSeconds?: number;
  videoUrl?: string;
  tips?: string;
  muscleGroups?: string[];
}): Promise<number> {
  const db = getDatabase();
  const result = await db.execute({
    sql: `
      INSERT INTO stretches (name, timer_seconds, video_url, tips, muscle_groups)
      VALUES (?, ?, ?, ?, ?)
    `,
    args: [
      data.name,
      typeof data.timerSeconds === 'number' ? data.timerSeconds : 0,
      data.videoUrl || null,
      data.tips || null,
      data.muscleGroups ? JSON.stringify(data.muscleGroups) : null
    ]
  });
  const id = Number(result.lastInsertRowid);
  try {
    await bumpStretchVersion();
  } catch (error) {
    console.warn('Failed to bump stretch version:', error);
  }
  return id;
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

function parseIdList(value: unknown): number[] {
  if (typeof value !== 'string' || !value) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => Number(item)).filter((item) => Number.isFinite(item));
  } catch {
    return [];
  }
}

export async function getStretchVersion(): Promise<number> {
  await ensureStretchVersionTable();
  const db = getDatabase();
  await db.execute({
    sql: 'INSERT OR IGNORE INTO stretch_version (id, version) VALUES (1, 0)'
  });
  const result = await db.execute({
    sql: 'SELECT version FROM stretch_version WHERE id = 1'
  });
  return Number(result.rows[0]?.version ?? 0);
}

export async function bumpStretchVersion(): Promise<void> {
  await ensureStretchVersionTable();
  const db = getDatabase();
  await db.execute({
    sql: `
      INSERT INTO stretch_version (id, version, updated_at)
      VALUES (1, 1, datetime('now'))
      ON CONFLICT(id) DO UPDATE SET
        version = version + 1,
        updated_at = datetime('now')
    `
  });
}

export async function getRoutineStretchRecommendationCache(params: {
  routineId: number;
  userId: string;
  signature: string;
}): Promise<{ recommendedPreIds: number[]; recommendedPostIds: number[] } | null> {
  await ensureStretchRecommendationCacheTable();
  const db = getDatabase();
  const result = await db.execute({
    sql: `
      SELECT recommended_pre_ids, recommended_post_ids
      FROM routine_stretch_recommendation_cache
      WHERE routine_id = ? AND user_id = ? AND signature = ?
    `,
    args: [params.routineId, params.userId, params.signature]
  });
  const row = result.rows[0] as any;
  if (!row) return null;
  return {
    recommendedPreIds: parseIdList(row.recommended_pre_ids),
    recommendedPostIds: parseIdList(row.recommended_post_ids),
  };
}

export async function upsertRoutineStretchRecommendationCache(params: {
  routineId: number;
  userId: string;
  signature: string;
  recommendedPreIds: number[];
  recommendedPostIds: number[];
}): Promise<void> {
  await ensureStretchRecommendationCacheTable();
  const db = getDatabase();
  await db.execute({
    sql: `
      INSERT INTO routine_stretch_recommendation_cache (
        routine_id,
        user_id,
        signature,
        recommended_pre_ids,
        recommended_post_ids,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      ON CONFLICT(routine_id, user_id, signature) DO UPDATE SET
        recommended_pre_ids = excluded.recommended_pre_ids,
        recommended_post_ids = excluded.recommended_post_ids,
        updated_at = datetime('now')
    `,
    args: [
      params.routineId,
      params.userId,
      params.signature,
      JSON.stringify(params.recommendedPreIds),
      JSON.stringify(params.recommendedPostIds)
    ]
  });
}

// Routine stretch management
export async function addStretchToRoutine(
  routineId: number,
  stretchId: number,
  type: 'pre' | 'post',
  orderIndex: number
): Promise<number> {
  await ensureRoutineStretchTables();
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
  await ensureRoutineStretchTables();
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
      SELECT rs.*, s.name, s.timer_seconds, s.video_url, s.tips, s.muscle_groups
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
  await ensureRoutineStretchTables();
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
  await ensureRoutineCounts();
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
       ORDER BY (COALESCE(r.like_count, 0) + COALESCE(r.clone_count, 0)) DESC, r.created_at DESC`
    : `SELECT r.*, u.username as creator_username, u.name as creator_name,
         NULL as last_workout_date
       FROM routines r
       JOIN users u ON r.user_id = u.id
       WHERE r.is_public = 1
       ORDER BY (COALESCE(r.like_count, 0) + COALESCE(r.clone_count, 0)) DESC, r.created_at DESC`;

  const args = excludeUserId ? [excludeUserId, excludeUserId] : [];
  const result = await db.execute({ sql, args });
  return result.rows as any[];
}

// Favorites management
export async function addFavorite(userId: string, routineId: number): Promise<void> {
  const db = getDatabase();
  await ensureRoutineCounts();
  await db.execute({
    sql: `INSERT OR IGNORE INTO routine_favorites (user_id, routine_id) VALUES (?, ?)`,
    args: [userId, routineId]
  });
  const changeResult = await db.execute({ sql: 'SELECT changes() as changes' });
  const changes = Number((changeResult.rows[0] as any)?.changes ?? 0);
  if (changes > 0) {
    await db.execute({
      sql: 'UPDATE routines SET like_count = COALESCE(like_count, 0) + 1 WHERE id = ?',
      args: [routineId]
    });
  }
}

export async function removeFavorite(userId: string, routineId: number): Promise<void> {
  const db = getDatabase();
  await ensureRoutineCounts();
  await db.execute({
    sql: `DELETE FROM routine_favorites WHERE user_id = ? AND routine_id = ?`,
    args: [userId, routineId]
  });
  const changeResult = await db.execute({ sql: 'SELECT changes() as changes' });
  const changes = Number((changeResult.rows[0] as any)?.changes ?? 0);
  if (changes > 0) {
    await db.execute({
      sql: `
        UPDATE routines
        SET like_count = CASE
          WHEN COALESCE(like_count, 0) > 0 THEN COALESCE(like_count, 0) - 1
          ELSE 0
        END
        WHERE id = ?
      `,
      args: [routineId]
    });
  }
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
  const orderIndex = await getNextRoutineOrderIndex(newUserId);
  const newRoutineResult = orderIndex === null
    ? await db.execute({
        sql: `INSERT INTO routines (user_id, name, description, is_public, created_at, updated_at)
              VALUES (?, ?, ?, 0, datetime('now'), datetime('now'))`,
        args: [newUserId, clonedName, routine.description]
      })
    : await db.execute({
        sql: `INSERT INTO routines (user_id, name, description, is_public, order_index, created_at, updated_at)
              VALUES (?, ?, ?, 0, ?, datetime('now'), datetime('now'))`,
        args: [newUserId, clonedName, routine.description, orderIndex]
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
        routine_id, exercise_id1, exercise_id2, order_index
      ) VALUES (?, ?, ?, ?)`,
      args: [
        newRoutineId,
        e.exercise_id1 ?? e.exercise_id,
        e.exercise_id2 ?? e.b2b_partner_id ?? null,
        e.order_index
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

  await ensureRoutineCounts();
  if (routine.is_public) {
    await db.execute({
      sql: 'UPDATE routines SET clone_count = COALESCE(clone_count, 0) + 1 WHERE id = ?',
      args: [routineId]
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
