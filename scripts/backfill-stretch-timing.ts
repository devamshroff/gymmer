// scripts/backfill-stretch-timing.ts
// Use the LLM to assign timer seconds and side counts for stretches.
import { getDatabase } from '../lib/database';

const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const BATCH_SIZE = 40;

type StretchRow = {
  id: number;
  name: string;
  duration: string | null;
  type: string | null;
  timer_seconds: number | null;
  side_count: number | null;
};

type LlmResponse = {
  items: Array<{ id: number; timerSeconds: number; sideCount: number }>;
};

function extractJson(content: string): string {
  const fencedMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fencedMatch?.[1]) {
    return fencedMatch[1];
  }
  return content;
}

function chunk<T>(items: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size));
  }
  return result;
}

function buildPrompt(rows: StretchRow[]): string {
  const lines = rows.map((row) => {
    const duration = row.duration ? row.duration : 'Unknown';
    const type = row.type ? row.type : 'Unknown';
    return `${row.id}: ${row.name} | type: ${type} | duration: ${duration}`;
  });
  return [
    'Assign timer seconds and side count for each stretch.',
    'Return JSON only in this format: {"items":[{"id":1,"timerSeconds":30,"sideCount":2}]}',
    'timerSeconds is the hold time per side in seconds (integer).',
    'sideCount must be 1 (single stretch) or 2 (each side).',
    'Use the duration text as a guide when available.',
    'Items:',
    ...lines,
  ].join('\n');
}

async function columnExists(table: string, column: string): Promise<boolean> {
  const db = getDatabase();
  const result = await db.execute({ sql: `PRAGMA table_info(${table})` });
  return result.rows.some((row: any) => row.name === column);
}

async function ensureSideCountColumn(): Promise<void> {
  const db = getDatabase();
  const hasColumn = await columnExists('stretches', 'side_count');
  if (hasColumn) return;
  await db.execute('ALTER TABLE stretches ADD COLUMN side_count INTEGER DEFAULT 1');
  console.log('✓ Added stretches.side_count');
}

async function ensureTimerSecondsColumn(): Promise<void> {
  const db = getDatabase();
  const hasColumn = await columnExists('stretches', 'timer_seconds');
  if (hasColumn) return;
  await db.execute('ALTER TABLE stretches ADD COLUMN timer_seconds INTEGER DEFAULT 0');
  console.log('✓ Added stretches.timer_seconds');
}

async function classifyBatch(rows: StretchRow[]): Promise<Map<number, { timerSeconds: number; sideCount: number }>> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are a gym coach. Return only JSON. No markdown.',
        },
        {
          role: 'user',
          content: buildPrompt(rows),
        },
      ],
      temperature: 0.2,
      max_tokens: 800,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI request failed: ${errorText}`);
  }

  const payload = await response.json();
  const content = payload.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error('OpenAI response was empty.');
  }

  const parsed = JSON.parse(extractJson(content)) as LlmResponse;
  const map = new Map<number, { timerSeconds: number; sideCount: number }>();
  if (Array.isArray(parsed.items)) {
    for (const item of parsed.items) {
      const timerSeconds = Number(item?.timerSeconds);
      const sideCount = Number(item?.sideCount);
      if (typeof item?.id === 'number' && Number.isFinite(timerSeconds) && timerSeconds > 0 && (sideCount === 1 || sideCount === 2)) {
        map.set(item.id, { timerSeconds: Math.round(timerSeconds), sideCount });
      }
    }
  }
  return map;
}

function needsTimer(row: StretchRow): boolean {
  return !row.timer_seconds || row.timer_seconds <= 0;
}

function needsSideCount(row: StretchRow): boolean {
  return row.side_count !== 1 && row.side_count !== 2;
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OPENAI_API_KEY');
  }

  await ensureTimerSecondsColumn();
  await ensureSideCountColumn();
  const db = getDatabase();

  const result = await db.execute({
    sql: 'SELECT id, name, duration, type, timer_seconds, side_count FROM stretches ORDER BY name',
  });
  const rows = result.rows as unknown as StretchRow[];
  const targets = rows.filter((row) => needsTimer(row) || needsSideCount(row));
  if (targets.length === 0) {
    console.log('All stretches already have timer seconds and side counts.');
    await db.close();
    return;
  }

  const batches = chunk(targets, BATCH_SIZE);
  let updatedCount = 0;

  for (let i = 0; i < batches.length; i += 1) {
    const batch = batches[i];
    console.log(`Classifying batch ${i + 1}/${batches.length}...`);
    const classifications = await classifyBatch(batch);
    for (const row of batch) {
      const suggestion = classifications.get(row.id);
      if (!suggestion) continue;
      const timerSeconds = needsTimer(row) ? suggestion.timerSeconds : row.timer_seconds;
      const sideCount = needsSideCount(row) ? suggestion.sideCount : row.side_count;
      if (!timerSeconds || (sideCount !== 1 && sideCount !== 2)) continue;
      await db.execute({
        sql: 'UPDATE stretches SET timer_seconds = ?, side_count = ? WHERE id = ?',
        args: [timerSeconds, sideCount, row.id],
      });
      updatedCount += 1;
    }
  }

  console.log(`✓ Updated ${updatedCount} stretches`);
  await db.close();
}

main().catch((error) => {
  console.error('Backfill failed:', error);
  process.exit(1);
});
