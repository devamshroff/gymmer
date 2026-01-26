// scripts/delete-empty-routines.ts
// Delete routines that have no exercises
import { getDatabase } from '../lib/database';

async function main() {
  console.log('Finding and deleting empty routines...\n');
  const db = getDatabase();

  try {
    // Find all routines
    const routinesResult = await db.execute('SELECT * FROM routines');

    for (const routine of routinesResult.rows) {
      const routineId = (routine as any).id;
      const routineName = (routine as any).name;

      // Check if routine has any exercises
      const exercisesResult = await db.execute({
        sql: 'SELECT COUNT(*) as count FROM routine_exercises WHERE routine_id = ?',
        args: [routineId]
      });

      const exerciseCount = (exercisesResult.rows[0] as any).count;

      if (exerciseCount === 0) {
        // Delete empty routine
        await db.execute({
          sql: 'DELETE FROM routines WHERE id = ?',
          args: [routineId]
        });
        console.log(`✓ Deleted empty routine: "${routineName}"`);
      } else {
        console.log(`  Kept routine: "${routineName}" (${exerciseCount} exercises)`);
      }
    }

    console.log('\n✅ Cleanup complete!');
  } catch (error) {
    console.error('Error during cleanup:', error);
    process.exit(1);
  } finally {
    await db.close();
    process.exit(0);
  }
}

main();
