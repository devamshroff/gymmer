// scripts/normalize-exercise-difficulty.ts
// Normalize difficulty labels and report missing exercise metadata.
import fs from 'fs';
import path from 'path';
import { getDatabase } from '../lib/database';

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

async function main() {
  loadEnvFile('.env.local');
  loadEnvFile('.env');

  const db = getDatabase();
  try {
    await db.execute({
      sql: `
        UPDATE exercises
        SET difficulty = 'Intermediate'
        WHERE difficulty IS NULL
           OR TRIM(difficulty) = ''
           OR LOWER(TRIM(difficulty)) IN ('medium', 'intermediate')
      `
    });

    const missingDifficulty = await db.execute({
      sql: `
        SELECT COUNT(*) AS count
        FROM exercises
        WHERE difficulty IS NULL OR TRIM(difficulty) = ''
      `
    });

    const missingMuscleGroups = await db.execute({
      sql: `
        SELECT COUNT(*) AS count
        FROM exercises
        WHERE muscle_groups IS NULL OR TRIM(muscle_groups) = ''
      `
    });

    const difficultyCount = Number(missingDifficulty.rows[0]?.count ?? 0);
    const muscleGroupsCount = Number(missingMuscleGroups.rows[0]?.count ?? 0);

    console.log('Difficulty normalization complete.');
    console.log(`Exercises missing difficulty: ${difficultyCount}`);
    console.log(`Exercises missing muscle groups: ${muscleGroupsCount}`);
  } finally {
    await db.close();
  }
}

main().catch((error) => {
  console.error('Normalization failed:', error);
  process.exit(1);
});
