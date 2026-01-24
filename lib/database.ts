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
}): Promise<number> {
  const db = getDatabase();
  const result = await db.execute({
    sql: `
      INSERT INTO workout_cardio_logs (session_id, cardio_type, time)
      VALUES (?, ?, ?)
    `,
    args: [data.session_id, data.cardio_type, data.time]
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

// Close database connection (for cleanup)
export async function closeDatabase() {
  if (db) {
    await db.close();
    db = null;
  }
}
