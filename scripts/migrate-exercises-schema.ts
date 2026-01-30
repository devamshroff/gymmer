// scripts/migrate-exercises-schema.ts
// Migrate exercises table schema and backfill difficulty + muscle groups.
import fs from 'fs';
import path from 'path';
import { getDatabase } from '../lib/database';
import { generateExerciseInsights } from '../lib/form-tips';
import { MUSCLE_GROUP_TAGS, normalizeTypeList } from '../lib/muscle-tags';

const DEFAULT_DIFFICULTY = 'Intermediate';

type ExerciseRow = {
  id: number;
  name: string;
  muscle_groups: string | null;
  equipment: string | null;
  difficulty: string | null;
};

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  medium: 'Intermediate',
  advanced: 'Advanced',
};

function normalizeDifficulty(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const cleaned = value.trim().toLowerCase();
  if (!cleaned || cleaned === 'unknown') return null;
  return DIFFICULTY_LABELS[cleaned] || null;
}

function parseMuscleGroups(value: string | null): string[] | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value);
    const normalized = normalizeTypeList(parsed, MUSCLE_GROUP_TAGS);
    return normalized.length ? normalized : null;
  } catch {
    return null;
  }
}

function loadEnvFile(fileName: string) {
  const filePath = path.join(process.cwd(), fileName);
  if (!fs.existsSync(filePath)) return;
  const contents = fs.readFileSync(filePath, 'utf8');
  for (const line of contents.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

async function getTableColumns(db: ReturnType<typeof getDatabase>, tableName: string): Promise<Set<string>> {
  const result = await db.execute(`PRAGMA table_info(${tableName})`);
  const columns = new Set<string>();
  for (const row of result.rows as Array<{ name?: string }>) {
    if (row?.name) {
      columns.add(String(row.name));
    }
  }
  return columns;
}

async function rebuildExercisesTable(
  db: ReturnType<typeof getDatabase>,
  columns: Set<string>
): Promise<void> {
  const needsRebuild = columns.has('exercise_type') || columns.has('is_custom');
  if (!needsRebuild) return;

  let inTransaction = false;
  await db.execute('BEGIN');
  inTransaction = true;
  try {
    await db.execute('ALTER TABLE exercises RENAME TO exercises_old');
    await db.execute(`
      CREATE TABLE exercises (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        video_url TEXT,
        tips TEXT,
        muscle_groups TEXT,
        equipment TEXT,
        difficulty TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        is_bodyweight INTEGER DEFAULT 0
      )
    `);

    const selectSql = `
      SELECT
        id,
        name,
        ${columns.has('video_url') ? 'video_url' : 'NULL'} as video_url,
        ${columns.has('tips') ? 'tips' : 'NULL'} as tips,
        ${columns.has('muscle_groups') ? 'muscle_groups' : 'NULL'} as muscle_groups,
        ${columns.has('equipment') ? 'equipment' : 'NULL'} as equipment,
        ${columns.has('difficulty') ? 'difficulty' : 'NULL'} as difficulty,
        ${columns.has('created_at') ? 'created_at' : "datetime('now')"} as created_at,
        ${columns.has('is_bodyweight') ? 'is_bodyweight' : '0'} as is_bodyweight
      FROM exercises_old
    `;

    await db.execute(`
      INSERT INTO exercises (
        id,
        name,
        video_url,
        tips,
        muscle_groups,
        equipment,
        difficulty,
        created_at,
        is_bodyweight
      )
      ${selectSql}
    `);

    await db.execute('DROP TABLE exercises_old');
    await db.execute('CREATE UNIQUE INDEX IF NOT EXISTS idx_exercises_name ON exercises(name)');
    await db.execute('CREATE INDEX IF NOT EXISTS idx_exercises_muscle ON exercises(muscle_groups)');
    await db.execute('COMMIT');
    inTransaction = false;
  } catch (error) {
    if (inTransaction) {
      try {
        await db.execute('ROLLBACK');
      } catch (rollbackError) {
        console.warn('Rollback failed:', rollbackError);
      }
    }
    throw error;
  }
}

async function backfillExercises(db: ReturnType<typeof getDatabase>) {
  const result = await db.execute({
    sql: `
      SELECT id, name, muscle_groups, equipment, difficulty
      FROM exercises
      WHERE difficulty IS NULL OR difficulty = ''
         OR muscle_groups IS NULL OR muscle_groups = ''
    `
  });

  const rows: ExerciseRow[] = result.rows.map((row: any) => ({
    id: Number(row.id),
    name: String(row.name),
    muscle_groups: typeof row.muscle_groups === 'string' ? row.muscle_groups : null,
    equipment: typeof row.equipment === 'string' ? row.equipment : null,
    difficulty: typeof row.difficulty === 'string' ? row.difficulty : null,
  }));

  if (rows.length === 0) {
    return { total: 0, updated: 0 };
  }

  if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OPENAI_API_KEY for backfill.');
  }

  let updated = 0;

  for (const row of rows) {
    const existingMuscleGroups = parseMuscleGroups(row.muscle_groups);
    const existingDifficulty = normalizeDifficulty(row.difficulty);
    const needsMuscleGroups = !existingMuscleGroups || existingMuscleGroups.length === 0;
    const needsDifficulty = !existingDifficulty;

    if (!needsMuscleGroups && !needsDifficulty) {
      continue;
    }

    const insights = await generateExerciseInsights({
      kind: 'exercise',
      name: row.name,
      muscleGroups: existingMuscleGroups || undefined,
      equipment: row.equipment || undefined,
      difficulty: existingDifficulty || undefined,
    });

    const resolvedMuscleGroups = needsMuscleGroups
      ? (insights?.muscleGroups && insights.muscleGroups.length > 0
          ? insights.muscleGroups
          : ['unknown'])
      : existingMuscleGroups || ['unknown'];
    const resolvedDifficulty = needsDifficulty
      ? normalizeDifficulty(insights?.difficulty) || DEFAULT_DIFFICULTY
      : existingDifficulty || DEFAULT_DIFFICULTY;

    const updates: string[] = [];
    const args: Array<string | number | null> = [];

    if (needsMuscleGroups) {
      updates.push('muscle_groups = ?');
      args.push(JSON.stringify(resolvedMuscleGroups));
    }
    if (needsDifficulty) {
      updates.push('difficulty = ?');
      args.push(resolvedDifficulty);
    }

    if (updates.length === 0) {
      continue;
    }

    args.push(row.id);
    await db.execute({
      sql: `UPDATE exercises SET ${updates.join(', ')} WHERE id = ?`,
      args
    });
    updated += 1;
    console.log(`  ✓ Updated: ${row.name}`);
  }

  return { total: rows.length, updated };
}

async function main() {
  loadEnvFile('.env.local');
  loadEnvFile('.env');

  const db = getDatabase();

  try {
    const columns = await getTableColumns(db, 'exercises');
    await rebuildExercisesTable(db, columns);

    console.log('Backfilling exercise difficulty and muscle groups...');
    const stats = await backfillExercises(db);
    console.log(`\n✅ Backfill complete`);
    console.log(`Exercises missing: ${stats.total}, updated: ${stats.updated}`);
  } finally {
    await db.close();
  }
}

main().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
