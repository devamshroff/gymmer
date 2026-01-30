// scripts/backfill-exercise-types.ts
// Use the LLM to classify exercises and stretches by primary muscle tags.
import { getDatabase } from '../lib/database';
import {
  EXERCISE_MUSCLE_TAGS,
  EXERCISE_TYPE_TAGS,
  STRETCH_MUSCLE_TAGS,
  normalizeTypeList,
} from '../lib/muscle-tags';

const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const EXERCISE_BATCH_SIZE = 40;
const STRETCH_BATCH_SIZE = 40;

type ExerciseRow = {
  id: number;
  name: string;
  equipment: string | null;
  exercise_type: string | null;
  muscle_groups: string | null;
};

type StretchRow = {
  id: number;
  name: string;
  duration: string | null;
  type: string | null;
  stretch_type: string | null;
  muscle_groups: string | null;
};

type ExerciseLlmResponse = {
  items: Array<{ id: number; exerciseTypes: string[] }>;
};

type StretchLlmResponse = {
  items: Array<{ id: number; stretchTypes: string[] }>;
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

function buildExercisePrompt(rows: ExerciseRow[]): string {
  const lines = rows.map((row) => {
    const equipment = row.equipment ? row.equipment : 'Unknown';
    return `${row.id}: ${row.name} | equipment: ${equipment}`;
  });
  return [
    'Categorize each exercise by its primary muscles (up to 2 tags).',
    'Include one compound tag when relevant: lower body compound, upper body compound, full body compound.',
    'Return JSON only in this format: {"items":[{"id":1,"exerciseTypes":["chest","upper body compound"]}]}',
    `exerciseTypes must be 1-2 tags from: ${EXERCISE_TYPE_TAGS.join(', ')}`,
    'Items:',
    ...lines,
  ].join('\n');
}

function buildStretchPrompt(rows: StretchRow[]): string {
  const lines = rows.map((row) => {
    const duration = row.duration ? row.duration : 'Unknown';
    const type = row.type ? row.type : 'Unknown';
    return `${row.id}: ${row.name} | type: ${type} | duration: ${duration}`;
  });
  return [
    'Categorize each stretch by its primary muscles (up to 2 tags).',
    'Return JSON only in this format: {"items":[{"id":1,"stretchTypes":["hamstrings","glutes"]}]}',
    `stretchTypes must be 1-2 tags from: ${STRETCH_MUSCLE_TAGS.join(', ')}`,
    'Items:',
    ...lines,
  ].join('\n');
}

async function columnExists(table: string, column: string): Promise<boolean> {
  const db = getDatabase();
  const result = await db.execute({ sql: `PRAGMA table_info(${table})` });
  return result.rows.some((row: any) => row.name === column);
}

async function ensureExerciseTypeColumn(): Promise<void> {
  const db = getDatabase();
  const hasColumn = await columnExists('exercises', 'exercise_type');
  if (hasColumn) return;
  await db.execute('ALTER TABLE exercises ADD COLUMN exercise_type TEXT');
  console.log('✓ Added exercises.exercise_type');
}

async function ensureStretchTypeColumn(): Promise<void> {
  const db = getDatabase();
  const hasColumn = await columnExists('stretches', 'stretch_type');
  if (hasColumn) return;
  await db.execute('ALTER TABLE stretches ADD COLUMN stretch_type TEXT');
  console.log('✓ Added stretches.stretch_type');
}

async function classifyExerciseBatch(rows: ExerciseRow[]): Promise<Map<number, string[]>> {
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
          content: buildExercisePrompt(rows),
        },
      ],
      temperature: 0.2,
      max_tokens: 900,
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

  const parsed = JSON.parse(extractJson(content)) as ExerciseLlmResponse;
  const map = new Map<number, string[]>();
  if (Array.isArray(parsed.items)) {
    for (const item of parsed.items) {
      const types = normalizeTypeList(item?.exerciseTypes, EXERCISE_TYPE_TAGS);
      if (typeof item?.id === 'number' && types.length > 0) {
        map.set(item.id, types);
      }
    }
  }
  return map;
}

