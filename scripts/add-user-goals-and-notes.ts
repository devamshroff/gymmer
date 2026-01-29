// scripts/add-user-goals-and-notes.ts
// Add goals_text to users and notes/session_mode columns where needed.
import { getDatabase } from '../lib/database';

async function columnExists(table: string, column: string): Promise<boolean> {
  const db = getDatabase();
  const result = await db.execute({
    sql: `PRAGMA table_info(${table})`
  });
  return result.rows.some((row: any) => row.name === column);
}

async function main() {
  const db = getDatabase();

  const hasNotes = await columnExists('routines', 'notes');
  if (!hasNotes) {
    await db.execute('ALTER TABLE routines ADD COLUMN notes TEXT');
    console.log('✓ Added routines.notes');
  } else {
    console.log('⊘ routines.notes already exists');
  }

  const hasSessionMode = await columnExists('workout_sessions', 'session_mode');
  if (!hasSessionMode) {
    await db.execute('ALTER TABLE workout_sessions ADD COLUMN session_mode TEXT');
    console.log('✓ Added workout_sessions.session_mode');
  } else {
    console.log('⊘ workout_sessions.session_mode already exists');
  }

  const hasGoals = await columnExists('users', 'goals_text');
  if (!hasGoals) {
    await db.execute('ALTER TABLE users ADD COLUMN goals_text TEXT');
    console.log('✓ Added users.goals_text');
  } else {
    console.log('⊘ users.goals_text already exists');
  }

  await db.close();
}

main().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
