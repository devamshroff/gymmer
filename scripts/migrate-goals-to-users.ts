import { getDatabase, closeDatabase } from '../lib/database';

async function ensureGoalsColumn() {
  const db = getDatabase();
  const columns = await db.execute({ sql: 'PRAGMA table_info(users)' });
  const hasGoals = columns.rows.some((row: any) => row.name === 'goals_text');
  if (!hasGoals) {
    await db.execute({ sql: 'ALTER TABLE users ADD COLUMN goals_text TEXT' });
  }
}

async function migrateGoals() {
  const db = getDatabase();
  const tableCheck = await db.execute({
    sql: "SELECT name FROM sqlite_master WHERE type='table' AND name='user_goals'"
  });
  if (tableCheck.rows.length === 0) {
    return;
  }

  await db.execute({
    sql: `
      UPDATE users
      SET goals_text = (
        SELECT goals_text FROM user_goals ug WHERE ug.user_id = users.id
      )
      WHERE EXISTS (
        SELECT 1 FROM user_goals ug WHERE ug.user_id = users.id
      )
    `
  });

  await db.execute({ sql: 'DROP TABLE IF EXISTS user_goals' });
}

async function main() {
  try {
    await ensureGoalsColumn();
    await migrateGoals();
    console.log('Goals migration complete.');
  } catch (error) {
    console.error('Goals migration failed:', error);
    process.exitCode = 1;
  } finally {
    await closeDatabase();
  }
}

main();
