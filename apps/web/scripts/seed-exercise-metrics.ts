// scripts/seed-exercise-metrics.ts
import { getDatabase } from '../lib/database';
import { EXERCISE_PRIMARY_METRICS } from '../lib/constants';
import { getDefaultMetricUnit } from '../lib/metric-utils';

const EXERCISES: Array<{
  name: string;
  equipment: string;
  primaryMetric: string;
}> = [
  { name: 'Box Jump', equipment: 'Bodyweight', primaryMetric: EXERCISE_PRIMARY_METRICS.height },
  { name: 'Broad Jump', equipment: 'Bodyweight', primaryMetric: EXERCISE_PRIMARY_METRICS.height },
  { name: 'Vertical Jump', equipment: 'Bodyweight', primaryMetric: EXERCISE_PRIMARY_METRICS.height },
  { name: 'Depth Jump', equipment: 'Bodyweight', primaryMetric: EXERCISE_PRIMARY_METRICS.height },
  { name: 'Hurdle Hop', equipment: 'Bodyweight', primaryMetric: EXERCISE_PRIMARY_METRICS.height },
  { name: 'Dead Hang', equipment: 'Bodyweight', primaryMetric: EXERCISE_PRIMARY_METRICS.time },
  { name: 'Active Hang', equipment: 'Bodyweight', primaryMetric: EXERCISE_PRIMARY_METRICS.time },
  { name: 'Plank', equipment: 'Bodyweight', primaryMetric: EXERCISE_PRIMARY_METRICS.time },
  { name: 'Side Plank', equipment: 'Bodyweight', primaryMetric: EXERCISE_PRIMARY_METRICS.time },
  { name: 'Wall Sit', equipment: 'Bodyweight', primaryMetric: EXERCISE_PRIMARY_METRICS.time },
  { name: 'Hollow Hold', equipment: 'Bodyweight', primaryMetric: EXERCISE_PRIMARY_METRICS.time },
  { name: 'L-Sit', equipment: 'Bodyweight', primaryMetric: EXERCISE_PRIMARY_METRICS.time },
  { name: 'Single-Leg Balance', equipment: 'Bodyweight', primaryMetric: EXERCISE_PRIMARY_METRICS.time },
  { name: 'Single Leg Balance', equipment: 'Bodyweight', primaryMetric: EXERCISE_PRIMARY_METRICS.time },
];

async function ensureExerciseColumns(db: ReturnType<typeof getDatabase>) {
  const columns = await db.execute({ sql: 'PRAGMA table_info(exercises)' });
  const names = new Set(columns.rows.map((row: any) => row.name));
  if (!names.has('primary_metric')) {
    await db.execute("ALTER TABLE exercises ADD COLUMN primary_metric TEXT DEFAULT 'weight'");
  }
  if (!names.has('metric_unit')) {
    await db.execute('ALTER TABLE exercises ADD COLUMN metric_unit TEXT');
  }
}

async function main() {
  const db = getDatabase();
  try {
    await ensureExerciseColumns(db);

    let inserted = 0;
    for (const exercise of EXERCISES) {
      const metricUnit = getDefaultMetricUnit(exercise.primaryMetric as any);
      await db.execute({
        sql: `INSERT OR IGNORE INTO exercises (name, equipment, is_bodyweight, primary_metric, metric_unit)
              VALUES (?, ?, 1, ?, ?)`
      ,
        args: [exercise.name, exercise.equipment, exercise.primaryMetric, metricUnit],
      });
      inserted += 1;
    }

    console.log(`Seeded ${inserted} exercises (no duplicates inserted).`);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  } finally {
    await db.close();
    process.exit(0);
  }
}

main();
