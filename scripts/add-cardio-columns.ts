// scripts/add-cardio-columns.ts
// Add speed and incline columns to workout_cardio_logs table
import { getDatabase } from '../lib/database';

async function main() {
  console.log('Adding speed and incline columns to workout_cardio_logs...\n');
  const db = getDatabase();

  try {
    // Check if columns already exist
    const tableInfo = await db.execute({
      sql: "PRAGMA table_info(workout_cardio_logs)",
      args: []
    });

    const columns = (tableInfo.rows as any[]).map(row => row.name);

    if (!columns.includes('speed')) {
      await db.execute({
        sql: 'ALTER TABLE workout_cardio_logs ADD COLUMN speed REAL',
        args: []
      });
      console.log('  ✓ Added speed column');
    } else {
      console.log('  ⊘ speed column already exists');
    }

    if (!columns.includes('incline')) {
      await db.execute({
        sql: 'ALTER TABLE workout_cardio_logs ADD COLUMN incline REAL',
        args: []
      });
      console.log('  ✓ Added incline column');
    } else {
      console.log('  ⊘ incline column already exists');
    }

    console.log('\n✅ Migration complete!');
  } catch (error) {
    console.error('Error running migration:', error);
    process.exit(1);
  }
}

main();
