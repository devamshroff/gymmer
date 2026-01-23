// scripts/seed-db.ts
import { Database } from 'bun:sqlite';
import path from 'path';
import fs from 'fs';

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'gym-tracker.db');
const db = new Database(dbPath);

console.log('Initializing database...');

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Create workout_plans table
db.run(`
  CREATE TABLE IF NOT EXISTS workout_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    file_path TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);
console.log('✓ Created workout_plans table');

// Create workout_sessions table
db.run(`
  CREATE TABLE IF NOT EXISTS workout_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workout_plan_name TEXT NOT NULL,
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    completed BOOLEAN DEFAULT 0
  );
`);
console.log('✓ Created workout_sessions table');

// Create exercise_logs table
db.run(`
  CREATE TABLE IF NOT EXISTS exercise_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    exercise_name TEXT NOT NULL,
    set_number INTEGER NOT NULL,
    weight REAL NOT NULL,
    reps INTEGER NOT NULL,
    exercise_order INTEGER NOT NULL,
    logged_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES workout_sessions(id)
  );
`);
console.log('✓ Created exercise_logs table');

// Create indexes for fast queries
db.run(`
  CREATE INDEX IF NOT EXISTS idx_exercise_logs_exercise_name
  ON exercise_logs(exercise_name);
`);
console.log('✓ Created index on exercise_logs.exercise_name');

db.run(`
  CREATE INDEX IF NOT EXISTS idx_exercise_logs_session_id
  ON exercise_logs(session_id);
`);
console.log('✓ Created index on exercise_logs.session_id');

db.run(`
  CREATE INDEX IF NOT EXISTS idx_workout_sessions_plan_name
  ON workout_sessions(workout_plan_name);
`);
console.log('✓ Created index on workout_sessions.workout_plan_name');

db.close();
console.log('\n✅ Database initialized successfully!');
console.log(`Database location: ${dbPath}`);
