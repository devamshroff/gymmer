// scripts/init-db.ts
// Simple script to test Turso database connection
import { getDatabase } from '../lib/database';

async function main() {
  console.log('Connecting to Turso database...');
  const db = getDatabase();
  console.log('Connected successfully!');

  // Test query
  const result = await db.execute(`
    SELECT name FROM sqlite_master WHERE type='table'
  `);

  console.log('\nTables in database:');
  result.rows.forEach((table: any) => {
    console.log(`  - ${table.name}`);
  });

  await db.close();
  process.exit(0);
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
