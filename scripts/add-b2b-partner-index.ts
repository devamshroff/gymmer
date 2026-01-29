import { getDatabase, closeDatabase } from '../lib/database';

async function addIndex() {
  const db = getDatabase();
  await db.execute({
    sql: 'CREATE INDEX IF NOT EXISTS idx_exercise_logs_partner_name ON workout_exercise_logs(b2b_partner_name)'
  });
}

async function main() {
  try {
    await addIndex();
    console.log('Index idx_exercise_logs_partner_name is ensured.');
  } catch (error) {
    console.error('Failed to add index:', error);
    process.exitCode = 1;
  } finally {
    await closeDatabase();
  }
}

main();
