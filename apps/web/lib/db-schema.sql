-- SQLite Database Schema for Temple v2.0 (Multi-User)

-- ============================================================================
-- Users Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  image TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  username TEXT,  -- Public display name (required for sharing)
  goals_text TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username_unique
  ON users(username)
  WHERE username IS NOT NULL;

-- User settings (per-user preferences)
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
);

-- ============================================================================
-- Workout History Tables
-- ============================================================================

CREATE TABLE IF NOT EXISTS workout_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  workout_plan_name TEXT NOT NULL,
  date_completed TEXT NOT NULL, -- ISO 8601 format
  total_duration_minutes INTEGER,
  total_strain INTEGER,
  workout_report TEXT, -- LLM workout summary for this session
  created_at TEXT DEFAULT (datetime('now')),
  user_id TEXT,  -- Owner of this workout session
  routine_id INTEGER, -- Optional routine reference
  session_key TEXT, -- Stable client session key (e.g., startTime)
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

  -- Working sets (up to 4). set*_weight stores the primary metric value (e.g., seconds for time).
  set1_weight REAL,
  set1_reps INTEGER,
  set2_weight REAL,
  set2_reps INTEGER,
  set3_weight REAL,
  set3_reps INTEGER,
  set4_weight REAL,
  set4_reps INTEGER,

  -- For B2B/Supersets: second exercise data (same metric convention as above).
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
CREATE UNIQUE INDEX IF NOT EXISTS idx_sessions_user_key ON workout_sessions(user_id, session_key);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON workout_sessions(date_completed);
CREATE INDEX IF NOT EXISTS idx_exercise_logs_session ON workout_exercise_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_exercise_logs_name ON workout_exercise_logs(exercise_name);
CREATE INDEX IF NOT EXISTS idx_exercise_logs_partner_name ON workout_exercise_logs(b2b_partner_name);
CREATE INDEX IF NOT EXISTS idx_cardio_logs_session ON workout_cardio_logs(session_id);

-- Standalone activity log for cardio, sports, classes, and other timed movement.
CREATE TABLE IF NOT EXISTS activity_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  activity_type TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  activity_date TEXT NOT NULL,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user_date ON activity_logs(user_id, activity_date);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_type ON activity_logs(user_id, activity_type);

-- Browser push subscriptions for nightly activity reminders.
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  enabled INTEGER DEFAULT 1,
  last_cardio_reminder_date TEXT,
  user_agent TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user ON push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_enabled ON push_subscriptions(enabled);

-- Minimal per-user nutrition tracking.
CREATE TABLE IF NOT EXISTS pantry_foods (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  serving_description TEXT NOT NULL,
  calories INTEGER NOT NULL,
  protein_g REAL NOT NULL,
  carbs_g REAL,
  fat_g REAL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_pantry_foods_user_name ON pantry_foods(user_id, name);

CREATE TABLE IF NOT EXISTS food_log_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  date TEXT NOT NULL,
  pantry_food_id INTEGER,
  name TEXT NOT NULL,
  calories INTEGER NOT NULL,
  protein_g REAL NOT NULL,
  carbs_g REAL,
  fat_g REAL,
  quantity REAL NOT NULL DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (pantry_food_id) REFERENCES pantry_foods(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_food_log_entries_user_date ON food_log_entries(user_id, date);
CREATE INDEX IF NOT EXISTS idx_food_log_entries_pantry_food ON food_log_entries(pantry_food_id);

CREATE TABLE IF NOT EXISTS bodyweight_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  date TEXT NOT NULL,
  weight_lbs REAL NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_bodyweight_entries_user_date
  ON bodyweight_entries(user_id, date);

CREATE TABLE IF NOT EXISTS combos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_combos_user_name ON combos(user_id, name);

CREATE TABLE IF NOT EXISTS combo_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  combo_id INTEGER NOT NULL,
  pantry_food_id INTEGER NOT NULL,
  default_quantity REAL NOT NULL DEFAULT 1,
  FOREIGN KEY (combo_id) REFERENCES combos(id) ON DELETE CASCADE,
  FOREIGN KEY (pantry_food_id) REFERENCES pantry_foods(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_combo_items_combo_food
  ON combo_items(combo_id, pantry_food_id);

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
  created_at TEXT DEFAULT (datetime('now')),
  is_bodyweight INTEGER DEFAULT 0, -- 1 = bodyweight, 0 = not bodyweight
  is_machine INTEGER DEFAULT 0, -- 1 = machine with base weight, 0 = not
  primary_metric TEXT DEFAULT 'weight', -- weight | height | time | distance | reps_only
  metric_unit TEXT -- e.g., lbs, in, sec
);

CREATE TABLE IF NOT EXISTS stretches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  video_url TEXT,
  tips TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  muscle_groups TEXT,  -- JSON array: ["hamstrings", "glutes", "lower back"]
  timer_seconds INTEGER DEFAULT 0  -- Hold time in seconds
);

-- Indexes for exercise/stretch libraries
CREATE INDEX IF NOT EXISTS idx_exercises_name ON exercises(name);
CREATE INDEX IF NOT EXISTS idx_exercises_muscle ON exercises(muscle_groups);

-- ============================================================================
-- Routines (Owned by users)
-- ============================================================================

CREATE TABLE IF NOT EXISTS routines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  source_file TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  user_id TEXT REFERENCES users(id),
  is_public INTEGER DEFAULT 1,  -- 1 = public (default), 0 = private
  order_index INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  clone_count INTEGER DEFAULT 0
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
  exercise_id1 INTEGER NOT NULL,
  exercise_id2 INTEGER,
  order_index INTEGER NOT NULL,
  FOREIGN KEY (routine_id) REFERENCES routines(id) ON DELETE CASCADE,
  FOREIGN KEY (exercise_id1) REFERENCES exercises(id) ON DELETE CASCADE,
  FOREIGN KEY (exercise_id2) REFERENCES exercises(id) ON DELETE CASCADE
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
CREATE INDEX IF NOT EXISTS idx_routines_public ON routines(is_public);

-- ============================================================================
-- Remote MCP OAuth (Claude custom connector)
-- ============================================================================

CREATE TABLE IF NOT EXISTS mcp_oauth_clients (
  client_id TEXT PRIMARY KEY,
  client_secret_hash TEXT,
  redirect_uris TEXT NOT NULL,
  grant_types TEXT NOT NULL,
  response_types TEXT NOT NULL,
  scope TEXT NOT NULL,
  token_endpoint_auth_method TEXT NOT NULL,
  client_name TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS mcp_oauth_authorization_codes (
  code_hash TEXT PRIMARY KEY,
  client_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  redirect_uri TEXT NOT NULL,
  scope TEXT NOT NULL,
  code_challenge TEXT NOT NULL,
  code_challenge_method TEXT NOT NULL,
  resource TEXT,
  expires_at INTEGER NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (client_id) REFERENCES mcp_oauth_clients(client_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS mcp_oauth_tokens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  access_token_hash TEXT NOT NULL UNIQUE,
  refresh_token_hash TEXT UNIQUE,
  client_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  scope TEXT NOT NULL,
  resource TEXT,
  access_expires_at INTEGER NOT NULL,
  refresh_expires_at INTEGER,
  revoked_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (client_id) REFERENCES mcp_oauth_clients(client_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_mcp_oauth_tokens_access ON mcp_oauth_tokens(access_token_hash);
CREATE INDEX IF NOT EXISTS idx_mcp_oauth_tokens_refresh ON mcp_oauth_tokens(refresh_token_hash);
