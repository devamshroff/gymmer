'use client';

import { useEffect, useMemo, useRef, useState, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { WorkoutPlan, Exercise, SingleExercise, B2BExercise } from '@/lib/types';
import {
  addExerciseToSession,
  ensureWorkoutSession,
  getWorkoutSession,
  updateWorkoutFlowState,
  DEFAULT_WORKOUT_FLOW_STATE,
  type WorkoutFlowState,
} from '@/lib/workout-session';
import { touchActiveRoutine } from '@/lib/active-routines';
import { useWorkoutSessionStore } from '@/lib/use-workout-session';
import { autosaveWorkout } from '@/lib/workout-autosave';
import ExerciseSelector from '@/app/components/ExerciseSelector';
import SupersetSelector from '@/app/components/SupersetSelector';
import { acknowledgeChangeWarning, hasChangeWarningAck, loadSessionWorkout, saveSessionWorkout } from '@/lib/session-workout';
import ExerciseHistoryModal from '@/app/components/ExerciseHistoryModal';
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
  isTimeMetric,
  isWeightMetric,
  parseMetricInput,
  resolvePrimaryMetric,
} from '@/lib/metric-utils';
import { playTimerCompleteFeedback, useCountdownTimer } from '@/lib/workout-timer';
import {
  loadWorkoutBootstrapCache,
  saveWorkoutBootstrapCache,
  type LastSetSummary,
  type WorkoutBootstrapPayload,
} from '@/lib/workout-bootstrap';
import { addSessionExerciseChange } from '@/lib/session-changes';
import { formatLocalDate, getLogSetValue, resolveHasWarmup } from './helpers';
import type { LastSetSummaries, SetData } from './types';
import { B2BExerciseView, SingleExerciseView } from './exercise-views';
import type { ActiveWorkoutViewContext } from './exercise-views';

type ExerciseOption = {
  id: number;
  name: string;
  video_url: string | null;
  tips: string | null;
  equipment?: string | null;
  is_bodyweight?: number | null;
  is_machine?: number | null;
};

function ActiveWorkoutContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [workout, setWorkout] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialIndexSet, setInitialIndexSet] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [weightUnit, setWeightUnit] = useState<WeightUnit>(DEFAULT_WEIGHT_UNIT);
  const [heightUnit, setHeightUnit] = useState<HeightUnit>(DEFAULT_HEIGHT_UNIT);
  const [timerSoundEnabled, setTimerSoundEnabled] = useState(true);
  const [timerVibrateEnabled, setTimerVibrateEnabled] = useState(true);

  // Single exercise state
  const [machineOnlyHoldWeight, setMachineOnlyHoldWeight] = useState(0);

  // B2B/Superset state
  const [machineOnlyHoldWeight1, setMachineOnlyHoldWeight1] = useState(0);
  const [machineOnlyHoldWeight2, setMachineOnlyHoldWeight2] = useState(0);

  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showExerciseTypePicker, setShowExerciseTypePicker] = useState(false);
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [showSupersetSelector, setShowSupersetSelector] = useState(false);
  const [exerciseActionMode, setExerciseActionMode] = useState<'add' | 'replace' | null>(null);
  const [showChangeWarning, setShowChangeWarning] = useState(false);
  const pendingChangeRef = useRef<(() => void) | null>(null);
  const [timeTargetSeconds, setTimeTargetSeconds] = useState(0);
  const [b2bTimeTargetSeconds1, setB2bTimeTargetSeconds1] = useState(0);
  const [b2bTimeTargetSeconds2, setB2bTimeTargetSeconds2] = useState(0);
  const [isEditingTimeTarget, setIsEditingTimeTarget] = useState(false);
  const [isEditingB2bTimeTarget1, setIsEditingB2bTimeTarget1] = useState(false);
  const [isEditingB2bTimeTarget2, setIsEditingB2bTimeTarget2] = useState(false);
  const singleTimer = useCountdownTimer({
    onComplete: () => {
      if (timeTargetSeconds <= 0) return;
      setSetData((prev) => ({ ...prev, weight: timeTargetSeconds, reps: 0 }));
    },
    soundEnabled: timerSoundEnabled,
    vibrateEnabled: timerVibrateEnabled,
  });
  const b2bTimer1 = useCountdownTimer({
    onComplete: () => {
      if (b2bTimeTargetSeconds1 <= 0) return;
      setSetData1((prev) => ({ ...prev, weight: b2bTimeTargetSeconds1, reps: 0 }));
    },
    soundEnabled: timerSoundEnabled,
    vibrateEnabled: timerVibrateEnabled,
  });
  const b2bTimer2 = useCountdownTimer({
    onComplete: () => {
      if (b2bTimeTargetSeconds2 <= 0) return;
      setSetData2((prev) => ({ ...prev, weight: b2bTimeTargetSeconds2, reps: 0 }));
    },
    soundEnabled: timerSoundEnabled,
    vibrateEnabled: timerVibrateEnabled,
  });

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

  const isExerciseTimeMetric = (exercise: {
    primaryMetric?: ExercisePrimaryMetric;
    isBodyweight?: boolean;
  }) => isTimeMetric(resolvePrimaryMetric(exercise.primaryMetric, exercise.isBodyweight));

  const getDefaultReps = (exercise: {
    primaryMetric?: ExercisePrimaryMetric;
    isBodyweight?: boolean;
    targetReps: number;
  }) => (isExerciseTimeMetric(exercise) ? 0 : exercise.targetReps);

  const getDefaultWeight = (
    exercise: { primaryMetric?: ExercisePrimaryMetric; isBodyweight?: boolean; targetWeight: number; isMachine?: boolean },
    useMachineOnly: boolean
  ) => {
    if (isExerciseTimeMetric(exercise)) return 0;
    return exercise.isMachine && useMachineOnly ? 0 : exercise.targetWeight;
  };

  const formatMetric = (
    value: number,
    metricInfo: { primaryMetric: ExercisePrimaryMetric; metricUnit: string | null },
    isMachine?: boolean
  ) => formatMetricDisplay(value, metricInfo.primaryMetric, metricInfo.metricUnit, weightUnit, heightUnit, isMachine);

  const formatSetSummary = (
    weight: number,
    reps: number,
    metricInfo: { primaryMetric: ExercisePrimaryMetric; metricUnit: string | null },
    isMachine?: boolean
  ) => {
    if (isRepsOnlyMetric(metricInfo.primaryMetric)) {
      return `${reps} reps`;
    }
    if (isTimeMetric(metricInfo.primaryMetric)) {
      return formatMetric(weight, metricInfo, isMachine);
    }
    return `${formatMetric(weight, metricInfo, isMachine)} × ${reps} reps`;
  };

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
  const sessionSnapshot = useWorkoutSessionStore();
  const flow = sessionSnapshot?.flow ?? DEFAULT_WORKOUT_FLOW_STATE;
  const {
    initialized,
    currentExerciseIndex,
    viewingExerciseIndex,
    showSetReview,
    currentSetIndex,
    currentExerciseInPair,
    completedSets,
    completedPairs,
    extraSetsByExerciseIndex,
    setData,
    setData1,
    setData2,
    warmupDecision,
    warmupCompleted,
    machineOnly,
    machineOnly1,
    machineOnly2,
    isResting,
    restTimeRemaining,
    restTimeSeconds,
    supersetRestSeconds,
    isTransitioning,
    transitionTimeRemaining,
  } = flow;

  const applyFlowUpdate = <T,>(value: T | ((prev: T) => T), prev: T): T => (
    typeof value === 'function' ? (value as (prev: T) => T)(prev) : value
  );

  const setFlowField = <K extends keyof WorkoutFlowState>(
    key: K,
    value: WorkoutFlowState[K] | ((prev: WorkoutFlowState[K]) => WorkoutFlowState[K])
  ) => {
    updateWorkoutFlowState((state) => ({
      ...state,
      [key]: applyFlowUpdate(value, state[key]),
    }));
  };

  const setCurrentExerciseIndex = (value: number | ((prev: number) => number)) => (
    setFlowField('currentExerciseIndex', value)
  );
  const setInitialized = (value: boolean) => setFlowField('initialized', value);
  const setViewingExerciseIndex = (value: number | ((prev: number) => number)) => (
    setFlowField('viewingExerciseIndex', value)
  );
  const setShowSetReview = (value: boolean) => setFlowField('showSetReview', value);
  const setCurrentSetIndex = (value: number | ((prev: number) => number)) => (
    setFlowField('currentSetIndex', value)
  );
  const setCurrentExerciseInPair = (value: number | ((prev: number) => number)) => (
    setFlowField('currentExerciseInPair', value)
  );
  const setCompletedSets = (value: SetData[] | ((prev: SetData[]) => SetData[])) => (
    setFlowField('completedSets', value)
  );
  const setCompletedPairs = (
    value: Array<{ ex1: SetData; ex2: SetData }> | ((
      prev: Array<{ ex1: SetData; ex2: SetData }>
    ) => Array<{ ex1: SetData; ex2: SetData }>)
  ) => setFlowField('completedPairs', value);
  const setExtraSetsByExerciseIndex = (
    value: Record<number, number> | ((prev: Record<number, number>) => Record<number, number>)
  ) => setFlowField('extraSetsByExerciseIndex', value);
  const setSetData = (value: SetData | ((prev: SetData) => SetData)) => (
    setFlowField('setData', value)
  );
  const setSetData1 = (value: SetData | ((prev: SetData) => SetData)) => (
    setFlowField('setData1', value)
  );
  const setSetData2 = (value: SetData | ((prev: SetData) => SetData)) => (
    setFlowField('setData2', value)
  );
  const setWarmupDecision = (value: 'pending' | 'include' | 'skip') => (
    setFlowField('warmupDecision', value)
  );
  const setWarmupCompleted = (value: boolean) => setFlowField('warmupCompleted', value);
  const setMachineOnly = (value: boolean) => setFlowField('machineOnly', value);
  const setMachineOnly1 = (value: boolean) => setFlowField('machineOnly1', value);
  const setMachineOnly2 = (value: boolean) => setFlowField('machineOnly2', value);
  const setIsResting = (value: boolean) => setFlowField('isResting', value);
  const setRestTimeRemaining = (value: number | ((prev: number) => number)) => (
    setFlowField('restTimeRemaining', value)
  );
  const setRestTimeSeconds = (value: number) => setFlowField('restTimeSeconds', value);
  const setSupersetRestSeconds = (value: number) => setFlowField('supersetRestSeconds', value);
  const setIsTransitioning = (value: boolean) => setFlowField('isTransitioning', value);
  const setTransitionTimeRemaining = (value: number | ((prev: number) => number)) => (
    setFlowField('transitionTimeRemaining', value)
  );

  const getExtraSetsForExercise = (exerciseIndex: number) => (
    extraSetsByExerciseIndex?.[exerciseIndex] ?? 0
  );
  const getTargetSetCount = (exerciseIndex: number, baseSetCount: number) => (
    baseSetCount + getExtraSetsForExercise(exerciseIndex)
  );
  const incrementExtraSetsForExercise = (exerciseIndex: number) => {
    setExtraSetsByExerciseIndex((prev) => ({
      ...prev,
      [exerciseIndex]: (prev?.[exerciseIndex] ?? 0) + 1,
    }));
  };

  const shiftExtraSetsForInsert = (insertIndex: number) => {
    setExtraSetsByExerciseIndex((prev) => {
      if (!prev) return prev;
      const next: Record<number, number> = {};
      for (const [key, value] of Object.entries(prev)) {
        const index = Number(key);
        if (!Number.isFinite(index)) continue;
        if (index >= insertIndex) {
          next[index + 1] = value;
        } else {
          next[index] = value;
        }
      }
      return next;
    });
  };

  const shiftCompletedCacheForInsert = (insertIndex: number) => {
    setCompletedExercisesCache((prev) => prev.map((entry) => (
      entry.exerciseIndex >= insertIndex
        ? { ...entry, exerciseIndex: entry.exerciseIndex + 1 }
        : entry
    )));
  };

  const clearCompletedCacheForIndex = (exerciseIndex: number) => {
    setCompletedExercisesCache((prev) => prev.filter((entry) => entry.exerciseIndex !== exerciseIndex));
  };

  const clearExtraSetsForIndex = (exerciseIndex: number) => {
    setExtraSetsByExerciseIndex((prev) => {
      if (!prev || prev[exerciseIndex] === undefined) return prev;
      const next = { ...prev };
      delete next[exerciseIndex];
      return next;
    });
  };

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
        weight: getDefaultWeight(exercise, defaultMachineOnly),
        reps: getDefaultReps(exercise),
      });
      return;
    }
    setWarmupDecision('pending');
    setCurrentSetIndex(1);
    setSetData({
      weight: getDefaultWeight(exercise, defaultMachineOnly),
      reps: getDefaultReps(exercise),
    });
  };

  // Get routineId from URL params (for public/favorited routines)
  const routineIdParam = searchParams.get('routineId');
  const routineIdValue = routineIdParam ? Number(routineIdParam) : null;
  const routineId = Number.isNaN(routineIdValue) ? null : routineIdValue;
  const routineQueryParams = new URLSearchParams();
  if (routineIdParam) routineQueryParams.set('routineId', routineIdParam);
  const routineQuery = routineQueryParams.toString() ? `?${routineQueryParams.toString()}` : '';

  useEffect(() => {
    let isMounted = true;
    async function fetchUser() {
      try {
        const response = await fetch('/api/user');
        if (!response.ok) return;
        const data = await response.json();
        if (isMounted && typeof data?.id === 'string') {
          setUserId(data.id);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }

    fetchUser();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    async function fetchWorkout() {
      try {
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
        ensureWorkoutSession(resolvedWorkout.name, routineId);

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
          setTimerSoundEnabled(bootstrapSettings?.timerSoundEnabled ?? true);
          setTimerVibrateEnabled(bootstrapSettings?.timerVibrateEnabled ?? true);
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
        const flowState = getWorkoutSession()?.flow ?? DEFAULT_WORKOUT_FLOW_STATE;
        if (exerciseCount > 0) {
          if (nextIndex > 0) {
            startIndex = nextIndex >= exerciseCount ? exerciseCount - 1 : nextIndex;
          }
          if (Number.isFinite(flowState.currentExerciseIndex)) {
            startIndex = Math.max(startIndex, Math.min(flowState.currentExerciseIndex, exerciseCount - 1));
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

        if (!indexParam && Number.isFinite(flowState.viewingExerciseIndex)) {
          viewingIndex = Math.min(Math.max(flowState.viewingExerciseIndex, 0), exerciseCount - 1);
        }

        setCurrentExerciseIndex(startIndex);
        setViewingExerciseIndex(viewingIndex);
        setShowSetReview(flowState.showSetReview);

        const cachedEntry = cache.find((entry) => entry.exerciseIndex === startIndex);

        // Initialize exercise at startIndex
        if (exerciseCount > 0) {
          const exercise = resolvedWorkout.exercises[startIndex];
          const baseShouldInit = !flowState.initialized || flowState.currentExerciseIndex !== startIndex;
          const shouldInitSingle = exercise.type === EXERCISE_TYPES.single
            && !resolveHasWarmup(exercise as SingleExercise)
            && flowState.currentSetIndex === 0
            && (flowState.completedSets?.length ?? 0) === 0;
          const shouldInitB2B = exercise.type === EXERCISE_TYPES.b2b
            && flowState.currentSetIndex === 0
            && (flowState.completedPairs?.length ?? 0) === 0;
          const shouldInit = baseShouldInit || shouldInitSingle || shouldInitB2B;

          if (exercise.type === EXERCISE_TYPES.single) {
            if (shouldInit) {
              const cachedSingle = cachedEntry?.type === EXERCISE_TYPES.single ? cachedEntry : null;
              const cachedSets = cachedSingle?.completedSets ?? [];
              const hasCachedSets = cachedSets.length > 0;
              setCompletedSets(hasCachedSets ? cachedSets : []);
              setCompletedPairs([]);
              setCurrentExerciseInPair(0);
              initSingleExerciseState(exercise);
              if (hasCachedSets) {
                const warmupWasCompleted = !!cachedSingle?.warmupCompleted;
                const workingCount = warmupWasCompleted
                  ? Math.max(cachedSets.length - 1, 0)
                  : cachedSets.length;
                setWarmupCompleted(warmupWasCompleted);
                setWarmupDecision(resolveHasWarmup(exercise) && warmupWasCompleted ? 'include' : 'skip');
                setCurrentSetIndex(Math.max(1, workingCount + 1));
                if (workingCount > exercise.sets) {
                  setExtraSetsByExerciseIndex((prev) => ({
                    ...prev,
                    [startIndex]: Math.max(prev?.[startIndex] ?? 0, workingCount - exercise.sets),
                  }));
                }
              }
              setInitialized(true);
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
            setMachineOnlyHoldWeight1(b2bEx.exercises[0].targetWeight);
            setMachineOnlyHoldWeight2(b2bEx.exercises[1].targetWeight);
            if (shouldInit) {
              const cachedB2B = cachedEntry?.type === EXERCISE_TYPES.b2b ? cachedEntry : null;
              const cachedPairs = cachedB2B?.completedPairs ?? [];
              const hasCachedPairs = cachedPairs.length > 0;
              setSetData1({
                weight: getDefaultWeight(b2bEx.exercises[0], defaultMachineOnly1),
                reps: getDefaultReps(b2bEx.exercises[0]),
              });
              setSetData2({
                weight: getDefaultWeight(b2bEx.exercises[1], defaultMachineOnly2),
                reps: getDefaultReps(b2bEx.exercises[1]),
              });
              setMachineOnly1(defaultMachineOnly1);
              setMachineOnly2(defaultMachineOnly2);
              setCompletedPairs(hasCachedPairs ? cachedPairs : []);
              setCurrentSetIndex(hasCachedPairs ? cachedPairs.length + 1 : 1);
              setCurrentExerciseInPair(0); // Start with first exercise
              setWarmupDecision('skip');
              setWarmupCompleted(false);
              if (cachedPairs.length > b2bEx.exercises[0].sets) {
                setExtraSetsByExerciseIndex((prev) => ({
                  ...prev,
                  [startIndex]: Math.max(prev?.[startIndex] ?? 0, cachedPairs.length - b2bEx.exercises[0].sets),
                }));
              }
              setInitialized(true);
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

  useEffect(() => {
    if (!userId) return;
    if (!workout || !sessionSnapshot?.startTime) return;
    if (sessionSnapshot.workoutName !== workout.name) return;
    if ((sessionSnapshot.routineId ?? null) !== (routineId ?? null)) return;
    touchActiveRoutine({
      sessionKey: sessionSnapshot.startTime,
      userId,
      workoutName: workout.name,
      routineId,
      resumeIndex: currentExerciseIndex,
      sessionId: sessionSnapshot.sessionId ?? null,
      sessionData: sessionSnapshot,
    });
  }, [workout, routineId, currentExerciseIndex, sessionSnapshot, userId]);

  // Rest timer countdown
  useEffect(() => {
    if (!isResting) return;
    if (restTimeRemaining > 0) {
      const timer = setTimeout(() => {
        setRestTimeRemaining(restTimeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }

    // Rest complete: feedback + auto-advance to next set
    playTimerCompleteFeedback({
      soundEnabled: timerSoundEnabled,
      vibrateEnabled: timerVibrateEnabled,
    });
    setIsResting(false);
  }, [isResting, restTimeRemaining, timerSoundEnabled, timerVibrateEnabled]);

  // Transition timer countdown
  useEffect(() => {
    if (isTransitioning && transitionTimeRemaining > 0) {
      const timer = setTimeout(() => {
        setTransitionTimeRemaining(transitionTimeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isTransitioning && transitionTimeRemaining === 0 && workout) {
      playTimerCompleteFeedback({
        soundEnabled: timerSoundEnabled,
        vibrateEnabled: timerVibrateEnabled,
      });
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
          weight: getDefaultWeight(b2bEx.exercises[0], defaultMachineOnly1),
          reps: getDefaultReps(b2bEx.exercises[0]),
        });
        setSetData2({
          weight: getDefaultWeight(b2bEx.exercises[1], defaultMachineOnly2),
          reps: getDefaultReps(b2bEx.exercises[1]),
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
  }, [
    isTransitioning,
    transitionTimeRemaining,
    workout,
    currentExerciseIndex,
    timerSoundEnabled,
    timerVibrateEnabled,
  ]);

  useEffect(() => {
    singleTimer.reset();
    b2bTimer1.reset();
    b2bTimer2.reset();
  }, [currentExerciseIndex, currentSetIndex]);

  useEffect(() => {
    if (!workout) return;
    const current = workout.exercises[currentExerciseIndex];
    if (current.type === EXERCISE_TYPES.single) {
      const metric = resolvePrimaryMetric(current.primaryMetric, current.isBodyweight);
      if (isTimeMetric(metric)) {
        const nextTarget = Number.isFinite(current.targetWeight)
          ? Math.max(0, Math.round(current.targetWeight))
          : 0;
        setTimeTargetSeconds(nextTarget);
        singleTimer.setDuration(nextTarget);
      } else {
        setTimeTargetSeconds(0);
        singleTimer.setDuration(0);
      }
      setB2bTimeTargetSeconds1(0);
      setB2bTimeTargetSeconds2(0);
      b2bTimer1.setDuration(0);
      b2bTimer2.setDuration(0);
      setIsEditingTimeTarget(false);
      setIsEditingB2bTimeTarget1(false);
      setIsEditingB2bTimeTarget2(false);
      return;
    }
    if (current.type === EXERCISE_TYPES.b2b) {
      const ex1 = current.exercises[0];
      const ex2 = current.exercises[1];
      const ex1Metric = resolvePrimaryMetric(ex1.primaryMetric, ex1.isBodyweight);
      const ex2Metric = resolvePrimaryMetric(ex2.primaryMetric, ex2.isBodyweight);
      if (isTimeMetric(ex1Metric)) {
        const nextTarget = Number.isFinite(ex1.targetWeight)
          ? Math.max(0, Math.round(ex1.targetWeight))
          : 0;
        setB2bTimeTargetSeconds1(nextTarget);
        b2bTimer1.setDuration(nextTarget);
      } else {
        setB2bTimeTargetSeconds1(0);
        b2bTimer1.setDuration(0);
      }
      if (isTimeMetric(ex2Metric)) {
        const nextTarget = Number.isFinite(ex2.targetWeight)
          ? Math.max(0, Math.round(ex2.targetWeight))
          : 0;
        setB2bTimeTargetSeconds2(nextTarget);
        b2bTimer2.setDuration(nextTarget);
      } else {
        setB2bTimeTargetSeconds2(0);
        b2bTimer2.setDuration(0);
      }
      setTimeTargetSeconds(0);
      singleTimer.setDuration(0);
      setIsEditingTimeTarget(false);
      setIsEditingB2bTimeTarget1(false);
      setIsEditingB2bTimeTarget2(false);
      return;
    }
  }, [workout, currentExerciseIndex]);

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
  const viewingCachedData = completedExercisesCache.find(cache => cache.exerciseIndex === viewingExerciseIndex) ?? null;
  const lastExerciseDate = lastExerciseLog?.completed_at || lastExerciseLog?.created_at || null;
  const lastPartnerExerciseDate = lastPartnerExerciseLog?.completed_at || lastPartnerExerciseLog?.created_at || null;

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
  const handleCompleteB2BExercise = (addExtraSet = false) => {
    const b2bExercise = currentExercise as B2BExercise;
    const b2bRestSeconds = Math.max(0, supersetRestSeconds);
    const ex1Metric = resolvePrimaryMetric(b2bExercise.exercises[0].primaryMetric, b2bExercise.exercises[0].isBodyweight);
    const ex2Metric = resolvePrimaryMetric(b2bExercise.exercises[1].primaryMetric, b2bExercise.exercises[1].isBodyweight);
    const ex1TimeOnly = isTimeMetric(ex1Metric);
    const ex2TimeOnly = isTimeMetric(ex2Metric);
    const ex1ElapsedSeconds = ex1TimeOnly ? b2bTimer1.elapsedSeconds : 0;
    const ex2ElapsedSeconds = ex2TimeOnly ? b2bTimer2.elapsedSeconds : 0;
    const nextEx1Weight = ex1TimeOnly
      ? (setData1.weight > 0 ? setData1.weight : ex1ElapsedSeconds)
      : setData1.weight;
    const nextEx2Weight = ex2TimeOnly
      ? (setData2.weight > 0 ? setData2.weight : ex2ElapsedSeconds)
      : setData2.weight;
    const nextSetData1 = { weight: nextEx1Weight, reps: ex1TimeOnly ? 0 : setData1.reps };
    const nextSetData2 = { weight: nextEx2Weight, reps: ex2TimeOnly ? 0 : setData2.reps };

    if (currentExerciseInPair === 0) {
      // Just completed first exercise, immediately move to second
      if (ex1TimeOnly && b2bTimer1.isRunning) {
        b2bTimer1.pause();
      }
      if (ex1TimeOnly) {
        setSetData1(nextSetData1);
      }
      setCurrentExerciseInPair(1);
    } else {
      // Completed both exercises in the pair
      if (ex2TimeOnly && b2bTimer2.isRunning) {
        b2bTimer2.pause();
      }
      if (ex2TimeOnly) {
        setSetData2(nextSetData2);
      }
      const newCompletedPairs = [...completedPairs, { ex1: nextSetData1, ex2: nextSetData2 }];
      const totalSets = getTargetSetCount(currentExerciseIndex, b2bExercise.exercises[0].sets)
        + (addExtraSet ? 1 : 0);

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

      if (addExtraSet) {
        incrementExtraSetsForExercise(currentExerciseIndex);
      }

      void autosaveWorkout({
        type: 'b2b_set',
        exerciseName: b2bExercise.exercises[0].name,
        partnerName: b2bExercise.exercises[1].name,
        setIndex: currentSetIndex,
        weight: nextSetData1.weight,
        reps: nextSetData1.reps,
        partnerWeight: nextSetData2.weight,
        partnerReps: nextSetData2.reps,
      });

      setCompletedPairs(newCompletedPairs);
      if (ex1TimeOnly) {
        b2bTimer1.reset();
      }
      if (ex2TimeOnly) {
        b2bTimer2.reset();
      }

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
  const handleCompleteSet = (addExtraSet = false) => {
    const exercise = currentExercise as SingleExercise;
    const primaryMetric = resolvePrimaryMetric(exercise.primaryMetric, exercise.isBodyweight);
    const isTimeOnly = isTimeMetric(primaryMetric);
    if (isTimeOnly && singleTimer.isRunning) {
      singleTimer.pause();
    }
    // For time-based exercises, store seconds in the weight field.
    const elapsedSeconds = isTimeOnly ? singleTimer.elapsedSeconds : 0;
    const nextWeight = isTimeOnly
      ? (setData.weight > 0 ? setData.weight : elapsedSeconds)
      : setData.weight;
    const nextReps = isTimeOnly ? 0 : setData.reps;
    if (isTimeOnly) {
      setSetData((prev) => ({ ...prev, weight: nextWeight, reps: 0 }));
    }
    const nextSet = { weight: nextWeight, reps: nextReps };
    const newCompletedSets = [...completedSets, nextSet];
    setCompletedSets(newCompletedSets);

    const hasWarmup = resolveHasWarmup(exercise);
    const targetSetCount = getTargetSetCount(currentExerciseIndex, exercise.sets)
      + (addExtraSet ? 1 : 0);
    const restSeconds = Math.max(0, restTimeSeconds);
    const isWarmupSet = hasWarmup && warmupDecision === 'include' && currentSetIndex === 0;

    if (addExtraSet) {
      incrementExtraSetsForExercise(currentExerciseIndex);
    }

    void autosaveWorkout({
      type: 'single_set',
      exerciseName: exercise.name,
      setIndex: currentSetIndex,
      weight: nextWeight,
      reps: nextReps,
      isWarmup: isWarmupSet,
    });
    if (isTimeOnly) {
      singleTimer.reset();
    }

    if (currentSetIndex === 0 && hasWarmup) {
      setWarmupCompleted(true);
    }

    if (currentSetIndex < targetSetCount) {
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
          weight: getDefaultWeight(exercise, machineOnly),
          reps: getDefaultReps(exercise),
        });
      }
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
      reps: getDefaultReps(exercise),
    });
  };

  const handleSkipWarmup = () => {
    const exercise = currentExercise as SingleExercise;
    // Move to set 1 (first working set)
    setWarmupDecision('skip');
    setCurrentSetIndex(1);
    setSetData({
      weight: getDefaultWeight(exercise, machineOnly),
      reps: getDefaultReps(exercise),
    });
    setWarmupCompleted(false);
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
    clearExtraSetsForIndex(currentExerciseIndex);

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
        weight: getDefaultWeight(b2bExercise.exercises[0], defaultMachineOnly1),
        reps: getDefaultReps(b2bExercise.exercises[0]),
      });
      setSetData2({
        weight: getDefaultWeight(b2bExercise.exercises[1], defaultMachineOnly2),
        reps: getDefaultReps(b2bExercise.exercises[1]),
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

  async function fetchLastSetSummary(exerciseName: string): Promise<LastSetSummary> {
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
  }

  async function refreshLastSetSummaries(exerciseNames: string[]) {
    const entries = await Promise.all(
      exerciseNames.map(async (name) => [name, await fetchLastSetSummary(name)] as const)
    );
    setLastSetSummaries((prev) => ({
      ...prev,
      ...Object.fromEntries(entries),
    }));
  }

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
      shiftExtraSetsForInsert(insertIndex);
      shiftCompletedCacheForInsert(insertIndex);
      updatedExercises.splice(insertIndex, 0, nextExercise);
      resetExerciseStateFor(nextExercise);
    } else {
      clearCompletedCacheForIndex(currentExerciseIndex);
      updatedExercises[currentExerciseIndex] = nextExercise;
      resetExerciseStateFor(nextExercise);
    }

    applyWorkoutUpdate({ ...workout, exercises: updatedExercises });
    setExerciseActionMode(null);
    setShowExerciseSelector(false);
    void refreshLastSetSummaries([exercise.name]);
    if (exerciseActionMode === 'add') {
      addSessionExerciseChange({
        workoutName: workout.name,
        routineId: routineIdParam,
        mode: 'single',
        origin: 'add',
        exercise1: { id: exercise.id, name: exercise.name },
      });
    }
  };

  const handleSelectSuperset = (exercise1: ExerciseOption, exercise2: ExerciseOption) => {
    if (!workout || !exerciseActionMode) return;
    const nextExercise = buildSupersetExercise(exercise1, exercise2);
    const updatedExercises = [...workout.exercises];
    const insertIndex = currentExerciseIndex;

    if (exerciseActionMode === 'add') {
      shiftExtraSetsForInsert(insertIndex);
      shiftCompletedCacheForInsert(insertIndex);
      updatedExercises.splice(insertIndex, 0, nextExercise);
      resetExerciseStateFor(nextExercise);
    } else {
      clearCompletedCacheForIndex(currentExerciseIndex);
      updatedExercises[currentExerciseIndex] = nextExercise;
      resetExerciseStateFor(nextExercise);
    }

    applyWorkoutUpdate({ ...workout, exercises: updatedExercises });
    setExerciseActionMode(null);
    setShowSupersetSelector(false);
    void refreshLastSetSummaries([exercise1.name, exercise2.name]);
    if (exerciseActionMode === 'add') {
      addSessionExerciseChange({
        workoutName: workout.name,
        routineId: routineIdParam,
        mode: 'superset',
        origin: 'add',
        exercise1: { id: exercise1.id, name: exercise1.name },
        exercise2: { id: exercise2.id, name: exercise2.name },
      });
    }
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

  const viewContext: ActiveWorkoutViewContext = {
    workout,
    routineQuery,
    exerciseToDisplay,
    currentExercise,
    currentExerciseIndex,
    viewingExerciseIndex,
    currentSetIndex,
    currentExerciseInPair,
    totalItems,
    currentProgress,
    progressPercentage,
    isReviewMode,
    isSetReview,
    reviewNextHandler,
    reviewNextLabel,
    handlePreviousSection,
    exerciseModifyControls,
    exerciseModals,
    viewingCachedData,
    completedSets,
    completedPairs,
    warmupDecision,
    warmupCompleted,
    machineOnly,
    machineOnly1,
    machineOnly2,
    machineOnlyHoldWeight,
    machineOnlyHoldWeight1,
    machineOnlyHoldWeight2,
    setData,
    setData1,
    setData2,
    setMachineOnly,
    setMachineOnly1,
    setMachineOnly2,
    setMachineOnlyHoldWeight,
    setMachineOnlyHoldWeight1,
    setMachineOnlyHoldWeight2,
    setSetData,
    setSetData1,
    setSetData2,
    setCurrentExerciseIndex,
    setViewingExerciseIndex,
    setCurrentSetIndex,
    setCurrentExerciseInPair,
    setCompletedSets,
    setCompletedPairs,
    setCompletedExercisesCache,
    setExtraSetsByExerciseIndex,
    setWarmupDecision,
    setWarmupCompleted,
    handleCompleteSet,
    handleCompleteB2BExercise,
    handleStartWarmup,
    handleSkipWarmup,
    handleEndExercise,
    initSingleExerciseState,
    getTargetSetCount,
    getDefaultReps,
    getDefaultWeight,
    isExerciseWeightMetric,
    formatMetric,
    formatSetSummary,
    getMetricLabelText,
    getMetricInfo,
    parseMetricValueInput,
    formatMetricValueInput,
    updateReviewSingleSet,
    updateActiveSingleSet,
    updateReviewPair,
    updateActivePair,
    openHistory,
    closeHistory,
    showHistory,
    historyExerciseNames,
    historyTargets,
    weightUnit,
    heightUnit,
    lastExerciseLog,
    lastPartnerExerciseLog,
    lastExerciseDate,
    lastPartnerExerciseDate,
    timeTargetSeconds,
    b2bTimeTargetSeconds1,
    b2bTimeTargetSeconds2,
    setTimeTargetSeconds,
    setB2bTimeTargetSeconds1,
    setB2bTimeTargetSeconds2,
    singleTimer,
    b2bTimer1,
    b2bTimer2,
    isEditingTimeTarget,
    isEditingB2bTimeTarget1,
    isEditingB2bTimeTarget2,
    setIsEditingTimeTarget,
    setIsEditingB2bTimeTarget1,
    setIsEditingB2bTimeTarget2,
    isResting,
    restTimeRemaining,
    handleAddTime,
    handleSkipRest,
    handleSkipTransition,
    isTransitioning,
    transitionTimeRemaining,
    setTransitionTimeRemaining,
    showExitConfirm,
    setShowExitConfirm,
    router,
  };

  const ExerciseView = {
    [EXERCISE_TYPES.single]: SingleExerciseView,
    [EXERCISE_TYPES.b2b]: B2BExerciseView,
  }[exerciseToDisplay.type] ?? SingleExerciseView;
  return <ExerciseView context={viewContext} />;
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
