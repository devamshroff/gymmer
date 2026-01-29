-- SQLite Database Schema for Gymmer v2.0 (Multi-User)

-- ============================================================================
-- Users Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,  -- Use email as ID for simplicity
  email TEXT NOT NULL UNIQUE,
  username TEXT UNIQUE,  -- Public display name (required for sharing)
  name TEXT,
  image TEXT,
  goals_text TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- ============================================================================
-- Workout History Tables
-- ============================================================================

CREATE TABLE IF NOT EXISTS workout_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,  -- Owner of this workout session
  workout_plan_name TEXT NOT NULL,
  date_completed TEXT NOT NULL, -- ISO 8601 format
  total_duration_minutes INTEGER,
  total_strain INTEGER,
  session_mode TEXT, -- 'incremental', 'maintenance', 'light'
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
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
  speed REAL, -- e.g. 6.5 mph
  incline REAL, -- e.g. 2.5 percent
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (session_id) REFERENCES workout_sessions(id) ON DELETE CASCADE
);

-- Indexes for workout history
CREATE INDEX IF NOT EXISTS idx_sessions_user ON workout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_workout_name ON workout_sessions(workout_plan_name);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON workout_sessions(date_completed);
CREATE INDEX IF NOT EXISTS idx_exercise_logs_session ON workout_exercise_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_exercise_logs_name ON workout_exercise_logs(exercise_name);
CREATE INDEX IF NOT EXISTS idx_exercise_logs_partner_name ON workout_exercise_logs(b2b_partner_name);
CREATE INDEX IF NOT EXISTS idx_cardio_logs_session ON workout_cardio_logs(session_id);

-- ============================================================================
-- Exercise & Stretch Libraries (Shared across all users)
-- ============================================================================

CREATE TABLE IF NOT EXISTS exercises (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  video_url TEXT,
  tips TEXT,
  muscle_groups TEXT,  -- JSON array: ["chest", "triceps"]
  equipment TEXT,      -- e.g., "Dumbbells", "Barbell", "Bodyweight"
  difficulty TEXT,     -- "Beginner", "Intermediate", "Advanced"
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS stretches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  duration TEXT NOT NULL,
  timer_seconds INTEGER DEFAULT 0,  -- 0 means no timer needed (rep-based), >0 means show timer
  video_url TEXT,
  tips TEXT,
  type TEXT,  -- "pre_workout" or "post_workout"
  muscle_groups TEXT,  -- JSON array: ["hamstrings", "glutes", "lower back"]
  created_at TEXT DEFAULT (datetime('now'))
);

-- Indexes for exercise/stretch libraries
CREATE INDEX IF NOT EXISTS idx_exercises_name ON exercises(name);
CREATE INDEX IF NOT EXISTS idx_exercises_muscle ON exercises(muscle_groups);
CREATE INDEX IF NOT EXISTS idx_stretches_type ON stretches(type);

-- ============================================================================
-- Routines (Owned by users)
-- ============================================================================

CREATE TABLE IF NOT EXISTS routines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,  -- Owner of this routine
  name TEXT NOT NULL,
  description TEXT,
  notes TEXT,
  is_public INTEGER DEFAULT 1,  -- 1 = public (default), 0 = private
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(user_id, name)  -- Each user can only have one routine with a given name
);

-- Favorites: users can favorite public routines from other users
CREATE TABLE IF NOT EXISTS routine_favorites (
  user_id TEXT NOT NULL,
  routine_id INTEGER NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, routine_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (routine_id) REFERENCES routines(id) ON DELETE CASCADE
);

-- Junction: routines to pre-workout stretches
CREATE TABLE IF NOT EXISTS routine_pre_stretches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  routine_id INTEGER NOT NULL,
  stretch_id INTEGER NOT NULL,
  order_index INTEGER NOT NULL,
  FOREIGN KEY (routine_id) REFERENCES routines(id) ON DELETE CASCADE,
  FOREIGN KEY (stretch_id) REFERENCES stretches(id) ON DELETE CASCADE
);

-- Junction: routines to exercises
CREATE TABLE IF NOT EXISTS routine_exercises (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  routine_id INTEGER NOT NULL,
  exercise_id INTEGER NOT NULL,
  order_index INTEGER NOT NULL,
  exercise_type TEXT NOT NULL,  -- "single" or "b2b"

  -- Single exercise config
  sets INTEGER,
  target_reps INTEGER,
  target_weight REAL,
  warmup_weight REAL,
  rest_time INTEGER,  -- seconds

  -- B2B partner (if exercise_type = "b2b")
  b2b_partner_id INTEGER,
  b2b_sets INTEGER,
  b2b_target_reps INTEGER,
  b2b_target_weight REAL,
  b2b_warmup_weight REAL,

  FOREIGN KEY (routine_id) REFERENCES routines(id) ON DELETE CASCADE,
  FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE,
  FOREIGN KEY (b2b_partner_id) REFERENCES exercises(id) ON DELETE CASCADE
);

-- Junction: routines to post-workout stretches
CREATE TABLE IF NOT EXISTS routine_post_stretches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  routine_id INTEGER NOT NULL,
  stretch_id INTEGER NOT NULL,
  order_index INTEGER NOT NULL,
  FOREIGN KEY (routine_id) REFERENCES routines(id) ON DELETE CASCADE,
  FOREIGN KEY (stretch_id) REFERENCES stretches(id) ON DELETE CASCADE
);

-- Optional cardio for routines
CREATE TABLE IF NOT EXISTS routine_cardio (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  routine_id INTEGER NOT NULL UNIQUE,
  cardio_type TEXT NOT NULL,
  duration TEXT NOT NULL,
  intensity TEXT,
  tips TEXT,
  FOREIGN KEY (routine_id) REFERENCES routines(id) ON DELETE CASCADE
);

-- Indexes for routines
CREATE INDEX IF NOT EXISTS idx_routines_user ON routines(user_id);
CREATE INDEX IF NOT EXISTS idx_routine_exercises_routine ON routine_exercises(routine_id);
CREATE INDEX IF NOT EXISTS idx_routine_exercises_order ON routine_exercises(routine_id, order_index);
