'use client';

import { useEffect, useMemo, useRef, useState, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { WorkoutPlan, Exercise, SingleExercise, B2BExercise } from '@/lib/types';
import {
  addExerciseToSession,
  getInProgressExercise,
  getWorkoutSession,
  setInProgressExercise,
  updateExerciseInSession,
} from '@/lib/workout-session';
import { autosaveWorkout } from '@/lib/workout-autosave';
import ExerciseSelector from '@/app/components/ExerciseSelector';
import SupersetSelector from '@/app/components/SupersetSelector';
import { getFormTips, getVideoUrl } from '@/lib/workout-media';
import { acknowledgeChangeWarning, hasChangeWarningAck, loadSessionWorkout, saveSessionWorkout } from '@/lib/session-workout';
import WorkoutNavHeader from '@/app/components/WorkoutNavHeader';
import ExerciseHistoryModal from '@/app/components/ExerciseHistoryModal';
import AutosaveBadge from '@/app/components/AutosaveBadge';
import { EXERCISE_TYPES, type ExercisePrimaryMetric } from '@/lib/constants';
import {
  DEFAULT_HEIGHT_UNIT,
  DEFAULT_WEIGHT_UNIT,
  normalizeHeightUnit,
  normalizeWeightUnit,
} from '@/lib/units';
import type { HeightUnit, WeightUnit } from '@/lib/units';
import {
  formatMetricDisplay,
  formatMetricInputValue,
  getMetricLabel,
  isRepsOnlyMetric,
  isWeightMetric,
  parseMetricInput,
  resolvePrimaryMetric,
} from '@/lib/metric-utils';
import {
  loadWorkoutBootstrapCache,
  saveWorkoutBootstrapCache,
  type LastSetSummary,
  type WorkoutBootstrapPayload,
} from '@/lib/workout-bootstrap';

interface SetData {
  weight: number;
  reps: number;
}

type ExerciseOption = {
  id: number;
  name: string;
  video_url: string | null;
  tips: string | null;
  equipment?: string | null;
  is_bodyweight?: number | null;
  is_machine?: number | null;
};

type LastSetSummaries = Record<string, LastSetSummary>;

type SetIndex = 1 | 2 | 3 | 4;
type SetField = 'weight' | 'reps';
type SetKey = `set${SetIndex}_${SetField}`;

function getLogSetValue(log: LastSetSummary, setNum: SetIndex, field: SetField): number | null {
  if (!log) return null;
  const key = `set${setNum}_${field}` as SetKey;
  return log[key] as number | null;
}

function normalizeDateString(value: string): string {
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(value)) {
    return `${value.replace(' ', 'T')}Z`;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return `${value}T00:00:00Z`;
  }
  return value;
}

