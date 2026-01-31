// scripts/backfill-form-tips.ts
import { getDatabase } from '../lib/database';
import { generateExerciseInsights, generateStretchInsights } from '../lib/form-tips';

type ExerciseRow = {
  id: number;
  name: string;
  tips: string | null;
  muscle_groups: string | null;
  equipment: string | null;
  difficulty: string | null;
};

type StretchRow = {
  id: number;
  name: string;
  tips: string | null;
  muscle_groups: string | null;
  timer_seconds: number | null;
};

type BackfillOptions = {
  dryRun: boolean;
  limit: number | null;
};

function parseJsonArray(value: unknown): string[] {
  if (typeof value !== 'string' || value.trim().length === 0) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => typeof item === 'string' && item.trim().length > 0);
  } catch {
    return [];
  }
}

function normalizeTips(value: string | null | undefined): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function parseLimit(args: string[]): number | null {
  const limitArg = args.find((arg) => arg.startsWith('--limit='));
  if (!limitArg) return null;
  const raw = Number(limitArg.split('=')[1]);
  if (!Number.isFinite(raw) || raw <= 0) return null;
  return Math.floor(raw);
}

async function backfillExercises(db: ReturnType<typeof getDatabase>, options: BackfillOptions) {
  const limitClause = options.limit ? ` LIMIT ${options.limit}` : '';
  const result = await db.execute({
    sql: `
      SELECT id, name, tips, muscle_groups, equipment, difficulty
      FROM exercises
      WHERE tips IS NULL OR TRIM(tips) = ''
      ORDER BY name${limitClause}
    `,
  });
  const rows = result.rows as any as ExerciseRow[];
  let updated = 0;
  for (const row of rows) {
    const insights = await generateExerciseInsights({
      kind: 'exercise',
      name: row.name,
      muscleGroups: parseJsonArray(row.muscle_groups),
      equipment: row.equipment || undefined,
      difficulty: row.difficulty || undefined,
    });
    const tips = normalizeTips(insights?.tips);
    if (!tips) {
      console.warn(`[exercise] ${row.name}: no tips generated`);
      continue;
    }
    if (!options.dryRun) {
      await db.execute({
        sql: 'UPDATE exercises SET tips = ? WHERE id = ?',
        args: [tips, row.id],
      });
    }
    updated += 1;
    console.info(`[exercise] ${row.name}: ${options.dryRun ? 'would update' : 'updated'}`);
  }
  console.info(`Exercises updated: ${updated}/${rows.length}`);
}

async function backfillStretches(db: ReturnType<typeof getDatabase>, options: BackfillOptions) {
  const limitClause = options.limit ? ` LIMIT ${options.limit}` : '';
  const result = await db.execute({
    sql: `
      SELECT id, name, tips, muscle_groups, timer_seconds
      FROM stretches
      WHERE tips IS NULL OR TRIM(tips) = ''
      ORDER BY name${limitClause}
    `,
  });
  const rows = result.rows as any as StretchRow[];
  let updated = 0;
  for (const row of rows) {
    const timerSeconds = Number.isFinite(Number(row.timer_seconds)) && Number(row.timer_seconds) > 0
      ? Math.round(Number(row.timer_seconds))
      : undefined;
    const insights = await generateStretchInsights({
      kind: 'stretch',
      name: row.name,
      timerSeconds,
      muscleGroups: parseJsonArray(row.muscle_groups),
    });
    const tips = normalizeTips(insights?.tips);
    if (!tips) {
      console.warn(`[stretch] ${row.name}: no tips generated`);
      continue;
    }
    if (!options.dryRun) {
      await db.execute({
        sql: 'UPDATE stretches SET tips = ? WHERE id = ?',
        args: [tips, row.id],
      });
    }
    updated += 1;
    console.info(`[stretch] ${row.name}: ${options.dryRun ? 'would update' : 'updated'}`);
  }
  console.info(`Stretches updated: ${updated}/${rows.length}`);
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error('Missing OPENAI_API_KEY');
    process.exit(1);
  }

  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const onlyExercises = args.includes('--exercises');
  const onlyStretches = args.includes('--stretches');
  const limit = parseLimit(args);
  const options = { dryRun, limit };

  const db = getDatabase();
  try {
    if (!onlyStretches) {
      await backfillExercises(db, options);
    }
    if (!onlyExercises) {
      await backfillStretches(db, options);
    }
  } catch (error) {
    console.error('Backfill failed:', error);
    process.exitCode = 1;
  } finally {
    await db.close();
  }
}

main();
