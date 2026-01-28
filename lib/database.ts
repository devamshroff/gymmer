// lib/database.ts
import { createClient, Client } from '@libsql/client';
import type { WorkoutSession, WorkoutExerciseLog, WorkoutCardioLog } from './types';

// Initialize database connection
let db: Client | null = null;

export function getDatabase(): Client {
  if (!db) {
    db = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });
  }
  return db;
}

// Query functions
export async function getLastWorkoutDate(workoutPlanName: string): Promise<string | null> {
  const db = getDatabase();
  const result = await db.execute({
    sql: `
      SELECT date_completed
      FROM workout_sessions
      WHERE workout_plan_name = ?
      ORDER BY date_completed DESC
      LIMIT 1
    `,
    args: [workoutPlanName]
  });

  return result.rows[0]?.date_completed as string || null;
}

export async function createWorkoutSession(data: {
  workout_plan_name: string;
  date_completed: string;
  total_duration_minutes?: number;
  total_strain?: number;
}): Promise<number> {
  const db = getDatabase();
  const result = await db.execute({
    sql: `
      INSERT INTO workout_sessions (workout_plan_name, date_completed, total_duration_minutes, total_strain)
      VALUES (?, ?, ?, ?)
    `,
    args: [
      data.workout_plan_name,
      data.date_completed,
      data.total_duration_minutes || null,
      data.total_strain || null
    ]
  });

  return Number(result.lastInsertRowid);
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
  const db = getDatabase();
  const result = await db.execute({
    sql: `
      INSERT INTO workout_exercise_logs (
        session_id, exercise_name, exercise_type,
        warmup_weight, warmup_reps,
        set1_weight, set1_reps,
        set2_weight, set2_reps,
        set3_weight, set3_reps,
        set4_weight, set4_reps,
        b2b_partner_name,
        b2b_warmup_weight, b2b_warmup_reps,
        b2b_set1_weight, b2b_set1_reps,
        b2b_set2_weight, b2b_set2_reps,
        b2b_set3_weight, b2b_set3_reps,
        b2b_set4_weight, b2b_set4_reps
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      data.session_id,
      data.exercise_name,
      data.exercise_type,
      data.warmup_weight ?? null, data.warmup_reps ?? null,
      data.set1_weight ?? null, data.set1_reps ?? null,
      data.set2_weight ?? null, data.set2_reps ?? null,
      data.set3_weight ?? null, data.set3_reps ?? null,
      data.set4_weight ?? null, data.set4_reps ?? null,
      data.b2b_partner_name ?? null,
      data.b2b_warmup_weight ?? null, data.b2b_warmup_reps ?? null,
      data.b2b_set1_weight ?? null, data.b2b_set1_reps ?? null,
      data.b2b_set2_weight ?? null, data.b2b_set2_reps ?? null,
      data.b2b_set3_weight ?? null, data.b2b_set3_reps ?? null,
      data.b2b_set4_weight ?? null, data.b2b_set4_reps ?? null
    ]
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
  workoutPlanName: string,
  exerciseName: string
): Promise<WorkoutExerciseLog | null> {
  const db = getDatabase();
  const result = await db.execute({
    sql: `
      SELECT el.*
      FROM workout_exercise_logs el
      JOIN workout_sessions ws ON el.session_id = ws.id
      WHERE ws.workout_plan_name = ? AND el.exercise_name = ?
      ORDER BY ws.date_completed DESC
      LIMIT 1
    `,
    args: [workoutPlanName, exerciseName]
  });

  return result.rows[0] as any as WorkoutExerciseLog || null;
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
  difficulty?: string;
}): Promise<number> {
  const db = getDatabase();
  const result = await db.execute({
    sql: `
      INSERT INTO exercises (name, video_url, tips, muscle_groups, equipment, difficulty)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    args: [
      data.name,
      data.videoUrl || null,
      data.tips || null,
      data.muscleGroups ? JSON.stringify(data.muscleGroups) : null,
      data.equipment || null,
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
export async function createRoutine(name: string): Promise<number> {
  const db = getDatabase();
  const result = await db.execute({
    sql: 'INSERT INTO routines (name, is_custom) VALUES (?, 1)',
    args: [name]
  });
  return Number(result.lastInsertRowid);
}

export async function getAllRoutines(): Promise<any[]> {
  const db = getDatabase();
  const result = await db.execute('SELECT * FROM routines ORDER BY is_custom DESC, created_at DESC');
  return result.rows as any[];
}

export async function getRoutineById(id: number): Promise<any | null> {
  const db = getDatabase();
  const result = await db.execute({
    sql: 'SELECT * FROM routines WHERE id = ?',
    args: [id]
  });
  return result.rows[0] as any || null;
}

export async function getRoutineByName(name: string): Promise<any | null> {
  const db = getDatabase();
  const result = await db.execute({
    sql: 'SELECT * FROM routines WHERE name = ?',
    args: [name]
  });
  return result.rows[0] as any || null;
}

export async function deleteRoutine(id: number): Promise<void> {
  const db = getDatabase();
  await db.execute({
    sql: 'DELETE FROM routines WHERE id = ?',
    args: [id]
  });
}

export async function updateRoutineName(id: number, newName: string): Promise<void> {
  const db = getDatabase();

  // Get the old name first
  const oldRoutine = await db.execute({
    sql: 'SELECT name FROM routines WHERE id = ?',
    args: [id]
  });

  if (oldRoutine.rows.length === 0) {
    throw new Error('Routine not found');
  }

  const oldName = (oldRoutine.rows[0] as any).name;

  // Update the routine name
  await db.execute({
    sql: 'UPDATE routines SET name = ?, updated_at = datetime(\'now\') WHERE id = ?',
    args: [newName, id]
  });

  // Update workout history to use the new name
  await db.execute({
    sql: 'UPDATE workout_sessions SET workout_plan_name = ? WHERE workout_plan_name = ?',
    args: [newName, oldName]
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
             e2.name as b2b_partner_name, e2.video_url as b2b_video_url, e2.tips as b2b_tips
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
  type: string;
  videoUrl?: string;
  tips?: string;
  muscleGroups?: string[];
}): Promise<number> {
  const db = getDatabase();
  const result = await db.execute({
    sql: `
      INSERT INTO stretches (name, duration, type, video_url, tips, muscle_groups)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    args: [
      data.name,
      data.duration,
      data.type,
      data.videoUrl || null,
      data.tips || null,
      data.muscleGroups ? JSON.stringify(data.muscleGroups) : null
    ]
  });
  return Number(result.lastInsertRowid);
}

export async function getAllStretches(type?: 'pre_workout' | 'post_workout'): Promise<any[]> {
  const db = getDatabase();
  if (type) {
    const result = await db.execute({
      sql: 'SELECT * FROM stretches WHERE type = ? ORDER BY name',
      args: [type]
    });
    return result.rows as any[];
  } else {
    const result = await db.execute('SELECT * FROM stretches ORDER BY name');
    return result.rows as any[];
  }
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
      SELECT rs.*, s.name, s.duration, s.video_url, s.tips, s.muscle_groups
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
