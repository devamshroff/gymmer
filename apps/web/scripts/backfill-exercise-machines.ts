// scripts/backfill-exercise-machines.ts
import { getDatabase } from '../lib/database';

const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const BATCH_SIZE = 120;

const FORCE_MACHINE_EXERCISES: string[] = [];
const SKIP_MACHINE_EXERCISES: string[] = [];

type LlmExerciseResult = {
  name: string;
  isMachine: boolean;
  variants?: Array<{
    kind: 'DB' | 'BB';
    name: string;
  }>;
};

async function ensureIsMachineColumn(db: ReturnType<typeof getDatabase>) {
  const columns = await db.execute({ sql: 'PRAGMA table_info(exercises)' });
  const hasColumn = columns.rows.some((row: any) => row.name === 'is_machine');
  if (!hasColumn) {
    await db.execute({ sql: 'ALTER TABLE exercises ADD COLUMN is_machine INTEGER DEFAULT 0' });
  }
}

function extractJson(content: string): string {
  const fencedMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fencedMatch?.[1]) return fencedMatch[1];
  return content;
}

async function classifyExercises(names: string[]): Promise<LlmExerciseResult[]> {
  if (!OPENAI_API_KEY) {
    throw new Error('Missing OPENAI_API_KEY');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: 'system',
          content: [
            'You classify exercises as machine-based or not.',
            'Machine-based means a fixed machine or selectorized station where weight added is separate from the machine base.',
            'If an exercise is machine-based and a popular dumbbell or barbell version exists, suggest variants.',
            'Return JSON only: [{"name":"...","isMachine":true|false,"variants":[{"kind":"DB|BB","name":"DB ..."}]}].',
            'Only include exercises provided by name. Do not invent extra exercises beyond DB/BB variants.'
          ].join(' ')
        },
        {
          role: 'user',
          content: JSON.stringify({ exercises: names })
        }
      ],
      temperature: 0,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI request failed: ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) return [];
  const parsed = JSON.parse(extractJson(content));
  if (!Array.isArray(parsed)) return [];
  return parsed as LlmExerciseResult[];
}

function normalizeVariants(entry: LlmExerciseResult): Array<{ kind: 'DB' | 'BB'; name: string }> {
  const variants = Array.isArray(entry.variants) ? entry.variants : [];
  const seen = new Set<string>();
  const cleaned: Array<{ kind: 'DB' | 'BB'; name: string }> = [];
  for (const variant of variants) {
    if (!variant || (variant.kind !== 'DB' && variant.kind !== 'BB')) continue;
    if (typeof variant.name !== 'string' || variant.name.trim().length === 0) continue;
    const name = variant.name.trim();
    if (seen.has(name)) continue;
    seen.add(name);
    cleaned.push({ kind: variant.kind, name });
  }
  return cleaned;
}

async function main() {
  const db = getDatabase();
  try {
    await ensureIsMachineColumn(db);

    const rows = await db.execute({ sql: 'SELECT name FROM exercises ORDER BY name' });
    const names = rows.rows.map((row: any) => String(row.name));
    const nameSet = new Set(names);

    const results: LlmExerciseResult[] = [];
    for (let i = 0; i < names.length; i += BATCH_SIZE) {
      const batch = names.slice(i, i + BATCH_SIZE);
      const batchResults = await classifyExercises(batch);
      for (const entry of batchResults) {
        if (!entry || typeof entry.name !== 'string') continue;
        if (!nameSet.has(entry.name)) continue;
        results.push(entry);
      }
    }

    const machineNames = new Set<string>(FORCE_MACHINE_EXERCISES);
    for (const entry of results) {
      if (entry.isMachine && !SKIP_MACHINE_EXERCISES.includes(entry.name)) {
        machineNames.add(entry.name);
      }
    }

    const machineList = Array.from(machineNames);
    if (machineList.length > 0) {
      const chunks: string[][] = [];
      for (let i = 0; i < machineList.length; i += 500) {
        chunks.push(machineList.slice(i, i + 500));
      }
      for (const chunk of chunks) {
        const placeholders = chunk.map(() => '?').join(', ');
        await db.execute({
          sql: `UPDATE exercises SET is_machine = 1 WHERE name IN (${placeholders})`,
          args: chunk,
        });
      }
    }

    const insertedVariants: string[] = [];
    for (const entry of results) {
      if (!entry.isMachine) continue;
      const variants = normalizeVariants(entry);
      for (const variant of variants) {
        if (nameSet.has(variant.name)) continue;
        const equipment = variant.kind === 'DB' ? 'Dumbbells' : 'Barbell';
        await db.execute({
          sql: 'INSERT OR IGNORE INTO exercises (name, equipment, is_machine) VALUES (?, ?, 0)',
          args: [variant.name, equipment],
        });
        nameSet.add(variant.name);
        insertedVariants.push(variant.name);
      }
    }

    console.log(`Updated is_machine for ${machineList.length} exercises.`);
    console.log(`Inserted ${insertedVariants.length} DB/BB variants.`);
  } catch (error) {
    console.error('Backfill failed:', error);
    process.exit(1);
  } finally {
    await db.close();
    process.exit(0);
  }
}

main();
