import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { getLatestWorkoutReportForWorkoutName, getRecentExerciseLogs, getUserGoals } from '@/lib/database';
import { resolveSessionMode } from '@/lib/workout-session';
import type { SessionMode } from '@/lib/constants';
import { EXERCISE_TYPES } from '@/lib/constants';

const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

type ExercisePayload = {
  name: string;
  type: typeof EXERCISE_TYPES.single | typeof EXERCISE_TYPES.b2b;
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

type TargetNarrative = {
  encouragement: string | null;
  goalSummary: string | null;
  trendSummary: string | null;
};

type TargetResponse = TargetNarrative & {
  targets: TargetSuggestion[];
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

function getLogMaxes(sets: Array<{ weight: number; reps: number }>) {
  let maxWeight: number | null = null;
  let maxReps: number | null = null;
  for (const set of sets) {
    if (Number.isFinite(set.weight)) {
      maxWeight = maxWeight === null ? set.weight : Math.max(maxWeight, set.weight);
    }
    if (Number.isFinite(set.reps)) {
      maxReps = maxReps === null ? set.reps : Math.max(maxReps, set.reps);
    }
  }
  return { maxWeight, maxReps };
}

function summarizeHistoryTrends(history: Record<string, ReturnType<typeof summarizeLogs>>) {
  const summary: Record<
    string,
    {
      latestMaxWeight: number | null;
      previousMaxWeight: number | null;
      latestMaxReps: number | null;
      previousMaxReps: number | null;
    }
  > = {};

  for (const [name, logs] of Object.entries(history)) {
    const latest = logs[0] ? getLogMaxes(logs[0].sets) : { maxWeight: null, maxReps: null };
    const previous = logs[1] ? getLogMaxes(logs[1].sets) : { maxWeight: null, maxReps: null };
    summary[name] = {
      latestMaxWeight: latest.maxWeight,
      previousMaxWeight: previous.maxWeight,
      latestMaxReps: latest.maxReps,
      previousMaxReps: previous.maxReps,
    };
  }

  return summary;
}

function extractJson(content: string): string {
  const fencedMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fencedMatch?.[1]) {
    return fencedMatch[1];
  }
  return content;
}

function normalizeSummaryField(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeResponse(raw: any, exerciseNames: Set<string>): TargetResponse | null {
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
  if (cleaned.length === 0) return null;
  return {
    targets: cleaned,
    encouragement: normalizeSummaryField(raw.encouragement),
    goalSummary: normalizeSummaryField(raw.goalSummary),
    trendSummary: normalizeSummaryField(raw.trendSummary),
  };
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

    const sessionMode: SessionMode = resolveSessionMode(body?.sessionMode);
    const workoutName = typeof body?.workoutName === 'string' ? body.workoutName : '';
    const goalsText = await getUserGoals(user.id);
    const lastWorkoutReport = workoutName
      ? await getLatestWorkoutReportForWorkoutName(user.id, workoutName)
      : null;

    const exerciseNames = new Set<string>();
    for (const exercise of exercises) {
      if (exercise?.name) {
        exerciseNames.add(String(exercise.name));
      }
    }

    const history: Record<string, Array<any>> = {};
    for (const name of exerciseNames) {
      const logs = await getRecentExerciseLogs(name, user.id, 4);
      history[name] = summarizeLogs(logs);
    }

    const payload = {
      workoutName,
      sessionMode,
      goals: goalsText || '',
      lastWorkoutReport: lastWorkoutReport || '',
      exercises,
      history,
      historySummary: summarizeHistoryTrends(history),
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
              'You are a gym trainer helping users make consistent progress.',
              'Use the workout goals, sessionMode, and recent history to suggest today\'s targets.',
              'If provided, use lastWorkoutReport from the prior session for this workout to guide targets.',
              'Provide an encouragement and recap trend changes using historySummary.',
              'Avoid form tips or stretching reminders; those are handled per exercise.',
              'User is able to pick between 3 modes based on how they are feeling today - Progress, Maintenance, and Light.',
              'Obviously if its the first time user is doing a particular exercise create a reasonable target based on the information you have.',
              'For progress, keep targets go up in targets a little unless slight adjustment helps recovery. Be mindful of their goals and push them for things that are more their goals.',
              'For maintenance, keep targets at baseline (last max) unless if doing multiple exercises with that muscle then maybe slight adjustment could help recovery. Take a call.',
              'For light sessions, reduce intensity a little bit and do not increase weight or reps.',
              'Return JSON only: {"encouragement":"...","goalSummary":"...","trendSummary":"...","targets":[{"name":"...","suggestedWeight":number|null,"suggestedReps":number|null,"rationale":"..."}]}',
              'Only include exercises provided by name.'
            ].join(' ')
          },
          {
            role: 'user',
            content: JSON.stringify(payload)
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
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
    if (data?.usage) {
      console.info('Workout targets token usage:', data.usage);
    }
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

    const normalized = normalizeResponse(parsed, exerciseNames);
    if (!normalized) {
      return NextResponse.json(
        { error: 'Invalid target response' },
        { status: 502 }
      );
    }

    return NextResponse.json(normalized);
  } catch (error: any) {
    console.error('Error generating workout targets:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate targets' },
      { status: 500 }
    );
  }
}
