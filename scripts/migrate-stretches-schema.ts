// scripts/migrate-stretches-schema.ts
// Migrate stretches table schema to timer_seconds-only fields.
import fs from 'fs';
import path from 'path';
import { getDatabase } from '../lib/database';
import { parseTimerSecondsFromText } from '../lib/stretch-utils';

type StretchRow = {
  id: number;
  name: string;
  video_url: string | null;
  tips: string | null;
  muscle_groups: string | null;
  timer_seconds: number | null;
  duration: string | null;
  created_at: string | null;
};

function loadEnvFile(fileName: string) {
  const filePath = path.join(process.cwd(), fileName);
  if (!fs.existsSync(filePath)) return;
  const contents = fs.readFileSync(filePath, 'utf8');
  for (const line of contents.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

async function getTableColumns(db: ReturnType<typeof getDatabase>, tableName: string): Promise<Set<string>> {
  const result = await db.execute(`PRAGMA table_info(${tableName})`);
  const columns = new Set<string>();
  for (const row of result.rows as Array<{ name?: string }>) {
    if (row?.name) {
      columns.add(String(row.name));
    }
  }
  return columns;
}

async function rebuildStretchesTable(db: ReturnType<typeof getDatabase>, columns: Set<string>): Promise<void> {
  const needsRebuild = ['duration', 'type', 'side_count', 'stretch_type'].some((column) => columns.has(column));
  if (!needsRebuild) {
    console.log('Stretches schema already up to date.');
    return;
  }

  const dbUrl = process.env.TURSO_DATABASE_URL || '';
  const useTransaction = dbUrl.startsWith('file:');
  if (useTransaction) {
    await db.execute('BEGIN');
  }
  try {
    await db.execute('ALTER TABLE stretches RENAME TO stretches_old');
    await db.execute(`
      CREATE TABLE stretches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        video_url TEXT,
        tips TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        muscle_groups TEXT,
        timer_seconds INTEGER DEFAULT 0
      )
    `);

    const rowsResult = await db.execute({
      sql: `
        SELECT
          id,
          name,
          ${columns.has('video_url') ? 'video_url' : 'NULL'} as video_url,
          ${columns.has('tips') ? 'tips' : 'NULL'} as tips,
          ${columns.has('muscle_groups') ? 'muscle_groups' : 'NULL'} as muscle_groups,
          ${columns.has('timer_seconds') ? 'timer_seconds' : 'NULL'} as timer_seconds,
          ${columns.has('duration') ? 'duration' : 'NULL'} as duration,
          ${columns.has('created_at') ? 'created_at' : "datetime('now')"} as created_at
        FROM stretches_old
      `
    });

    const rows = rowsResult.rows as unknown as StretchRow[];
    for (const row of rows) {
      const existingTimer = typeof row.timer_seconds === 'number' ? row.timer_seconds : 0;
      const parsedTimer = parseTimerSecondsFromText(row.duration);
      const resolvedTimer = existingTimer > 0 ? existingTimer : parsedTimer ?? 0;

      await db.execute({
        sql: `
          INSERT INTO stretches (
            id,
            name,
            video_url,
            tips,
            created_at,
            muscle_groups,
            timer_seconds
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          row.id,
          row.name,
          row.video_url || null,
          row.tips || null,
          row.created_at || null,
          row.muscle_groups || null,
          resolvedTimer
        ]
      });
    }

    await db.execute('DROP TABLE stretches_old');
    if (useTransaction) {
      await db.execute('COMMIT');
    }
    console.log('Stretches schema migration complete.');
  } catch (error) {
    if (useTransaction) {
      try {
        await db.execute('ROLLBACK');
      } catch (rollbackError) {
        console.warn('Rollback failed:', rollbackError);
      }
    }
    throw error;
  }
}

async function main() {
  loadEnvFile('.env.local');
  loadEnvFile('.env');

  const db = getDatabase();
  try {
    const columns = await getTableColumns(db, 'stretches');
    await rebuildStretchesTable(db, columns);
  } finally {
    await db.close();
  }
}

main().catch((error) => {
  console.error('Stretches migration failed:', error);
  process.exit(1);
});
