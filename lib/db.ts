// lib/db.ts
import { Database } from 'bun:sqlite';
import path from 'path';

// Database file path
const dbPath = path.join(process.cwd(), 'data', 'gym-tracker.db');

// Create and export database instance
export const db = new Database(dbPath);

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Export a function to close the database (useful for cleanup)
export function closeDb() {
  db.close();
}
