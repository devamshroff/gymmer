// lib/database.ts
import { Database } from 'bun:sqlite';
import path from 'path';
import fs from 'fs';
import type { WorkoutSession, WorkoutExerciseLog, WorkoutCardioLog } from './types';

// Database path
const DB_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'gymmer.db');

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Initialize database
let db: Database | null = null;

export function getDatabase(): Database {
  if (!db) {
    db = new Database(DB_PATH);
    initializeDatabase(db);
  }
  return db;
}

function initializeDatabase(database: Database) {
  const schemaPath = path.join(process.cwd(), 'lib', 'db-schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');

  // Execute schema
  database.exec(schema);
}

// Query functions
export function getLastWorkoutDate(workoutPlanName: string): string | null {
  const db = getDatabase();
  const result = db.query(`
    SELECT date_completed
    FROM workout_sessions
    WHERE workout_plan_name = ?
    ORDER BY date_completed DESC
    LIMIT 1
  `).get(workoutPlanName) as { date_completed: string } | null;

  return result?.date_completed || null;
}

export function createWorkoutSession(data: {
  workout_plan_name: string;
  date_completed: string;
  total_duration_minutes?: number;
  total_strain?: number;
}): number {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO workout_sessions (workout_plan_name, date_completed, total_duration_minutes, total_strain)
    VALUES (?, ?, ?, ?)
  `);

  stmt.run(
    data.workout_plan_name,
    data.date_completed,
    data.total_duration_minutes || null,
    data.total_strain || null
  );

  return db.query('SELECT last_insert_rowid() as id').get() as any as number;
}

export function logExercise(data: Partial<WorkoutExerciseLog>): number {
  const db = getDatabase();
  const stmt = db.prepare(`
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
  `);

  stmt.run(
    data.session_id,
    data.exercise_name,
    data.exercise_type,
    data.warmup_weight || null, data.warmup_reps || null,
    data.set1_weight || null, data.set1_reps || null,
    data.set2_weight || null, data.set2_reps || null,
    data.set3_weight || null, data.set3_reps || null,
    data.set4_weight || null, data.set4_reps || null,
    data.b2b_partner_name || null,
    data.b2b_warmup_weight || null, data.b2b_warmup_reps || null,
    data.b2b_set1_weight || null, data.b2b_set1_reps || null,
    data.b2b_set2_weight || null, data.b2b_set2_reps || null,
    data.b2b_set3_weight || null, data.b2b_set3_reps || null,
    data.b2b_set4_weight || null, data.b2b_set4_reps || null
  );

  return db.query('SELECT last_insert_rowid() as id').get() as any as number;
}

export function logCardio(data: {
  session_id: number;
  cardio_type: string;
  time: string;
}): number {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO workout_cardio_logs (session_id, cardio_type, time)
    VALUES (?, ?, ?)
  `);

  stmt.run(data.session_id, data.cardio_type, data.time);

  return db.query('SELECT last_insert_rowid() as id').get() as any as number;
}

export function getWorkoutSession(sessionId: number): (WorkoutSession & {
  exercises: WorkoutExerciseLog[];
  cardio: WorkoutCardioLog[];
}) | null {
  const db = getDatabase();

  const session = db.query(`
    SELECT * FROM workout_sessions WHERE id = ?
  `).get(sessionId) as WorkoutSession | null;

  if (!session) return null;

  const exercises = db.query(`
    SELECT * FROM workout_exercise_logs WHERE session_id = ?
  `).all(sessionId) as WorkoutExerciseLog[];

  const cardio = db.query(`
    SELECT * FROM workout_cardio_logs WHERE session_id = ?
  `).all(sessionId) as WorkoutCardioLog[];

  return { ...session, exercises, cardio };
}

export function getLastExerciseLog(
  workoutPlanName: string,
  exerciseName: string
): WorkoutExerciseLog | null {
  const db = getDatabase();
  const result = db.query(`
    SELECT el.*
    FROM workout_exercise_logs el
    JOIN workout_sessions ws ON el.session_id = ws.id
    WHERE ws.workout_plan_name = ? AND el.exercise_name = ?
    ORDER BY ws.date_completed DESC
    LIMIT 1
  `).get(workoutPlanName, exerciseName) as WorkoutExerciseLog | null;

  return result;
}

// Close database connection (for cleanup)
export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}
