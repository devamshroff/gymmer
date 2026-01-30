import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import {
  createStretch,
  getAllStretches,
  getRoutineById,
  getRoutineExercises,
  getUserGoals,
} from '@/lib/database';
import { generateStretchInsights } from '@/lib/form-tips';
import { STRETCH_MUSCLE_TAGS, normalizeTypeList } from '@/lib/muscle-tags';
import { EXERCISE_TYPES } from '@/lib/constants';
import { parseTimerSecondsFromText } from '@/lib/stretch-utils';

const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

type RecommendedStretch = {
  name: string;
  timerSeconds?: number;
  tips?: string;
  muscleGroups?: string[];
  stretchTypes?: string[];
};

type NameIndex = {
  exactLower: Map<string, number>;
  normalized: Map<string, number>;
};

function normalizeName(value: string): string {
  return value
    .toLowerCase()
    .replace(/[_-]+/g, ' ')
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractJson(content: string): string {
  const fencedMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fencedMatch?.[1]) {
    return fencedMatch[1];
  }
  return content;
}

function buildSystemPrompt(
  exercises: string[],
  routineName?: string,
  routineDescription?: string | null,
  exerciseCount?: number,
  availableStretchNames?: string[],
  goalsText?: string | null
): string {
  const goalsLine = goalsText ? `User goals: ${goalsText}` : 'User goals: (not provided)';
  return [
    'You are a gym trainer helping users make consistent, incremental progress.',
    'Recommend stretches for this workout.',
    'Given the exercise list, provide pre-workout and post-workout stretches.',
    'Ensure every primary muscle used in the exercises has at least one stretch in pre-workout and one in post-workout.',
    'Return ONLY valid JSON with this exact shape:',
    '{',
    '  "preWorkoutStretches": [ { "name": string, "timerSeconds": number, "tips": string (optional), "muscleGroups": string[] (optional) } ],',
    '  "postWorkoutStretches": [ { "name": string, "timerSeconds": number, "tips": string (optional), "muscleGroups": string[] (optional) } ]',
    '}',
    'Return at least 4 stretches per list.',
    'Increase stretch count with more exercises: 4-5 for <=4 exercises, 5-7 for 5-8, 7-9 for 9+.',
    'Use concise stretch names.',
    `Routine: ${routineName || 'Workout routine'}`,
    routineDescription ? `Description: ${routineDescription}` : 'Description: (none)',
    `Exercise count: ${exerciseCount ?? exercises.length}`,
    availableStretchNames?.length
      ? `Available stretches: ${availableStretchNames.join(', ')}`
      : 'Available stretches: (none)',
    'Prefer existing stretches from the lists above when possible. If a needed stretch is missing, suggest a new one.',
    goalsLine,
    `Exercises: ${exercises.join(', ')}`
  ].join('\n');
}

async function buildNameIndex(stretches: any[]): Promise<NameIndex> {
  const exactLower = new Map<string, number>();
  const normalized = new Map<string, number>();

  for (const stretch of stretches) {
    const lower = String(stretch.name || '').toLowerCase();
    const normalizedName = normalizeName(String(stretch.name || ''));
    exactLower.set(lower, stretch.id);
    if (!normalized.has(normalizedName)) {
      normalized.set(normalizedName, stretch.id);
    }
  }

  return { exactLower, normalized };
}

