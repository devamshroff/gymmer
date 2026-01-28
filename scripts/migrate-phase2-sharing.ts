// scripts/migrate-phase2-sharing.ts
import { getDatabase } from '../lib/database';

async function main() {
  console.log('Migrating to Phase 2 (Routine Sharing)...\n');
  const db = getDatabase();

  try {
    // Step 1: Add username column to users table (WITHOUT UNIQUE)
    console.log('Step 1: Adding username column to users table...');
    const usersInfo = await db.execute("PRAGMA table_info(users)");
    const hasUsername = usersInfo.rows.some((row: any) => row.name === 'username');

    if (!hasUsername) {
      await db.execute(`ALTER TABLE users ADD COLUMN username TEXT`);
      console.log('  ✓ Added username column to users');
    } else {
      console.log('  ⊘ username column already exists');
    }

    // Step 1b: Create unique index for username (instead of UNIQUE constraint)
    console.log('Step 1b: Creating unique index on username...');
    await db.execute(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username_unique 
      ON users(username)
      WHERE username IS NOT NULL
    `);
    console.log('  ✓ Unique index on username created');

    // Step 2: Add is_public column to routines table
    console.log('\nStep 2: Adding is_public column to routines table...');
    const routinesInfo = await db.execute("PRAGMA table_info(routines)");
    const hasIsPublic = routinesInfo.rows.some((row: any) => row.name === 'is_public');

    if (!hasIsPublic) {
      await db.execute(`ALTER TABLE routines ADD COLUMN is_public INTEGER DEFAULT 1`);
      console.log('  ✓ Added is_public column to routines (default: public)');

      await db.execute(`UPDATE routines SET is_public = 1 WHERE is_public IS NULL`);
      console.log('  ✓ Set all existing routines to public');
    } else {
      console.log('  ⊘ is_public column already exists');
    }

    // Step 3: Create routine_favorites table
    console.log('\nStep 3: Creating routine_favorites table...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS routine_favorites (
        user_id TEXT NOT NULL,
        routine_id INTEGER NOT NULL,
        created_at TEXT DEFAULT (datetime('now')),
        PRIMARY KEY (user_id, routine_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (routine_id) REFERENCES routines(id) ON DELETE CASCADE
      )
    `);
    console.log('  ✓ routine_favorites table created');

    // Step 4: Create indexes
    console.log('\nStep 4: Creating indexes...');
    await db.execute('CREATE INDEX IF NOT EXISTS idx_routines_public ON routines(is_public)');
    console.log('  ✓ Indexes created');

    // Step 5: Verify migration
    console.log('\nStep 5: Verifying migration...');

    const usersWithUsername = await db.execute(
      'SELECT COUNT(*) as count FROM users WHERE username IS NOT NULL'
    );
    console.log(`  ✓ Users with username: ${(usersWithUsername.rows[0] as any).count}`);

    const publicRoutines = await db.execute(
      'SELECT COUNT(*) as count FROM routines WHERE is_public = 1'
    );
    console.log(`  ✓ Public routines: ${(publicRoutines.rows[0] as any).count}`);

    console.log('\n✅ Phase 2 migration complete!');
    console.log('\nNext steps:');
    console.log('1. Users without usernames will be prompted to set one on next login');
    console.log('2. All existing routines are now public by default');
    console.log('3. Users can make routines private when creating/editing');

  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  } finally {
    await db.close();
    process.exit(0);
  }
}

main();
