-- SQLite Database Schema for Gymmer v1.0

CREATE TABLE IF NOT EXISTS workout_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  workout_plan_name TEXT NOT NULL,
  date_completed TEXT NOT NULL, -- ISO 8601 format
  total_duration_minutes INTEGER,
  total_strain INTEGER,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS workout_exercise_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id INTEGER NOT NULL,
  exercise_name TEXT NOT NULL,
  exercise_type TEXT NOT NULL, -- 'single', 'b2b', 'circuit'

  -- Warmup set
  warmup_weight REAL,
  warmup_reps INTEGER,

  -- Working sets (up to 4)
  set1_weight REAL,
  set1_reps INTEGER,
  set2_weight REAL,
  set2_reps INTEGER,
  set3_weight REAL,
  set3_reps INTEGER,
  set4_weight REAL,
  set4_reps INTEGER,

  -- For B2B/Supersets: second exercise data
  b2b_partner_name TEXT,
  b2b_warmup_weight REAL,
  b2b_warmup_reps INTEGER,
  b2b_set1_weight REAL,
  b2b_set1_reps INTEGER,
  b2b_set2_weight REAL,
  b2b_set2_reps INTEGER,
  b2b_set3_weight REAL,
  b2b_set3_reps INTEGER,
  b2b_set4_weight REAL,
  b2b_set4_reps INTEGER,

  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (session_id) REFERENCES workout_sessions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS workout_cardio_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id INTEGER NOT NULL,
  cardio_type TEXT NOT NULL,
  time TEXT NOT NULL, -- e.g. "15 min", "12 min"
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (session_id) REFERENCES workout_sessions(id) ON DELETE CASCADE
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_sessions_workout_name ON workout_sessions(workout_plan_name);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON workout_sessions(date_completed);
CREATE INDEX IF NOT EXISTS idx_exercise_logs_session ON workout_exercise_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_exercise_logs_name ON workout_exercise_logs(exercise_name);
CREATE INDEX IF NOT EXISTS idx_cardio_logs_session ON workout_cardio_logs(session_id);