function formatLocalDate(value?: string | null): string {
  if (!value) return 'Unknown date';
  const date = new Date(normalizeDateString(value));
  if (Number.isNaN(date.getTime())) return 'Unknown date';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function resolveHasWarmup(exercise: SingleExercise): boolean {
  const primaryMetric = resolvePrimaryMetric(exercise.primaryMetric, exercise.isBodyweight);
  if (!isWeightMetric(primaryMetric)) {
    return false;
  }
  if (typeof exercise.hasWarmup === 'boolean') {
    return exercise.hasWarmup;
  }
  if (exercise.isBodyweight) {
    return false;
  }
  return true;
}

function ActiveWorkoutContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [workout, setWorkout] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [initialIndexSet, setInitialIndexSet] = useState(false);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTimeRemaining, setRestTimeRemaining] = useState(0);
  const [restTimeSeconds, setRestTimeSeconds] = useState(60);
  const [supersetRestSeconds, setSupersetRestSeconds] = useState(15);
  const [weightUnit, setWeightUnit] = useState<WeightUnit>(DEFAULT_WEIGHT_UNIT);
  const [heightUnit, setHeightUnit] = useState<HeightUnit>(DEFAULT_HEIGHT_UNIT);

  // Single exercise state
  const [setData, setSetData] = useState<SetData>({ weight: 0, reps: 0 });
  const [completedSets, setCompletedSets] = useState<SetData[]>([]);
  const [warmupCompleted, setWarmupCompleted] = useState(false);
  const [warmupDecision, setWarmupDecision] = useState<'pending' | 'include' | 'skip'>('pending');
  const [machineOnly, setMachineOnly] = useState(false);
  const [machineOnlyHoldWeight, setMachineOnlyHoldWeight] = useState(0);

  // B2B/Superset state
  const [currentExerciseInPair, setCurrentExerciseInPair] = useState(0); // 0 or 1
  const [setData1, setSetData1] = useState<SetData>({ weight: 0, reps: 0 });
  const [setData2, setSetData2] = useState<SetData>({ weight: 0, reps: 0 });
  const [completedPairs, setCompletedPairs] = useState<Array<{ ex1: SetData; ex2: SetData }>>([]);
  const [machineOnly1, setMachineOnly1] = useState(false);
  const [machineOnly2, setMachineOnly2] = useState(false);
  const [machineOnlyHoldWeight1, setMachineOnlyHoldWeight1] = useState(0);
  const [machineOnlyHoldWeight2, setMachineOnlyHoldWeight2] = useState(0);

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionTimeRemaining, setTransitionTimeRemaining] = useState(60);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showExerciseTypePicker, setShowExerciseTypePicker] = useState(false);
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [showSupersetSelector, setShowSupersetSelector] = useState(false);
  const [exerciseActionMode, setExerciseActionMode] = useState<'add' | 'replace' | null>(null);
  const [showChangeWarning, setShowChangeWarning] = useState(false);
  const pendingChangeRef = useRef<(() => void) | null>(null);

  const getMetricInfo = (exercise: {
    primaryMetric?: ExercisePrimaryMetric;
    metricUnit?: string | null;
    isBodyweight?: boolean;
  }) => ({
    primaryMetric: resolvePrimaryMetric(exercise.primaryMetric, exercise.isBodyweight),
    metricUnit: exercise.metricUnit ?? null,
  });

  const isExerciseWeightMetric = (exercise: {
    primaryMetric?: ExercisePrimaryMetric;
    isBodyweight?: boolean;
  }) => isWeightMetric(resolvePrimaryMetric(exercise.primaryMetric, exercise.isBodyweight));

  const formatMetric = (
    value: number,
    metricInfo: { primaryMetric: ExercisePrimaryMetric; metricUnit: string | null },
    isMachine?: boolean
  ) => formatMetricDisplay(value, metricInfo.primaryMetric, metricInfo.metricUnit, weightUnit, heightUnit, isMachine);

  const getMetricLabelText = (
    metricInfo: { primaryMetric: ExercisePrimaryMetric; metricUnit: string | null },
    isMachine?: boolean
  ) => getMetricLabel(metricInfo.primaryMetric, metricInfo.metricUnit, weightUnit, heightUnit, isMachine);

  const parseMetricValueInput = (
    value: string,
    metricInfo: { primaryMetric: ExercisePrimaryMetric }
  ): number | null => parseMetricInput(value, metricInfo.primaryMetric, weightUnit, heightUnit);

  const formatMetricValueInput = (
    value: number,
    metricInfo: { primaryMetric: ExercisePrimaryMetric },
    allowBlank = false
  ) => formatMetricInputValue(value, metricInfo.primaryMetric, weightUnit, heightUnit, allowBlank);

  const historyTargets = useMemo(() => {
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
  const [showHistory, setShowHistory] = useState(false);
  const [historyExerciseNames, setHistoryExerciseNames] = useState<string[]>([]);

  // Last exercise log from database
  const [lastSetSummaries, setLastSetSummaries] = useState<LastSetSummaries>({});
  const [lastExerciseLog, setLastExerciseLog] = useState<LastSetSummary>(null);
  const [lastPartnerExerciseLog, setLastPartnerExerciseLog] = useState<LastSetSummary>(null);

  // Review mode: cache completed exercises and track viewing
  type CompletedExerciseCache = {
    exerciseIndex: number;
    exerciseName: string;
    type: typeof EXERCISE_TYPES.single | typeof EXERCISE_TYPES.b2b;
    sessionExerciseIndex?: number | null;
    completedSets?: SetData[];
    completedPairs?: Array<{ ex1: SetData; ex2: SetData }>;
    warmupCompleted?: boolean;
  };
  const [completedExercisesCache, setCompletedExercisesCache] = useState<CompletedExerciseCache[]>([]);
  const [viewingExerciseIndex, setViewingExerciseIndex] = useState(0); // Which exercise we're viewing (can be past/current)
  const [showSetReview, setShowSetReview] = useState(false);

  const buildCompletedCacheFromSession = (plan: WorkoutPlan, routineId: number | null) => {
    const session = getWorkoutSession();
    if (!session) {
      return { cache: [], nextIndex: 0 };
    }
    if (session.workoutName !== plan.name) {
      return { cache: [], nextIndex: 0 };
    }
    if ((session.routineId ?? null) !== (routineId ?? null)) {
      return { cache: [], nextIndex: 0 };
    }

    const cache: CompletedExerciseCache[] = [];
    let scanIndex = 0;
    let lastMatchedIndex = -1;

    for (let sessionIndex = 0; sessionIndex < session.exercises.length; sessionIndex += 1) {
      const sessionExercise = session.exercises[sessionIndex];
      let matchedIndex = -1;

      for (let workoutIndex = scanIndex; workoutIndex < plan.exercises.length; workoutIndex += 1) {
        const workoutExercise = plan.exercises[workoutIndex];
        if (sessionExercise.type === EXERCISE_TYPES.single && workoutExercise.type === EXERCISE_TYPES.single) {
          if (workoutExercise.name === sessionExercise.name) {
            matchedIndex = workoutIndex;
            break;
          }
        }
        if (sessionExercise.type === EXERCISE_TYPES.b2b && workoutExercise.type === EXERCISE_TYPES.b2b) {
          const [ex1, ex2] = workoutExercise.exercises;
          const partnerName = sessionExercise.b2bPartner?.name;
          if (ex1.name === sessionExercise.name && (!partnerName || ex2.name === partnerName)) {
            matchedIndex = workoutIndex;
            break;
          }
        }
      }

      if (matchedIndex === -1) continue;
      scanIndex = matchedIndex + 1;
      lastMatchedIndex = matchedIndex;

      if (sessionExercise.type === EXERCISE_TYPES.single) {
        const warmup = sessionExercise.warmup;
        const completedSets = warmup
          ? [warmup, ...(sessionExercise.sets || [])]
          : [...(sessionExercise.sets || [])];
        cache.push({
          exerciseIndex: matchedIndex,
          exerciseName: sessionExercise.name,
          type: EXERCISE_TYPES.single,
          sessionExerciseIndex: sessionIndex,
          completedSets,
          warmupCompleted: !!warmup,
        });
      } else {
        const partnerSets = sessionExercise.b2bPartner?.sets || [];
        const setCount = Math.max(sessionExercise.sets?.length ?? 0, partnerSets.length);
        const completedPairs = Array.from({ length: setCount }, (_, pairIndex) => ({
          ex1: sessionExercise.sets?.[pairIndex] ?? { weight: 0, reps: 0 },
          ex2: partnerSets[pairIndex] ?? { weight: 0, reps: 0 },
        }));
        cache.push({
          exerciseIndex: matchedIndex,
          exerciseName: sessionExercise.name,
          type: EXERCISE_TYPES.b2b,
          sessionExerciseIndex: sessionIndex,
          completedPairs,
        });
      }
    }

    return {
      cache,
      nextIndex: lastMatchedIndex + 1,
    };
  };

  const initSingleExerciseState = (exercise: SingleExercise) => {
    const hasWarmup = resolveHasWarmup(exercise);
    const defaultMachineOnly = !!exercise.isMachine
      && isExerciseWeightMetric(exercise)
      && exercise.targetWeight <= 0;
    setWarmupCompleted(false);
    setMachineOnly(defaultMachineOnly);
    setMachineOnlyHoldWeight(exercise.targetWeight);
    if (!hasWarmup) {
      setWarmupDecision('skip');
      setCurrentSetIndex(1);
      setSetData({
        weight: defaultMachineOnly ? 0 : exercise.targetWeight,
        reps: exercise.targetReps,
      });
      return;
    }
    setWarmupDecision('pending');
    setCurrentSetIndex(1);
    setSetData({
      weight: defaultMachineOnly ? 0 : exercise.targetWeight,
      reps: exercise.targetReps,
    });
  };

  // Get routineId from URL params (for public/favorited routines)
  const routineIdParam = searchParams.get('routineId');
  const routineQueryParams = new URLSearchParams();
  if (routineIdParam) routineQueryParams.set('routineId', routineIdParam);
  const routineQuery = routineQueryParams.toString() ? `?${routineQueryParams.toString()}` : '';

  useEffect(() => {
    async function fetchWorkout() {
      try {
        const routineIdValue = routineIdParam ? Number(routineIdParam) : null;
        const routineId = Number.isNaN(routineIdValue) ? null : routineIdValue;
        const decodedName = decodeURIComponent(params.name as string);
        const cached = loadWorkoutBootstrapCache({
          workoutName: decodedName,
          routineId: routineIdParam,
        });

        let baseWorkout: WorkoutPlan | null = null;
        let bootstrapSettings: WorkoutBootstrapPayload['settings'] | null = null;
        let bootstrapSummaries: LastSetSummaries = {};

        if (cached) {
          baseWorkout = cached.workout;
          bootstrapSettings = cached.settings;
          bootstrapSummaries = cached.lastSetSummaries || {};
        } else {
          let apiUrl = `/api/workout/${params.name}?bootstrap=1`;
          if (routineIdParam) {
            apiUrl += `&routineId=${routineIdParam}`;
          }
          const response = await fetch(apiUrl);
          if (!response.ok) {
            throw new Error('Workout not found');
          }
          const data = await response.json();
          baseWorkout = data.workout as WorkoutPlan;
          bootstrapSettings = data.settings;
          bootstrapSummaries = data.lastSetSummaries || {};
          const payload: WorkoutBootstrapPayload = {
            workout: baseWorkout,
            settings: data.settings,
            lastSetSummaries: bootstrapSummaries,
            lastWorkoutReport: data.lastWorkoutReport || null,
            routineMeta: data.routineMeta,
          };
          saveWorkoutBootstrapCache({
            workoutName: decodedName,
            routineId: routineIdParam ?? (payload.routineMeta?.id ? String(payload.routineMeta.id) : null),
            payload,
          });
        }

        if (!baseWorkout) {
          throw new Error('Workout not found');
        }

        const sessionWorkout = loadSessionWorkout(baseWorkout.name, routineIdParam);
        const resolvedWorkout = sessionWorkout || baseWorkout;
        setWorkout(resolvedWorkout);
        setLastSetSummaries(bootstrapSummaries);

        const missingNames: string[] = [];
        for (const exercise of resolvedWorkout.exercises) {
          if (exercise.type === EXERCISE_TYPES.single) {
            if (!(exercise.name in bootstrapSummaries)) missingNames.push(exercise.name);
          } else {
            const [ex1, ex2] = exercise.exercises;
            if (!(ex1.name in bootstrapSummaries)) missingNames.push(ex1.name);
            if (!(ex2.name in bootstrapSummaries)) missingNames.push(ex2.name);
          }
        }
        if (missingNames.length > 0) {
          void refreshLastSetSummaries(missingNames);
        }

        if (bootstrapSettings) {
          const restSeconds = Number(bootstrapSettings?.restTimeSeconds);
          const supersetSeconds = Number(bootstrapSettings?.supersetRestSeconds);
          setRestTimeSeconds(Number.isFinite(restSeconds) ? restSeconds : 60);
          setSupersetRestSeconds(Number.isFinite(supersetSeconds) ? supersetSeconds : 15);
          setWeightUnit(normalizeWeightUnit(bootstrapSettings?.weightUnit));
          setHeightUnit(normalizeHeightUnit(bootstrapSettings?.heightUnit));
        }

        const { cache, nextIndex } = buildCompletedCacheFromSession(resolvedWorkout, routineId);
        if (cache.length > 0) {
          setCompletedExercisesCache(cache);
        }

        // Check for index in URL (for navigation from other sections)
        const indexParam = searchParams.get('index');
        const resumeIndexParam = searchParams.get('resumeIndex');
        const reviewParam = searchParams.get('review');
        let startIndex = 0;

        const exerciseCount = resolvedWorkout.exercises.length;
        const inProgress = getInProgressExercise();
        if (exerciseCount > 0) {
          if (nextIndex > 0) {
            startIndex = nextIndex >= exerciseCount ? exerciseCount - 1 : nextIndex;
          }
          if (inProgress && inProgress.exerciseIndex >= 0 && inProgress.exerciseIndex < exerciseCount) {
            startIndex = Math.max(startIndex, inProgress.exerciseIndex);
          }
          if (resumeIndexParam && !Number.isNaN(Number(resumeIndexParam))) {
            const resumeIndex = Math.min(
              Math.max(0, Number(resumeIndexParam)),
              exerciseCount - 1
            );
            startIndex = Math.max(startIndex, resumeIndex);
          }
        }

        let viewingIndex = startIndex;
        if (indexParam && !initialIndexSet) {
          const idx = parseInt(indexParam, 10);
          if (!Number.isNaN(idx) && idx >= 0 && idx < exerciseCount) {
            viewingIndex = idx;
            if (idx > startIndex) {
              startIndex = idx;
            }
          }
          setInitialIndexSet(true);
        }

        if (reviewParam === '1' && cache.length > 0 && exerciseCount > 0) {
          const firstCompletedIndex = cache.reduce((minIndex, entry) => (
            entry.exerciseIndex < minIndex ? entry.exerciseIndex : minIndex
          ), cache[0].exerciseIndex);
          viewingIndex = Math.min(Math.max(firstCompletedIndex, 0), exerciseCount - 1);
          setInitialIndexSet(true);
        }

        setCurrentExerciseIndex(startIndex);
        setViewingExerciseIndex(viewingIndex);

        // Initialize exercise at startIndex
        if (exerciseCount > 0) {
          const exercise = resolvedWorkout.exercises[startIndex];
          if (exercise.type === EXERCISE_TYPES.single) {
            initSingleExerciseState(exercise);
            if (inProgress && inProgress.exerciseIndex === startIndex && inProgress.type === EXERCISE_TYPES.single) {
              setCompletedSets(inProgress.completedSets ?? []);
              setWarmupDecision(inProgress.warmupDecision ?? 'pending');
              setWarmupCompleted(!!inProgress.warmupCompleted);
              if (typeof inProgress.currentSetIndex === 'number') {
                setCurrentSetIndex(inProgress.currentSetIndex);
              }
              if (inProgress.setData) {
                setSetData(inProgress.setData);
              }
              if (typeof inProgress.machineOnly === 'boolean') {
                setMachineOnly(inProgress.machineOnly);
              }
            }
          } else {
            // B2B exercise - no warmups, start at set 1
            const b2bEx = exercise as B2BExercise;
            const defaultMachineOnly1 = !!b2bEx.exercises[0].isMachine
              && isExerciseWeightMetric(b2bEx.exercises[0])
              && b2bEx.exercises[0].targetWeight <= 0;
            const defaultMachineOnly2 = !!b2bEx.exercises[1].isMachine
              && isExerciseWeightMetric(b2bEx.exercises[1])
              && b2bEx.exercises[1].targetWeight <= 0;
            setSetData1({
              weight: defaultMachineOnly1 ? 0 : b2bEx.exercises[0].targetWeight,
              reps: b2bEx.exercises[0].targetReps,
            });
            setSetData2({
              weight: defaultMachineOnly2 ? 0 : b2bEx.exercises[1].targetWeight,
              reps: b2bEx.exercises[1].targetReps,
            });
            setMachineOnly1(defaultMachineOnly1);
            setMachineOnly2(defaultMachineOnly2);
            setMachineOnlyHoldWeight1(b2bEx.exercises[0].targetWeight);
            setMachineOnlyHoldWeight2(b2bEx.exercises[1].targetWeight);
            setCurrentSetIndex(1);
            setCurrentExerciseInPair(0); // Start with first exercise
            setWarmupDecision('skip');
            setWarmupCompleted(false);

            if (inProgress && inProgress.exerciseIndex === startIndex && inProgress.type === EXERCISE_TYPES.b2b) {
              setCompletedPairs(inProgress.completedPairs ?? []);
              if (typeof inProgress.currentSetIndex === 'number') {
                setCurrentSetIndex(inProgress.currentSetIndex);
              }
              if (typeof inProgress.currentExerciseInPair === 'number') {
                setCurrentExerciseInPair(inProgress.currentExerciseInPair);
              }
              if (inProgress.setData1) {
                setSetData1(inProgress.setData1);
              }
              if (inProgress.setData2) {
                setSetData2(inProgress.setData2);
              }
              if (typeof inProgress.machineOnly1 === 'boolean') {
                setMachineOnly1(inProgress.machineOnly1);
              }
              if (typeof inProgress.machineOnly2 === 'boolean') {
                setMachineOnly2(inProgress.machineOnly2);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching workout:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchWorkout();
  }, [params.name, searchParams, routineIdParam, initialIndexSet]);

  // Rest timer countdown
  useEffect(() => {
    if (!isResting) return;
    if (restTimeRemaining > 0) {
      const timer = setTimeout(() => {
        setRestTimeRemaining(restTimeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }

    // Rest complete: vibrate and auto-advance to next set
    if ('vibrate' in navigator) {
      navigator.vibrate(500);
    }
    setIsResting(false);
  }, [isResting, restTimeRemaining]);

  // Transition timer countdown
  useEffect(() => {
    if (isTransitioning && transitionTimeRemaining > 0) {
      const timer = setTimeout(() => {
        setTransitionTimeRemaining(transitionTimeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isTransitioning && transitionTimeRemaining === 0 && workout) {
      // Transition complete - move to next exercise
      const nextExerciseIndex = currentExerciseIndex + 1;
      setIsTransitioning(false);
      setCurrentExerciseIndex(nextExerciseIndex);
      setViewingExerciseIndex(nextExerciseIndex); // Keep viewing in sync with active exercise
      setCompletedSets([]);

      // Initialize next exercise
      const nextExercise = workout.exercises[nextExerciseIndex];
      if (nextExercise.type === EXERCISE_TYPES.single) {
        initSingleExerciseState(nextExercise);
      } else {
        // B2B exercise - no warmups, start at set 1
        const b2bEx = nextExercise as B2BExercise;
        const defaultMachineOnly1 = !!b2bEx.exercises[0].isMachine
          && isExerciseWeightMetric(b2bEx.exercises[0])
          && b2bEx.exercises[0].targetWeight <= 0;
        const defaultMachineOnly2 = !!b2bEx.exercises[1].isMachine
          && isExerciseWeightMetric(b2bEx.exercises[1])
          && b2bEx.exercises[1].targetWeight <= 0;
        setSetData1({
          weight: defaultMachineOnly1 ? 0 : b2bEx.exercises[0].targetWeight,
          reps: b2bEx.exercises[0].targetReps,
        });
        setSetData2({
          weight: defaultMachineOnly2 ? 0 : b2bEx.exercises[1].targetWeight,
          reps: b2bEx.exercises[1].targetReps,
        });
        setMachineOnly1(defaultMachineOnly1);
        setMachineOnly2(defaultMachineOnly2);
        setMachineOnlyHoldWeight1(b2bEx.exercises[0].targetWeight);
        setMachineOnlyHoldWeight2(b2bEx.exercises[1].targetWeight);
        setCurrentSetIndex(1);
        setCurrentExerciseInPair(0);
        setCompletedPairs([]);
        setWarmupDecision('skip');
        setWarmupCompleted(false);
      }
    }
  }, [isTransitioning, transitionTimeRemaining, workout, currentExerciseIndex]);

  // Resolve last-set summaries from bootstrap cache
  useEffect(() => {
    if (!workout) return;
    const currentExercise = workout.exercises[currentExerciseIndex];
    if (currentExercise.type === EXERCISE_TYPES.single) {
      setLastExerciseLog(lastSetSummaries[currentExercise.name] ?? null);
      setLastPartnerExerciseLog(null);
      return;
    }
    const b2bExercise = currentExercise as B2BExercise;
    setLastExerciseLog(lastSetSummaries[b2bExercise.exercises[0].name] ?? null);
    setLastPartnerExerciseLog(lastSetSummaries[b2bExercise.exercises[1].name] ?? null);
  }, [workout, currentExerciseIndex, lastSetSummaries]);

  useEffect(() => {
    setShowSetReview(false);
  }, [currentExerciseIndex, viewingExerciseIndex]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
        <div className="text-white text-2xl">Loading...</div>
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

  const currentExercise = workout.exercises[currentExerciseIndex];

  // Review mode: determine if viewing a previous exercise
  const isReviewMode = viewingExerciseIndex < currentExerciseIndex;
  const isSetReview = showSetReview && viewingExerciseIndex === currentExerciseIndex;
  const viewingExercise = workout.exercises[viewingExerciseIndex];
  const viewingCachedData = completedExercisesCache.find(cache => cache.exerciseIndex === viewingExerciseIndex);
  const lastExerciseDate = lastExerciseLog?.completed_at || lastExerciseLog?.created_at;
  const lastPartnerExerciseDate = lastPartnerExerciseLog?.completed_at || lastPartnerExerciseLog?.created_at;

  // Calculate total workout items for progress
  const totalItems =
    workout.preWorkoutStretches.length +
    workout.exercises.length +
    (workout.cardio ? 1 : 0) +
    workout.postWorkoutStretches.length;
  const currentProgress = workout.preWorkoutStretches.length + currentExerciseIndex + 1;
  const progressPercentage = (currentProgress / totalItems) * 100;

  const reviewNextHandler = showSetReview
    ? () => setShowSetReview(false)
    : (isReviewMode ? () => setViewingExerciseIndex(viewingExerciseIndex + 1) : undefined);
  const reviewNextLabel = showSetReview ? 'Back to Set' : 'Next';

  // B2B Exercise Handlers
  const handleCompleteB2BExercise = () => {
    const b2bExercise = currentExercise as B2BExercise;
    const b2bRestSeconds = Math.max(0, supersetRestSeconds);

    if (currentExerciseInPair === 0) {
      // Just completed first exercise, immediately move to second
      setCurrentExerciseInPair(1);
      persistB2BProgress(completedPairs);
    } else {
      // Completed both exercises in the pair
      const newCompletedPairs = [...completedPairs, { ex1: setData1, ex2: setData2 }];
      const totalSets = b2bExercise.exercises[0].sets;

      console.log('B2B Completion Check:', {
        newCompletedPairsLength: newCompletedPairs.length,
        totalSets,
        shouldContinue: newCompletedPairs.length < totalSets
      });

      // Guard: Don't allow completing more sets than total
      if (newCompletedPairs.length > totalSets) {
        console.log('Already completed all sets, ignoring duplicate click');
        return;
      }

      void autosaveWorkout({
        type: 'b2b_set',
        exerciseName: b2bExercise.exercises[0].name,
        partnerName: b2bExercise.exercises[1].name,
        setIndex: currentSetIndex,
        weight: setData1.weight,
        reps: setData1.reps,
        partnerWeight: setData2.weight,
        partnerReps: setData2.reps,
      });

      setCompletedPairs(newCompletedPairs);
      const nextSetIndex = newCompletedPairs.length < totalSets ? currentSetIndex + 1 : currentSetIndex;
      const nextExerciseInPair = newCompletedPairs.length < totalSets ? 0 : currentExerciseInPair;
      setInProgressExercise({
        exerciseIndex: currentExerciseIndex,
        type: EXERCISE_TYPES.b2b,
        completedPairs: newCompletedPairs,
        currentSetIndex: nextSetIndex,
        currentExerciseInPair: nextExerciseInPair,
        setData1,
        setData2,
        machineOnly1,
        machineOnly2,
      });

      if (newCompletedPairs.length < totalSets) {
        // More sets to go - rest briefly before next set
        setCurrentSetIndex(currentSetIndex + 1);
        setCurrentExerciseInPair(0); // Reset to first exercise for next round
        if (b2bRestSeconds > 0) {
          setIsResting(true);
          setRestTimeRemaining(b2bRestSeconds);
        } else {
          setIsResting(false);
          setRestTimeRemaining(0);
        }
      } else {
        // All sets complete - save to session and show transition to next exercise
        console.log('Finishing B2B exercise');
        const sessionExerciseIndex = addExerciseToSession({
          name: b2bExercise.exercises[0].name,
          type: EXERCISE_TYPES.b2b,
          isMachine: b2bExercise.exercises[0].isMachine,
          primaryMetric: b2bExercise.exercises[0].primaryMetric,
          metricUnit: b2bExercise.exercises[0].metricUnit ?? null,
          sets: newCompletedPairs.map(pair => pair.ex1),
          b2bPartner: {
            name: b2bExercise.exercises[1].name,
            isMachine: b2bExercise.exercises[1].isMachine,
            primaryMetric: b2bExercise.exercises[1].primaryMetric,
            metricUnit: b2bExercise.exercises[1].metricUnit ?? null,
            sets: newCompletedPairs.map(pair => pair.ex2),
          },
        });

        // Cache completed B2B exercise for review
        setCompletedExercisesCache([...completedExercisesCache, {
          exerciseIndex: currentExerciseIndex,
          exerciseName: b2bExercise.exercises[0].name,
          type: EXERCISE_TYPES.b2b,
          sessionExerciseIndex,
          completedPairs: newCompletedPairs,
        }]);
        setInProgressExercise(null);

        if (currentExerciseIndex < workout!.exercises.length - 1) {
          setIsResting(false);
          setIsTransitioning(true);
          setTransitionTimeRemaining(60);
        } else {
          // All exercises done - always go to cardio (optional)
          router.push(`/workout/${encodeURIComponent(workout!.name)}/cardio${routineQuery}`);
        }
      }
    }
  };

  // Single Exercise Handlers
  const handleCompleteSet = () => {
    const newCompletedSets = [...completedSets, setData];
    setCompletedSets(newCompletedSets);

    const exercise = currentExercise as SingleExercise;
    const hasWarmup = resolveHasWarmup(exercise);
    const restSeconds = Math.max(0, restTimeSeconds);
    const isWarmupSet = hasWarmup && warmupDecision === 'include' && currentSetIndex === 0;

    void autosaveWorkout({
      type: 'single_set',
      exerciseName: exercise.name,
      setIndex: currentSetIndex,
      weight: setData.weight,
      reps: setData.reps,
      isWarmup: isWarmupSet,
    });

    if (currentSetIndex === 0 && hasWarmup) {
      setWarmupCompleted(true);
    }

    if (currentSetIndex < exercise.sets) {
      // More sets to go - start rest timer
      setCurrentSetIndex(currentSetIndex + 1);
      if (restSeconds > 0) {
        setIsResting(true);
        setRestTimeRemaining(restSeconds);
      } else {
        setIsResting(false);
        setRestTimeRemaining(0);
      }

      // Auto-update weight for next set (if it was warmup, switch to working weight)
      if (currentSetIndex === 0) {
        setSetData({
          weight: exercise.isMachine && machineOnly ? 0 : exercise.targetWeight,
          reps: exercise.targetReps,
        });
      }
      persistSingleProgress(newCompletedSets, currentSetIndex === 0
        ? {
            weight: exercise.isMachine && machineOnly ? 0 : exercise.targetWeight,
            reps: exercise.targetReps,
          }
        : setData);
    } else {
      // Exercise complete - save to session
      const sessionExerciseIndex = addExerciseToSession({
        name: exercise.name,
        type: EXERCISE_TYPES.single,
        isMachine: exercise.isMachine,
        primaryMetric: exercise.primaryMetric,
        metricUnit: exercise.metricUnit ?? null,
        warmup: hasWarmup && warmupCompleted ? newCompletedSets[0] : undefined,
        sets: hasWarmup && warmupCompleted ? newCompletedSets.slice(1) : newCompletedSets,
      });

      // Cache completed exercise for review
      setCompletedExercisesCache([...completedExercisesCache, {
        exerciseIndex: currentExerciseIndex,
        exerciseName: exercise.name,
        type: EXERCISE_TYPES.single,
        sessionExerciseIndex,
        completedSets: newCompletedSets,
        warmupCompleted,
      }]);
      setInProgressExercise(null);

      // Show transition to next exercise
      if (currentExerciseIndex < workout.exercises.length - 1) {
        setIsResting(false);
        setIsTransitioning(true);
        setTransitionTimeRemaining(60);
      } else {
        // All exercises done - always go to cardio (optional)
        router.push(`/workout/${encodeURIComponent(workout.name)}/cardio${routineQuery}`);
      }
    }
  };

  const handleSkipRest = () => {
    setIsResting(false);
    setRestTimeRemaining(0);
  };

  const handleStartWarmup = () => {
    const exercise = currentExercise as SingleExercise;
    const suggestedWeight = exercise.isMachine && machineOnly
      ? 0
      : (exercise.warmupWeight > 0 ? exercise.warmupWeight : 0);
    setWarmupDecision('include');
    setWarmupCompleted(false);
    setCurrentSetIndex(0);
    setSetData({
      weight: suggestedWeight,
      reps: exercise.targetReps,
    });
    setInProgressExercise({
      exerciseIndex: currentExerciseIndex,
      type: EXERCISE_TYPES.single,
      completedSets,
      warmupDecision: 'include',
      warmupCompleted: false,
      currentSetIndex: 0,
      setData: {
        weight: suggestedWeight,
        reps: exercise.targetReps,
      },
      machineOnly,
    });
  };

  const handleSkipWarmup = () => {
    const exercise = currentExercise as SingleExercise;
    // Move to set 1 (first working set)
    setWarmupDecision('skip');
    setCurrentSetIndex(1);
    setSetData({
      weight: exercise.isMachine && machineOnly ? 0 : exercise.targetWeight,
      reps: exercise.targetReps,
    });
    setWarmupCompleted(false);
    setInProgressExercise({
      exerciseIndex: currentExerciseIndex,
      type: EXERCISE_TYPES.single,
      completedSets,
      warmupDecision: 'skip',
      warmupCompleted: false,
      currentSetIndex: 1,
      setData: {
        weight: exercise.isMachine && machineOnly ? 0 : exercise.targetWeight,
        reps: exercise.targetReps,
      },
      machineOnly,
    });
  };

  const handleAddTime = () => {
    setRestTimeRemaining(restTimeRemaining + 15);
  };

  const handleSkipTransition = () => {
    setTransitionTimeRemaining(0);
  };

  const openHistory = (names: string[]) => {
    setHistoryExerciseNames(names);
    setShowHistory(true);
  };

  const closeHistory = () => {
    setShowHistory(false);
    setHistoryExerciseNames([]);
  };

  const handleEndExercise = () => {
    console.log('handleEndExercise called', {
      exerciseType: currentExercise.type,
      currentExerciseIndex,
      totalExercises: workout!.exercises.length
    });

    void autosaveWorkout({
      type: 'exercise_end',
    });

    // Save completed sets and move to next exercise
    if (currentExercise.type === EXERCISE_TYPES.single) {
      const exercise = currentExercise as SingleExercise;
      const hasWarmup = resolveHasWarmup(exercise);

      if (completedSets.length > 0) {
        const sessionExerciseIndex = addExerciseToSession({
          name: exercise.name,
          type: EXERCISE_TYPES.single,
          isMachine: exercise.isMachine,
          primaryMetric: exercise.primaryMetric,
          metricUnit: exercise.metricUnit ?? null,
          warmup: hasWarmup && warmupCompleted ? completedSets[0] : undefined,
          sets: hasWarmup && warmupCompleted ? completedSets.slice(1) : completedSets,
        });

        // Cache for review
        setCompletedExercisesCache([...completedExercisesCache, {
          exerciseIndex: currentExerciseIndex,
          exerciseName: exercise.name,
          type: EXERCISE_TYPES.single,
          sessionExerciseIndex,
          completedSets: completedSets,
          warmupCompleted,
        }]);
        setInProgressExercise(null);
      }
    } else {
      // B2B exercise
      const b2bExercise = currentExercise as B2BExercise;

      console.log('Ending B2B exercise early', {
        completedPairsLength: completedPairs.length
      });

      if (completedPairs.length > 0) {
        const sessionExerciseIndex = addExerciseToSession({
          name: b2bExercise.exercises[0].name,
          type: EXERCISE_TYPES.b2b,
          isMachine: b2bExercise.exercises[0].isMachine,
          primaryMetric: b2bExercise.exercises[0].primaryMetric,
          metricUnit: b2bExercise.exercises[0].metricUnit ?? null,
          sets: completedPairs.map(pair => pair.ex1),
          b2bPartner: {
            name: b2bExercise.exercises[1].name,
            isMachine: b2bExercise.exercises[1].isMachine,
            primaryMetric: b2bExercise.exercises[1].primaryMetric,
            metricUnit: b2bExercise.exercises[1].metricUnit ?? null,
            sets: completedPairs.map(pair => pair.ex2),
          },
        });

        // Cache for review
        setCompletedExercisesCache([...completedExercisesCache, {
          exerciseIndex: currentExerciseIndex,
          exerciseName: b2bExercise.exercises[0].name,
          type: EXERCISE_TYPES.b2b,
          sessionExerciseIndex,
          completedPairs: completedPairs,
        }]);
        setInProgressExercise(null);
      }
    }

    // Move to next exercise or finish
    if (currentExerciseIndex < workout!.exercises.length - 1) {
      console.log('Moving to next exercise');
      setIsResting(false);
      setIsTransitioning(true);
      setTransitionTimeRemaining(60);
      // Keep viewing index synced so next exercise isn't in read-only mode
      setViewingExerciseIndex(currentExerciseIndex);
    } else {
      console.log('All exercises done, going to cardio');
      // All exercises done - always go to cardio (optional)
      router.push(`/workout/${encodeURIComponent(workout!.name)}/cardio${routineQuery}`);
    }
  };

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // If viewing a previous exercise, go back one more
    if (viewingExerciseIndex > 0) {
      setViewingExerciseIndex(viewingExerciseIndex - 1);
    } else if (workout) {
      // At the first exercise, go back to pre-stretches (if any) or exit
      const preStretchCount = workout.preWorkoutStretches?.length || 0;
      if (preStretchCount > 0) {
        if (currentExercise.type === EXERCISE_TYPES.single) {
          setInProgressExercise({
            exerciseIndex: currentExerciseIndex,
            type: EXERCISE_TYPES.single,
            completedSets,
            warmupDecision,
            warmupCompleted,
            currentSetIndex,
            setData,
            machineOnly,
          });
        } else {
          setInProgressExercise({
            exerciseIndex: currentExerciseIndex,
            type: EXERCISE_TYPES.b2b,
            completedPairs,
            currentSetIndex,
            currentExerciseInPair,
            setData1,
            setData2,
            machineOnly1,
            machineOnly2,
          });
        }
        const stretchParams = new URLSearchParams(routineQueryParams.toString());
        stretchParams.set('index', String(preStretchCount - 1));
        stretchParams.set('from', 'active');
        stretchParams.set('resumeIndex', String(currentExerciseIndex));
        router.push(`/stretches/${encodeURIComponent(workout.name)}?${stretchParams.toString()}`);
      } else {
        setShowExitConfirm(true);
      }
    }
  };

  // Handle going to previous section (for WorkoutNavHeader)
  const handlePreviousSection = () => {
    if (!workout) return;

    const isReview = viewingExerciseIndex < currentExerciseIndex;
    if (!isReview && !showSetReview) {
      const canReviewSets = currentExercise.type === EXERCISE_TYPES.single
        ? completedSets.length > 0
        : completedPairs.length > 0;
      if (canReviewSets) {
        setShowSetReview(true);
        return;
      }
    }

    if (showSetReview) {
      setShowSetReview(false);
    }

    if (viewingExerciseIndex > 0) {
      setViewingExerciseIndex(viewingExerciseIndex - 1);
    } else {
      // Go to last pre-stretch
      const preStretchCount = workout.preWorkoutStretches?.length || 0;
      if (preStretchCount > 0) {
        if (currentExercise.type === EXERCISE_TYPES.single) {
          setInProgressExercise({
            exerciseIndex: currentExerciseIndex,
            type: EXERCISE_TYPES.single,
            completedSets,
            warmupDecision,
            warmupCompleted,
            currentSetIndex,
            setData,
            machineOnly,
          });
        } else {
          setInProgressExercise({
            exerciseIndex: currentExerciseIndex,
            type: EXERCISE_TYPES.b2b,
            completedPairs,
            currentSetIndex,
            currentExerciseInPair,
            setData1,
            setData2,
            machineOnly1,
            machineOnly2,
          });
        }
        const stretchParams = new URLSearchParams(routineQueryParams.toString());
        stretchParams.set('index', String(preStretchCount - 1));
        stretchParams.set('from', 'active');
        stretchParams.set('resumeIndex', String(currentExerciseIndex));
        router.push(`/stretches/${encodeURIComponent(workout.name)}?${stretchParams.toString()}`);
      }
    }
  };

  const handleForwardClick = () => {
    // Can only go forward if there are completed exercises ahead
    if (viewingExerciseIndex < currentExerciseIndex) {
      setViewingExerciseIndex(viewingExerciseIndex + 1);
    }
  };

  const buildSingleExercise = (exercise: ExerciseOption): SingleExercise => {
    const isBodyweight = typeof exercise.is_bodyweight === 'number'
      ? exercise.is_bodyweight === 1
      : false;
    const isMachine = typeof exercise.is_machine === 'number'
      ? exercise.is_machine === 1
      : false;
    return {
      type: EXERCISE_TYPES.single,
      name: exercise.name,
      sets: 3,
      targetReps: 10,
      targetWeight: 0,
      warmupWeight: 0,
      hasWarmup: !isBodyweight,
      restTime: 60,
      videoUrl: exercise.video_url || '',
      tips: exercise.tips || '',
      isBodyweight,
      isMachine
    };
  };

  const buildSupersetExercise = (exercise1: ExerciseOption, exercise2: ExerciseOption): B2BExercise => {
    const isBodyweight1 = typeof exercise1.is_bodyweight === 'number'
      ? exercise1.is_bodyweight === 1
      : false;
    const isBodyweight2 = typeof exercise2.is_bodyweight === 'number'
      ? exercise2.is_bodyweight === 1
      : false;
    const isMachine1 = typeof exercise1.is_machine === 'number'
      ? exercise1.is_machine === 1
      : false;
    const isMachine2 = typeof exercise2.is_machine === 'number'
      ? exercise2.is_machine === 1
      : false;
    return {
      type: EXERCISE_TYPES.b2b,
      restTime: 30,
      exercises: [
        {
          name: exercise1.name,
          sets: 3,
          targetReps: 10,
          targetWeight: 0,
          warmupWeight: 0,
          hasWarmup: false,
          videoUrl: exercise1.video_url || '',
          tips: exercise1.tips || '',
          isBodyweight: isBodyweight1,
          isMachine: isMachine1
        },
        {
          name: exercise2.name,
          sets: 3,
          targetReps: 10,
          targetWeight: 0,
          warmupWeight: 0,
          hasWarmup: false,
          videoUrl: exercise2.video_url || '',
          tips: exercise2.tips || '',
          isBodyweight: isBodyweight2,
          isMachine: isMachine2
        }
      ]
    };
  };

  const applyWorkoutUpdate = (updatedWorkout: WorkoutPlan) => {
    setWorkout(updatedWorkout);
    saveSessionWorkout(updatedWorkout, routineIdParam);
  };

  const resetExerciseStateFor = (exercise: Exercise) => {
    setIsResting(false);
    setRestTimeRemaining(0);
    setIsTransitioning(false);
    setTransitionTimeRemaining(60);
    setCompletedSets([]);
    setCompletedPairs([]);
    setCurrentExerciseInPair(0);
    setLastExerciseLog(null);
    setLastPartnerExerciseLog(null);
    setShowSetReview(false);

    if (exercise.type === EXERCISE_TYPES.single) {
      initSingleExerciseState(exercise);
    } else {
      const b2bExercise = exercise as B2BExercise;
      const defaultMachineOnly1 = !!b2bExercise.exercises[0].isMachine
        && isExerciseWeightMetric(b2bExercise.exercises[0])
        && b2bExercise.exercises[0].targetWeight <= 0;
      const defaultMachineOnly2 = !!b2bExercise.exercises[1].isMachine
        && isExerciseWeightMetric(b2bExercise.exercises[1])
        && b2bExercise.exercises[1].targetWeight <= 0;
      setSetData1({
        weight: defaultMachineOnly1 ? 0 : b2bExercise.exercises[0].targetWeight,
        reps: b2bExercise.exercises[0].targetReps,
      });
      setSetData2({
        weight: defaultMachineOnly2 ? 0 : b2bExercise.exercises[1].targetWeight,
        reps: b2bExercise.exercises[1].targetReps,
      });
      setMachineOnly1(defaultMachineOnly1);
      setMachineOnly2(defaultMachineOnly2);
      setMachineOnlyHoldWeight1(b2bExercise.exercises[0].targetWeight);
      setMachineOnlyHoldWeight2(b2bExercise.exercises[1].targetWeight);
      setCurrentSetIndex(1);
      setWarmupDecision('skip');
      setWarmupCompleted(false);
    }

    setViewingExerciseIndex(currentExerciseIndex);
  };

  const updateReviewSingleSet = (setIndex: number, updates: Partial<SetData>) => {
    setCompletedExercisesCache((prev) => prev.map((cache) => {
      if (cache.exerciseIndex !== viewingExerciseIndex) return cache;
      const nextSets = cache.completedSets ? [...cache.completedSets] : [];
      if (!nextSets[setIndex]) return cache;
      nextSets[setIndex] = { ...nextSets[setIndex], ...updates };
      return { ...cache, completedSets: nextSets };
    }));
  };

  const updateReviewPair = (
    pairIndex: number,
    updates: { ex1?: Partial<SetData>; ex2?: Partial<SetData> }
  ) => {
    setCompletedExercisesCache((prev) => prev.map((cache) => {
      if (cache.exerciseIndex !== viewingExerciseIndex) return cache;
      const nextPairs = cache.completedPairs ? [...cache.completedPairs] : [];
      if (!nextPairs[pairIndex]) return cache;
      const currentPair = nextPairs[pairIndex];
      nextPairs[pairIndex] = {
        ex1: { ...currentPair.ex1, ...(updates.ex1 ?? {}) },
        ex2: { ...currentPair.ex2, ...(updates.ex2 ?? {}) },
      };
      return { ...cache, completedPairs: nextPairs };
    }));
  };

  const updateActiveSingleSet = (setIndex: number, updates: Partial<SetData>) => {
    setCompletedSets((prev) => {
      if (!prev[setIndex]) return prev;
      const nextSets = [...prev];
      nextSets[setIndex] = { ...nextSets[setIndex], ...updates };
      return nextSets;
    });
  };

  const persistSingleProgress = (nextCompletedSets: SetData[], nextSetData?: SetData) => {
    setInProgressExercise({
      exerciseIndex: currentExerciseIndex,
      type: EXERCISE_TYPES.single,
      completedSets: nextCompletedSets,
      warmupDecision,
      warmupCompleted,
      currentSetIndex,
      setData: nextSetData ?? setData,
      machineOnly,
    });
  };

  const updateActivePair = (
    pairIndex: number,
    updates: { ex1?: Partial<SetData>; ex2?: Partial<SetData> }
  ) => {
    setCompletedPairs((prev) => {
      if (!prev[pairIndex]) return prev;
      const nextPairs = [...prev];
      const currentPair = nextPairs[pairIndex];
      nextPairs[pairIndex] = {
        ex1: { ...currentPair.ex1, ...(updates.ex1 ?? {}) },
        ex2: { ...currentPair.ex2, ...(updates.ex2 ?? {}) },
      };
      return nextPairs;
    });
  };

  const persistB2BProgress = (nextCompletedPairs: Array<{ ex1: SetData; ex2: SetData }>) => {
    setInProgressExercise({
      exerciseIndex: currentExerciseIndex,
      type: EXERCISE_TYPES.b2b,
      completedPairs: nextCompletedPairs,
      currentSetIndex,
      currentExerciseInPair,
      setData1,
      setData2,
      machineOnly1,
      machineOnly2,
    });
  };

  const fetchLastSetSummary = async (exerciseName: string): Promise<LastSetSummary> => {
    try {
      const response = await fetch(
        `/api/last-exercise?exerciseName=${encodeURIComponent(exerciseName)}`
      );
      if (!response.ok) return null;
      const data = await response.json();
      return data.lastLog ?? null;
    } catch (error) {
      console.error('Error fetching last exercise log:', error);
      return null;
    }
  };

  const refreshLastSetSummaries = async (exerciseNames: string[]) => {
    const entries = await Promise.all(
      exerciseNames.map(async (name) => [name, await fetchLastSetSummary(name)] as const)
    );
    setLastSetSummaries((prev) => ({
      ...prev,
      ...Object.fromEntries(entries),
    }));
  };

  const runWithChangeWarning = (action: () => void) => {
    if (!workout) return;
    if (hasChangeWarningAck(workout.name, routineIdParam)) {
      action();
      return;
    }
    pendingChangeRef.current = action;
    setShowChangeWarning(true);
  };

  const handleWarningContinue = () => {
    if (!workout) {
      setShowChangeWarning(false);
      return;
    }
    acknowledgeChangeWarning(workout.name, routineIdParam);
    setShowChangeWarning(false);
    const action = pendingChangeRef.current;
    pendingChangeRef.current = null;
    action?.();
  };

  const handleWarningCancel = () => {
    pendingChangeRef.current = null;
    setShowChangeWarning(false);
  };

  const openExerciseTypePicker = (mode: 'add' | 'replace') => {
    runWithChangeWarning(() => {
      setExerciseActionMode(mode);
      setShowExerciseTypePicker(true);
    });
  };

  const handleSelectSingleExercise = (exercise: ExerciseOption) => {
    if (!workout || !exerciseActionMode) return;
    const nextExercise = buildSingleExercise(exercise);
    const updatedExercises = [...workout.exercises];
    const insertIndex = currentExerciseIndex;

    if (exerciseActionMode === 'add') {
      updatedExercises.splice(insertIndex, 0, nextExercise);
      resetExerciseStateFor(nextExercise);
    } else {
      updatedExercises[currentExerciseIndex] = nextExercise;
      resetExerciseStateFor(nextExercise);
    }

    applyWorkoutUpdate({ ...workout, exercises: updatedExercises });
    setExerciseActionMode(null);
    setShowExerciseSelector(false);
    void refreshLastSetSummaries([exercise.name]);
  };

  const handleSelectSuperset = (exercise1: ExerciseOption, exercise2: ExerciseOption) => {
    if (!workout || !exerciseActionMode) return;
    const nextExercise = buildSupersetExercise(exercise1, exercise2);
    const updatedExercises = [...workout.exercises];
    const insertIndex = currentExerciseIndex;

    if (exerciseActionMode === 'add') {
      updatedExercises.splice(insertIndex, 0, nextExercise);
      resetExerciseStateFor(nextExercise);
    } else {
      updatedExercises[currentExerciseIndex] = nextExercise;
      resetExerciseStateFor(nextExercise);
    }

    applyWorkoutUpdate({ ...workout, exercises: updatedExercises });
    setExerciseActionMode(null);
    setShowSupersetSelector(false);
    void refreshLastSetSummaries([exercise1.name, exercise2.name]);
  };

  const handleExerciseTypeCancel = () => {
    setShowExerciseTypePicker(false);
    setExerciseActionMode(null);
  };

  // Determine which exercise to display (for review mode vs active mode)
  const exerciseToDisplay = isReviewMode ? viewingExercise : currentExercise;
  const modifyAccentClasses = exerciseToDisplay.type === EXERCISE_TYPES.b2b
    ? 'bg-purple-600 hover:bg-purple-500'
    : 'bg-rose-800 hover:bg-rose-700';
  const hasExerciseStarted = currentExercise.type === EXERCISE_TYPES.b2b
    ? completedPairs.length > 0 || currentExerciseInPair !== 0
    : completedSets.length > 0;
  const canModifyExercise = !isReviewMode && !hasExerciseStarted;
  const exerciseModifyControls = canModifyExercise ? (
    <div className="flex items-center gap-2">
      <button
        onClick={() => openExerciseTypePicker('add')}
        className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold text-white transition-colors ${modifyAccentClasses}`}
      >
        + Add Exercise
      </button>
      <button
        onClick={() => openExerciseTypePicker('replace')}
        className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold text-white transition-colors ${modifyAccentClasses}`}
      >
        ↺ Replace
      </button>
    </div>
  ) : null;
  const exerciseModals = (
    <>
      {showChangeWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-lg border border-zinc-700 bg-zinc-900 p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Session-only change</h3>
            <p className="text-sm text-zinc-300 mb-6">
              This edit only applies to today&apos;s workout. Edit the routine to make a permanent change.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleWarningCancel}
                className="rounded-lg bg-zinc-700 py-2 text-sm font-semibold text-white hover:bg-zinc-600"
              >
                Cancel
              </button>
              <button
                onClick={handleWarningContinue}
                className="rounded-lg bg-emerald-600 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {showExerciseTypePicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-sm rounded-lg border border-zinc-700 bg-zinc-900 p-5 text-white">
            <h3 className="text-lg font-semibold mb-4">Choose exercise type</h3>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowExerciseTypePicker(false);
                  setShowExerciseSelector(true);
                }}
                className="w-full rounded-lg bg-rose-800 py-2 text-sm font-semibold text-white hover:bg-rose-700"
              >
                Single exercise
              </button>
              <button
                onClick={() => {
                  setShowExerciseTypePicker(false);
                  setShowSupersetSelector(true);
                }}
                className="w-full rounded-lg bg-purple-600 py-2 text-sm font-semibold text-white hover:bg-purple-500"
              >
                Superset
              </button>
              <button
                onClick={handleExerciseTypeCancel}
                className="w-full rounded-lg bg-zinc-700 py-2 text-sm font-semibold text-white hover:bg-zinc-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showExerciseSelector && (
        <ExerciseSelector
          title={exerciseActionMode === 'replace' ? 'Replace Exercise' : 'Add Exercise'}
          onCancel={() => {
            setShowExerciseSelector(false);
            setExerciseActionMode(null);
          }}
          onSelect={handleSelectSingleExercise}
        />
      )}

      {showSupersetSelector && (
        <SupersetSelector
          onCancel={() => {
            setShowSupersetSelector(false);
            setExerciseActionMode(null);
          }}
          onSelect={handleSelectSuperset}
        />
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
    </>
  );

  // Handle B2B/Superset exercises
  if (exerciseToDisplay.type === EXERCISE_TYPES.b2b) {
    const b2bExercise = exerciseToDisplay as B2BExercise;
    const ex1 = b2bExercise.exercises[0];
    const ex2 = b2bExercise.exercises[1];
    const ex1MetricInfo = getMetricInfo(ex1);
    const ex2MetricInfo = getMetricInfo(ex2);
    const ex1RepsOnly = isRepsOnlyMetric(ex1MetricInfo.primaryMetric);
    const ex2RepsOnly = isRepsOnlyMetric(ex2MetricInfo.primaryMetric);
    const ex1IsWeightMetric = isWeightMetric(ex1MetricInfo.primaryMetric);
    const ex2IsWeightMetric = isWeightMetric(ex2MetricInfo.primaryMetric);
    const ex1Machine = !!ex1.isMachine && ex1IsWeightMetric;
    const ex2Machine = !!ex2.isMachine && ex2IsWeightMetric;
    const showMachineToggle1 = ex1Machine && !ex1RepsOnly;
    const showMachineToggle2 = ex2Machine && !ex2RepsOnly;
    const showMetricInput1 = !ex1RepsOnly && !(ex1Machine && machineOnly1);
    const showMetricInput2 = !ex2RepsOnly && !(ex2Machine && machineOnly2);

    // In review mode, show cached completed pairs
    const displayCompletedPairs = isReviewMode && viewingCachedData
      ? viewingCachedData.completedPairs || []
      : completedPairs;

    const commitReviewPair = (pairIndex: number) => {
      if (!viewingCachedData?.completedPairs) return;
      const pair = viewingCachedData.completedPairs[pairIndex];
      if (!pair) return;
      const sessionExerciseIndex = viewingCachedData.sessionExerciseIndex;
      if (sessionExerciseIndex === null || sessionExerciseIndex === undefined) return;

      updateExerciseInSession(sessionExerciseIndex, (exercise) => {
        const nextSets = [...(exercise.sets || [])];
        nextSets[pairIndex] = {
          weight: pair.ex1.weight,
          reps: pair.ex1.reps,
        };
        const nextPartner = exercise.b2bPartner
          ? { ...exercise.b2bPartner, sets: [...(exercise.b2bPartner.sets || [])] }
          : {
              name: ex2.name,
              sets: [],
            };
        nextPartner.sets[pairIndex] = {
          weight: pair.ex2.weight,
          reps: pair.ex2.reps,
        };
        return {
          ...exercise,
          sets: nextSets,
          b2bPartner: nextPartner,
        };
      });

      void autosaveWorkout({
        type: 'b2b_set',
        exerciseName: ex1.name,
        partnerName: ex2.name,
        setIndex: pairIndex + 1,
        weight: pair.ex1.weight,
        reps: pair.ex1.reps,
        partnerWeight: pair.ex2.weight,
        partnerReps: pair.ex2.reps,
      });
    };

    const commitActivePair = (pairIndex: number) => {
      const pair = completedPairs[pairIndex];
      if (!pair) return;
      void autosaveWorkout({
        type: 'b2b_set',
        exerciseName: ex1.name,
        partnerName: ex2.name,
        setIndex: pairIndex + 1,
        weight: pair.ex1.weight,
        reps: pair.ex1.reps,
        partnerWeight: pair.ex2.weight,
        partnerReps: pair.ex2.reps,
      });
      setInProgressExercise({
        exerciseIndex: currentExerciseIndex,
        type: EXERCISE_TYPES.b2b,
        completedPairs,
        currentSetIndex,
        currentExerciseInPair,
        setData1,
        setData2,
        machineOnly1,
        machineOnly2,
      });
    };

    if (isSetReview) {
      return (
        <div className="min-h-screen bg-zinc-900 p-4 pb-32">
          <div className="max-w-2xl mx-auto">
            <WorkoutNavHeader
              exitUrl={`/workout/${encodeURIComponent(workout.name)}${routineQuery}`}
              previousUrl={null}
              onPrevious={handlePreviousSection}
              onNext={reviewNextHandler}
              nextLabel={reviewNextLabel}
            />
            <div className="flex justify-end mb-2">
              <AutosaveBadge />
            </div>
            <div className="text-zinc-400 text-right mb-4 -mt-4">
              Exercise {viewingExerciseIndex + 1}/{workout.exercises.length}
            </div>

            <div className="bg-zinc-800 rounded-lg p-4 mb-6 border border-purple-700">
              <div className="text-purple-300 text-xs mb-2">COMPLETED SETS</div>
              <div className="text-white text-lg font-semibold mb-1">
                {ex1.name} + {ex2.name}
              </div>
              <div className="text-zinc-400 text-sm">
                Review completed sets for this superset.
              </div>
            </div>

            {displayCompletedPairs.length === 0 ? (
              <div className="bg-zinc-800 rounded-lg p-4 text-zinc-400 text-sm">
                No completed sets logged for this superset yet.
              </div>
            ) : (
              <div className="space-y-4">
                {displayCompletedPairs.map((pair, index) => (
                  <div key={index} className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                    <div className="text-zinc-400 text-xs mb-3">Set {index + 1}</div>
                    <div className="space-y-3">
                      <div className="bg-zinc-900 rounded-lg p-3">
                        <div className="text-purple-300 text-xs mb-2">{ex1.name}</div>
                        <div className={`grid ${ex1RepsOnly ? 'grid-cols-1' : 'grid-cols-2'} gap-3`}>
                          {!ex1RepsOnly && (
                            <div>
                              <label className="text-zinc-500 text-xs block mb-1">
                                {getMetricLabelText(ex1MetricInfo, ex1Machine)}
                              </label>
                              <input
                                type="text"
                                inputMode="decimal"
                                value={formatMetricValueInput(pair.ex1.weight, ex1MetricInfo)}
                                onChange={(e) => {
                                  const nextValue = parseMetricValueInput(e.target.value, ex1MetricInfo);
                                  if (nextValue !== null) {
                                    updateActivePair(index, { ex1: { weight: nextValue } });
                                  }
                                }}
                                onBlur={() => commitActivePair(index)}
                                className="w-full bg-zinc-800 text-white text-xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                            </div>
                          )}
                          <div>
                            <label className="text-zinc-500 text-xs block mb-1">Reps</label>
                            <input
                              type="text"
                              inputMode="numeric"
                              value={pair.ex1.reps ?? ''}
                              onChange={(e) => {
                                const reps = parseInt(e.target.value, 10) || 0;
                                updateActivePair(index, { ex1: { reps } });
                              }}
                              onBlur={() => commitActivePair(index)}
                              className="w-full bg-zinc-800 text-white text-xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="bg-zinc-900 rounded-lg p-3">
                        <div className="text-purple-300 text-xs mb-2">{ex2.name}</div>
                        <div className={`grid ${ex2RepsOnly ? 'grid-cols-1' : 'grid-cols-2'} gap-3`}>
                          {!ex2RepsOnly && (
                            <div>
                              <label className="text-zinc-500 text-xs block mb-1">
                                {getMetricLabelText(ex2MetricInfo, ex2Machine)}
                              </label>
                              <input
                                type="text"
                                inputMode="decimal"
                                value={formatMetricValueInput(pair.ex2.weight, ex2MetricInfo)}
                                onChange={(e) => {
                                  const nextValue = parseMetricValueInput(e.target.value, ex2MetricInfo);
                                  if (nextValue !== null) {
                                    updateActivePair(index, { ex2: { weight: nextValue } });
                                  }
                                }}
                                onBlur={() => commitActivePair(index)}
                                className="w-full bg-zinc-800 text-white text-xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                            </div>
                          )}
                          <div>
                            <label className="text-zinc-500 text-xs block mb-1">Reps</label>
                            <input
                              type="text"
                              inputMode="numeric"
                              value={pair.ex2.reps ?? ''}
                              onChange={(e) => {
                                const reps = parseInt(e.target.value, 10) || 0;
                                updateActivePair(index, { ex2: { reps } });
                              }}
                              onBlur={() => commitActivePair(index)}
                              className="w-full bg-zinc-800 text-white text-xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {exerciseModals}
          </div>
        </div>
      );
    }

    if (isReviewMode) {
      const reviewMetricInput1 = !ex1RepsOnly;
      const reviewMetricInput2 = !ex2RepsOnly;
      return (
        <div className="min-h-screen bg-zinc-900 p-4 pb-32">
          <div className="max-w-2xl mx-auto">
            <WorkoutNavHeader
              exitUrl={`/workout/${encodeURIComponent(workout.name)}${routineQuery}`}
              previousUrl={null}
              onPrevious={handlePreviousSection}
              onNext={reviewNextHandler}
              nextLabel={reviewNextLabel}
            />
            <div className="flex justify-end mb-2">
              <AutosaveBadge />
            </div>
            <div className="text-zinc-400 text-right mb-4 -mt-4">
              Exercise {viewingExerciseIndex + 1}/{workout.exercises.length}
            </div>

            <div className="bg-zinc-800 rounded-lg p-4 mb-6 border border-purple-700">
              <div className="text-purple-300 text-xs mb-2">EDIT COMPLETED SETS</div>
              <div className="text-white text-lg font-semibold mb-1">
                {ex1.name} + {ex2.name}
              </div>
              <div className="text-zinc-400 text-sm">
                Update any set values from earlier in today&apos;s workout.
              </div>
            </div>

            {displayCompletedPairs.length === 0 ? (
              <div className="bg-zinc-800 rounded-lg p-4 text-zinc-400 text-sm">
                No completed sets logged for this superset yet.
              </div>
            ) : (
              <div className="space-y-4">
                {displayCompletedPairs.map((pair, index) => (
                  <div key={index} className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                    <div className="text-zinc-400 text-xs mb-3">Set {index + 1}</div>
                    <div className="space-y-3">
                      <div className="bg-zinc-900 rounded-lg p-3">
                        <div className="text-purple-300 text-xs mb-2">{ex1.name}</div>
                        <div className={`grid ${reviewMetricInput1 ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
                          {reviewMetricInput1 && (
                            <div>
                              <label className="text-zinc-500 text-xs block mb-1">
                                {getMetricLabelText(ex1MetricInfo, ex1Machine)}
                              </label>
                              <input
                                type="text"
                                inputMode="decimal"
                                value={formatMetricValueInput(pair.ex1.weight, ex1MetricInfo)}
                                onChange={(e) => {
                                  const nextValue = parseMetricValueInput(e.target.value, ex1MetricInfo);
                                  if (nextValue !== null) {
                                    updateReviewPair(index, { ex1: { weight: nextValue } });
                                  }
                                }}
                                onBlur={() => commitReviewPair(index)}
                                className="w-full bg-zinc-800 text-white text-xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                            </div>
                          )}
                          <div>
                            <label className="text-zinc-500 text-xs block mb-1">Reps</label>
                            <input
                              type="text"
                              inputMode="numeric"
                              value={pair.ex1.reps ?? ''}
                              onChange={(e) => {
                                const reps = parseInt(e.target.value, 10) || 0;
                                updateReviewPair(index, { ex1: { reps } });
                              }}
                              onBlur={() => commitReviewPair(index)}
                              className="w-full bg-zinc-800 text-white text-xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="bg-zinc-900 rounded-lg p-3">
                        <div className="text-purple-300 text-xs mb-2">{ex2.name}</div>
                        <div className={`grid ${reviewMetricInput2 ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
                          {reviewMetricInput2 && (
                            <div>
                              <label className="text-zinc-500 text-xs block mb-1">
                                {getMetricLabelText(ex2MetricInfo, ex2Machine)}
                              </label>
                              <input
                                type="text"
                                inputMode="decimal"
                                value={formatMetricValueInput(pair.ex2.weight, ex2MetricInfo)}
                                onChange={(e) => {
                                  const nextValue = parseMetricValueInput(e.target.value, ex2MetricInfo);
                                  if (nextValue !== null) {
                                    updateReviewPair(index, { ex2: { weight: nextValue } });
                                  }
                                }}
                                onBlur={() => commitReviewPair(index)}
                                className="w-full bg-zinc-800 text-white text-xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                            </div>
                          )}
                          <div>
                            <label className="text-zinc-500 text-xs block mb-1">Reps</label>
                            <input
                              type="text"
                              inputMode="numeric"
                              value={pair.ex2.reps ?? ''}
                              onChange={(e) => {
                                const reps = parseInt(e.target.value, 10) || 0;
                                updateReviewPair(index, { ex2: { reps } });
                              }}
                              onBlur={() => commitReviewPair(index)}
                              className="w-full bg-zinc-800 text-white text-xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => openHistory([ex1.name, ex2.name])}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                📈 History
              </button>
            </div>

            {exerciseModals}
          </div>
        </div>
      );
    }

    // Transition Screen (for B2B)
    if (isTransitioning) {
      return (
        <div className="min-h-screen bg-zinc-900 p-4">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="text-zinc-400">Exercise {currentExerciseIndex + 1}/{workout.exercises.length}</div>
            </div>

            {/* Exercise Names */}
            <h1 className="text-2xl font-bold text-white text-center mb-2">{ex1.name}</h1>
            <div className="text-purple-400 text-center text-lg mb-8">+ {ex2.name}</div>

            {/* Exercise Complete */}
            <div className="text-center mb-8">
              <div className="text-green-500 text-6xl mb-2">✓</div>
              <div className="text-white text-2xl font-semibold">EXERCISE COMPLETE</div>
            </div>

            {/* Transition Timer */}
            <div className={`bg-zinc-800 rounded-lg p-12 mb-8 text-center border-4 ${transitionTimeRemaining === 0 ? 'border-zinc-700' : 'border-orange-600'}`}>
              <div className={`text-xl mb-4 ${transitionTimeRemaining === 0 ? 'text-zinc-400' : 'text-orange-400'}`}>Chilll Outtt</div>
              <div className={`text-8xl font-bold mb-2 ${transitionTimeRemaining === 0 ? 'text-orange-400' : 'text-white'}`}>
                {transitionTimeRemaining}
              </div>
              <div className="text-zinc-400 text-lg">seconds</div>
            </div>

            {/* Timer Controls */}
            <div className="space-y-3">
              <button
                onClick={() => setTransitionTimeRemaining(0)}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg text-lg font-bold transition-colors"
              >
                Skip Timer →
              </button>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setTransitionTimeRemaining(Math.max(0, transitionTimeRemaining - 15))}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  -15s
                </button>
                <button
                  onClick={() => setTransitionTimeRemaining(transitionTimeRemaining + 15)}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  +15s
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Rest Timer Screen (for B2B)
    if (isResting) {
      return (
        <div className="min-h-screen bg-zinc-900 p-4">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="text-zinc-400">Exercise {currentExerciseIndex + 1}/{workout.exercises.length}</div>
            </div>

            {/* Exercise Names */}
            <h1 className="text-2xl font-bold text-white text-center mb-2">{ex1.name}</h1>
            <div className="text-purple-400 text-center text-lg mb-8">+ {ex2.name}</div>

            {/* Set Complete */}
            <div className="text-center mb-8">
              <div className="text-green-500 text-6xl mb-2">✓</div>
              <div className="text-white text-2xl font-semibold">
                SET {completedPairs.length} COMPLETE
              </div>
            </div>

            {/* Rest Timer */}
            <div className={`bg-zinc-800 rounded-lg p-12 mb-8 text-center border-4 ${restTimeRemaining === 0 ? 'border-zinc-700' : 'border-purple-600'}`}>
              <div className={`text-xl mb-4 ${restTimeRemaining === 0 ? 'text-zinc-400' : 'text-purple-400'}`}>REST TIME</div>
              <div className={`text-8xl font-bold mb-2 ${restTimeRemaining === 0 ? 'text-purple-400' : 'text-white'}`}>
                {restTimeRemaining}
              </div>
              <div className="text-zinc-400 text-lg">seconds</div>
            </div>

            {/* Timer Controls */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button
                onClick={handleAddTime}
                className="bg-zinc-700 hover:bg-zinc-600 text-white py-4 rounded-lg text-lg font-semibold transition-colors"
              >
                + Add 15s
              </button>
              <button
                onClick={handleSkipRest}
                className="bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg text-lg font-semibold transition-colors"
              >
                {restTimeRemaining === 0 ? 'Continue Workout' : 'Skip Rest'}
              </button>
            </div>

            {/* Next Set Info */}
            <div className="bg-zinc-800 rounded-lg p-4 text-center">
              <div className="text-zinc-400 text-sm mb-2">Next up:</div>
              <div className="text-white text-xl font-semibold">
                Set {currentSetIndex}
              </div>
              <div className="text-zinc-300 text-base">
                {ex1.name} → {ex2.name}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // B2B Exercise Tracking Screen
    return (
      <div className="min-h-screen bg-zinc-900 p-4 pb-32">
        <div className="max-w-2xl mx-auto">
          {/* Navigation */}
          <WorkoutNavHeader
            exitUrl={`/workout/${encodeURIComponent(workout.name)}${routineQuery}`}
            previousUrl={null}
            onPrevious={handlePreviousSection}
            onNext={reviewNextHandler}
            nextLabel={reviewNextLabel}
          />
          <div className="flex justify-end mb-2">
            <AutosaveBadge />
          </div>
          <div className="text-zinc-400 text-right mb-4 -mt-4">Exercise {viewingExerciseIndex + 1}/{workout.exercises.length}</div>

          {/* READ ONLY Banner */}
          {isReviewMode && (
            <div className="bg-yellow-900 border border-yellow-600 rounded-lg p-3 mb-6">
              <div className="text-yellow-200 text-sm font-semibold text-center">
                📖 READ ONLY - Cannot edit completed sets
              </div>
            </div>
          )}

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="text-zinc-500 text-sm text-center mt-2">
              Overall Progress: {currentProgress} / {totalItems}
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4">
            {exerciseModifyControls}
            <button
              onClick={() => openHistory([ex1.name, ex2.name])}
              className="ml-auto bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              📈 History
            </button>
          </div>

          {/* Superset Title */}
          <div className="text-center mb-6">
            <div className="text-purple-400 text-sm font-bold mb-2">🔄 SUPERSET</div>
            <div className="text-white text-lg font-semibold mb-1">
              SET {currentSetIndex} of {ex1.sets}
            </div>
          </div>

          {/* Last Time Section for B2B */}
          {(lastExerciseLog || lastPartnerExerciseLog) && (
            <div className="bg-zinc-800 rounded-lg p-4 mb-6 border border-zinc-700">
              <div className="text-zinc-400 text-sm mb-3">LAST TIME</div>
              <div className="grid grid-cols-2 gap-4">
                {/* Exercise 1 Last Time */}
                <div>
                  <div className="text-purple-400 text-xs font-semibold mb-1">{ex1.name}</div>
                  {lastExerciseLog ? (
                    <>
                      <div className="text-zinc-500 text-xs mb-2">
                        {formatLocalDate(lastExerciseDate)}
                      </div>
                      <div className="space-y-1">
                        {([1, 2, 3, 4] as const).map((setNum) => {
                          const weight = getLogSetValue(lastExerciseLog, setNum, 'weight');
                          const reps = getLogSetValue(lastExerciseLog, setNum, 'reps');
                          if (weight !== null && reps !== null) {
                            return (
                              <div key={setNum} className="text-zinc-300 text-xs">
                                {ex1RepsOnly
                                  ? `Set ${setNum}: ${reps} reps`
                                  : `Set ${setNum}: ${formatMetric(weight, ex1MetricInfo, ex1Machine)} × ${reps}`}
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </>
                  ) : (
                    <div className="text-zinc-500 text-xs">No history yet</div>
                  )}
                </div>
                {/* Exercise 2 Last Time */}
                <div>
                  <div className="text-purple-400 text-xs font-semibold mb-1">{ex2.name}</div>
                  {lastPartnerExerciseLog ? (
                    <>
                      <div className="text-zinc-500 text-xs mb-2">
                        {formatLocalDate(lastPartnerExerciseDate)}
                      </div>
                      <div className="space-y-1">
                        {([1, 2, 3, 4] as const).map((setNum) => {
                          const weight = getLogSetValue(lastPartnerExerciseLog, setNum, 'weight');
                          const reps = getLogSetValue(lastPartnerExerciseLog, setNum, 'reps');
                          if (weight !== null && reps !== null) {
                            return (
                              <div key={setNum} className="text-zinc-300 text-xs">
                                {ex2RepsOnly
                                  ? `Set ${setNum}: ${reps} reps`
                                  : `Set ${setNum}: ${formatMetric(weight, ex2MetricInfo, ex2Machine)} × ${reps}`}
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </>
                  ) : (
                    <div className="text-zinc-500 text-xs">No history yet</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Exercise 1 Card */}
          <div className={`bg-zinc-800 rounded-lg p-5 mb-4 transition-all ${
            currentExerciseInPair === 0 ? 'border-2 border-purple-600' : 'border border-zinc-700 opacity-60'
          }`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="text-zinc-500 text-xs mb-1">
                  Exercise 1 of 2 {currentExerciseInPair === 0 ? '(ACTIVE)' : completedPairs.length >= currentSetIndex ? '(Done)' : '(Next)'}
                </div>
                <h2 className="text-xl font-bold text-white mb-2">{ex1.name}</h2>
              </div>
              <a
                href={getVideoUrl(ex1.name, ex1.videoUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-500 hover:text-red-400 text-sm font-medium px-3 py-2 bg-zinc-900 rounded"
              >
                📺 Video
              </a>
            </div>

            <div className="bg-zinc-900 rounded p-3 mb-3 border border-purple-700/50">
              <div className="text-purple-300 text-xs mb-2">Today&apos;s target</div>
              <div className={`grid ${ex1RepsOnly ? 'grid-cols-1' : 'grid-cols-2'} gap-3`}>
                {!ex1RepsOnly && (
                  <div className="text-center">
                    <div className="text-zinc-500 text-xs mb-1">
                      {getMetricLabelText(ex1MetricInfo, ex1Machine)}
                    </div>
                    <div className="text-white text-lg font-semibold">
                      {formatMetric(ex1.targetWeight, ex1MetricInfo, ex1Machine)}
                    </div>
                  </div>
                )}
                <div className="text-center">
                  <div className="text-zinc-500 text-xs mb-1">Reps</div>
                  <div className="text-white text-lg font-semibold">
                    {ex1.targetReps}
                  </div>
                </div>
              </div>
            </div>

            {!isReviewMode && currentExerciseInPair === 0 ? (
              <>
                {/* Active: Show inputs */}
                {showMachineToggle1 && (
                  <label className="flex items-center gap-2 text-xs text-zinc-400 mb-2">
                    <input
                      type="checkbox"
                      checked={machineOnly1}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setMachineOnly1(checked);
                        setSetData1((prev) => {
                          if (checked) {
                            setMachineOnlyHoldWeight1(prev.weight);
                            return { ...prev, weight: 0 };
                          }
                          const restore = Number.isFinite(machineOnlyHoldWeight1)
                            ? machineOnlyHoldWeight1
                            : ex1.targetWeight;
                          return { ...prev, weight: restore };
                        });
                      }}
                    />
                    Machine weight only
                  </label>
                )}
                <div className={`grid ${showMetricInput1 ? 'grid-cols-2' : 'grid-cols-1'} gap-3 mb-3`}>
                  {showMetricInput1 && (
                    <div className="bg-zinc-900 rounded-lg p-3">
                      <label className="text-zinc-400 text-xs block mb-1">
                        {getMetricLabelText(ex1MetricInfo, ex1Machine)}
                      </label>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={formatMetricValueInput(setData1.weight, ex1MetricInfo)}
                        onChange={(e) => {
                          const val = e.target.value;
                          const nextValue = parseMetricValueInput(val, ex1MetricInfo);
                          if (nextValue !== null) {
                            setSetData1({ ...setData1, weight: nextValue });
                          }
                        }}
                        className="w-full bg-zinc-800 text-white text-2xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  )}
                  <div className="bg-zinc-900 rounded-lg p-3">
                    <label className="text-zinc-400 text-xs block mb-1">Reps</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={setData1.reps ?? ''}
                      onChange={(e) => setSetData1({ ...setData1, reps: parseInt(e.target.value) || 0 })}
                      className="w-full bg-zinc-800 text-white text-2xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="bg-zinc-900 rounded p-3 mb-3">
                  <div className="text-zinc-500 text-xs mb-1">Form Tips</div>
                  <p className="text-zinc-300 text-sm">{getFormTips(ex1.tips)}</p>
                </div>

                <button
                  onClick={handleCompleteB2BExercise}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg text-lg font-bold transition-colors"
                >
                  ✓ Complete Exercise 1
                </button>
              </>
            ) : (
              <>
                {/* Inactive: Show entered data */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-zinc-900 rounded p-3 text-center">
                    <div className="text-zinc-500 text-xs mb-1">
                      {getMetricLabelText(ex1MetricInfo, ex1Machine)}
                    </div>
                    <div className="text-white text-xl font-semibold">
                      {formatMetric(setData1.weight, ex1MetricInfo, ex1Machine)}
                    </div>
                  </div>
                  <div className="bg-zinc-900 rounded p-3 text-center">
                    <div className="text-zinc-500 text-xs mb-1">Reps</div>
                    <div className="text-white text-xl font-semibold">
                      {setData1.reps}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Exercise 2 Card */}
          <div className={`bg-zinc-800 rounded-lg p-5 mb-6 transition-all ${
            currentExerciseInPair === 1 ? 'border-2 border-purple-600' : 'border border-zinc-700 opacity-60'
          }`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="text-zinc-500 text-xs mb-1">
                  Exercise 2 of 2 {currentExerciseInPair === 1 ? '(ACTIVE)' : currentExerciseInPair === 0 ? '(Next)' : '(Done)'}
                </div>
                <h2 className="text-xl font-bold text-white mb-2">{ex2.name}</h2>
              </div>
              <a
                href={getVideoUrl(ex2.name, ex2.videoUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-500 hover:text-red-400 text-sm font-medium px-3 py-2 bg-zinc-900 rounded"
              >
                📺 Video
              </a>
            </div>

            <div className="bg-zinc-900 rounded p-3 mb-3 border border-purple-700/50">
              <div className="text-purple-300 text-xs mb-2">Today&apos;s target</div>
              <div className={`grid ${ex2RepsOnly ? 'grid-cols-1' : 'grid-cols-2'} gap-3`}>
                {!ex2RepsOnly && (
                  <div className="text-center">
                    <div className="text-zinc-500 text-xs mb-1">
                      {getMetricLabelText(ex2MetricInfo, ex2Machine)}
                    </div>
                    <div className="text-white text-lg font-semibold">
                      {formatMetric(ex2.targetWeight, ex2MetricInfo, ex2Machine)}
                    </div>
                  </div>
                )}
                <div className="text-center">
                  <div className="text-zinc-500 text-xs mb-1">Reps</div>
                  <div className="text-white text-lg font-semibold">
                    {ex2.targetReps}
                  </div>
                </div>
              </div>
            </div>

            {!isReviewMode && currentExerciseInPair === 1 ? (
              <>
                {/* Active: Show inputs */}
                {showMachineToggle2 && (
                  <label className="flex items-center gap-2 text-xs text-zinc-400 mb-2">
                    <input
                      type="checkbox"
                      checked={machineOnly2}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setMachineOnly2(checked);
                        setSetData2((prev) => {
                          if (checked) {
                            setMachineOnlyHoldWeight2(prev.weight);
                            return { ...prev, weight: 0 };
                          }
                          const restore = Number.isFinite(machineOnlyHoldWeight2)
                            ? machineOnlyHoldWeight2
                            : ex2.targetWeight;
                          return { ...prev, weight: restore };
                        });
                      }}
                    />
                    Machine weight only
                  </label>
                )}
                <div className={`grid ${showMetricInput2 ? 'grid-cols-2' : 'grid-cols-1'} gap-3 mb-3`}>
                  {showMetricInput2 && (
                    <div className="bg-zinc-900 rounded-lg p-3">
                      <label className="text-zinc-400 text-xs block mb-1">
                        {getMetricLabelText(ex2MetricInfo, ex2Machine)}
                      </label>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={formatMetricValueInput(setData2.weight, ex2MetricInfo)}
                        onChange={(e) => {
                          const val = e.target.value;
                          const nextValue = parseMetricValueInput(val, ex2MetricInfo);
                          if (nextValue !== null) {
                            setSetData2({ ...setData2, weight: nextValue });
                          }
                        }}
                        className="w-full bg-zinc-800 text-white text-2xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  )}
                  <div className="bg-zinc-900 rounded-lg p-3">
                    <label className="text-zinc-400 text-xs block mb-1">Reps</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={setData2.reps ?? ''}
                      onChange={(e) => setSetData2({ ...setData2, reps: parseInt(e.target.value) || 0 })}
                      className="w-full bg-zinc-800 text-white text-2xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="bg-zinc-900 rounded p-3 mb-3">
                  <div className="text-zinc-500 text-xs mb-1">Form Tips</div>
                  <p className="text-zinc-300 text-sm">{getFormTips(ex2.tips)}</p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleCompleteB2BExercise}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg text-lg font-bold transition-colors"
                  >
                    ✓ Complete Exercise 2
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Inactive: Show entered data */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-zinc-900 rounded p-3 text-center">
                    <div className="text-zinc-500 text-xs mb-1">
                      {getMetricLabelText(ex2MetricInfo, ex2Machine)}
                    </div>
                    <div className="text-white text-xl font-semibold">
                      {formatMetric(setData2.weight, ex2MetricInfo, ex2Machine)}
                    </div>
                  </div>
                  <div className="bg-zinc-900 rounded p-3 text-center">
                    <div className="text-zinc-500 text-xs mb-1">Reps</div>
                    <div className="text-white text-xl font-semibold">
                      {setData2.reps}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Completed Sets */}
          {displayCompletedPairs.length > 0 && (
            <div className="bg-zinc-800 rounded-lg p-4 mb-4">
              <div className="text-zinc-400 text-sm mb-2">COMPLETED SETS</div>
              {displayCompletedPairs.map((pair, index) => (
                <div key={index} className="mb-2">
                  <div className="text-green-400 text-sm font-semibold mb-1">Set {index + 1}:</div>
                  <div className="text-zinc-300 text-xs ml-2">
                    ✓ {ex1.name}: {formatMetric(pair.ex1.weight, ex1MetricInfo, ex1Machine)} × {pair.ex1.reps} reps
                  </div>
                  <div className="text-zinc-300 text-xs ml-2">
                    ✓ {ex2.name}: {formatMetric(pair.ex2.weight, ex2MetricInfo, ex2Machine)} × {pair.ex2.reps} reps
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Skip Exercise (only in active mode, not review mode) */}
          {!isReviewMode && (
            <button
              onClick={() => {
                if (completedPairs.length > 0) {
                  handleEndExercise();
                  return;
                }
                void autosaveWorkout({ type: 'exercise_skip' });
                if (currentExerciseIndex < workout.exercises.length - 1) {
                  const nextExerciseIndex = currentExerciseIndex + 1;
                  setCurrentExerciseIndex(nextExerciseIndex);
                  setViewingExerciseIndex(nextExerciseIndex);
                  setCompletedPairs([]);

                  // Initialize next exercise
                  const nextExercise = workout.exercises[nextExerciseIndex];
                  if (nextExercise.type === EXERCISE_TYPES.single) {
                    initSingleExerciseState(nextExercise);
                  } else {
                    const b2bEx = nextExercise as B2BExercise;
                    const defaultMachineOnly1 = !!b2bEx.exercises[0].isMachine
                      && isExerciseWeightMetric(b2bEx.exercises[0])
                      && b2bEx.exercises[0].targetWeight <= 0;
                    const defaultMachineOnly2 = !!b2bEx.exercises[1].isMachine
                      && isExerciseWeightMetric(b2bEx.exercises[1])
                      && b2bEx.exercises[1].targetWeight <= 0;
                    setSetData1({
                      weight: defaultMachineOnly1 ? 0 : b2bEx.exercises[0].targetWeight,
                      reps: b2bEx.exercises[0].targetReps,
                    });
                    setSetData2({
                      weight: defaultMachineOnly2 ? 0 : b2bEx.exercises[1].targetWeight,
                      reps: b2bEx.exercises[1].targetReps,
                    });
                    setMachineOnly1(defaultMachineOnly1);
                    setMachineOnly2(defaultMachineOnly2);
                    setMachineOnlyHoldWeight1(b2bEx.exercises[0].targetWeight);
                    setMachineOnlyHoldWeight2(b2bEx.exercises[1].targetWeight);
                    setCurrentSetIndex(1);
                    setCurrentExerciseInPair(0);
                    setWarmupDecision('skip');
                    setWarmupCompleted(false);
                  }
                } else {
                  // Always go to cardio (optional)
                  router.push(`/workout/${encodeURIComponent(workout.name)}/cardio${routineQuery}`);
                }
              }}
              className="w-full bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              {completedPairs.length > 0 ? 'End Exercise' : 'Skip Exercise'}
            </button>
          )}

          {exerciseModals}
        </div>
      </div>
    );
  }

  const exercise = exerciseToDisplay as SingleExercise;
  const metricInfo = getMetricInfo(exercise);
  const hasWarmup = resolveHasWarmup(exercise);
  const isWarmupSet = hasWarmup && warmupDecision === 'include' && currentSetIndex === 0;
  const isRepsOnly = isRepsOnlyMetric(metricInfo.primaryMetric);
  const isMachine = !!exercise.isMachine && isWeightMetric(metricInfo.primaryMetric);
  const showMachineToggle = isMachine && !isRepsOnly;
  const showMetricInput = !isRepsOnly && !(isMachine && machineOnly);

  // In review mode, show cached completed sets
  const displayCompletedSets = isReviewMode && viewingCachedData
    ? viewingCachedData.completedSets || []
    : completedSets;
  const displayWarmupCompleted = hasWarmup && (isReviewMode
    ? !!viewingCachedData?.warmupCompleted
    : warmupCompleted);
  const showWarmupPrompt = !isReviewMode && hasWarmup && warmupDecision === 'pending';
  const warmupSuggestionWeight = hasWarmup && exercise.warmupWeight > 0 && isWeightMetric(metricInfo.primaryMetric)
    ? exercise.warmupWeight
    : null;
  const weightInputValue = isWarmupSet && warmupSuggestionWeight === null && showMetricInput && setData.weight === 0
    ? ''
    : formatMetricValueInput(setData.weight, metricInfo);

  const commitReviewSingleSet = (setIndex: number) => {
    if (!viewingCachedData?.completedSets) return;
    const set = viewingCachedData.completedSets[setIndex];
    if (!set) return;
    const sessionExerciseIndex = viewingCachedData.sessionExerciseIndex;
    if (sessionExerciseIndex === null || sessionExerciseIndex === undefined) return;

    const isWarmupEdit = displayWarmupCompleted && setIndex === 0;
    const workingSetIndex = displayWarmupCompleted ? setIndex - 1 : setIndex;

    updateExerciseInSession(sessionExerciseIndex, (sessionExercise) => {
      if (isWarmupEdit) {
        return {
          ...sessionExercise,
          warmup: { weight: set.weight, reps: set.reps },
        };
      }
      const nextSets = [...(sessionExercise.sets || [])];
      nextSets[workingSetIndex] = { weight: set.weight, reps: set.reps };
      return {
        ...sessionExercise,
        sets: nextSets,
      };
    });

    void autosaveWorkout({
      type: 'single_set',
      exerciseName: exercise.name,
      setIndex: isWarmupEdit ? 0 : (displayWarmupCompleted ? setIndex : setIndex + 1),
      weight: set.weight,
      reps: set.reps,
      ...(isWarmupEdit ? { isWarmup: true } : {}),
    });
  };

  const commitActiveSingleSet = (setIndex: number) => {
    const set = completedSets[setIndex];
    if (!set) return;
    const isWarmupEdit = displayWarmupCompleted && setIndex === 0;
    const setIndexForAutosave = isWarmupEdit
      ? 0
      : (displayWarmupCompleted ? setIndex : setIndex + 1);

    void autosaveWorkout({
      type: 'single_set',
      exerciseName: exercise.name,
      setIndex: setIndexForAutosave,
      weight: set.weight,
      reps: set.reps,
      ...(isWarmupEdit ? { isWarmup: true } : {}),
    });
    setInProgressExercise({
      exerciseIndex: currentExerciseIndex,
      type: EXERCISE_TYPES.single,
      completedSets,
      warmupDecision,
      warmupCompleted,
      currentSetIndex,
      setData,
      machineOnly,
    });
  };

  if (isSetReview) {
    return (
      <div className="min-h-screen bg-zinc-900 p-4 pb-32">
        <div className="max-w-2xl mx-auto">
          <WorkoutNavHeader
            exitUrl={`/workout/${encodeURIComponent(workout.name)}${routineQuery}`}
            previousUrl={null}
            onPrevious={handlePreviousSection}
            onNext={reviewNextHandler}
            nextLabel={reviewNextLabel}
          />
          <div className="flex justify-end mb-2">
            <AutosaveBadge />
          </div>
          <div className="text-zinc-400 text-right mb-4 -mt-4">
            Exercise {viewingExerciseIndex + 1}/{workout.exercises.length}
          </div>

          <div className="bg-zinc-800 rounded-lg p-4 mb-6 border border-rose-700">
            <div className="text-rose-300 text-xs mb-2">COMPLETED SETS</div>
            <div className="text-white text-lg font-semibold mb-1">{exercise.name}</div>
            <div className="text-zinc-400 text-sm">
              Review completed sets for this exercise.
            </div>
          </div>

          {displayCompletedSets.length === 0 ? (
            <div className="bg-zinc-800 rounded-lg p-4 text-zinc-400 text-sm">
              No completed sets logged for this exercise yet.
            </div>
          ) : (
            <div className="space-y-3">
              {displayCompletedSets.map((set, index) => {
                const label = displayWarmupCompleted
                  ? (index === 0 ? 'Warmup' : `Set ${index}`)
                  : `Set ${index + 1}`;
                return (
                  <div key={index} className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                    <div className="text-zinc-400 text-xs mb-2">{label}</div>
                    <div className={`grid ${isRepsOnly ? 'grid-cols-1' : 'grid-cols-2'} gap-3`}>
                      {!isRepsOnly && (
                        <div>
                          <label className="text-zinc-500 text-xs block mb-1">
                            {getMetricLabelText(metricInfo, isMachine)}
                          </label>
                          <input
                            type="text"
                            inputMode="decimal"
                            value={formatMetricValueInput(set.weight, metricInfo)}
                            onChange={(e) => {
                              const nextValue = parseMetricValueInput(e.target.value, metricInfo);
                              if (nextValue !== null) {
                                updateActiveSingleSet(index, { weight: nextValue });
                              }
                            }}
                            onBlur={() => commitActiveSingleSet(index)}
                            className="w-full bg-zinc-800 text-white text-xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-rose-600"
                          />
                        </div>
                      )}
                      <div>
                        <label className="text-zinc-500 text-xs block mb-1">Reps</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={set.reps ?? ''}
                          onChange={(e) => {
                            const reps = parseInt(e.target.value, 10) || 0;
                            updateActiveSingleSet(index, { reps });
                          }}
                          onBlur={() => commitActiveSingleSet(index)}
                          className="w-full bg-zinc-800 text-white text-xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-rose-600"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {exerciseModals}
        </div>
      </div>
    );
  }

  if (isReviewMode) {
    const reviewMetricInput = !isRepsOnly;
    return (
      <div className="min-h-screen bg-zinc-900 p-4 pb-32">
        <div className="max-w-2xl mx-auto">
          <WorkoutNavHeader
            exitUrl={`/workout/${encodeURIComponent(workout.name)}${routineQuery}`}
            previousUrl={null}
            onPrevious={handlePreviousSection}
            onNext={reviewNextHandler}
            nextLabel={reviewNextLabel}
          />
          <div className="flex justify-end mb-2">
            <AutosaveBadge />
          </div>
          <div className="text-zinc-400 text-right mb-4 -mt-4">
            Exercise {viewingExerciseIndex + 1}/{workout.exercises.length}
          </div>

          <div className="bg-zinc-800 rounded-lg p-4 mb-6 border border-rose-700">
            <div className="text-rose-300 text-xs mb-2">EDIT COMPLETED SETS</div>
            <div className="text-white text-lg font-semibold mb-1">{exercise.name}</div>
            <div className="text-zinc-400 text-sm">
              Update any set values from earlier in today&apos;s workout.
            </div>
          </div>

          {displayCompletedSets.length === 0 ? (
            <div className="bg-zinc-800 rounded-lg p-4 text-zinc-400 text-sm">
              No completed sets logged for this exercise yet.
            </div>
          ) : (
            <div className="space-y-4">
              {displayCompletedSets.map((set, index) => {
                const label = displayWarmupCompleted
                  ? (index === 0 ? 'Warmup' : `Set ${index}`)
                  : `Set ${index + 1}`;
                return (
                  <div key={index} className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                    <div className="text-zinc-400 text-xs mb-3">{label}</div>
                    <div className={`grid ${reviewMetricInput ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
                      {reviewMetricInput && (
                        <div>
                          <label className="text-zinc-500 text-xs block mb-1">
                            {getMetricLabelText(metricInfo, isMachine)}
                          </label>
                          <input
                            type="text"
                            inputMode="decimal"
                            value={formatMetricValueInput(set.weight, metricInfo)}
                            onChange={(e) => {
                              const nextValue = parseMetricValueInput(e.target.value, metricInfo);
                              if (nextValue !== null) {
                                updateReviewSingleSet(index, { weight: nextValue });
                              }
                            }}
                            onBlur={() => commitReviewSingleSet(index)}
                            className="w-full bg-zinc-800 text-white text-xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-rose-600"
                          />
                        </div>
                      )}
                      <div>
                        <label className="text-zinc-500 text-xs block mb-1">Reps</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={set.reps ?? ''}
                          onChange={(e) => {
                            const reps = parseInt(e.target.value, 10) || 0;
                            updateReviewSingleSet(index, { reps });
                          }}
                          onBlur={() => commitReviewSingleSet(index)}
                          className="w-full bg-zinc-800 text-white text-xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-rose-600"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={() => openHistory([exercise.name])}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              📈 History
            </button>
          </div>

          {exerciseModals}
        </div>
      </div>
    );
  }

  // Transition Screen (between exercises)
  if (isTransitioning) {
    const nextExercise = workout.exercises[currentExerciseIndex + 1];
    const nextExerciseName = nextExercise.type === EXERCISE_TYPES.single
      ? nextExercise.name
      : `${nextExercise.exercises[0].name} / ${nextExercise.exercises[1].name}`;

    return (
      <div className="min-h-screen bg-zinc-900 p-4">
        <div className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-screen">
          {/* Progress Bar */}
          <div className="w-full mb-12">
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-600 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Heading */}
          <div className="text-zinc-400 text-xl mb-4">Next Exercise</div>

          {/* Exercise Name */}
          <h1 className="text-4xl font-bold text-white text-center mb-12 px-4">
            {nextExerciseName}
          </h1>

          {/* Countdown Timer */}
          <div className={`bg-zinc-800 rounded-lg p-16 mb-12 text-center border-4 ${transitionTimeRemaining === 0 ? 'border-zinc-700' : 'border-rose-700'}`}>
            <div className={`text-xl mb-4 ${transitionTimeRemaining === 0 ? 'text-zinc-400' : 'text-rose-300'}`}>Chilll Outtt</div>
            <div className={`text-9xl font-bold mb-2 ${transitionTimeRemaining === 0 ? 'text-rose-300' : 'text-white'}`}>
              {transitionTimeRemaining}
            </div>
            <div className="text-zinc-400 text-lg">seconds</div>
          </div>

          {/* Skip Button */}
          <button
            onClick={handleSkipTransition}
            className="bg-rose-700 hover:bg-rose-600 text-white px-12 py-5 rounded-lg text-2xl font-bold transition-colors"
          >
            I'm Ready →
          </button>
        </div>
      </div>
    );
  }

  // Rest Timer Screen
  if (isResting) {
    return (
      <div className="min-h-screen bg-zinc-900 p-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-zinc-400">Exercise {currentExerciseIndex + 1}/{workout.exercises.length}</div>
          </div>

          {/* Exercise Name */}
          <h1 className="text-3xl font-bold text-white text-center mb-8">{exercise.name}</h1>

          {/* Set Complete */}
          <div className="text-center mb-8">
            <div className="text-rose-400 text-6xl mb-2">✓</div>
            <div className="text-white text-2xl font-semibold">
              {hasWarmup && warmupCompleted && completedSets.length === 1
                ? 'WARMUP SET'
                : `SET ${hasWarmup && warmupCompleted ? completedSets.length - 1 : completedSets.length}`} COMPLETE
            </div>
          </div>

          {/* Rest Timer */}
          <div className={`bg-zinc-800 rounded-lg p-12 mb-8 text-center border-4 ${restTimeRemaining === 0 ? 'border-zinc-700' : 'border-rose-700'}`}>
            <div className={`text-xl mb-4 ${restTimeRemaining === 0 ? 'text-zinc-400' : 'text-rose-300'}`}>REST TIME</div>
            <div className={`text-8xl font-bold mb-2 ${restTimeRemaining === 0 ? 'text-rose-300' : 'text-white'}`}>
              {restTimeRemaining}
            </div>
            <div className="text-zinc-400 text-lg">seconds</div>
          </div>

          {/* Timer Controls */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              onClick={handleAddTime}
              className="bg-zinc-700 hover:bg-zinc-600 text-white py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              + Add 15s
            </button>
            <button
              onClick={handleSkipRest}
              className="bg-rose-700 hover:bg-rose-600 text-white py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              {restTimeRemaining === 0 ? 'Continue Workout' : 'Skip Rest'}
            </button>
          </div>

          {/* Next Set Info */}
          <div className="bg-zinc-800 rounded-lg p-4 text-center">
            <div className="text-zinc-400 text-sm mb-2">Next up:</div>
            <div className="text-white text-xl font-semibold">
              Set {currentSetIndex} (Working)
            </div>
            <div className="text-zinc-300 text-lg">
              {formatMetric(exercise.targetWeight, metricInfo, isMachine)} × {exercise.targetReps} reps
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Exit Confirmation Modal
  if (showExitConfirm) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-zinc-800 rounded-lg p-6">
          <h2 className="text-white text-2xl font-bold mb-4">Exit Routine?</h2>
          <p className="text-zinc-300 mb-6">
            You will lose your current routine progress. Completed exercises have been saved to the database.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setShowExitConfirm(false)}
              className="bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Continue
            </button>
            <Link
              href="/routines"
              className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-colors text-center"
            >
              Exit Routine
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Exercise Tracking Screen
  return (
    <div className="min-h-screen bg-zinc-900 p-4 pb-32">
      <div className="max-w-2xl mx-auto">
        {/* Navigation */}
        <WorkoutNavHeader
          exitUrl={`/workout/${encodeURIComponent(workout.name)}${routineQuery}`}
          previousUrl={null}
          onPrevious={handlePreviousSection}
          onNext={reviewNextHandler}
          nextLabel={reviewNextLabel}
        />
        <div className="flex justify-end mb-2">
          <AutosaveBadge />
        </div>
        <div className="text-zinc-400 text-right mb-4 -mt-4">Exercise {viewingExerciseIndex + 1}/{workout.exercises.length}</div>

        {/* READ ONLY Banner */}
        {isReviewMode && (
          <div className="bg-yellow-900 border border-yellow-600 rounded-lg p-3 mb-6">
            <div className="text-yellow-200 text-sm font-semibold text-center">
              📖 READ ONLY - Cannot edit completed sets
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-600 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
          </div>
          <div className="text-zinc-500 text-sm text-center mt-2">
            Overall Progress: {currentProgress} / {totalItems}
          </div>
        </div>

        <div className="flex items-center gap-3 mb-3">
          {exerciseModifyControls}
          <button
            onClick={() => openHistory([exercise.name])}
            className="ml-auto bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            📈 History
          </button>
        </div>
        <h1 className="text-3xl font-bold text-white mb-6">{exercise.name}</h1>

        {/* Last Time Section */}
        {lastExerciseLog && (
          <div className="bg-zinc-800 rounded-lg p-4 mb-6 border border-zinc-700">
            <div className="text-zinc-400 text-sm mb-2">
              LAST TIME ({formatLocalDate(lastExerciseDate)})
            </div>
            <div className="space-y-1">
              {lastExerciseLog.warmup_weight !== null && lastExerciseLog.warmup_reps !== null && (
                <div className="text-zinc-300 text-sm">
                  {isRepsOnly
                    ? `Warmup: ${lastExerciseLog.warmup_reps} reps`
                    : `Warmup: ${formatMetric(lastExerciseLog.warmup_weight, metricInfo, isMachine)} × ${lastExerciseLog.warmup_reps} reps`}
                </div>
              )}
              {([1, 2, 3, 4] as const).map((setNum) => {
                const weight = getLogSetValue(lastExerciseLog, setNum, 'weight');
                const reps = getLogSetValue(lastExerciseLog, setNum, 'reps');
                if (weight !== null && reps !== null) {
                  return (
                    <div key={setNum} className="text-zinc-300 text-sm">
                      {isRepsOnly
                        ? `Set ${setNum}: ${reps} reps`
                        : `Set ${setNum}: ${formatMetric(weight, metricInfo, isMachine)} × ${reps} reps`}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        )}

        <div className="bg-zinc-800 rounded-lg p-4 mb-6 border border-emerald-700">
          <div className="text-emerald-400 text-xs mb-2">TODAY&apos;S TARGET</div>
          <div className={`grid ${isRepsOnly ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
            {!isRepsOnly && (
              <div className="bg-zinc-900 rounded p-3 text-center">
                <div className="text-zinc-500 text-xs mb-1">
                  {getMetricLabelText(metricInfo, isMachine)}
                </div>
                <div className="text-white text-xl font-semibold">
                  {formatMetric(exercise.targetWeight, metricInfo, isMachine)}
                </div>
              </div>
            )}
            <div className="bg-zinc-900 rounded p-3 text-center">
              <div className="text-zinc-500 text-xs mb-1">Reps</div>
              <div className="text-white text-xl font-semibold">
                {exercise.targetReps}
              </div>
            </div>
          </div>
        </div>

        {/* Warmup Choice */}
        {!isReviewMode && showWarmupPrompt && (
          <div className="bg-zinc-800 rounded-lg p-6 mb-6 border-2 border-rose-700">
            <div className="text-center mb-3">
              <div className="text-rose-300 text-lg font-semibold mb-2">Warm up?</div>
              <div className="text-zinc-400 text-sm">Optional warmup set before working sets.</div>
              {warmupSuggestionWeight !== null && !isRepsOnly && (
                <div className="text-zinc-300 text-sm mt-2">
                  Suggested warmup: {formatMetric(warmupSuggestionWeight, metricInfo, isMachine)}
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleStartWarmup}
                className="bg-rose-700 hover:bg-rose-600 text-white py-4 rounded-lg text-lg font-semibold transition-colors"
              >
                Warm up
              </button>
              <button
                onClick={handleSkipWarmup}
                className="bg-zinc-700 hover:bg-zinc-600 text-white py-4 rounded-lg text-lg font-semibold transition-colors"
              >
                Start Set 1
              </button>
            </div>
          </div>
        )}

        {/* Current Set - Only show if not in review mode */}
        {!isReviewMode && !showWarmupPrompt && (
          <div className="bg-zinc-800 rounded-lg p-6 mb-6 border-2 border-rose-700">
            <div className="text-center mb-4">
              <div className="text-rose-300 text-lg font-semibold mb-2">
                {isWarmupSet ? 'WARMUP SET' : `SET ${currentSetIndex} (WORKING)`}
              </div>
            </div>

            {/* Weight and Reps Inputs */}
            {showMachineToggle && (
              <label className="flex items-center gap-2 text-xs text-zinc-400 mb-3">
                <input
                  type="checkbox"
                  checked={machineOnly}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setMachineOnly(checked);
                    setSetData((prev) => {
                      if (checked) {
                        setMachineOnlyHoldWeight(prev.weight);
                        return { ...prev, weight: 0 };
                      }
                      const restore = Number.isFinite(machineOnlyHoldWeight)
                        ? machineOnlyHoldWeight
                        : exercise.targetWeight;
                      return { ...prev, weight: restore };
                    });
                  }}
                />
                Machine weight only
              </label>
            )}
            <div className={`grid ${showMetricInput ? 'grid-cols-2' : 'grid-cols-1'} gap-4 mb-4`}>
              {showMetricInput && (
                <div className="bg-zinc-900 rounded-lg p-4">
                  <label className="text-zinc-400 text-sm block mb-2">
                    {getMetricLabelText(metricInfo, isMachine)}
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={weightInputValue}
                    onChange={(e) => {
                      const val = e.target.value;
                      const nextValue = parseMetricValueInput(val, metricInfo);
                      if (nextValue !== null) {
                        setSetData({ ...setData, weight: nextValue });
                      }
                    }}
                    className="w-full bg-zinc-800 text-white text-3xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-rose-600"
                  />
                </div>
              )}
              <div className="bg-zinc-900 rounded-lg p-4">
                <label className="text-zinc-400 text-sm block mb-2">Reps</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={setData.reps ?? ''}
                  onChange={(e) => setSetData({ ...setData, reps: parseInt(e.target.value) || 0 })}
                  className="w-full bg-zinc-800 text-white text-3xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-rose-600"
                />
              </div>
            </div>

            {/* Complete Set Button(s) */}
            {isWarmupSet ? (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleSkipWarmup}
                  className="bg-zinc-700 hover:bg-zinc-600 text-white py-4 rounded-lg text-lg font-semibold transition-colors"
                >
                  Skip Warmup
                </button>
                <button
                  onClick={handleCompleteSet}
                  className="bg-rose-700 hover:bg-rose-600 text-white py-4 rounded-lg text-lg font-bold transition-colors"
                >
                  ✓ Complete Warmup
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleCompleteSet}
                  className="w-full bg-rose-700 hover:bg-rose-600 text-white py-4 rounded-lg text-xl font-bold transition-colors"
                >
                  ✓ Complete Set {currentSetIndex}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Completed Sets */}
        {displayCompletedSets.length > 0 && (
          <div className="bg-zinc-800 rounded-lg p-4 mb-6">
            <div className="text-zinc-400 text-sm mb-2">COMPLETED SETS</div>
            {displayCompletedSets.map((set, index) => {
              const label = displayWarmupCompleted
                ? (index === 0 ? 'Warmup' : `Set ${index}`)
                : `Set ${index + 1}`;
              return (
                <div key={index} className="text-rose-300 text-sm mb-1">
                  ✓ {label}: {formatMetric(set.weight, metricInfo, isMachine)} × {set.reps} reps
                </div>
              );
            })}
          </div>
        )}

        {/* Form Tips */}
        <div className="bg-zinc-800 rounded-lg p-4 mb-4">
          <div className="text-zinc-400 text-sm mb-2">FORM TIPS</div>
          <p className="text-zinc-200 text-base leading-relaxed">{getFormTips(exercise.tips)}</p>
        </div>

        {/* Video and Skip */}
        <div className={isReviewMode ? '' : 'grid grid-cols-2 gap-4'}>
          <a
            href={getVideoUrl(exercise.name, exercise.videoUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-red-600 hover:bg-red-700 text-white text-center py-3 rounded-lg font-semibold transition-colors"
          >
            📺 Watch Video
          </a>
          {!isReviewMode && (
            <button
              onClick={() => {
                if (completedSets.length > 0) {
                  handleEndExercise();
                  return;
                }
                void autosaveWorkout({ type: 'exercise_skip' });
                if (currentExerciseIndex < workout.exercises.length - 1) {
                  const nextExerciseIndex = currentExerciseIndex + 1;
                  setCurrentExerciseIndex(nextExerciseIndex);
                  setViewingExerciseIndex(nextExerciseIndex);
                  setCompletedSets([]);

                  // Initialize next exercise
                  const nextExercise = workout.exercises[nextExerciseIndex];
                  if (nextExercise.type === EXERCISE_TYPES.single) {
                    initSingleExerciseState(nextExercise);
                  } else {
                    const b2bEx = nextExercise as B2BExercise;
                    const defaultMachineOnly1 = !!b2bEx.exercises[0].isMachine
                      && isExerciseWeightMetric(b2bEx.exercises[0])
                      && b2bEx.exercises[0].targetWeight <= 0;
                    const defaultMachineOnly2 = !!b2bEx.exercises[1].isMachine
                      && isExerciseWeightMetric(b2bEx.exercises[1])
                      && b2bEx.exercises[1].targetWeight <= 0;
                    setSetData1({
                      weight: defaultMachineOnly1 ? 0 : b2bEx.exercises[0].targetWeight,
                      reps: b2bEx.exercises[0].targetReps,
                    });
                    setSetData2({
                      weight: defaultMachineOnly2 ? 0 : b2bEx.exercises[1].targetWeight,
                      reps: b2bEx.exercises[1].targetReps,
                    });
                    setMachineOnly1(defaultMachineOnly1);
                    setMachineOnly2(defaultMachineOnly2);
                    setMachineOnlyHoldWeight1(b2bEx.exercises[0].targetWeight);
                    setMachineOnlyHoldWeight2(b2bEx.exercises[1].targetWeight);
                    setCurrentSetIndex(1);
                    setCurrentExerciseInPair(0);
                    setCompletedPairs([]);
                    setWarmupDecision('skip');
                    setWarmupCompleted(false);
                  }
                } else {
                  // Always go to cardio (optional)
                  router.push(`/workout/${encodeURIComponent(workout.name)}/cardio${routineQuery}`);
                }
              }}
              className="bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              {completedSets.length > 0 ? 'End Exercise' : 'Skip Exercise'}
            </button>
          )}

          {exerciseModals}
        </div>
      </div>
    </div>
  );
}

export default function ActiveWorkoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    }>
      <ActiveWorkoutContent />
    </Suspense>
  );
}
