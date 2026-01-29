import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { getRecentExerciseLogs, getUserGoals } from '@/lib/database';
import { resolveSessionMode } from '@/lib/workout-session';
import type { SessionMode } from '@/lib/workout-session';

const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

type ExercisePayload = {
  name: string;
  type: 'single' | 'b2b';
  sets: number;
  targetWeight: number;
  targetReps: number;
  warmupWeight?: number;
  isBodyweight?: boolean;
};

type TargetSuggestion = {
  name: string;
  suggestedWeight?: number | null;
  suggestedReps?: number | null;
  rationale?: string | null;
};

function summarizeLogs(logs: Array<any>) {
  return logs.map((log) => {
    const sets: Array<{ weight: number; reps: number }> = [];
    for (let i = 1; i <= 4; i += 1) {
      const weight = log[`set${i}_weight`];
      const reps = log[`set${i}_reps`];
      if (weight !== null && reps !== null) {
        sets.push({ weight, reps });
      }
    }
    return {
      completedAt: log.completed_at || log.created_at,
      matchedRole: log.matched_role,
      warmup: log.warmup_weight !== null && log.warmup_reps !== null
        ? { weight: log.warmup_weight, reps: log.warmup_reps }
        : null,
      sets,
    };
  });
}

function extractJson(content: string): string {
  const fencedMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fencedMatch?.[1]) {
    return fencedMatch[1];
  }
  return content;
}

function normalizeTargets(raw: any, exerciseNames: Set<string>): TargetSuggestion[] | null {
  if (!raw || !Array.isArray(raw.targets)) return null;
  const cleaned: TargetSuggestion[] = [];
  for (const entry of raw.targets) {
    if (!entry || typeof entry.name !== 'string') continue;
    if (!exerciseNames.has(entry.name)) continue;
    const weightValue = Number(entry.suggestedWeight);
    const repsValue = Number(entry.suggestedReps);
    const suggestedWeight = Number.isFinite(weightValue) ? weightValue : null;
    const suggestedReps = Number.isFinite(repsValue) ? repsValue : null;
    cleaned.push({
      name: entry.name,
      suggestedWeight,
      suggestedReps,
      rationale: typeof entry.rationale === 'string' ? entry.rationale : null,
    });
  }
  return cleaned;
}

export async function POST(request: NextRequest) {
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
    const body = await request.json();
    const exercises = Array.isArray(body?.exercises) ? (body.exercises as ExercisePayload[]) : [];
    if (exercises.length === 0) {
      return NextResponse.json({ error: 'exercises are required' }, { status: 400 });
    }

    const sessionMode: SessionMode = resolveSessionMode(body?.sessionMode, 'incremental');
    const workoutName = typeof body?.workoutName === 'string' ? body.workoutName : '';
    const goalsText = await getUserGoals(user.id);

    const exerciseNames = new Set<string>();
    for (const exercise of exercises) {
      if (exercise?.name) {
        exerciseNames.add(String(exercise.name));
      }
    }

    const history: Record<string, Array<any>> = {};
    for (const name of exerciseNames) {
      const logs = await getRecentExerciseLogs(name, user.id, 4, { excludeSessionMode: 'light' });
      history[name] = summarizeLogs(logs);
    }

    const payload = {
      workoutName,
      sessionMode,
      goals: goalsText || '',
      exercises,
      history,
    };

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
            content: [
              'You are a gym trainer helping users make consistent, incremental progress.',
              'Use the workout goals, sessionMode, and recent history to suggest today\'s targets.',
              'For maintenance, keep targets at baseline unless slight adjustment helps recovery.',
              'For light sessions, reduce intensity and do not increase weight or reps.',
              'Return JSON only: {"targets":[{"name":"...","suggestedWeight":number|null,"suggestedReps":number|null,"rationale":"..."}]}',
              'Only include exercises provided by name.'
            ].join(' ')
          },
          {
            role: 'user',
            content: JSON.stringify(payload)
          }
        ],
        temperature: 0.3,
        max_tokens: 500,
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
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: 'No content returned from model' },
        { status: 502 }
      );
    }

    let parsed: any = null;
    try {
      parsed = JSON.parse(extractJson(content));
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to parse model response' },
        { status: 502 }
      );
    }

    const targets = normalizeTargets(parsed, exerciseNames);
    if (!targets) {
      return NextResponse.json(
        { error: 'Invalid target response' },
        { status: 502 }
      );
    }

    return NextResponse.json({ targets });
  } catch (error: any) {
    console.error('Error generating workout targets:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate targets' },
      { status: 500 }
    );
  }
}