async function classifyStretchBatch(rows: StretchRow[]): Promise<Map<number, string[]>> {
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
          content: buildStretchPrompt(rows),
        },
      ],
      temperature: 0.2,
      max_tokens: 900,
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

  const parsed = JSON.parse(extractJson(content)) as StretchLlmResponse;
  const map = new Map<number, string[]>();
  if (Array.isArray(parsed.items)) {
    for (const item of parsed.items) {
      const types = normalizeTypeList(item?.stretchTypes, STRETCH_MUSCLE_TAGS);
      if (typeof item?.id === 'number' && types.length > 0) {
        map.set(item.id, types);
      }
    }
  }
  return map;
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OPENAI_API_KEY');
  }

  await ensureExerciseTypeColumn();
  await ensureStretchTypeColumn();
  const db = getDatabase();

  const exerciseResult = await db.execute({
    sql: `
      SELECT id, name, equipment, exercise_type, muscle_groups
      FROM exercises
      WHERE exercise_type IS NULL OR exercise_type = ''
      ORDER BY name
    `,
  });
  const exerciseRows = exerciseResult.rows as unknown as ExerciseRow[];

  if (exerciseRows.length === 0) {
    console.log('All exercises already have exercise_type.');
  } else {
    const batches = chunk(exerciseRows, EXERCISE_BATCH_SIZE);
    let updatedCount = 0;

    for (let i = 0; i < batches.length; i += 1) {
      const batch = batches[i];
      console.log(`Classifying exercises batch ${i + 1}/${batches.length}...`);
      const classifications = await classifyExerciseBatch(batch);
      for (const row of batch) {
        const exerciseTypes = classifications.get(row.id);
        if (!exerciseTypes) continue;
        const muscleGroups = normalizeTypeList(exerciseTypes, EXERCISE_MUSCLE_TAGS);
        const shouldUpdateMuscles = !row.muscle_groups || String(row.muscle_groups).trim() === '';
        const args: Array<string | number | null> = [JSON.stringify(exerciseTypes)];
        let sql = 'UPDATE exercises SET exercise_type = ?';
        if (shouldUpdateMuscles && muscleGroups.length > 0) {
          sql += ', muscle_groups = ?';
          args.push(JSON.stringify(muscleGroups));
        }
        sql += ' WHERE id = ?';
        args.push(row.id);

        await db.execute({ sql, args });
        updatedCount += 1;
      }
    }

    console.log(`✓ Updated ${updatedCount} exercises`);
  }

  const stretchResult = await db.execute({
    sql: `
      SELECT id, name, duration, type, stretch_type, muscle_groups
      FROM stretches
      WHERE stretch_type IS NULL OR stretch_type = ''
      ORDER BY name
    `,
  });
  const stretchRows = stretchResult.rows as unknown as StretchRow[];

  if (stretchRows.length === 0) {
    console.log('All stretches already have stretch_type.');
  } else {
    const batches = chunk(stretchRows, STRETCH_BATCH_SIZE);
    let updatedCount = 0;

    for (let i = 0; i < batches.length; i += 1) {
      const batch = batches[i];
      console.log(`Classifying stretches batch ${i + 1}/${batches.length}...`);
      const classifications = await classifyStretchBatch(batch);
      for (const row of batch) {
        const stretchTypes = classifications.get(row.id);
        if (!stretchTypes) continue;
        const shouldUpdateMuscles = !row.muscle_groups || String(row.muscle_groups).trim() === '';
        const args: Array<string | number | null> = [JSON.stringify(stretchTypes)];
        let sql = 'UPDATE stretches SET stretch_type = ?';
        if (shouldUpdateMuscles) {
          sql += ', muscle_groups = ?';
          args.push(JSON.stringify(stretchTypes));
        }
        sql += ' WHERE id = ?';
        args.push(row.id);

        await db.execute({ sql, args });
        updatedCount += 1;
      }
    }

    console.log(`✓ Updated ${updatedCount} stretches`);
  }

  await db.close();
}

main().catch((error) => {
  console.error('Backfill failed:', error);
  process.exit(1);
});
