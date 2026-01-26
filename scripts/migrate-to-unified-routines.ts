// scripts/migrate-to-unified-routines.ts
// Migrate custom_routines table to unified routines table
import { getDatabase } from '../lib/database';

async function main() {
  console.log('Migrating to unified routines table...\n');
  const db = getDatabase();

  try {
    // Step 1: Create new routines table
    console.log('Step 1: Creating new routines table...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS routines (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        is_custom INTEGER DEFAULT 1,
        source_file TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      )
    `);
    console.log('✓ Routines table created');

    // Step 2: Check if custom_routines exists and has data
    console.log('\nStep 2: Checking for existing custom_routines...');
    const tableCheck = await db.execute(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='custom_routines'"
    );

    if (tableCheck.rows.length > 0) {
      console.log('✓ Found custom_routines table');

      // Step 3: Migrate existing data
      console.log('\nStep 3: Migrating existing routines...');
      const existingRoutines = await db.execute('SELECT * FROM custom_routines');

      for (const routine of existingRoutines.rows) {
        await db.execute({
          sql: `INSERT OR IGNORE INTO routines (id, name, description, is_custom, created_at, updated_at)
                VALUES (?, ?, ?, 1, ?, ?)`,
          args: [
            routine.id,
            routine.name,
            null,
            routine.created_at,
            routine.updated_at
          ]
        });
        console.log(`  ✓ Migrated: ${routine.name}`);
      }

      console.log(`\n✓ Migrated ${existingRoutines.rows.length} routine(s)`);

      // Step 4: Update foreign keys by recreating junction tables
      console.log('\nStep 4: Updating foreign key references...');

      // Backup and recreate routine_pre_stretches
      await db.execute('ALTER TABLE routine_pre_stretches RENAME TO routine_pre_stretches_old');
      await db.execute(`
        CREATE TABLE routine_pre_stretches (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          routine_id INTEGER NOT NULL,
          stretch_id INTEGER NOT NULL,
          order_index INTEGER NOT NULL,
          FOREIGN KEY (routine_id) REFERENCES routines(id) ON DELETE CASCADE,
          FOREIGN KEY (stretch_id) REFERENCES stretches(id) ON DELETE CASCADE
        )
      `);
      await db.execute('INSERT INTO routine_pre_stretches SELECT * FROM routine_pre_stretches_old');
      await db.execute('DROP TABLE routine_pre_stretches_old');
      console.log('  ✓ Updated routine_pre_stretches');

      // Backup and recreate routine_exercises
      await db.execute('ALTER TABLE routine_exercises RENAME TO routine_exercises_old');
      await db.execute(`
        CREATE TABLE routine_exercises (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          routine_id INTEGER NOT NULL,
          exercise_id INTEGER NOT NULL,
          order_index INTEGER NOT NULL,
          exercise_type TEXT NOT NULL,
          sets INTEGER,
          target_reps INTEGER,
          target_weight REAL,
          warmup_weight REAL,
          rest_time INTEGER,
          b2b_partner_id INTEGER,
          b2b_sets INTEGER,
          b2b_target_reps INTEGER,
          b2b_target_weight REAL,
          b2b_warmup_weight REAL,
          FOREIGN KEY (routine_id) REFERENCES routines(id) ON DELETE CASCADE,
          FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE,
          FOREIGN KEY (b2b_partner_id) REFERENCES exercises(id) ON DELETE CASCADE
        )
      `);
      await db.execute('INSERT INTO routine_exercises SELECT * FROM routine_exercises_old');
      await db.execute('DROP TABLE routine_exercises_old');
      console.log('  ✓ Updated routine_exercises');

      // Backup and recreate routine_post_stretches
      await db.execute('ALTER TABLE routine_post_stretches RENAME TO routine_post_stretches_old');
      await db.execute(`
        CREATE TABLE routine_post_stretches (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          routine_id INTEGER NOT NULL,
          stretch_id INTEGER NOT NULL,
          order_index INTEGER NOT NULL,
          FOREIGN KEY (routine_id) REFERENCES routines(id) ON DELETE CASCADE,
          FOREIGN KEY (stretch_id) REFERENCES stretches(id) ON DELETE CASCADE
        )
      `);
      await db.execute('INSERT INTO routine_post_stretches SELECT * FROM routine_post_stretches_old');
      await db.execute('DROP TABLE routine_post_stretches_old');
      console.log('  ✓ Updated routine_post_stretches');

      // Backup and recreate routine_cardio
      await db.execute('ALTER TABLE routine_cardio RENAME TO routine_cardio_old');
      await db.execute(`
        CREATE TABLE routine_cardio (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          routine_id INTEGER NOT NULL UNIQUE,
          cardio_type TEXT NOT NULL,
          duration TEXT NOT NULL,
          intensity TEXT,
          tips TEXT,
          FOREIGN KEY (routine_id) REFERENCES routines(id) ON DELETE CASCADE
        )
      `);
      await db.execute('INSERT INTO routine_cardio SELECT * FROM routine_cardio_old');
      await db.execute('DROP TABLE routine_cardio_old');
      console.log('  ✓ Updated routine_cardio');

      // Step 5: Drop old custom_routines table
      console.log('\nStep 5: Cleaning up old table...');
      await db.execute('DROP TABLE custom_routines');
      console.log('✓ Dropped custom_routines table');
    } else {
      console.log('⊘ No custom_routines table found (fresh install)');
    }

    console.log('\n✅ Migration complete!');
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  } finally {
    await db.close();
    process.exit(0);
  }
}

main();
