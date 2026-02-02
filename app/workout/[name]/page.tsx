'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { WorkoutPlan, Exercise, Stretch, Cardio, SingleExercise } from '@/lib/types';
import { getFormTips, getVideoUrl } from '@/lib/workout-media';
import { formatStretchTimer } from '@/lib/stretch-utils';
import { initWorkoutSession, isSessionMode, resolveSessionMode } from '@/lib/workout-session';
import { BottomActionBar, Card, SectionHeader } from '@/app/components/SharedUi';
import ExerciseHistoryModal from '@/app/components/ExerciseHistoryModal';
import { saveSessionTargetsMeta, saveSessionWorkout } from '@/lib/session-workout';
import {
  EXERCISE_TYPES,
  ExerciseHistoryDisplayMode,
  type ExercisePrimaryMetric,
  SESSION_MODE_DESCRIPTIONS,
  SESSION_MODE_LABELS,
  SESSION_MODES,
} from '@/lib/constants';
import type { SessionMode } from '@/lib/constants';
import {
  DEFAULT_HEIGHT_UNIT,
  DEFAULT_WEIGHT_UNIT,
  normalizeHeightUnit,
  normalizeWeightUnit,
} from '@/lib/units';
import type { HeightUnit, WeightUnit } from '@/lib/units';
import {
  formatMetricDisplay,
  getMetricLabel,
  isRepsOnlyMetric,
  resolvePrimaryMetric,
} from '@/lib/metric-utils';

type ExerciseTarget = {
  suggestedWeight?: number | null;
  suggestedReps?: number | null;
  rationale?: string | null;
};

type ExerciseHistoryPoint = {
  weight_max: number | null;
  reps_max: number | null;
};

type ExerciseHistorySeries = {
  display_mode: ExerciseHistoryDisplayMode;
  is_machine?: boolean;
  points: ExerciseHistoryPoint[];
};

type TargetsNarrative = {
  encouragement: string | null;
  goalSummary: string | null;
  trendSummary: string | null;
};

type TargetsSource = 'ai' | 'fallback' | null;

type FallbackTargetsResult = {
  targets: Record<string, ExerciseTarget>;
  narrative: TargetsNarrative;
};

type LastSessionMax = {
  weight: number | null;
  reps: number | null;
};

type TrendCounts = {
  up: number;
  down: number;
  flat: number;
  newData: number;
};

const WEIGHT_INCREMENT = 2.5;
type TargetExercise = Pick<SingleExercise, 'name' | 'targetWeight' | 'targetReps' | 'isBodyweight' | 'isMachine'>;

function roundUpToIncrement(value: number, increment: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.ceil(value / increment) * increment;
}

function roundUpWhole(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.ceil(value);
}

function getMaxWeightAndReps(points: ExerciseHistoryPoint[]) {
  let maxWeight: number | null = null;
  let repsAtMax: number | null = null;
  let maxReps: number | null = null;

  for (const point of points) {
    if (point.reps_max !== null) {
      maxReps = maxReps === null ? point.reps_max : Math.max(maxReps, point.reps_max);
    }

    if (point.weight_max === null) continue;
    if (maxWeight === null || point.weight_max > maxWeight) {
      maxWeight = point.weight_max;
      repsAtMax = point.reps_max ?? null;
      continue;
    }
    if (point.weight_max === maxWeight && point.reps_max !== null) {
      repsAtMax = repsAtMax === null ? point.reps_max : Math.max(repsAtMax, point.reps_max);
    }
  }

  return { maxWeight, repsAtMax, maxReps };
}

function getSessionFactors(mode: SessionMode) {
  if (mode === SESSION_MODES.maintenance) return { weight: 0.85, reps: 0.85 };
  if (mode === SESSION_MODES.light) return { weight: 0.6, reps: 0.6 };
  return { weight: 1.05, reps: 1.05 };
}

