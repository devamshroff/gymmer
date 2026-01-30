// scripts/backfill-bodyweight.ts
// Use the LLM to classify exercises as bodyweight and update the DB.
import { getDatabase } from '../lib/database';

const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const BATCH_SIZE = 50;

type ExerciseRow = {
  id: number;
  name: string;
  equipment: string | null;
};

type LlmResponse = {
  items: Array<{ id: number; isBodyweight: boolean }>;
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

function buildPrompt(rows: ExerciseRow[]): string {
  const lines = rows.map((row) => {
    const equipment = row.equipment ? row.equipment : 'Unknown';
    return `${row.id}: ${row.name} | equipment: ${equipment}`;
  });
  return [
    'Classify which exercises are bodyweight (true/false).',
    'Return JSON only in this format: {"items":[{"id":1,"isBodyweight":true}]}',
    'Items:',
    ...lines,
  ].join('\n');
}

async function columnExists(table: string, column: string): Promise<boolean> {
  const db = getDatabase();
  const result = await db.execute({ sql: `PRAGMA table_info(${table})` });
  return result.rows.some((row: any) => row.name === column);
}

async function ensureBodyweightColumn(): Promise<void> {
  const db = getDatabase();
  const hasColumn = await columnExists('exercises', 'is_bodyweight');
  if (hasColumn) return;
  await db.execute('ALTER TABLE exercises ADD COLUMN is_bodyweight INTEGER DEFAULT 0');
  console.log('✓ Added exercises.is_bodyweight');
}

async function classifyBatch(rows: ExerciseRow[]): Promise<Map<number, boolean>> {
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
  const map = new Map<number, boolean>();
  if (Array.isArray(parsed.items)) {
    for (const item of parsed.items) {
      if (typeof item?.id === 'number' && typeof item?.isBodyweight === 'boolean') {
        map.set(item.id, item.isBodyweight);
      }
    }
  }
  return map;
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OPENAI_API_KEY');
  }

  await ensureBodyweightColumn();
  const db = getDatabase();

  const result = await db.execute({
    sql: 'SELECT id, name, equipment FROM exercises ORDER BY name',
  });
  const rows = result.rows as unknown as ExerciseRow[];
  if (rows.length === 0) {
    console.log('No exercises found.');
    await db.close();
    return;
  }

  const batches = chunk(rows, BATCH_SIZE);
  let updatedCount = 0;

  for (let i = 0; i < batches.length; i += 1) {
    const batch = batches[i];
    console.log(`Classifying batch ${i + 1}/${batches.length}...`);
    const classifications = await classifyBatch(batch);
    for (const row of batch) {
      if (!classifications.has(row.id)) continue;
      const isBodyweight = classifications.get(row.id) ? 1 : 0;
      await db.execute({
        sql: 'UPDATE exercises SET is_bodyweight = ? WHERE id = ?',
        args: [isBodyweight, row.id],
      });
      updatedCount += 1;
    }
  }

  console.log(`✓ Updated ${updatedCount} exercises`);
  await db.close();
}

main().catch((error) => {
  console.error('Backfill failed:', error);
  process.exit(1);
});
