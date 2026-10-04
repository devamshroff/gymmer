// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createClient, type Client } from '@libsql/client';
import { mkdtempSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

/**
 * These tests run against a real SQLite file rather than a mocked client: the
 * point is to prove the routines table rebuild keeps foreign-keyed child rows,
 * which a mock cannot show.
 */

// The routines DDL as it exists in production before the migration, including
// the legacy is_custom column and columns added later via ALTER TABLE.
const LEGACY_ROUTINES_DDL = `CREATE TABLE routines (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        is_custom INTEGER DEFAULT 1,
        source_file TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      , user_id TEXT REFERENCES users(id), is_public INTEGER DEFAULT 1, like_count INTEGER DEFAULT 0, clone_count INTEGER DEFAULT 0, order_index INTEGER DEFAULT 0)`;

let dir: string;
let raw: Client;
type DatabaseModule = typeof import('@/lib/database');
let database: DatabaseModule;

async function seedLegacyDatabase() {
  await raw.execute('PRAGMA foreign_keys = ON');
  await raw.execute('CREATE TABLE users (id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE)');
  await raw.execute('CREATE TABLE exercises (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE)');
  await raw.execute(LEGACY_ROUTINES_DDL);
  await raw.execute(`CREATE TABLE routine_exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    routine_id INTEGER NOT NULL,
    exercise_id1 INTEGER NOT NULL,
    exercise_id2 INTEGER,
    order_index INTEGER NOT NULL,
    FOREIGN KEY (routine_id) REFERENCES routines(id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id1) REFERENCES exercises(id) ON DELETE CASCADE
  )`);
  await raw.execute(`CREATE TABLE routine_cardio (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    routine_id INTEGER NOT NULL UNIQUE,
    cardio_type TEXT NOT NULL,
    duration TEXT NOT NULL,
    FOREIGN KEY (routine_id) REFERENCES routines(id) ON DELETE CASCADE
  )`);
  await raw.execute("INSERT INTO users (id, email) VALUES ('me@x.com', 'me@x.com'), ('friend@x.com', 'friend@x.com')");
  await raw.execute("INSERT INTO exercises (name) VALUES ('Bench Press'), ('Squat')");
  await raw.execute(
    "INSERT INTO routines (id, name, user_id, is_custom, order_index) VALUES (1, 'Push Day', 'me@x.com', 0, 3)"
  );
  await raw.execute(
    'INSERT INTO routine_exercises (routine_id, exercise_id1, order_index) VALUES (1, 1, 0), (1, 2, 1)'
  );
  await raw.execute("INSERT INTO routine_cardio (routine_id, cardio_type, duration) VALUES (1, 'Run', '10 min')");
}

beforeEach(async () => {
  dir = mkdtempSync(join(tmpdir(), 'gymmer-routine-scope-'));
  const url = `file:${join(dir, 'test.db')}`;
  raw = createClient({ url });
  vi.resetModules();
  vi.stubEnv('TURSO_DATABASE_URL', url);
  database = await import('@/lib/database');
});

afterEach(async () => {
  await database.closeDatabase();
  raw.close();
  vi.unstubAllEnvs();
  rmSync(dir, { recursive: true, force: true });
});

describe('ensureRoutineNamesScopedPerUser', () => {
  it('drops the global name UNIQUE without losing routine children', async () => {
    await seedLegacyDatabase();

    await database.ensureRoutineNamesScopedPerUser();

    const ddl = await raw.execute("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'routines'");
    expect(String(ddl.rows[0].sql)).not.toMatch(/name\s+TEXT\s+NOT\s+NULL\s+UNIQUE/i);

    const routine = await raw.execute('SELECT * FROM routines WHERE id = 1');
    expect(routine.rows[0]).toMatchObject({ name: 'Push Day', user_id: 'me@x.com', is_custom: 0, order_index: 3 });

    const exercises = await raw.execute('SELECT COUNT(*) AS c FROM routine_exercises WHERE routine_id = 1');
    expect(Number(exercises.rows[0].c)).toBe(2);
    const cardio = await raw.execute('SELECT COUNT(*) AS c FROM routine_cardio WHERE routine_id = 1');
    expect(Number(cardio.rows[0].c)).toBe(1);

    // Child foreign keys still point at the rebuilt table and still cascade.
    const fkCheck = await raw.execute('PRAGMA foreign_key_check');
    expect(fkCheck.rows).toHaveLength(0);
  });

  it('lets two users share a routine name but blocks duplicates for one user', async () => {
    await seedLegacyDatabase();

    const friendRoutineId = await database.createRoutine('Push Day', 'friend@x.com');
    expect(friendRoutineId).toBeGreaterThan(1);

    await expect(database.createRoutine('Push Day', 'me@x.com')).rejects.toThrow(/UNIQUE constraint failed/);
  });

  it('is a no-op on a database that is already migrated', async () => {
    await seedLegacyDatabase();
    await database.ensureRoutineNamesScopedPerUser();

    vi.resetModules();
    const fresh = await import('@/lib/database');
    await fresh.ensureRoutineNamesScopedPerUser();
    await fresh.closeDatabase();

    const exercises = await raw.execute('SELECT COUNT(*) AS c FROM routine_exercises WHERE routine_id = 1');
    expect(Number(exercises.rows[0].c)).toBe(2);
  });
});

describe('removeExerciseFromRoutine', () => {
  it('only deletes exercise rows that belong to the given routine', async () => {
    await seedLegacyDatabase();
    const friendRoutineId = await database.createRoutine('Leg Day', 'friend@x.com');
    await raw.execute({
      sql: 'INSERT INTO routine_exercises (routine_id, exercise_id1, order_index) VALUES (?, 2, 0)',
      args: [friendRoutineId],
    });
    const friendRow = await raw.execute({
      sql: 'SELECT id FROM routine_exercises WHERE routine_id = ?',
      args: [friendRoutineId],
    });
    const friendExerciseId = Number(friendRow.rows[0].id);

    // I own routine 1 but pass the id of an exercise row in my friend's routine.
    await database.removeExerciseFromRoutine(1, friendExerciseId);

    const stillThere = await raw.execute({
      sql: 'SELECT COUNT(*) AS c FROM routine_exercises WHERE id = ?',
      args: [friendExerciseId],
    });
    expect(Number(stillThere.rows[0].c)).toBe(1);

    await database.removeExerciseFromRoutine(friendRoutineId, friendExerciseId);
    const gone = await raw.execute({
      sql: 'SELECT COUNT(*) AS c FROM routine_exercises WHERE id = ?',
      args: [friendExerciseId],
    });
    expect(Number(gone.rows[0].c)).toBe(0);
  });
});