function normalizeNarrativeField(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function computeLastSessionMaxes(history: Record<string, ExerciseHistorySeries>) {
  const lastMaxes: Record<string, LastSessionMax> = {};
  for (const [name, series] of Object.entries(history)) {
    const points = series?.points || [];
    let lastWeight: number | null = null;
    let lastReps: number | null = null;
    for (let i = points.length - 1; i >= 0; i -= 1) {
      const point = points[i];
      if (lastWeight === null && point.weight_max !== null) {
        lastWeight = point.weight_max;
      }
      if (lastReps === null && point.reps_max !== null) {
        lastReps = point.reps_max;
      }
      if (lastWeight !== null && lastReps !== null) break;
    }
    lastMaxes[name] = { weight: lastWeight, reps: lastReps };
  }
  return lastMaxes;
}

function buildFallbackNarrative(
  sessionMode: SessionMode,
  workoutName: string,
  exerciseNames: string[],
  trendCounts: TrendCounts
): TargetsNarrative {
  const encouragement = sessionMode === SESSION_MODES.progress
    ? 'Targets are set. Push for a clean win today.'
    : sessionMode === SESSION_MODES.maintenance
      ? 'Targets are set. Keep it steady and controlled today.'
      : 'Targets are set. Keep it light and focus on smooth reps today.';

  const focusNames = exerciseNames.slice(0, 3);
  const focusText = focusNames.length > 0 ? ` Focus lifts: ${focusNames.join(', ')}.` : '';
  const sessionLabel = SESSION_MODE_LABELS[sessionMode] ?? 'Training';
  const workoutLabel = workoutName || 'today';
  const goalSummary = `Goal today: ${sessionLabel} session for ${workoutLabel}.${focusText}`.trim();

  const trendParts: string[] = [];
  if (trendCounts.up) trendParts.push(`${trendCounts.up} trending up`);
  if (trendCounts.flat) trendParts.push(`${trendCounts.flat} steady`);
  if (trendCounts.down) trendParts.push(`${trendCounts.down} trending down`);
  if (trendCounts.newData) trendParts.push(`${trendCounts.newData} without recent data`);
  const trendSummary = trendParts.length > 0
    ? `Last 30 days: ${trendParts.join(', ')}.`
    : 'Last 30 days: not enough history yet.';

  return { encouragement, goalSummary, trendSummary };
}

function resolveTargetNumber(value: number | null | undefined, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function applyTargetsToWorkout(
  plan: WorkoutPlan,
  targets: Record<string, ExerciseTarget>
): WorkoutPlan {
  return {
    ...plan,
    exercises: plan.exercises.map((exercise) => {
      if (exercise.type === EXERCISE_TYPES.single) {
        const suggestion = targets[exercise.name];
        if (!suggestion) return exercise;
        return {
          ...exercise,
          targetWeight: resolveTargetNumber(suggestion.suggestedWeight, exercise.targetWeight),
          targetReps: resolveTargetNumber(suggestion.suggestedReps, exercise.targetReps),
        };
      }
      const [ex1, ex2] = exercise.exercises;
      const nextEx1 = (() => {
        const suggestion = targets[ex1.name];
        if (!suggestion) return ex1;
        return {
          ...ex1,
          targetWeight: resolveTargetNumber(suggestion.suggestedWeight, ex1.targetWeight),
          targetReps: resolveTargetNumber(suggestion.suggestedReps, ex1.targetReps),
        };
      })();
      const nextEx2 = (() => {
        const suggestion = targets[ex2.name];
        if (!suggestion) return ex2;
        return {
          ...ex2,
          targetWeight: resolveTargetNumber(suggestion.suggestedWeight, ex2.targetWeight),
          targetReps: resolveTargetNumber(suggestion.suggestedReps, ex2.targetReps),
        };
      })();
      return {
        ...exercise,
        exercises: [nextEx1, nextEx2],
      };
    }),
  };
}

export default function WorkoutDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPreview = searchParams.get('preview') === '1';
  const sessionModeParam = searchParams.get('mode');
  const routineIdParam = searchParams.get('routineId');
  const sessionMode = isSessionMode(sessionModeParam) ? sessionModeParam : null;
  const startMode = resolveSessionMode(sessionModeParam);
  const [workout, setWorkout] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [routineId, setRoutineId] = useState<number | null>(null);
  const [isPublicRoutine, setIsPublicRoutine] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [historyExerciseNames, setHistoryExerciseNames] = useState<string[]>([]);
  const [targets, setTargets] = useState<Record<string, ExerciseTarget>>({});
  const [targetsLoading, setTargetsLoading] = useState(false);
  const [targetsError, setTargetsError] = useState<string | null>(null);
  const [targetsNarrative, setTargetsNarrative] = useState<TargetsNarrative>({
    encouragement: null,
    goalSummary: null,
    trendSummary: null,
  });
  const [targetsSource, setTargetsSource] = useState<TargetsSource>(null);
  const [lastSessionMaxes, setLastSessionMaxes] = useState<Record<string, LastSessionMax>>({});
  const [lastWorkoutReport, setLastWorkoutReport] = useState<string | null>(null);
  const [lastWorkoutReportLoading, setLastWorkoutReportLoading] = useState(false);
  const [showLastWorkoutReport, setShowLastWorkoutReport] = useState(false);
  const [loadingDots, setLoadingDots] = useState('...');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>(DEFAULT_WEIGHT_UNIT);
  const [heightUnit, setHeightUnit] = useState<HeightUnit>(DEFAULT_HEIGHT_UNIT);

  const cacheTargetsForSession = useCallback(
    (nextTargets: Record<string, ExerciseTarget>) => {
      if (!workout) return;
      const updatedWorkout = applyTargetsToWorkout(workout, nextTargets);
      const sessionRoutineId = routineIdParam ?? (routineId !== null ? String(routineId) : null);
      saveSessionWorkout(updatedWorkout, sessionRoutineId);
    },
    [routineId, routineIdParam, workout]
  );

  const baseHistoryTargets = useMemo(() => {
    if (!workout) return {};
    const next: Record<string, { weight?: number | null; reps?: number | null }> = {};
    for (const exercise of workout.exercises) {
      if (exercise.type === EXERCISE_TYPES.single) {
        next[exercise.name] = {
          weight: exercise.targetWeight,
          reps: exercise.targetReps,
        };
      } else {
        const [ex1, ex2] = exercise.exercises;
        next[ex1.name] = {
          weight: ex1.targetWeight,
          reps: ex1.targetReps,
        };
        next[ex2.name] = {
          weight: ex2.targetWeight,
          reps: ex2.targetReps,
        };
      }
    }
    return next;
  }, [workout]);

  const historyTargets = useMemo(() => {
    const next: Record<string, { weight?: number | null; reps?: number | null }> = { ...baseHistoryTargets };
    if (isPreview) {
      for (const [name, suggestion] of Object.entries(targets)) {
        const current = next[name] || {};
        next[name] = {
          weight: suggestion.suggestedWeight ?? current.weight ?? null,
          reps: suggestion.suggestedReps ?? current.reps ?? null,
        };
      }
    }
    return next;
  }, [baseHistoryTargets, isPreview, targets]);

  const allExerciseNames = useMemo(() => {
    if (!workout) return [];
    const names: string[] = [];
    for (const exercise of workout.exercises) {
      if (exercise.type === EXERCISE_TYPES.single) {
        names.push(exercise.name);
      } else {
        const [ex1, ex2] = exercise.exercises;
        names.push(ex1.name, ex2.name);
      }
    }
    return names;
  }, [workout]);

  useEffect(() => {
    async function fetchWorkout() {
      try {
        // Check for routineId in query params (for public/favorited routines)
        const routineIdParam = searchParams.get('routineId');

        // Build API URL with routineId if present
        let apiUrl = `/api/workout/${params.name}`;
        if (routineIdParam) {
          apiUrl += `?routineId=${routineIdParam}`;
          setRoutineId(parseInt(routineIdParam));
          setIsPublicRoutine(true);
        }

        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Workout not found');
        }
        const data = await response.json();
        setWorkout(data.workout);

        // Only fetch routine ID from user's routines if not a public routine
        if (!routineIdParam) {
          const routinesResponse = await fetch('/api/routines');
          const routinesData = await routinesResponse.json();
          const decodedName = decodeURIComponent(params.name as string);
          const routine = routinesData.routines.find((r: any) => r.name === decodedName);
          if (routine) {
            setRoutineId(routine.id);
          }
        }
      } catch (error) {
        console.error('Error fetching workout:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchWorkout();
  }, [params.name, searchParams]);

  useEffect(() => {
    let isMounted = true;
    async function fetchUserSettings() {
      try {
        const response = await fetch('/api/user/settings');
        if (!response.ok) return;
        const data = await response.json();
        if (!isMounted) return;
        setWeightUnit(normalizeWeightUnit(data?.weightUnit));
        setHeightUnit(normalizeHeightUnit(data?.heightUnit));
      } catch (error) {
        console.error('Error fetching user settings:', error);
      }
    }

    fetchUserSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  const fetchExerciseHistory = async (
    signal: AbortSignal
  ): Promise<Record<string, ExerciseHistorySeries>> => {
    if (!workout) return {};
    const params = new URLSearchParams({ range: 'month' });
    for (const name of allExerciseNames) {
      params.append('name', name);
    }
    const response = await fetch(`/api/exercise-history?${params.toString()}`, { signal });
    if (!response.ok) {
      throw new Error('Failed to load exercise history');
    }
    const data = await response.json();
    return data.history || {};
  };

  const computeFallbackTargets = async (
    signal: AbortSignal,
    historyOverride?: Record<string, ExerciseHistorySeries>
  ): Promise<FallbackTargetsResult> => {
    if (!workout) {
      return {
        targets: {},
        narrative: { encouragement: null, goalSummary: null, trendSummary: null }
      };
    }
    const history: Record<string, ExerciseHistorySeries> = historyOverride
      ? historyOverride
      : await fetchExerciseHistory(signal);
    const fallback: Record<string, ExerciseTarget> = {};
    const { weight: weightFactor, reps: repsFactor } = getSessionFactors(sessionMode as SessionMode);
    const trendCounts: TrendCounts = { up: 0, down: 0, flat: 0, newData: 0 };

    const getLatestValues = (
      points: ExerciseHistoryPoint[],
      primaryKey: 'weight_max' | 'reps_max',
      fallbackKey?: 'reps_max'
    ) => {
      const values: number[] = [];
      for (let i = points.length - 1; i >= 0 && values.length < 2; i -= 1) {
        const primary = points[i][primaryKey];
        if (primary !== null && primary !== undefined) {
          values.push(primary);
          continue;
        }
        if (fallbackKey) {
          const fallbackValue = points[i][fallbackKey];
          if (fallbackValue !== null && fallbackValue !== undefined) {
            values.push(fallbackValue);
          }
        }
      }
      return {
        latest: values[0] ?? null,
        previous: values[1] ?? null,
      };
    };

    const updateTrendCounts = (exercise: TargetExercise) => {
      const series = history[exercise.name];
      const points = series?.points || [];
      if (points.length === 0) {
        trendCounts.newData += 1;
        return;
      }
      const metricKey: 'weight_max' | 'reps_max' = exercise.isBodyweight ? 'reps_max' : 'weight_max';
      const fallbackKey = exercise.isBodyweight ? undefined : 'reps_max';
      const { latest, previous } = getLatestValues(points, metricKey, fallbackKey);
      if (latest === null || previous === null) {
        trendCounts.newData += 1;
        return;
      }
      const delta = latest - previous;
      if (Math.abs(delta) < 0.1) {
        trendCounts.flat += 1;
      } else if (delta > 0) {
        trendCounts.up += 1;
      } else {
        trendCounts.down += 1;
      }
    };

    const buildTarget = (exercise: TargetExercise) => {
      const series = history[exercise.name];
      const points = series?.points || [];
      const { maxWeight, repsAtMax, maxReps } = getMaxWeightAndReps(points);
      const baseWeight = exercise.targetWeight;
      const baseReps = exercise.targetReps;
      const isBodyweight = !!exercise.isBodyweight;
      const isMachine = !!exercise.isMachine;
      const usesHistory = points.length > 0 && (maxWeight !== null || maxReps !== null);
      let suggestedWeight: number | null = null;
      let suggestedReps: number | null = null;
      let rationale: string | null = null;

      if (isBodyweight) {
        const sourceReps = maxReps ?? baseReps;
        const scaledReps = roundUpWhole(sourceReps * repsFactor);
        suggestedReps = Math.max(1, scaledReps);
        rationale = usesHistory
          ? `Default target uses ${Math.round(repsFactor * 100)}% of your last 30-day max reps.`
          : 'Default target uses your routine baseline until more history is logged.';
      } else {
        const sourceWeight = maxWeight ?? baseWeight;
        const sourceReps = repsAtMax ?? maxReps ?? baseReps;
        const scaledWeight = roundUpToIncrement(sourceWeight * weightFactor, WEIGHT_INCREMENT);
        const repFactorForMode = sessionMode === SESSION_MODES.progress ? 1 : repsFactor;
        const scaledReps = roundUpWhole(sourceReps * repFactorForMode);
        const hasAddedWeight = isMachine ? (maxWeight !== null && maxWeight > 0) : true;
        suggestedWeight = hasAddedWeight ? Math.max(0, scaledWeight) : null;
        suggestedReps = Math.max(1, scaledReps);
        const repNote = sessionMode === SESSION_MODES.progress
          ? 'max reps at your max weight'
          : `${Math.round(repsFactor * 100)}% of your max reps`;
        if (usesHistory) {
          rationale = hasAddedWeight
            ? `Default target uses ${Math.round(weightFactor * 100)}% of your last 30-day max weight and ${repNote}.`
            : `Default target uses ${repNote}; add weight when you feel ready.`;
        } else {
          rationale = 'Default target uses your routine baseline until more history is logged.';
        }
      }

      fallback[exercise.name] = {
        suggestedWeight,
        suggestedReps,
        rationale
      };
    };

    for (const entry of workout.exercises) {
      if (entry.type === EXERCISE_TYPES.single) {
        buildTarget(entry);
        updateTrendCounts(entry);
      } else {
        const [ex1, ex2] = entry.exercises;
        buildTarget(ex1);
        buildTarget(ex2);
        updateTrendCounts(ex1);
        updateTrendCounts(ex2);
      }
    }

    const narrative = buildFallbackNarrative(
      sessionMode as SessionMode,
      workout.name,
      allExerciseNames,
      trendCounts
    );

    return { targets: fallback, narrative };
  };

  useEffect(() => {
    if (!targetsLoading) {
      setLoadingDots('...');
      return;
    }

    const frames = ['.', '..', '...'];
    let index = 0;
    setLoadingDots(frames[index]);
    const interval = window.setInterval(() => {
      index = (index + 1) % frames.length;
      setLoadingDots(frames[index]);
    }, 500);

    return () => window.clearInterval(interval);
  }, [targetsLoading]);

  useEffect(() => {
    setShowLastWorkoutReport(false);
  }, [workout?.name]);

  useEffect(() => {
    if (!isPreview || !workout) return;
    let isActive = true;
    const controller = new AbortController();

    const fetchLastReport = async () => {
      setLastWorkoutReportLoading(true);
      try {
        const params = new URLSearchParams({ workoutName: workout.name });
        const response = await fetch(`/api/workout-report?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          if (!isActive) return;
          setLastWorkoutReport(null);
          return;
        }
        const data = await response.json();
        if (!isActive) return;
        const reportText = typeof data?.report === 'string' ? data.report.trim() : '';
        setLastWorkoutReport(reportText.length > 0 ? reportText : null);
      } catch (error) {
        if (!isActive) return;
        setLastWorkoutReport(null);
      } finally {
        if (isActive) {
          setLastWorkoutReportLoading(false);
        }
      }
    };

    fetchLastReport();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [isPreview, workout?.name]);

  useEffect(() => {
    if (!isPreview || !workout) return;
    if (Object.keys(targets).length === 0) return;
    cacheTargetsForSession(targets);
  }, [cacheTargetsForSession, isPreview, targets, workout]);

  useEffect(() => {
    if (!workout || !isPreview || !sessionMode) return;

    let isActive = true;
    const controller = new AbortController();

    const fetchTargets = async () => {
      setTargetsLoading(true);
      setTargetsError(null);
      setTargets({});
      setTargetsNarrative({ encouragement: null, goalSummary: null, trendSummary: null });
      setTargetsSource(null);
      setLastSessionMaxes({});
      const sessionRoutineId = routineIdParam ?? (routineId !== null ? String(routineId) : null);
      saveSessionTargetsMeta(workout.name, sessionRoutineId, null);

      const exercisePayload: Array<{
        name: string;
        type: typeof EXERCISE_TYPES.single | typeof EXERCISE_TYPES.b2b;
        sets: number;
        targetWeight: number;
        targetReps: number;
        warmupWeight?: number;
        isBodyweight?: boolean;
        isMachine?: boolean;
      }> = [];

      for (const exercise of workout.exercises) {
        if (exercise.type === EXERCISE_TYPES.single) {
          exercisePayload.push({
            name: exercise.name,
            type: EXERCISE_TYPES.single,
            sets: exercise.sets,
            targetWeight: exercise.targetWeight,
            targetReps: exercise.targetReps,
            warmupWeight: exercise.warmupWeight,
            isBodyweight: exercise.isBodyweight,
            isMachine: exercise.isMachine,
          });
        } else {
          const [ex1, ex2] = exercise.exercises;
          exercisePayload.push({
            name: ex1.name,
            type: EXERCISE_TYPES.b2b,
            sets: ex1.sets,
            targetWeight: ex1.targetWeight,
            targetReps: ex1.targetReps,
            warmupWeight: ex1.warmupWeight,
            isBodyweight: ex1.isBodyweight,
            isMachine: ex1.isMachine,
          });
          exercisePayload.push({
            name: ex2.name,
            type: EXERCISE_TYPES.b2b,
            sets: ex2.sets,
            targetWeight: ex2.targetWeight,
            targetReps: ex2.targetReps,
            warmupWeight: ex2.warmupWeight,
            isBodyweight: ex2.isBodyweight,
            isMachine: ex2.isMachine,
          });
        }
      }

      const historyPromise = fetchExerciseHistory(controller.signal)
        .then((historyData) => {
          if (!isActive) return null;
          setLastSessionMaxes(computeLastSessionMaxes(historyData));
          return historyData;
        })
        .catch(() => null);

      try {
        const targetsResponse = await fetch('/api/workout-targets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            workoutName: workout.name,
            sessionMode,
            exercises: exercisePayload,
          }),
          signal: controller.signal,
        });

        if (!isActive) return;

        if (!targetsResponse.ok) {
          const errorText = await targetsResponse.text();
          throw new Error(errorText || 'Failed to load targets');
        }

        const targetsData = await targetsResponse.json();
        const nextTargets: Record<string, ExerciseTarget> = {};
        for (const target of targetsData?.targets || []) {
          if (target?.name) {
            nextTargets[target.name] = {
              suggestedWeight: target.suggestedWeight ?? null,
              suggestedReps: target.suggestedReps ?? null,
              rationale: target.rationale ?? null,
            };
          }
        }
        if (Object.keys(nextTargets).length === 0) {
          throw new Error('No targets returned');
        }
        setTargets(nextTargets);
        const narrative: TargetsNarrative = {
          encouragement: normalizeNarrativeField(targetsData?.encouragement),
          goalSummary: normalizeNarrativeField(targetsData?.goalSummary),
          trendSummary: normalizeNarrativeField(targetsData?.trendSummary),
        };
        const finalNarrative = (!narrative.encouragement && !narrative.goalSummary && !narrative.trendSummary)
          ? buildFallbackNarrative(
            sessionMode as SessionMode,
            workout.name,
            allExerciseNames,
            { up: 0, down: 0, flat: 0, newData: allExerciseNames.length }
          )
          : narrative;
        setTargetsNarrative(finalNarrative);
        setTargetsSource('ai');
        saveSessionTargetsMeta(workout.name, sessionRoutineId, {
          encouragement: finalNarrative.encouragement,
          goalSummary: finalNarrative.goalSummary,
          trendSummary: finalNarrative.trendSummary,
          source: 'ai',
          sessionMode
        });
        setTargetsLoading(false);
        await historyPromise;
      } catch (error: any) {
        if (!isActive) return;
        console.error('AI-trainer targets failed:', error);
        const aiErrorMessage = error instanceof Error ? error.message : 'AI-trainer request failed.';
        try {
          const historyData = await historyPromise;
          const fallbackResult = await computeFallbackTargets(controller.signal, historyData || undefined);
          if (!isActive) return;
          setTargets(fallbackResult.targets);
          setTargetsNarrative(fallbackResult.narrative);
          setTargetsSource('fallback');
          saveSessionTargetsMeta(workout.name, sessionRoutineId, {
            encouragement: fallbackResult.narrative.encouragement,
            goalSummary: fallbackResult.narrative.goalSummary,
            trendSummary: fallbackResult.narrative.trendSummary,
            source: 'fallback',
            sessionMode
          });
          setTargetsError(
            `AI-trainer error: ${aiErrorMessage}. Using default targets for now; we should root-cause this.`
          );
        } catch (fallbackError) {
          if (!isActive) return;
          setTargetsSource('fallback');
          setTargetsError(
            `AI-trainer error: ${aiErrorMessage}. Fallback targets also failed; we should root-cause this.`
          );
        } finally {
          setTargetsLoading(false);
        }
      }
    };

    fetchTargets();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [workout, isPreview, sessionMode]);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!routineId) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/routines/${routineId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete routine');
      }

      // Redirect to routines
      router.push('/routines');
    } catch (error) {
      console.error('Error deleting routine:', error);
      alert('Failed to delete routine. Please try again.');
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const openHistory = (names: string[]) => {
    setHistoryExerciseNames(names);
    setShowHistory(true);
  };

  const closeHistory = () => {
    setShowHistory(false);
    setHistoryExerciseNames([]);
  };

  const handleModeSelect = (mode: SessionMode) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set('preview', '1');
    nextParams.set('mode', mode);
    router.replace(`/workout/${encodeURIComponent(params.name as string)}?${nextParams.toString()}`);
  };

  const handleModeReset = () => {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete('mode');
    nextParams.set('preview', '1');
    router.replace(`/workout/${encodeURIComponent(params.name as string)}?${nextParams.toString()}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
        <div className="text-white text-2xl">Loading workout...</div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-white text-2xl mb-4">Workout not found</div>
          <Link href="/routines" className="text-blue-400 hover:text-blue-300">
            Back to routines
          </Link>
        </div>
      </div>
    );
  }

  if (isPreview && !sessionMode) {
    return (
      <div className="min-h-screen bg-zinc-900 p-4">
        <div className="max-w-xl mx-auto">
          <div className="mt-8 bg-zinc-800 border border-zinc-700 rounded-lg p-6">
            <div className="text-zinc-400 text-sm mb-2">Before you preview</div>
            <h1 className="text-3xl font-bold text-white mb-3">How are you feeling today?</h1>
            <p className="text-zinc-400 mb-6">
              Pick the vibe for this session so we can set targets for today.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => handleModeSelect(SESSION_MODES.progress)}
                className="w-full text-left bg-emerald-700/80 hover:bg-emerald-600 text-white px-4 py-4 rounded-lg font-semibold transition-colors"
              >
                Progress
                <div className="text-emerald-200 text-sm font-normal">Push for some wins today.</div>
              </button>
              <button
                onClick={() => handleModeSelect(SESSION_MODES.maintenance)}
                className="w-full text-left bg-blue-700/70 hover:bg-blue-600 text-white px-4 py-4 rounded-lg font-semibold transition-colors"
              >
                Maintenance
                <div className="text-blue-200 text-sm font-normal">Hold steady and keep the groove.</div>
              </button>
              <button
                onClick={() => handleModeSelect(SESSION_MODES.light)}
                className="w-full text-left bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-4 rounded-lg font-semibold transition-colors"
              >
                Light
                <div className="text-zinc-300 text-sm font-normal">Deload or just move a bit.</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 p-4 pb-32">
      <div className="max-w-2xl mx-auto">
        {/* Navigation */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Link href="/routines" className="text-blue-400 hover:text-blue-300">
              ← Back to routines
            </Link>
            {routineId && !isPublicRoutine && !isPreview && (
              <div className="flex gap-2">
                <Link
                  href={`/routines/${routineId}/edit`}
                  className="bg-blue-900/50 hover:bg-blue-900 text-blue-300 hover:text-blue-100 px-4 py-2 rounded text-sm font-semibold transition-colors"
                >
                  Edit Routine
                </Link>
                <button
                  onClick={handleDeleteClick}
                  className="bg-red-900/50 hover:bg-red-900 text-red-300 hover:text-red-100 px-4 py-2 rounded text-sm font-semibold transition-colors"
                >
                  Delete Routine
                </button>
              </div>
            )}
          </div>
          <h1 className="text-4xl font-bold text-white">{workout.name}</h1>
        </div>

        {isPreview && (
          <section className="mb-8">
            <Card paddingClassName="p-5" borderClassName="border-emerald-600">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-emerald-400 text-xs mb-1">Session Type</div>
                  <div className="text-white text-lg font-semibold">
                    {SESSION_MODE_LABELS[startMode]}
                  </div>
                  <div className="text-zinc-400 text-sm mt-1">
                    {SESSION_MODE_DESCRIPTIONS[startMode]}
                  </div>
                </div>
                <button
                  onClick={handleModeReset}
                  className="text-xs text-emerald-300 hover:text-emerald-200 bg-zinc-900 px-3 py-2 rounded"
                >
                  Change
                </button>
              </div>
            </Card>
          </section>
        )}

        {isPreview && (
          <section className="mb-8">
            <SectionHeader
              icon="🎯"
              iconClassName="text-amber-400"
              label="AI-Trainer Targets"
              className="text-2xl"
            />
            <Card paddingClassName="p-5" borderClassName="border-amber-600">
              <div className="flex items-center justify-between gap-4">
                <p className="text-zinc-200 font-semibold">
                  {targetsLoading
                    ? `Loading AI-trainer targets${loadingDots}`
                    : targetsSource === 'fallback'
                      ? 'AI-trainer unavailable. Using formula-based targets for this session.'
                      : 'AI-trainer targets ready.'}
                </p>
                {targetsLoading && (
                  <div className="text-xs text-amber-300 bg-zinc-900 px-3 py-2 rounded">
                    Building your session plan
                  </div>
                )}
              </div>
              {!targetsLoading && (
                (targetsNarrative.encouragement || targetsNarrative.goalSummary || targetsNarrative.trendSummary) && (
                  <div className="mt-3 space-y-2 text-sm text-zinc-300 leading-relaxed">
                    {targetsNarrative.encouragement && <p>{targetsNarrative.encouragement}</p>}
                    {targetsNarrative.goalSummary && <p>{targetsNarrative.goalSummary}</p>}
                    {targetsNarrative.trendSummary && <p>{targetsNarrative.trendSummary}</p>}
                  </div>
                )
              )}
            </Card>
            {!targetsLoading && !lastWorkoutReportLoading && lastWorkoutReport && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => setShowLastWorkoutReport((prev) => !prev)}
                  className="text-xs text-amber-300 hover:text-amber-200 bg-zinc-900 px-3 py-2 rounded"
                >
                  {showLastWorkoutReport ? 'Hide last session report' : 'View last session report'}
                </button>
                {showLastWorkoutReport && (
                  <div className="mt-3 bg-zinc-900 rounded p-3 text-zinc-300 text-sm whitespace-pre-line border border-amber-700/40">
                    {lastWorkoutReport}
                  </div>
                )}
              </div>
            )}
            <p className="text-zinc-400 text-sm mt-3">
              Targets are generated with your{' '}
              <Link href="/profile" className="text-amber-300 hover:text-amber-200 underline">
                background and fitness goals
              </Link>{' '}
              and your{' '}
              <button
                type="button"
                onClick={() => openHistory(allExerciseNames)}
                className="text-amber-300 hover:text-amber-200 underline"
              >
                exercise history
              </button>
              .
            </p>
            {targetsError && (
              <div className="text-red-400 text-sm mt-3">{targetsError}</div>
            )}
          </section>
        )}

        {/* Pre-Workout Stretches */}
        <section className="mb-8">
          <SectionHeader
            icon="🟢"
            iconClassName="text-green-500"
            label="Pre-Workout Stretches"
            className="text-2xl"
          />
          <div className="text-zinc-400 text-sm mb-4">Dynamic stretches · 5-8 minutes</div>
          <div className="grid grid-cols-2 gap-3">
            {workout.preWorkoutStretches.map((stretch, index) => (
              <StretchCard key={index} stretch={stretch} index={index} />
            ))}
          </div>
        </section>

        {/* Exercises */}
        <section className="mb-8">
          <SectionHeader
            icon="🔥"
            iconClassName="text-orange-500"
            label="Exercises"
            className="text-2xl"
          />
          <div className="text-zinc-400 text-sm mb-4">{workout.exercises.length} exercises</div>
          <div className="space-y-4">
            {workout.exercises.map((exercise, index) => (
              <ExerciseCard
                key={index}
                exercise={exercise}
                index={index}
                onShowHistory={openHistory}
                targets={targets}
                showTargets={isPreview}
                lastSessionMaxes={lastSessionMaxes}
                weightUnit={weightUnit}
                heightUnit={heightUnit}
              />
            ))}
          </div>
        </section>

        {/* Cardio (Optional) */}
        {workout.cardio && (
          <section className="mb-8">
            <SectionHeader
              icon="❤️"
              iconClassName="text-red-500"
              label="Cardio (Optional)"
              className="text-2xl"
            />
            <Card paddingClassName="p-5" borderClassName="border-red-600">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{workout.cardio.type}</h3>
                  <div className="text-blue-400 text-lg mb-1">{workout.cardio.duration}</div>
                  <div className="text-zinc-400 text-sm">{workout.cardio.intensity}</div>
                </div>
              </div>
              <div className="bg-zinc-900 rounded p-3">
                <div className="text-zinc-500 text-xs mb-1">Tips</div>
                <p className="text-zinc-300 text-sm">{workout.cardio.tips}</p>
              </div>
            </Card>
          </section>
        )}

        {/* Post-Workout Stretches */}
        <section className="mb-8">
          <SectionHeader
            icon="🔵"
            iconClassName="text-blue-500"
            label="Post-Workout Stretches"
            className="text-2xl"
          />
          <div className="text-zinc-400 text-sm mb-4">Static stretches · 8-10 minutes</div>
          <div className="grid grid-cols-2 gap-3">
            {workout.postWorkoutStretches.map((stretch, index) => (
              <StretchCard key={index} stretch={stretch} index={index} />
            ))}
          </div>
        </section>

        {/* Start Workout Button - Fixed at bottom */}
        <BottomActionBar maxWidthClassName="max-w-2xl">
          <button
            onClick={() => {
              const query = new URLSearchParams();
              if (routineId) query.set('routineId', String(routineId));
              const queryString = query.toString();
              initWorkoutSession(workout.name, routineId);
              const url = `/stretches/${encodeURIComponent(workout.name)}${queryString ? `?${queryString}` : ''}`;
              router.push(url);
            }}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg text-xl font-bold transition-colors"
          >
            Start Workout
          </button>
        </BottomActionBar>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-800 rounded-lg p-6 max-w-md w-full border-2 border-red-600">
            <h2 className="text-2xl font-bold text-white mb-4">Delete Routine</h2>
            <p className="text-zinc-300 mb-6">
              This will permanently delete this routine. Are you sure you want to proceed?
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleCancelDelete}
                disabled={deleting}
                className="bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-800 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold transition-colors"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ExerciseHistoryModal
        open={showHistory}
        onClose={closeHistory}
        exerciseNames={historyExerciseNames}
        title="Exercise History"
        targets={historyTargets}
        weightUnit={weightUnit}
        heightUnit={heightUnit}
      />
    </div>
  );
}

function StretchCard({ stretch, index }: { stretch: Stretch; index: number }) {
  const tips = getFormTips(stretch.tips);
  const videoHref = getVideoUrl(stretch.name, stretch.videoUrl);

  return (
    <div className="bg-zinc-800 rounded-lg p-3 border border-zinc-700">
      <div className="text-zinc-500 text-xs mb-1">#{index + 1}</div>
      <h3 className="text-sm font-semibold text-white mb-1">{stretch.name}</h3>
      <div className="text-blue-400 text-xs mb-2">
        {formatStretchTimer(stretch.timerSeconds)}
      </div>
      <p className="text-zinc-400 text-xs mb-2 leading-relaxed">{tips}</p>
      <a
        href={videoHref}
        target="_blank"
        rel="noopener noreferrer"
        className="text-red-500 hover:text-red-400 text-xs font-medium px-2 py-1 bg-zinc-900 rounded inline-block"
      >
        📺 Video
      </a>
    </div>
  );
}

function TargetCard({
  baseWeight,
  baseReps,
  suggestion,
  isBodyweight,
  isMachine,
  primaryMetric,
  metricUnit,
  weightUnit,
  heightUnit,
  lastSession,
}: {
  baseWeight: number;
  baseReps: number;
  suggestion?: ExerciseTarget;
  isBodyweight?: boolean;
  isMachine?: boolean;
  primaryMetric?: ExercisePrimaryMetric;
  metricUnit?: string | null;
  weightUnit: WeightUnit;
  heightUnit: HeightUnit;
  lastSession?: LastSessionMax;
}) {
  const metricInfo = {
    primaryMetric: resolvePrimaryMetric(primaryMetric, isBodyweight),
    metricUnit: metricUnit ?? null,
  };
  const targetWeight = suggestion?.suggestedWeight ?? baseWeight;
  const targetReps = suggestion?.suggestedReps ?? baseReps;
  const lastWeight = lastSession?.weight ?? null;
  const lastReps = lastSession?.reps ?? null;
  const weightDelta = lastWeight !== null ? targetWeight - lastWeight : null;
  const repsDelta = lastReps !== null ? targetReps - lastReps : null;
  const showMetric = !isRepsOnlyMetric(metricInfo.primaryMetric);
  const weightLabel = getMetricLabel(
    metricInfo.primaryMetric,
    metricInfo.metricUnit,
    weightUnit,
    heightUnit,
    isMachine
  );
  const lastSummaryParts: string[] = [];
  if (showMetric) {
    if (lastWeight !== null) {
      lastSummaryParts.push(
        formatMetricDisplay(
          lastWeight,
          metricInfo.primaryMetric,
          metricInfo.metricUnit,
          weightUnit,
          heightUnit,
          isMachine
        )
      );
    }
    if (lastReps !== null) lastSummaryParts.push(`${lastReps} reps`);
  } else {
    if (lastReps !== null) lastSummaryParts.push(`${lastReps} reps`);
    else if (lastWeight !== null) {
      lastSummaryParts.push(
        formatMetricDisplay(
          lastWeight,
          metricInfo.primaryMetric,
          metricInfo.metricUnit,
          weightUnit,
          heightUnit,
          isMachine
        )
      );
    }
  }
  const lastSummary = lastSummaryParts.join(' · ');

  const formatDelta = (delta: number) => `${delta > 0 ? '+' : ''}${delta}`;
  const deltaClass = (delta: number) => (delta > 0 ? 'text-emerald-300' : 'text-amber-300');

  return (
    <div className="bg-zinc-900 rounded p-3 border border-emerald-800">
      <div className="text-emerald-400 text-xs mb-2">Today&apos;s target</div>
      <div className={`grid ${showMetric ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
        {showMetric && (
          <div>
            <div className="text-zinc-500 text-xs mb-1">{weightLabel}</div>
            <div className="text-white font-semibold text-lg">
              {formatMetricDisplay(
                targetWeight,
                metricInfo.primaryMetric,
                metricInfo.metricUnit,
                weightUnit,
                heightUnit,
                isMachine
              )}
              {weightDelta !== null && weightDelta !== 0 && (
                <span className={`ml-2 text-sm ${deltaClass(weightDelta)}`}>({formatDelta(weightDelta)})</span>
              )}
            </div>
          </div>
        )}
        <div>
          <div className="text-zinc-500 text-xs mb-1">Reps</div>
          <div className="text-white font-semibold text-lg">
            {targetReps}
            {repsDelta !== null && repsDelta !== 0 && (
              <span className={`ml-2 text-sm ${deltaClass(repsDelta)}`}>({formatDelta(repsDelta)})</span>
            )}
          </div>
        </div>
      </div>
      {lastSummary && (
        <div className="text-zinc-500 text-xs mt-2">
          Last time max: {lastSummary}
        </div>
      )}
      {suggestion?.rationale && (
        <div className="text-zinc-400 text-xs mt-2">{suggestion.rationale}</div>
      )}
    </div>
  );
}

function ExerciseCard({
  exercise,
  index,
  onShowHistory,
  targets,
  showTargets,
  lastSessionMaxes,
  weightUnit,
  heightUnit,
}: {
  exercise: Exercise;
  index: number;
  onShowHistory: (names: string[]) => void;
  targets: Record<string, ExerciseTarget>;
  showTargets: boolean;
  lastSessionMaxes: Record<string, LastSessionMax>;
  weightUnit: WeightUnit;
  heightUnit: HeightUnit;
}) {
  if (exercise.type === EXERCISE_TYPES.single) {
    const tips = getFormTips(exercise.tips);
    const videoHref = getVideoUrl(exercise.name, exercise.videoUrl);
    const metricInfo = {
      primaryMetric: resolvePrimaryMetric(exercise.primaryMetric, exercise.isBodyweight),
      metricUnit: exercise.metricUnit ?? null,
    };
    const showMetric = !isRepsOnlyMetric(metricInfo.primaryMetric);
    const isMachine = !!exercise.isMachine;
    const metricLabel = getMetricLabel(
      metricInfo.primaryMetric,
      metricInfo.metricUnit,
      weightUnit,
      heightUnit,
      isMachine
    );
    const showWarmup = showMetric
      && metricInfo.primaryMetric === 'weight'
      && (exercise.hasWarmup ?? !exercise.isBodyweight);

    return (
      <div className="bg-zinc-800 rounded-lg p-5 border-2 border-zinc-700">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="text-zinc-500 text-sm mb-1">Exercise #{index + 1}</div>
            <h3 className="text-xl font-bold text-white mb-2">{exercise.name}</h3>
          </div>
          <div className="flex flex-col gap-2">
            <a
              href={videoHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-500 hover:text-red-400 text-sm font-medium px-3 py-2 bg-zinc-900 rounded text-center"
            >
              📺 Video
            </a>
            <button
              onClick={() => onShowHistory([exercise.name])}
              className="text-blue-300 hover:text-blue-200 text-sm font-medium px-3 py-2 bg-zinc-900 rounded"
            >
              📈 History
            </button>
          </div>
        </div>

        <div className="space-y-2 mb-3">
          {showMetric && (
            <div className={`grid ${showWarmup ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
              {showWarmup && (
                <div className="bg-green-950 border border-green-800 rounded p-3">
                  <div className="text-green-400 text-xs mb-1">Warmup {metricLabel}</div>
                  <div className="text-green-300 font-bold text-2xl">
                    {formatMetricDisplay(
                      exercise.warmupWeight,
                      metricInfo.primaryMetric,
                      metricInfo.metricUnit,
                      weightUnit,
                      heightUnit,
                      isMachine
                    )}
                  </div>
                </div>
              )}
              <div className="bg-orange-950 border border-orange-800 rounded p-3">
                <div className="text-orange-400 text-xs mb-1">Target {metricLabel}</div>
                <div className="text-orange-300 font-bold text-2xl">
                  {formatMetricDisplay(
                    exercise.targetWeight,
                    metricInfo.primaryMetric,
                    metricInfo.metricUnit,
                    weightUnit,
                    heightUnit,
                    isMachine
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Sets & Rest */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-900 rounded p-3">
              <div className="text-zinc-500 text-xs mb-1">Rest Time</div>
              <div className="text-white font-semibold text-2xl">{exercise.restTime}s</div>
            </div>
            <div className="bg-zinc-900 rounded p-3">
              <div className="text-zinc-500 text-xs mb-1">Sets × Reps</div>
              <div className="text-white font-semibold text-2xl">
                {exercise.sets} × {exercise.targetReps}
              </div>
            </div>
          </div>
        </div>

        {showTargets && (
          <TargetCard
            baseWeight={exercise.targetWeight}
            baseReps={exercise.targetReps}
            suggestion={targets[exercise.name]}
            isBodyweight={exercise.isBodyweight}
            isMachine={exercise.isMachine}
            primaryMetric={exercise.primaryMetric}
            metricUnit={exercise.metricUnit}
            weightUnit={weightUnit}
            heightUnit={heightUnit}
            lastSession={lastSessionMaxes[exercise.name]}
          />
        )}

        <div className="bg-zinc-900 rounded p-3">
          <div className="text-zinc-500 text-xs mb-1">Form Tips</div>
          <p className="text-zinc-300 text-sm">{tips}</p>
        </div>
      </div>
    );
  }

  // B2B Exercise
  const [ex1, ex2] = exercise.exercises;
  const ex1Tips = getFormTips(ex1.tips);
  const ex2Tips = getFormTips(ex2.tips);
  const ex1VideoHref = getVideoUrl(ex1.name, ex1.videoUrl);
  const ex2VideoHref = getVideoUrl(ex2.name, ex2.videoUrl);
  const ex1MetricInfo = {
    primaryMetric: resolvePrimaryMetric(ex1.primaryMetric, ex1.isBodyweight),
    metricUnit: ex1.metricUnit ?? null,
  };
  const ex2MetricInfo = {
    primaryMetric: resolvePrimaryMetric(ex2.primaryMetric, ex2.isBodyweight),
    metricUnit: ex2.metricUnit ?? null,
  };
  const ex1ShowMetric = !isRepsOnlyMetric(ex1MetricInfo.primaryMetric);
  const ex2ShowMetric = !isRepsOnlyMetric(ex2MetricInfo.primaryMetric);
  const ex1Machine = !!ex1.isMachine;
  const ex2Machine = !!ex2.isMachine;
  const ex1MetricLabel = getMetricLabel(
    ex1MetricInfo.primaryMetric,
    ex1MetricInfo.metricUnit,
    weightUnit,
    heightUnit,
    ex1Machine
  );
  const ex2MetricLabel = getMetricLabel(
    ex2MetricInfo.primaryMetric,
    ex2MetricInfo.metricUnit,
    weightUnit,
    heightUnit,
    ex2Machine
  );
  const ex1ShowWarmup = ex1ShowMetric
    && ex1MetricInfo.primaryMetric === 'weight'
    && (ex1.hasWarmup ?? !ex1.isBodyweight);
  const ex2ShowWarmup = ex2ShowMetric
    && ex2MetricInfo.primaryMetric === 'weight'
    && (ex2.hasWarmup ?? !ex2.isBodyweight);

  return (
    <div className="bg-zinc-800 rounded-lg p-5 border-2 border-purple-700">
      <div className="flex items-center justify-between mb-3">
        <div className="text-purple-400 text-sm font-bold">
          🔄 B2B SUPERSET · Exercise #{index + 1}
        </div>
        <button
          onClick={() => onShowHistory([ex1.name, ex2.name])}
          className="text-blue-300 hover:text-blue-200 text-xs font-semibold px-3 py-2 bg-zinc-900 rounded"
        >
          📈 History
        </button>
      </div>

      {/* Exercise 1 */}
      <div className="mb-3">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="text-zinc-500 text-xs mb-1">Exercise 1 of 2</div>
            <h3 className="text-lg font-bold text-white mb-2">{ex1.name}</h3>
          </div>
          <a
            href={ex1VideoHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-500 hover:text-red-400 text-sm font-medium px-3 py-2 bg-zinc-900 rounded"
          >
            📺 Video
          </a>
        </div>

        <div className="space-y-2">
          {ex1ShowMetric && (
            <div className={`grid ${ex1ShowWarmup ? 'grid-cols-2' : 'grid-cols-1'} gap-2`}>
              {ex1ShowWarmup && (
                <div className="bg-green-950 border border-green-800 rounded p-2">
                  <div className="text-green-400 text-xs mb-1">Warmup {ex1MetricLabel}</div>
                  <div className="text-green-300 font-bold text-xl">
                    {formatMetricDisplay(
                      ex1.warmupWeight,
                      ex1MetricInfo.primaryMetric,
                      ex1MetricInfo.metricUnit,
                      weightUnit,
                      heightUnit,
                      ex1Machine
                    )}
                  </div>
                </div>
              )}
              <div className="bg-orange-950 border border-orange-800 rounded p-2">
                <div className="text-orange-400 text-xs mb-1">Target {ex1MetricLabel}</div>
                <div className="text-orange-300 font-bold text-xl">
                  {formatMetricDisplay(
                    ex1.targetWeight,
                    ex1MetricInfo.primaryMetric,
                    ex1MetricInfo.metricUnit,
                    weightUnit,
                    heightUnit,
                    ex1Machine
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Sets × Reps and Tips */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-zinc-900 rounded p-2">
              <div className="text-zinc-500 text-xs mb-1">Sets × Reps</div>
              <div className="text-white font-semibold text-xl">
                {ex1.sets} × {ex1.targetReps}
              </div>
            </div>
            <div className="bg-zinc-900 rounded p-2">
              <div className="text-zinc-500 text-xs mb-1">Form Tips</div>
              <p className="text-zinc-400 text-xs">{ex1Tips}</p>
            </div>
          </div>
        </div>

        {showTargets && (
          <div className="mt-2">
            <TargetCard
              baseWeight={ex1.targetWeight}
              baseReps={ex1.targetReps}
              suggestion={targets[ex1.name]}
              isBodyweight={ex1.isBodyweight}
              isMachine={ex1.isMachine}
              primaryMetric={ex1.primaryMetric}
              metricUnit={ex1.metricUnit}
              weightUnit={weightUnit}
              heightUnit={heightUnit}
              lastSession={lastSessionMaxes[ex1.name]}
            />
          </div>
        )}
      </div>

      {/* Rest Time Card */}
      <div className="my-4">
        <div className="bg-purple-950 border-2 border-purple-700 rounded-lg p-4">
          <div className="text-center">
            <div className="text-purple-400 text-sm mb-1">Rest Between Exercises</div>
            <div className="text-purple-300 font-bold text-3xl">{exercise.restTime}s</div>
          </div>
        </div>
      </div>

      {/* Exercise 2 */}
      <div className="mt-3">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="text-zinc-500 text-xs mb-1">Exercise 2 of 2</div>
            <h3 className="text-lg font-bold text-white mb-2">{ex2.name}</h3>
          </div>
          <a
            href={ex2VideoHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-500 hover:text-red-400 text-sm font-medium px-3 py-2 bg-zinc-900 rounded"
          >
            📺 Video
          </a>
        </div>

        <div className="space-y-2">
          {ex2ShowMetric && (
            <div className={`grid ${ex2ShowWarmup ? 'grid-cols-2' : 'grid-cols-1'} gap-2`}>
              {ex2ShowWarmup && (
                <div className="bg-green-950 border border-green-800 rounded p-2">
                  <div className="text-green-400 text-xs mb-1">Warmup {ex2MetricLabel}</div>
                  <div className="text-green-300 font-bold text-xl">
                    {formatMetricDisplay(
                      ex2.warmupWeight,
                      ex2MetricInfo.primaryMetric,
                      ex2MetricInfo.metricUnit,
                      weightUnit,
                      heightUnit,
                      ex2Machine
                    )}
                  </div>
                </div>
              )}
              <div className="bg-orange-950 border border-orange-800 rounded p-2">
                <div className="text-orange-400 text-xs mb-1">Target {ex2MetricLabel}</div>
                <div className="text-orange-300 font-bold text-xl">
                  {formatMetricDisplay(
                    ex2.targetWeight,
                    ex2MetricInfo.primaryMetric,
                    ex2MetricInfo.metricUnit,
                    weightUnit,
                    heightUnit,
                    ex2Machine
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Sets × Reps and Tips */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-zinc-900 rounded p-2">
              <div className="text-zinc-500 text-xs mb-1">Sets × Reps</div>
              <div className="text-white font-semibold text-xl">
                {ex2.sets} × {ex2.targetReps}
              </div>
            </div>
            <div className="bg-zinc-900 rounded p-2">
              <div className="text-zinc-500 text-xs mb-1">Form Tips</div>
              <p className="text-zinc-400 text-xs">{ex2Tips}</p>
            </div>
          </div>
        </div>

        {showTargets && (
          <div className="mt-2">
            <TargetCard
              baseWeight={ex2.targetWeight}
              baseReps={ex2.targetReps}
              suggestion={targets[ex2.name]}
              isBodyweight={ex2.isBodyweight}
              isMachine={ex2.isMachine}
              primaryMetric={ex2.primaryMetric}
              metricUnit={ex2.metricUnit}
              weightUnit={weightUnit}
              heightUnit={heightUnit}
              lastSession={lastSessionMaxes[ex2.name]}
            />
          </div>
        )}
      </div>
    </div>
  );
}
