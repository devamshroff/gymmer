// scripts/init-db.ts
// Simple script to initialize the database
import { getDatabase } from '../lib/database';

console.log('Initializing database...');
const db = getDatabase();
console.log('Database initialized successfully!');
console.log('Database path: data/gymmer.db');

// Test query
const tables = db.prepare(`
  SELECT name FROM sqlite_master WHERE type='table'
`).all();

console.log('\nTables created:');
tables.forEach((table: any) => {
  console.log(`  - ${table.name}`);
});

process.exit(0);
