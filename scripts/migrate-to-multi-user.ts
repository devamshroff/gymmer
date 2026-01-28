// scripts/migrate-to-multi-user.ts
// Migrate database to support multiple users
import { getDatabase } from '../lib/database';

// User assignments - routine name (case insensitive) -> user email
const ROUTINE_ASSIGNMENTS: Record<string, string> = {
  'yg400 abs': 'yagnyapatel@gmail.com',
  'sai test': 'saiakaash@gmail.com',
};

// Default user for routines not in ROUTINE_ASSIGNMENTS
const DEFAULT_USER_EMAIL = 'dev.shroff12@gmail.com';

// All users to create
const USERS = [
  { email: 'dev.shroff12@gmail.com', name: 'Dev Shroff' },
  { email: 'shroffdevam@gmail.com', name: 'Devam' },
  { email: 'yagnyapatel@gmail.com', name: 'Yagnya' },
  { email: 'saiakaash@gmail.com', name: 'Sai' },
  { email: 'shreeya423@gmail.com', name: 'Shreeya' },
  { email: 'shubhamshroff9892@gmail.com', name: 'Shubham' },
  { email: 'radhika.gathwala@gmail.com', name: 'Radhika' },
];

async function main() {
  console.log('Migrating to multi-user database...\n');
  const db = getDatabase();

  try {
    // Step 1: Create users table
    console.log('Step 1: Creating users table...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        name TEXT,
        image TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      )
    `);
    console.log('  ✓ Users table created');

    // Step 2: Create all users
    console.log('\nStep 2: Creating users...');
    for (const user of USERS) {
      await db.execute({
        sql: `INSERT OR IGNORE INTO users (id, email, name) VALUES (?, ?, ?)`,
        args: [user.email, user.email, user.name]
      });
      console.log(`  ✓ User: ${user.email}`);
    }

    // Step 3: Add user_id to routines table
    console.log('\nStep 3: Adding user_id to routines table...');

    const routinesInfo = await db.execute("PRAGMA table_info(routines)");
    const hasUserIdInRoutines = routinesInfo.rows.some((row: any) => row.name === 'user_id');

    if (!hasUserIdInRoutines) {
      await db.execute(`ALTER TABLE routines ADD COLUMN user_id TEXT REFERENCES users(id)`);
      console.log('  ✓ Added user_id column to routines');
    } else {
      console.log('  ⊘ user_id column already exists in routines');
    }

    // Step 4: Assign routines to users based on name
    console.log('\nStep 4: Assigning routines to users...');

    const allRoutines = await db.execute('SELECT id, name FROM routines');
    for (const routine of allRoutines.rows) {
      const routineName = (routine as any).name;
      const routineId = (routine as any).id;
      const routineNameLower = routineName.toLowerCase();

      // Check if this routine has a specific assignment
      let assignedUser = DEFAULT_USER_EMAIL;
      for (const [pattern, email] of Object.entries(ROUTINE_ASSIGNMENTS)) {
        if (routineNameLower === pattern.toLowerCase()) {
          assignedUser = email;
          break;
        }
      }

      await db.execute({
        sql: `UPDATE routines SET user_id = ? WHERE id = ?`,
        args: [assignedUser, routineId]
      });
      console.log(`  ✓ "${routineName}" -> ${assignedUser}`);
    }

    // Step 5: Add user_id to workout_sessions table
    console.log('\nStep 5: Adding user_id to workout_sessions table...');

    const sessionsInfo = await db.execute("PRAGMA table_info(workout_sessions)");
    const hasUserIdInSessions = sessionsInfo.rows.some((row: any) => row.name === 'user_id');

    if (!hasUserIdInSessions) {
      await db.execute(`ALTER TABLE workout_sessions ADD COLUMN user_id TEXT REFERENCES users(id)`);
      console.log('  ✓ Added user_id column to workout_sessions');
    } else {
      console.log('  ⊘ user_id column already exists in workout_sessions');
    }

    // Step 6: Assign workout sessions based on routine assignments
    console.log('\nStep 6: Assigning workout sessions to users...');

    const allSessions = await db.execute('SELECT id, workout_plan_name FROM workout_sessions');
    for (const session of allSessions.rows) {
      const workoutName = (session as any).workout_plan_name;
      const sessionId = (session as any).id;
      const workoutNameLower = workoutName.toLowerCase();

      // Check if this workout has a specific assignment
      let assignedUser = DEFAULT_USER_EMAIL;
      for (const [pattern, email] of Object.entries(ROUTINE_ASSIGNMENTS)) {
        if (workoutNameLower === pattern.toLowerCase()) {
          assignedUser = email;
          break;
        }
      }

      await db.execute({
        sql: `UPDATE workout_sessions SET user_id = ? WHERE id = ?`,
        args: [assignedUser, sessionId]
      });
    }
    console.log(`  ✓ Assigned ${allSessions.rows.length} workout sessions`);

    // Step 7: Create indexes for user_id
    console.log('\nStep 7: Creating indexes...');
    await db.execute('CREATE INDEX IF NOT EXISTS idx_routines_user ON routines(user_id)');
    await db.execute('CREATE INDEX IF NOT EXISTS idx_sessions_user ON workout_sessions(user_id)');
    console.log('  ✓ Indexes created');

    // Step 8: Verify migration
    console.log('\nStep 8: Verifying migration...');

    const userCount = await db.execute('SELECT COUNT(*) as count FROM users');
    console.log(`  ✓ Users: ${(userCount.rows[0] as any).count}`);

    const routineCount = await db.execute('SELECT COUNT(*) as count FROM routines WHERE user_id IS NOT NULL');
    console.log(`  ✓ Routines with user_id: ${(routineCount.rows[0] as any).count}`);

    const sessionCount = await db.execute('SELECT COUNT(*) as count FROM workout_sessions WHERE user_id IS NOT NULL');
    console.log(`  ✓ Workout sessions with user_id: ${(sessionCount.rows[0] as any).count}`);

    // Show routine assignments
    console.log('\nRoutine assignments:');
    const routineUsers = await db.execute(`
      SELECT r.name, r.user_id, u.name as user_name
      FROM routines r
      LEFT JOIN users u ON r.user_id = u.id
    `);
    for (const row of routineUsers.rows) {
      console.log(`  • "${(row as any).name}" -> ${(row as any).user_name || (row as any).user_id}`);
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
