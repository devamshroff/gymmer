// scripts/backfill-form-tips.ts
// Fill missing exercise/stretch tips using the LLM helper.
import fs from 'fs';
import path from 'path';
import { getDatabase } from '../lib/database';
import { generateFormTips } from '../lib/form-tips';

type ExerciseRow = {
  id: number;
  name: string;
  muscle_groups: string | null;
  equipment: string | null;
  difficulty: string | null;
};

type StretchRow = {
  id: number;
  name: string;
  duration: string;
  type: string;
  muscle_groups: string | null;
};

function toNullableString(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  return String(value);
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

function parseMuscleGroups(value: string | null): string[] | undefined {
  if (!value) return undefined;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

async function backfillExercises(db: ReturnType<typeof getDatabase>) {
  const result = await db.execute({
    sql: `
      SELECT id, name, muscle_groups, equipment, difficulty
      FROM exercises
      WHERE tips IS NULL OR tips = ''
    `
  });
  const rows: ExerciseRow[] = result.rows.map((row) => ({
    id: Number(row.id),
    name: String(row.name),
    muscle_groups: toNullableString(row.muscle_groups),
    equipment: toNullableString(row.equipment),
    difficulty: toNullableString(row.difficulty),
  }));
  let updated = 0;

  for (const row of rows) {
    const tips = await generateFormTips({
      kind: 'exercise',
      name: row.name,
      muscleGroups: parseMuscleGroups(row.muscle_groups),
      equipment: row.equipment || undefined,
      difficulty: row.difficulty || undefined,
    });
    if (!tips) {
      console.log(`  ⊘ Skipped exercise (no tips): ${row.name}`);
      continue;
    }

    await db.execute({
      sql: 'UPDATE exercises SET tips = ? WHERE id = ?',
      args: [tips, row.id]
    });
    console.log(`  ✓ Updated exercise: ${row.name}`);
    updated += 1;
  }

  return { total: rows.length, updated };
}

async function backfillStretches(db: ReturnType<typeof getDatabase>) {
  const result = await db.execute({
    sql: `
      SELECT id, name, duration, type, muscle_groups
      FROM stretches
      WHERE tips IS NULL OR tips = ''
    `
  });
  const rows: StretchRow[] = result.rows.map((row) => ({
    id: Number(row.id),
    name: String(row.name),
    duration: String(row.duration),
    type: String(row.type),
    muscle_groups: toNullableString(row.muscle_groups),
  }));
  let updated = 0;

  for (const row of rows) {
    const tips = await generateFormTips({
      kind: 'stretch',
      name: row.name,
      duration: row.duration,
      stretchType: row.type,
      muscleGroups: parseMuscleGroups(row.muscle_groups),
    });
    if (!tips) {
      console.log(`  ⊘ Skipped stretch (no tips): ${row.name}`);
      continue;
    }

    await db.execute({
      sql: 'UPDATE stretches SET tips = ? WHERE id = ?',
      args: [tips, row.id]
    });
    console.log(`  ✓ Updated stretch: ${row.name}`);
    updated += 1;
  }

  return { total: rows.length, updated };
}

async function main() {
  loadEnvFile('.env.local');
  loadEnvFile('.env');

  if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OPENAI_API_KEY');
  }

  console.log('Backfilling missing form tips...');
  const db = getDatabase();

  const exerciseStats = await backfillExercises(db);
  const stretchStats = await backfillStretches(db);

  console.log('\n✅ Backfill complete');
  console.log(`Exercises missing: ${exerciseStats.total}, updated: ${exerciseStats.updated}`);
  console.log(`Stretches missing: ${stretchStats.total}, updated: ${stretchStats.updated}`);

  await db.close();
}

main().catch((error) => {
  console.error('Backfill failed:', error);
  process.exit(1);
});
