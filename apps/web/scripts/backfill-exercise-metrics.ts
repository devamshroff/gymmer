// scripts/backfill-exercise-metrics.ts
import { getDatabase } from '../lib/database';
import { EXERCISE_PRIMARY_METRICS } from '../lib/constants';
import { getDefaultMetricUnit } from '../lib/metric-utils';

const HEIGHT_EXERCISES = [
  'Box Jump',
  'Box Jumps',
  'Broad Jump',
  'Vertical Jump',
  'Depth Jump',
  'Hurdle Hop',
  'Hurdle Hops',
];

const TIME_EXERCISES = [
  'Dead Hang',
  'Dead Hangs',
  'Active Hang',
  'Plank',
  'Side Plank',
  'Wall Sit',
  'Hollow Hold',
  'L-Sit',
];

const REPS_ONLY_EXERCISES = [
  'Pull-up',
  'Pull-ups',
  'Push-up',
  'Push-ups',
  'Chin-up',
  'Chin-ups',
  'Dip',
  'Dips',
  'Air Squat',
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

function buildMetricMap(metric: string, names: string[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const name of names) {
    map.set(name.trim().toLowerCase(), metric);
  }
  return map;
}

async function main() {
  const db = getDatabase();
  try {
    await ensureExerciseColumns(db);

    const metricMap = new Map<string, string>([
      ...buildMetricMap(EXERCISE_PRIMARY_METRICS.height, HEIGHT_EXERCISES),
      ...buildMetricMap(EXERCISE_PRIMARY_METRICS.time, TIME_EXERCISES),
      ...buildMetricMap(EXERCISE_PRIMARY_METRICS.repsOnly, REPS_ONLY_EXERCISES),
    ]);

    const rows = await db.execute({
      sql: 'SELECT id, name, primary_metric, metric_unit FROM exercises',
    });

    let updated = 0;
    for (const row of rows.rows as any[]) {
      const name = typeof row.name === 'string' ? row.name : '';
      const key = name.trim().toLowerCase();
      const desiredMetric = metricMap.get(key);
      if (!desiredMetric) continue;

      const currentMetric = typeof row.primary_metric === 'string' ? row.primary_metric : null;
      if (currentMetric && currentMetric !== 'weight') {
        continue;
      }

      const nextUnit = typeof row.metric_unit === 'string' && row.metric_unit.trim().length > 0
        ? row.metric_unit
        : getDefaultMetricUnit(desiredMetric as any);

      await db.execute({
        sql: 'UPDATE exercises SET primary_metric = ?, metric_unit = ? WHERE id = ?',
        args: [desiredMetric, nextUnit, row.id],
      });
      updated += 1;
    }

    console.log(`Updated ${updated} exercises with primary metrics.`);
  } catch (error) {
    console.error('Backfill failed:', error);
    process.exit(1);
  } finally {
    await db.close();
    process.exit(0);
  }
}

main();
