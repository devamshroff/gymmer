// One-off: scope routine names per user on an existing database (ADR 0005).
// The app also runs this lazily before routine writes; this script lets you run
// it deliberately and verify that no routine child rows were lost.
//
// Usage (from apps/web): bun --env-file=.env.local scripts/migrate-routine-names-per-user.ts

import { closeDatabase, ensureRoutineNamesScopedPerUser, getDatabase } from '../lib/database';

const CHILD_TABLES = [
  'routines',
  'routine_exercises',
  'routine_pre_stretches',
  'routine_post_stretches',
  'routine_cardio',
  'routine_favorites',
];

async function countRows(): Promise<Record<string, number>> {
  const db = getDatabase();
  const counts: Record<string, number> = {};
  for (const table of CHILD_TABLES) {
    const result = await db.execute(`SELECT COUNT(*) AS c FROM ${table}`);
    counts[table] = Number(result.rows[0].c);
  }
  return counts;
}

async function main() {
  const db = getDatabase();
  const before = await countRows();
  console.log('before:', before);

  await ensureRoutineNamesScopedPerUser();

  const after = await countRows();
  console.log('after: ', after);

  const ddl = String(
    (await db.execute("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'routines'")).rows[0].sql
  );
  const checks = {
    globalUniqueRemoved: !/name\s+TEXT\s+NOT\s+NULL\s+UNIQUE/i.test(ddl),
    perUserIndexExists:
      (await db.execute("SELECT 1 FROM sqlite_master WHERE name = 'idx_routines_user_name'")).rows.length === 1,
    noForeignKeyViolations: (await db.execute('PRAGMA foreign_key_check')).rows.length === 0,
    rowCountsUnchanged: JSON.stringify(before) === JSON.stringify(after),
  };
  console.log(checks);

  await closeDatabase();
  if (Object.values(checks).some((ok) => !ok)) {
    console.error('Migration check FAILED. Restore from your backup before deploying.');
    process.exit(1);
  }
  console.log('Migration OK.');
}

main().catch(async (error) => {
  console.error(error);
  await closeDatabase();
  process.exit(1);
});