async function findOrCreateStretchId(
  index: NameIndex,
  stretch: RecommendedStretch,
  goalsText?: string | null
): Promise<{ id: number; created: boolean }> {
  const name = String(stretch.name || '').trim();
  const lower = name.toLowerCase();
  const normalized = normalizeName(name);

  const exactMatch = index.exactLower.get(lower);
  if (exactMatch) return { id: exactMatch, created: false };

  const normalizedMatch = index.normalized.get(normalized);
  if (normalizedMatch) return { id: normalizedMatch, created: false };

  const providedTimer = Number.isFinite(Number(stretch.timerSeconds)) && Number(stretch.timerSeconds) > 0
    ? Math.round(Number(stretch.timerSeconds))
    : parseTimerSecondsFromText(stretch.duration);
  const muscleGroupsInput = normalizeTypeList(
    stretch.muscleGroups || stretch.stretchTypes,
    STRETCH_MUSCLE_TAGS
  );
  let resolvedTips = stretch.tips || null;
  let resolvedTimerSeconds = providedTimer;
  let muscleGroups = muscleGroupsInput;

  if (!resolvedTimerSeconds || !resolvedTips) {
    const insights = await generateStretchInsights({
      kind: 'stretch',
      name,
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
    throw new Error(`Missing timerSeconds for stretch "${name}"`);
  }
  const resolvedMuscleGroups = muscleGroups.length ? muscleGroups : ['unknown'];
  const id = await createStretch({
    name,
    timerSeconds: resolvedTimerSeconds,
    tips: resolvedTips || undefined,
    muscleGroups: resolvedMuscleGroups,
  });

  index.exactLower.set(lower, id);
  index.normalized.set(normalized, id);
  return { id, created: true };
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth();
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'Missing OPENAI_API_KEY' },
      { status: 500 }
    );
  }

  try {
    const { id } = await params;
    const routineId = Number(id);
    if (Number.isNaN(routineId)) {
      return NextResponse.json({ error: 'Invalid routine id' }, { status: 400 });
    }

    const routine = await getRoutineById(routineId, user.id);
    if (!routine) {
      return NextResponse.json({ error: 'Routine not found' }, { status: 404 });
    }

    const exercises = await getRoutineExercises(routineId);
    const exerciseNames = exercises.flatMap((ex) => {
      if (ex.exercise_type === EXERCISE_TYPES.b2b && ex.b2b_partner_name) {
        return [
          `Superset: ${ex.exercise_name} (sets: ${ex.sets ?? 'N/A'}, reps: ${ex.target_reps ?? 'N/A'}) + ${ex.b2b_partner_name} (sets: ${ex.b2b_sets ?? 'N/A'}, reps: ${ex.b2b_target_reps ?? 'N/A'})`,
        ];
      }
      return [
        `${ex.exercise_name} (sets: ${ex.sets ?? 'N/A'}, reps: ${ex.target_reps ?? 'N/A'}, rest: ${ex.rest_time ?? 'N/A'}s)`
      ];
    });

    if (exerciseNames.length === 0) {
      return NextResponse.json(
        { error: 'No exercises found for routine' },
        { status: 400 }
      );
    }

    const allStretches = await getAllStretches();
    const availableStretchNames = allStretches.map((stretch) => stretch.name);
    const goalsText = await getUserGoals(user.id);

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
            content: buildSystemPrompt(
              exerciseNames,
              routine.name,
              routine.description,
              exercises.length,
              availableStretchNames,
              goalsText
            )
          },
          { role: 'user', content: 'Recommend stretches for this routine.' },
        ],
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `OpenAI request failed: ${errorText}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) {
      return NextResponse.json(
        { error: 'No content returned from model' },
        { status: 502 }
      );
    }

    const jsonText = extractJson(content);
    let recommendations: {
      preWorkoutStretches?: RecommendedStretch[];
      postWorkoutStretches?: RecommendedStretch[];
    };
    try {
      recommendations = JSON.parse(jsonText);
    } catch (error) {
      return NextResponse.json(
        { error: 'Model did not return valid JSON' },
        { status: 502 }
      );
    }

    const preList = Array.isArray(recommendations.preWorkoutStretches)
      ? recommendations.preWorkoutStretches
      : [];
    const postList = Array.isArray(recommendations.postWorkoutStretches)
      ? recommendations.postWorkoutStretches
      : [];
    const minCount = exercises.length >= 9 ? 7 : exercises.length >= 5 ? 5 : 4;

    const index = await buildNameIndex(allStretches);

    const createdIds: number[] = [];
    const recommendedPreIds: number[] = [];
    const recommendedPostIds: number[] = [];

    for (const stretch of preList) {
      if (!stretch?.name) continue;
      const result = await findOrCreateStretchId(index, stretch, goalsText);
      if (result.created) createdIds.push(result.id);
      recommendedPreIds.push(result.id);
    }

    for (const stretch of postList) {
      if (!stretch?.name) continue;
      const result = await findOrCreateStretchId(index, stretch, goalsText);
      if (result.created) createdIds.push(result.id);
      recommendedPostIds.push(result.id);
    }

    const fillMissing = (ids: number[]) => {
      if (ids.length >= minCount) return ids;
      const existingIds = new Set(ids);
      const candidates = allStretches
        .filter((stretch) => !existingIds.has(stretch.id))
        .map((stretch) => stretch.id);
      const needed = minCount - ids.length;
      return [...ids, ...candidates.slice(0, needed)];
    };

    const finalPreIds = fillMissing(recommendedPreIds);
    const finalPostIds = fillMissing(recommendedPostIds);

    const updatedStretches = await getAllStretches();
    const createdStretches = updatedStretches.filter((s) => createdIds.includes(s.id));

    return NextResponse.json({
      recommendedPreIds: finalPreIds,
      recommendedPostIds: finalPostIds,
      createdStretches,
    });
  } catch (error: any) {
    console.error('Error generating stretch recommendations:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}
