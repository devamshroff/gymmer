// scripts/init-routine-builder.ts
// Initialize routine builder database tables
import { getDatabase } from '../lib/database';
import { readFileSync } from 'fs';
import { join } from 'path';

async function main() {
  console.log('Initializing routine builder tables...');
  const db = getDatabase();

  try {
    // Read and execute schema
    const schemaPath = join(__dirname, '../lib/db-schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');

    // Split by semicolon and execute each statement
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (const statement of statements) {
      await db.execute(statement);
    }

    console.log('✓ Tables created successfully!');

    // Verify tables exist
    const result = await db.execute(`
      SELECT name FROM sqlite_master
      WHERE type='table'
      AND name IN ('exercises', 'custom_routines', 'stretches', 'routine_exercises', 'routine_pre_stretches', 'routine_post_stretches', 'routine_cardio')
      ORDER BY name
    `);

    console.log('\nRoutine builder tables:');
    result.rows.forEach((table: any) => {
      console.log(`  ✓ ${table.name}`);
    });

    if (result.rows.length === 7) {
      console.log('\n✅ All 7 routine builder tables created successfully!');
    } else {
      console.log(`\n⚠️  Expected 7 tables, found ${result.rows.length}`);
    }

  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  } finally {
    await db.close();
    process.exit(0);
  }
}

main();
