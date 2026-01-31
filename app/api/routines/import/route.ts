// app/api/routines/import/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { addStretchToRoutine, getDatabase, getUserGoals } from '@/lib/database';
import { requireAuth } from '@/lib/auth-utils';
import { generateExerciseInsights, generateStretchInsights } from '@/lib/form-tips';
import {
  MUSCLE_GROUP_TAGS,
  STRETCH_MUSCLE_TAGS,
  normalizeTypeList,
} from '@/lib/muscle-tags';
import { EXERCISE_TYPES } from '@/lib/constants';

export async function POST(request: NextRequest) {
  const authResult = await requireAuth();
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const body = await request.json();
    const { workoutPlan, fileName } = body;

    if (!workoutPlan || !workoutPlan.name || !workoutPlan.exercises) {
      return NextResponse.json(
        { error: 'Invalid workout plan format' },
        { status: 400 }
      );
    }

    const db = getDatabase();
    const goalsText = await getUserGoals(user.id);

    // Check if routine already exists for this user
    const existing = await db.execute({
      sql: 'SELECT id FROM routines WHERE name = ? AND user_id = ?',
      args: [workoutPlan.name, user.id]
    });

    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: `A routine named "${workoutPlan.name}" already exists` },
        { status: 409 }
      );
    }

    // Create routine for this user
    const routineResult = await db.execute({
      sql: `INSERT INTO routines (name, user_id, description)
            VALUES (?, ?, ?)`,
      args: [workoutPlan.name, user.id, workoutPlan.description || null]
    });
    const routineId = Number(routineResult.lastInsertRowid);

    const exerciseIndex = await buildNameIndex(db, 'exercises');
    const stretchIndex = await buildNameIndex(db, 'stretches');

    // Import exercises
    for (let i = 0; i < workoutPlan.exercises.length; i++) {
      const exercise = workoutPlan.exercises[i];

      if (exercise.type === EXERCISE_TYPES.single && exercise.name) {
        const exerciseId = await getOrCreateExercise(db, exerciseIndex, exercise.name, goalsText);

        await db.execute({
          sql: `INSERT INTO routine_exercises (
            routine_id, exercise_id1, exercise_id2, order_index
          ) VALUES (?, ?, ?, ?)`,
          args: [
            routineId,
            exerciseId,
            null,
            i
          ]
        });
      } else if (exercise.type === EXERCISE_TYPES.b2b && exercise.exercises && exercise.exercises.length >= 2) {
        const ex1 = exercise.exercises[0];
        const ex2 = exercise.exercises[1];

        const exerciseId1 = await getOrCreateExercise(db, exerciseIndex, ex1.name, goalsText);
        const exerciseId2 = await getOrCreateExercise(db, exerciseIndex, ex2.name, goalsText);

        await db.execute({
          sql: `INSERT INTO routine_exercises (
            routine_id, exercise_id1, exercise_id2, order_index
          ) VALUES (?, ?, ?, ?)`,
          args: [
            routineId,
            exerciseId1,
            exerciseId2,
            i
          ]
        });
      }
    }

    // Import stretches
    if (workoutPlan.preWorkoutStretches) {
      for (let i = 0; i < workoutPlan.preWorkoutStretches.length; i++) {
        const stretch = workoutPlan.preWorkoutStretches[i];
        const stretchId = await getOrCreateStretch(db, stretchIndex, stretch, goalsText);
        await addStretchToRoutine(routineId, stretchId, 'pre', i);
      }
    }

    if (workoutPlan.postWorkoutStretches) {
      for (let i = 0; i < workoutPlan.postWorkoutStretches.length; i++) {
        const stretch = workoutPlan.postWorkoutStretches[i];
        const stretchId = await getOrCreateStretch(db, stretchIndex, stretch, goalsText);
        await addStretchToRoutine(routineId, stretchId, 'post', i);
      }
    }

    // Import cardio
    if (workoutPlan.cardio) {
      await db.execute({
        sql: `INSERT INTO routine_cardio (routine_id, cardio_type, duration, intensity, tips)
              VALUES (?, ?, ?, ?, ?)`,
        args: [
          routineId,
          workoutPlan.cardio.type,
          workoutPlan.cardio.duration,
          workoutPlan.cardio.intensity || null,
          workoutPlan.cardio.tips || null
        ]
      });
    }

    return NextResponse.json({
      id: routineId,
      name: workoutPlan.name,
      success: true
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error importing routine:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to import routine' },
      { status: 500 }
    );
  }
}

type NameIndex = {
  exactLower: Map<string, number>;
  normalized: Map<string, number>;
  idToName: Map<number, string>;
};

async function buildNameIndex(db: any, table: 'exercises' | 'stretches'): Promise<NameIndex> {
  const rows = await db.execute({
    sql: `SELECT id, name FROM ${table}`,
  });
  const exactLower = new Map<string, number>();
  const normalized = new Map<string, number>();
  const idToName = new Map<number, string>();

  for (const row of rows.rows as Array<{ id: number; name: string }>) {
    const lower = row.name.toLowerCase();
    exactLower.set(lower, row.id);
    const normalizedName = normalizeName(row.name);
    if (!normalized.has(normalizedName)) {
      normalized.set(normalizedName, row.id);
    }
    idToName.set(row.id, row.name);
  }

  return { exactLower, normalized, idToName };
}

