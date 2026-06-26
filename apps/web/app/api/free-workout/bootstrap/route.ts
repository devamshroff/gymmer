import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import {
  getExercisesWithHistory,
  getPopularExercises,
  getPopularSupersetPairs,
  getRecentExerciseLogs,
  getUserGoals,
} from '@/lib/database';
import { EXERCISE_PRIMARY_METRICS, SESSION_MODES, type ExercisePrimaryMetric, type SessionMode } from '@/lib/constants';
import { resolveSessionMode } from '@/lib/workout-session';
import { createClaudeText } from '@/lib/claude';

type HistoryExercise = {
  id: number;
  name: string;
  video_url: string | null;
  tips: string | null;
  equipment: string | null;
  is_bodyweight?: number | null;
  is_machine?: number | null;
  primary_metric?: string | null;
  metric_unit?: string | null;
  muscle_groups?: string | null;
  history_count?: number | null;
  recent_count?: number | null;
  last_used_at?: string | null;
};

type TargetSuggestion = {
  suggestedWeight?: number | null;
  suggestedReps?: number | null;
};

type TargetResponse = {
  encouragement: string | null;
  goalSummary: string | null;
  trendSummary: string | null;
  targetsByExercise: Record<string, TargetSuggestion>;
  source: 'ai' | 'fallback';
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
  let repsAtMaxWeight: number | null = null;
  let maxReps: number | null = null;
  for (const set of sets) {
    if (Number.isFinite(set.reps)) {
      maxReps = maxReps === null ? set.reps : Math.max(maxReps, set.reps);
    }
    if (!Number.isFinite(set.weight)) continue;
    if (maxWeight === null || set.weight > maxWeight) {
      maxWeight = set.weight;
      repsAtMaxWeight = Number.isFinite(set.reps) ? set.reps : null;
    } else if (set.weight === maxWeight && Number.isFinite(set.reps)) {
      repsAtMaxWeight = repsAtMaxWeight === null ? set.reps : Math.max(repsAtMaxWeight, set.reps);
    }
  }
  return { maxWeight, repsAtMaxWeight, maxReps };
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
    const latest = logs[0] ? getLogMaxes(logs[0].sets) : { maxWeight: null, repsAtMaxWeight: null, maxReps: null };
    const previous = logs[1] ? getLogMaxes(logs[1].sets) : { maxWeight: null, repsAtMaxWeight: null, maxReps: null };
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

function getSessionFactors(mode: SessionMode) {
  if (mode === SESSION_MODES.maintenance) return { weight: 0.9, reps: 0.9 };
  if (mode === SESSION_MODES.light) return { weight: 0.65, reps: 0.65 };
  return { weight: 1.05, reps: 1.05 };
}

function roundUpToIncrement(value: number, increment: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.ceil(value / increment) * increment;
}

function roundUpWhole(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.ceil(value);
}

function buildFallbackTargets(
  sessionMode: SessionMode,
  exercises: HistoryExercise[],
  history: Record<string, ReturnType<typeof summarizeLogs>>
): TargetResponse {
  const { weight: weightFactor, reps: repsFactor } = getSessionFactors(sessionMode);
  const targetsByExercise: Record<string, TargetSuggestion> = {};

  for (const exercise of exercises) {
    const name = exercise.name;
    const logs = history[name] || [];
    const latest = logs[0] ? getLogMaxes(logs[0].sets) : { maxWeight: null, repsAtMaxWeight: null, maxReps: null };
    const isBodyweight = exercise.is_bodyweight === 1;
    const isMachine = exercise.is_machine === 1;
    const primaryMetric = (typeof exercise.primary_metric === 'string'
      ? exercise.primary_metric
      : (isBodyweight ? EXERCISE_PRIMARY_METRICS.repsOnly : EXERCISE_PRIMARY_METRICS.weight)) as ExercisePrimaryMetric;

    if (primaryMetric === EXERCISE_PRIMARY_METRICS.repsOnly) {
      targetsByExercise[name] = {
        suggestedWeight: null,
        suggestedReps: latest.maxReps !== null ? Math.max(1, roundUpWhole(latest.maxReps * repsFactor)) : null,
      };
      continue;
    }

    const hasAddedWeight = isMachine ? (latest.maxWeight !== null && latest.maxWeight > 0) : true;
    const suggestedWeight = latest.maxWeight !== null && hasAddedWeight
      ? Math.max(0, roundUpToIncrement(latest.maxWeight * weightFactor, 2.5))
      : null;
    const repBaseline = latest.repsAtMaxWeight ?? latest.maxReps;
    const repFactor = sessionMode === SESSION_MODES.progress ? 1 : repsFactor;
    const suggestedReps = repBaseline !== null ? Math.max(1, roundUpWhole(repBaseline * repFactor)) : null;

    targetsByExercise[name] = {
      suggestedWeight,
      suggestedReps,
    };
  }

  return {
    encouragement: sessionMode === SESSION_MODES.progress
      ? 'Targets are loaded. Push the exercises that feel good today.'
      : sessionMode === SESSION_MODES.maintenance
        ? 'Targets are loaded. Keep it steady and clean today.'
        : 'Targets are loaded. Keep it light and move well today.',
    goalSummary: 'Targets are preloaded for exercises you have already done before.',
    trendSummary: 'Suggestions are based on your recent exercise history and today’s session mode.',
    targetsByExercise,
    source: 'fallback',
  };
}

function normalizeAiResponse(
  raw: any,
  validExerciseNames: Set<string>,
  exerciseMetrics: Map<string, ExercisePrimaryMetric>,
  machineAddedWeight: Map<string, boolean>
): TargetResponse | null {
  if (!raw || !Array.isArray(raw.targets)) return null;
  const targetsByExercise: Record<string, TargetSuggestion> = {};

  for (const entry of raw.targets) {
    if (!entry || typeof entry.name !== 'string') continue;
    if (!validExerciseNames.has(entry.name)) continue;

    const weightValue = Number(entry.suggestedWeight);
    const repsValue = Number(entry.suggestedReps);
    let suggestedWeight = Number.isFinite(weightValue) ? weightValue : null;
    const suggestedReps = Number.isFinite(repsValue) ? repsValue : null;

    if (exerciseMetrics.get(entry.name) === EXERCISE_PRIMARY_METRICS.weight
      && machineAddedWeight.get(entry.name) === false) {
      suggestedWeight = null;
    }

    targetsByExercise[entry.name] = {
      suggestedWeight,
      suggestedReps,
    };
  }

  return {
    encouragement: normalizeSummaryField(raw.encouragement),
    goalSummary: normalizeSummaryField(raw.goalSummary),
    trendSummary: normalizeSummaryField(raw.trendSummary),
    targetsByExercise,
    source: 'ai',
  };
}

export async function POST(request: NextRequest) {
  const authResult = await requireAuth();
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const body = await request.json();
    const sessionMode = resolveSessionMode(body?.sessionMode);
    const skipAi = body?.skipAi === true;
    const popularExercises = await getPopularExercises(user.id, 12);
    const popularSupersets = await getPopularSupersetPairs(user.id, 8);
    const historyExercises = await getExercisesWithHistory(user.id) as HistoryExercise[];

    if (historyExercises.length === 0) {
      return NextResponse.json({
        sessionMode,
        source: 'fallback',
        encouragement: sessionMode === SESSION_MODES.light
          ? 'Start light and add what feels good.'
          : 'Start with your go-to lifts and adjust as you go.',
        goalSummary: 'No history yet, so new exercises will use default targets.',
        trendSummary: null,
        targetsByExercise: {},
        popularExercises,
        popularSupersets,
      });
    }

    const history: Record<string, ReturnType<typeof summarizeLogs>> = {};
    for (const exercise of historyExercises) {
      const logs = await getRecentExerciseLogs(exercise.name, user.id, 4);
      history[exercise.name] = summarizeLogs(logs);
    }

    const exerciseMetrics = new Map<string, ExercisePrimaryMetric>();
    const machineAddedWeight = new Map<string, boolean>();
    for (const exercise of historyExercises) {
      const isBodyweight = exercise.is_bodyweight === 1;
      const primaryMetric = (typeof exercise.primary_metric === 'string'
        ? exercise.primary_metric
        : (isBodyweight ? EXERCISE_PRIMARY_METRICS.repsOnly : EXERCISE_PRIMARY_METRICS.weight)) as ExercisePrimaryMetric;
      exerciseMetrics.set(exercise.name, primaryMetric);
      if (exercise.is_machine === 1 && primaryMetric === EXERCISE_PRIMARY_METRICS.weight) {
        const logs = history[exercise.name] || [];
        const hasAddedWeight = logs.some((log) => log.sets.some((set: { weight: number }) => set.weight > 0));
        machineAddedWeight.set(exercise.name, hasAddedWeight);
      }
    }

    const fallbackResponse = buildFallbackTargets(sessionMode, historyExercises, history);

    if (sessionMode !== SESSION_MODES.progress || skipAi || !process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({
        sessionMode,
        ...fallbackResponse,
        popularExercises,
        popularSupersets,
      });
    }

    const goalsText = await getUserGoals(user.id);

    const payload = {
      sessionMode,
      goals: goalsText || '',
      exercises: historyExercises.map((exercise) => ({
        name: exercise.name,
        equipment: exercise.equipment ?? null,
        isBodyweight: exercise.is_bodyweight === 1,
        isMachine: exercise.is_machine === 1,
        primaryMetric: exerciseMetrics.get(exercise.name),
        metricUnit: exercise.metric_unit ?? null,
        historyCount: Number(exercise.history_count ?? 0),
        recentCount: Number(exercise.recent_count ?? 0),
      })),
      history,
      historySummary: summarizeHistoryTrends(history),
    };

    let content = '';
    try {
      const result = await createClaudeText({
        system: [
          'You are a gym trainer helping users preload workout targets for a free-workout session.',
          'The user has already selected a session mode: Progress, Maintenance, or Light.',
          'For each exercise in the payload, return a target the user can use immediately if they add that exercise today.',
          'Base suggestions on recent history and the selected session mode.',
          'For progress, push a little. For maintenance, hold roughly steady. For light, reduce intensity and never increase both weight and reps.',
          'Some exercises are machine-based; their logged weight values are added plates only. If no added-weight history exists, leave suggestedWeight null and provide reps only.',
          'Each exercise has a primaryMetric and metricUnit. If the metric is reps_only, leave suggestedWeight null.',
          'Keep the response compact. Do not include per-exercise rationale.',
          'Return JSON only: {"encouragement":"...","goalSummary":"...","trendSummary":"...","targets":[{"name":"...","suggestedWeight":number|null,"suggestedReps":number|null}]}',
          'Only include exercises provided by name.'
        ].join(' '),
        messages: [
          {
            role: 'user',
            content: JSON.stringify(payload),
          },
        ],
        temperature: 0.2,
        maxTokens: 3000,
      });
      content = result.text;
    } catch (aiError) {
      console.error('Free workout bootstrap AI failed:', aiError);
      return NextResponse.json({
        sessionMode,
        ...fallbackResponse,
        popularExercises,
        popularSupersets,
      });
    }

    let parsed: any = null;
    try {
      parsed = JSON.parse(extractJson(content));
    } catch (error) {
      console.error('Failed to parse free workout bootstrap AI response:', error);
      return NextResponse.json({
        sessionMode,
        ...fallbackResponse,
        popularExercises,
        popularSupersets,
      });
    }

    const normalized = normalizeAiResponse(
      parsed,
      new Set(historyExercises.map((exercise) => exercise.name)),
      exerciseMetrics,
      machineAddedWeight
    );

    if (!normalized || Object.keys(normalized.targetsByExercise).length === 0) {
      return NextResponse.json({
        sessionMode,
        ...fallbackResponse,
        popularExercises,
        popularSupersets,
      });
    }

    return NextResponse.json({
      sessionMode,
      source: normalized.source,
      encouragement: normalized.encouragement ?? fallbackResponse.encouragement,
      goalSummary: normalized.goalSummary ?? fallbackResponse.goalSummary,
      trendSummary: normalized.trendSummary ?? fallbackResponse.trendSummary,
      targetsByExercise: normalized.targetsByExercise,
      popularExercises,
      popularSupersets,
    });
  } catch (error) {
    console.error('Error bootstrapping free workout:', error);
    return NextResponse.json(
      { error: 'Failed to bootstrap free workout' },
      { status: 500 }
    );
  }
}
