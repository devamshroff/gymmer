import { createClient } from '@libsql/client';
import { readFileSync, mkdirSync, existsSync, rmSync } from 'fs';
import { join } from 'path';

async function setupDatabase() {
  const root = process.cwd();
  const dbDir = join(root, '.e2e');
  const dbPath = join(dbDir, 'gymmer.db');

  mkdirSync(dbDir, { recursive: true });
  if (existsSync(dbPath)) {
    rmSync(dbPath);
  }

  const db = createClient({ url: `file:${dbPath}` });

  const schemaPath = join(root, 'lib', 'db-schema.sql');
  const schema = readFileSync(schemaPath, 'utf-8');
  const statements = schema
    .split(';')
    .map((stmt) => stmt.trim())
    .filter((stmt) => stmt.length > 0);

  for (const statement of statements) {
    await db.execute(statement);
  }

  const users = [
    {
      id: 'e2e@test.local',
      email: 'e2e@test.local',
      username: 'e2e',
      name: 'E2E User',
    },
    {
      id: 'creator@test.local',
      email: 'creator@test.local',
      username: 'sai',
      name: 'Sai',
    },
  ];

  for (const user of users) {
    await db.execute({
      sql: `INSERT INTO users (id, email, username, name)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
              email = excluded.email,
              username = excluded.username,
              name = excluded.name`,
      args: [user.id, user.email, user.username, user.name],
    });
  }

  const exercises = [
    { name: 'Bench Press', equipment: 'Barbell' },
    { name: 'Push-up', equipment: 'Bodyweight' },
    { name: 'Dumbbell Row', equipment: 'Dumbbell' },
    { name: 'Plank', equipment: 'Bodyweight' },
    { name: 'Pull-up', equipment: 'Bodyweight' },
    { name: 'Squat', equipment: 'Barbell' },
  ];

  for (const exercise of exercises) {
    await db.execute({
      sql: `INSERT OR IGNORE INTO exercises (name, equipment, created_at)
            VALUES (?, ?, datetime('now'))`,
      args: [exercise.name, exercise.equipment],
    });
  }

  const stretches = [
    { name: 'Arm Circles', timerSeconds: 30 },
    { name: 'Chest Opener', timerSeconds: 30 },
    { name: 'Shoulder Stretch', timerSeconds: 45 },
    { name: 'Lat Stretch', timerSeconds: 45 },
  ];

  for (const stretch of stretches) {
    await db.execute({
      sql: `INSERT OR IGNORE INTO stretches (name, timer_seconds, created_at)
            VALUES (?, ?, datetime('now'))`,
      args: [stretch.name, stretch.timerSeconds],
    });
  }

  const exerciseRows = await db.execute({
    sql: 'SELECT id, name FROM exercises',
  });
  const exerciseMap = new Map<string, number>();
  const exerciseList = exerciseRows.rows as unknown as Array<{ id: number; name: string }>;
  for (const row of exerciseList) {
    exerciseMap.set(row.name, row.id);
  }
  const requireExerciseId = (name: string) => {
    const id = exerciseMap.get(name);
    if (!id) {
      throw new Error(`Missing exercise seed for ${name}`);
    }
    return id;
  };

  const routineResult = await db.execute({
    sql: `INSERT INTO routines (user_id, name, description, is_public)
          VALUES (?, ?, ?, ?)`,
    args: ['e2e@test.local', 'E2E Routine', 'Seeded routine for e2e.', 0],
  });
  const e2eRoutineId = Number(routineResult.lastInsertRowid);

  await db.execute({
    sql: `INSERT INTO routine_exercises (
            routine_id, exercise_id1, exercise_id2, order_index
          ) VALUES (?, ?, ?, ?)`,
    args: [
      e2eRoutineId,
      requireExerciseId('Bench Press'),
      null,
      0,
    ],
  });

  const publicRoutineResult = await db.execute({
    sql: `INSERT INTO routines (user_id, name, description, is_public)
          VALUES (?, ?, ?, ?)`,
    args: ['creator@test.local', 'Sais Routine', 'Public routine for clone.', 1],
  });
  const publicRoutineId = Number(publicRoutineResult.lastInsertRowid);

  await db.execute({
    sql: `INSERT INTO routine_exercises (
            routine_id, exercise_id1, exercise_id2, order_index
          ) VALUES (?, ?, ?, ?)`,
    args: [
      publicRoutineId,
      requireExerciseId('Pull-up'),
      null,
      0,
    ],
  });

  await db.close();
}

export default async function globalSetup() {
  await setupDatabase();
}