function normalizeName(value: string): string {
  return value
    .toLowerCase()
    .replace(/[_-]+/g, ' ')
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function getOrCreateExercise(
  db: any,
  index: NameIndex,
  name: string,
  goalsText?: string | null
): Promise<number> {
  const lowerName = name.toLowerCase();
  const normalizedName = normalizeName(name);
  const exactMatch = index.exactLower.get(lowerName);
  if (exactMatch) return exactMatch;

  const normalizedMatch = index.normalized.get(normalizedName);
  if (normalizedMatch) return normalizedMatch;

  const fuzzyMatch = await resolveFuzzyMatch(name, index, goalsText);
  if (fuzzyMatch) return fuzzyMatch;

  const insights = await generateExerciseInsights({
    kind: 'exercise',
    name,
    goalsText,
  });
  const muscleGroups = normalizeTypeList(insights?.muscleGroups, MUSCLE_GROUP_TAGS);
  const resolvedMuscleGroups = muscleGroups.length ? muscleGroups : ['unknown'];
  const resolvedDifficulty = insights?.difficulty || 'Intermediate';

  const result = await db.execute({
    sql: 'INSERT INTO exercises (name, muscle_groups, difficulty) VALUES (?, ?, ?)',
    args: [
      name,
      JSON.stringify(resolvedMuscleGroups),
      resolvedDifficulty,
    ]
  });

  const newId = Number(result.lastInsertRowid);
  index.exactLower.set(lowerName, newId);
  index.normalized.set(normalizedName, newId);
  index.idToName.set(newId, name);
  return newId;
}

async function getOrCreateStretch(
  db: any,
  index: NameIndex,
  stretch: any,
  goalsText?: string | null
): Promise<number> {
  const lowerName = String(stretch.name || '').toLowerCase();
  const normalizedName = normalizeName(String(stretch.name || ''));
  const exactMatch = index.exactLower.get(lowerName);
  if (exactMatch) return exactMatch;

  const normalizedMatch = index.normalized.get(normalizedName);
  if (normalizedMatch) return normalizedMatch;

  const fuzzyMatch = await resolveFuzzyMatch(String(stretch.name || ''), index, goalsText);
  if (fuzzyMatch) return fuzzyMatch;

  const providedTimer = Number.isFinite(Number(stretch.timerSeconds)) && Number(stretch.timerSeconds) > 0
    ? Math.round(Number(stretch.timerSeconds))
    : null;
  const muscleGroupsInput = normalizeTypeList(
    stretch.muscleGroups || stretch.stretchTypes,
    STRETCH_MUSCLE_TAGS
  );
  let resolvedTips = typeof stretch.tips === 'string' ? stretch.tips : null;
  let resolvedTimerSeconds = providedTimer;
  let muscleGroups = muscleGroupsInput;

  if (!resolvedTimerSeconds || !resolvedTips) {
    const insights = await generateStretchInsights({
      kind: 'stretch',
      name: stretch.name,
      timerSeconds: resolvedTimerSeconds ?? undefined,
      muscleGroups: muscleGroupsInput.length ? muscleGroupsInput : undefined,
      goalsText,
    });
    if (!resolvedTips) {
      resolvedTips = insights?.tips ?? null;
    }
    if (!resolvedTimerSeconds) {
      resolvedTimerSeconds = insights?.timerSeconds ?? null;
    }
    if (muscleGroups.length === 0) {
      muscleGroups = normalizeTypeList(insights?.muscleGroups, STRETCH_MUSCLE_TAGS);
    }
  }

  if (!resolvedTimerSeconds) {
    throw new Error(`Missing timerSeconds for stretch "${stretch.name}"`);
  }

  const resolvedMuscleGroups = muscleGroups.length ? muscleGroups : ['unknown'];
  const result = await db.execute({
    sql: `INSERT INTO stretches (name, timer_seconds, video_url, tips, muscle_groups)
          VALUES (?, ?, ?, ?, ?)`,
    args: [
      stretch.name,
      resolvedTimerSeconds,
      stretch.videoUrl || null,
      resolvedTips || null,
      JSON.stringify(resolvedMuscleGroups),
    ]
  });

  const newId = Number(result.lastInsertRowid);
  index.exactLower.set(lowerName, newId);
  index.normalized.set(normalizedName, newId);
  index.idToName.set(newId, stretch.name);
  return newId;
}

async function resolveFuzzyMatch(
  name: string,
  index: NameIndex,
  goalsText?: string | null
): Promise<number | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const options = Array.from(index.idToName.entries()).map(([id, label]) => ({ id, label }));
  if (options.length === 0) return null;

  const payload = {
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: [
          'You are a gym trainer helping users make consistent progress.',
          'You match exercise/stretch names to existing options.',
          'Return ONLY a JSON object: {"matchId": number|null}.',
          'Return null if there is no close match.',
          'Prefer exact or near-exact semantic matches; avoid loose matches.',
          goalsText ? `User goals: ${goalsText}` : 'User goals: (not provided)',
        ].join(' ')
      },
      {
        role: 'user',
        content: JSON.stringify({
          query: name,
          options: options.map((opt) => ({ id: opt.id, label: opt.label }))
        })
      }
    ],
    temperature: 0.2,
  };

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) return null;
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) return null;

    const jsonText = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)?.[1] ?? content;
    const parsed = JSON.parse(jsonText);
    const matchId = parsed?.matchId;
    if (typeof matchId === 'number' && index.idToName.has(matchId)) {
      return matchId;
    }
  } catch (error) {
    console.error('Fuzzy match error:', error);
  }

  return null;
}
