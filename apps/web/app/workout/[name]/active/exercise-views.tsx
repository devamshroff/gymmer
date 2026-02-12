'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import WorkoutNavHeader from '@/app/components/WorkoutNavHeader';
import AutosaveBadge from '@/app/components/AutosaveBadge';
import { EXERCISE_TYPES } from '@/lib/constants';
import type { ExercisePrimaryMetric } from '@/lib/constants';
import { isRepsOnlyMetric, isTimeMetric, isWeightMetric } from '@/lib/metric-utils';
import type { useCountdownTimer } from '@/lib/workout-timer';
import { autosaveWorkout } from '@/lib/workout-autosave';
import { updateExerciseInSession } from '@/lib/workout-session';
import { getFormTips, getVideoUrl } from '@/lib/workout-media';
import type { Exercise, WorkoutPlan, B2BExercise, SingleExercise } from '@/lib/types';
import type { HeightUnit, WeightUnit } from '@/lib/units';
import type { LastSetSummary } from '@/lib/workout-bootstrap';
import { formatLocalDate, getLogSetValue, resolveHasWarmup } from './helpers';
import type { SetData } from './types';

type CountdownTimer = ReturnType<typeof useCountdownTimer>;
type CompletedPair = { ex1: SetData; ex2: SetData };
type MetricInfo = { primaryMetric: ExercisePrimaryMetric; metricUnit: string | null };
type MetricExercise = { primaryMetric?: ExercisePrimaryMetric; isBodyweight?: boolean };
type MetricWeightExercise = MetricExercise & { targetWeight: number; isMachine?: boolean };
type MetricRepsExercise = MetricExercise & { targetReps: number };

const formatTimePart = (value: number) => String(value).padStart(2, '0');
const sanitizeTimeInput = (value: string) => value.replace(/\D/g, '').slice(0, 2);

const splitTimeParts = (totalSeconds: number) => {
  const safeSeconds = Number.isFinite(totalSeconds) ? Math.max(0, Math.floor(totalSeconds)) : 0;
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return { minutes, seconds };
};

const formatTimerDisplay = (totalSeconds: number) => {
  const { minutes, seconds } = splitTimeParts(totalSeconds);
  return `${formatTimePart(minutes)}:${formatTimePart(seconds)}`;
};

const parseTimeInput = (value: string) => {
  const digits = sanitizeTimeInput(value);
  if (!digits) return 0;
  const parsed = Number.parseInt(digits, 10);
  return Number.isFinite(parsed) ? parsed : 0;
};

type CompletedExerciseCache = {
  exerciseIndex: number;
  exerciseName: string;
  type: typeof EXERCISE_TYPES.single | typeof EXERCISE_TYPES.b2b;
  sessionExerciseIndex?: number | null;
  completedSets?: SetData[];
  completedPairs?: CompletedPair[];
  warmupCompleted?: boolean;
};

export type ActiveWorkoutViewContext = {
  workout: WorkoutPlan;
  routineQuery: string;
  exerciseToDisplay: Exercise;
  currentExercise: Exercise;
  currentExerciseIndex: number;
  viewingExerciseIndex: number;
  currentSetIndex: number;
  currentExerciseInPair: number;
  totalItems: number;
  currentProgress: number;
  progressPercentage: number;
  isReviewMode: boolean;
  isSetReview: boolean;
  reviewNextHandler: (() => void) | undefined;
  reviewNextLabel: string;
  handlePreviousSection: () => void;
  exerciseModifyControls: ReactNode;
  exerciseModals: ReactNode;
  viewingCachedData: CompletedExerciseCache | null;
  completedSets: SetData[];
  completedPairs: CompletedPair[];
  warmupDecision: 'pending' | 'include' | 'skip';
  warmupCompleted: boolean;
  machineOnly: boolean;
  machineOnly1: boolean;
  machineOnly2: boolean;
  machineOnlyHoldWeight: number;
  machineOnlyHoldWeight1: number;
  machineOnlyHoldWeight2: number;
  setData: SetData;
  setData1: SetData;
  setData2: SetData;
  setMachineOnly: (value: boolean) => void;
  setMachineOnly1: (value: boolean) => void;
  setMachineOnly2: (value: boolean) => void;
  setMachineOnlyHoldWeight: (value: number) => void;
  setMachineOnlyHoldWeight1: (value: number) => void;
  setMachineOnlyHoldWeight2: (value: number) => void;
  setSetData: (value: SetData | ((prev: SetData) => SetData)) => void;
  setSetData1: (value: SetData | ((prev: SetData) => SetData)) => void;
  setSetData2: (value: SetData | ((prev: SetData) => SetData)) => void;
  setCurrentExerciseIndex: (value: number | ((prev: number) => number)) => void;
  setViewingExerciseIndex: (value: number | ((prev: number) => number)) => void;
  setCurrentSetIndex: (value: number | ((prev: number) => number)) => void;
  setCurrentExerciseInPair: (value: number | ((prev: number) => number)) => void;
  setCompletedSets: (value: SetData[] | ((prev: SetData[]) => SetData[])) => void;
  setCompletedPairs: (value: CompletedPair[] | ((prev: CompletedPair[]) => CompletedPair[])) => void;
  setExtraSetsByExerciseIndex: (
    value: Record<number, number> | ((prev: Record<number, number>) => Record<number, number>)
  ) => void;
  setCompletedExercisesCache: (
    value: CompletedExerciseCache[] | ((prev: CompletedExerciseCache[]) => CompletedExerciseCache[])
  ) => void;
  setWarmupDecision: (value: 'pending' | 'include' | 'skip') => void;
  setWarmupCompleted: (value: boolean) => void;
  handleCompleteSet: (addExtraSet?: boolean) => void;
  handleCompleteB2BExercise: (addExtraSet?: boolean) => void;
  handleStartWarmup: () => void;
  handleSkipWarmup: () => void;
  handleEndExercise: () => void;
  initSingleExerciseState: (exercise: SingleExercise) => void;
  getTargetSetCount: (exerciseIndex: number, baseSetCount: number) => number;
  getDefaultReps: (exercise: MetricRepsExercise) => number;
  getDefaultWeight: (exercise: MetricWeightExercise, useMachineOnly: boolean) => number;
  isExerciseWeightMetric: (exercise: MetricExercise) => boolean;
  formatMetric: (value: number, metricInfo: MetricInfo, isMachine?: boolean) => string;
  formatSetSummary: (weight: number, reps: number, metricInfo: MetricInfo, isMachine?: boolean) => string;
  getMetricLabelText: (metricInfo: MetricInfo, isMachine?: boolean) => string;
  getMetricInfo: (exercise: MetricExercise & { metricUnit?: string | null }) => MetricInfo;
  parseMetricValueInput: (value: string, metricInfo: { primaryMetric: ExercisePrimaryMetric }) => number | null;
  formatMetricValueInput: (
    value: number,
    metricInfo: { primaryMetric: ExercisePrimaryMetric },
    allowBlank?: boolean
  ) => string;
  updateReviewSingleSet: (setIndex: number, updates: Partial<SetData>) => void;
  updateActiveSingleSet: (setIndex: number, updates: Partial<SetData>) => void;
  updateReviewPair: (pairIndex: number, updates: { ex1?: Partial<SetData>; ex2?: Partial<SetData> }) => void;
  updateActivePair: (pairIndex: number, updates: { ex1?: Partial<SetData>; ex2?: Partial<SetData> }) => void;
  openHistory: (names: string[]) => void;
  closeHistory: () => void;
  showHistory: boolean;
  historyExerciseNames: string[];
  historyTargets: Record<string, { weight?: number | null; reps?: number | null }>;
  weightUnit: WeightUnit;
  heightUnit: HeightUnit;
  lastExerciseLog: LastSetSummary;
  lastPartnerExerciseLog: LastSetSummary;
  lastExerciseDate: string | null;
  lastPartnerExerciseDate: string | null;
  timeTargetSeconds: number;
  b2bTimeTargetSeconds1: number;
  b2bTimeTargetSeconds2: number;
  setTimeTargetSeconds: (value: number) => void;
  setB2bTimeTargetSeconds1: (value: number) => void;
  setB2bTimeTargetSeconds2: (value: number) => void;
  singleTimer: CountdownTimer;
  b2bTimer1: CountdownTimer;
  b2bTimer2: CountdownTimer;
  isEditingTimeTarget: boolean;
  isEditingB2bTimeTarget1: boolean;
  isEditingB2bTimeTarget2: boolean;
  setIsEditingTimeTarget: (value: boolean) => void;
  setIsEditingB2bTimeTarget1: (value: boolean) => void;
  setIsEditingB2bTimeTarget2: (value: boolean) => void;
  isTransitioning: boolean;
  transitionTimeRemaining: number;
  setTransitionTimeRemaining: (value: number | ((prev: number) => number)) => void;
  isResting: boolean;
  restTimeRemaining: number;
  handleAddTime: () => void;
  handleSkipRest: () => void;
  handleSkipTransition: () => void;
  showExitConfirm: boolean;
  setShowExitConfirm: (value: boolean) => void;
  router: AppRouterInstance;
};

export function B2BExerciseView({ context }: { context: ActiveWorkoutViewContext }) {
  const {
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
  } = context;
  const b2bExercise = exerciseToDisplay as B2BExercise;
  const ex1 = b2bExercise.exercises[0];
  const ex2 = b2bExercise.exercises[1];
  const ex1MetricInfo = getMetricInfo(ex1);
  const ex2MetricInfo = getMetricInfo(ex2);
  const ex1RepsOnly = isRepsOnlyMetric(ex1MetricInfo.primaryMetric);
  const ex2RepsOnly = isRepsOnlyMetric(ex2MetricInfo.primaryMetric);
  const ex1TimeOnly = isTimeMetric(ex1MetricInfo.primaryMetric);
  const ex2TimeOnly = isTimeMetric(ex2MetricInfo.primaryMetric);
  const ex1IsWeightMetric = isWeightMetric(ex1MetricInfo.primaryMetric);
  const ex2IsWeightMetric = isWeightMetric(ex2MetricInfo.primaryMetric);
  const ex1TargetParts = splitTimeParts(b2bTimeTargetSeconds1);
  const ex2TargetParts = splitTimeParts(b2bTimeTargetSeconds2);
  const ex1Machine = !!ex1.isMachine && ex1IsWeightMetric;
  const ex2Machine = !!ex2.isMachine && ex2IsWeightMetric;
  const showMachineToggle1 = ex1Machine && !ex1RepsOnly;
  const showMachineToggle2 = ex2Machine && !ex2RepsOnly;
  const showMetricInput1 = !ex1RepsOnly && !(ex1Machine && machineOnly1);
  const showMetricInput2 = !ex2RepsOnly && !(ex2Machine && machineOnly2);
  const showRepsInput1 = !ex1TimeOnly;
  const showRepsInput2 = !ex2TimeOnly;
  const showTargetMetric1 = !ex1RepsOnly;
  const showTargetMetric2 = !ex2RepsOnly;
  const showTargetReps1 = !ex1TimeOnly;
  const showTargetReps2 = !ex2TimeOnly;
  const ex1InputColumnClass = showMetricInput1 && showRepsInput1 ? 'grid-cols-2' : 'grid-cols-1';
  const ex2InputColumnClass = showMetricInput2 && showRepsInput2 ? 'grid-cols-2' : 'grid-cols-1';
  const targetSetCount = getTargetSetCount(currentExerciseIndex, ex1.sets);
  const [ex1MinutesInput, setEx1MinutesInput] = useState<string | null>(null);
  const [ex1SecondsInput, setEx1SecondsInput] = useState<string | null>(null);
  const [ex2MinutesInput, setEx2MinutesInput] = useState<string | null>(null);
  const [ex2SecondsInput, setEx2SecondsInput] = useState<string | null>(null);

  // In review mode, show cached completed pairs
  const displayCompletedPairs = isReviewMode && viewingCachedData
    ? viewingCachedData.completedPairs || []
    : completedPairs;
  useEffect(() => {
    if (!isEditingB2bTimeTarget1) {
      setEx1MinutesInput(null);
      setEx1SecondsInput(null);
    }
  }, [isEditingB2bTimeTarget1]);
  useEffect(() => {
    if (!isEditingB2bTimeTarget2) {
      setEx2MinutesInput(null);
      setEx2SecondsInput(null);
    }
  }, [isEditingB2bTimeTarget2]);

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
  };

  const handleAddReviewPair = () => {
    if (!viewingCachedData) return;
    const sessionExerciseIndex = viewingCachedData.sessionExerciseIndex;
    if (sessionExerciseIndex === null || sessionExerciseIndex === undefined) return;

    const lastPair = displayCompletedPairs[displayCompletedPairs.length - 1];
    const fallbackPair = {
      ex1: {
        weight: ex1RepsOnly ? 0 : ex1.targetWeight,
        reps: getDefaultReps(ex1),
      },
      ex2: {
        weight: ex2RepsOnly ? 0 : ex2.targetWeight,
        reps: getDefaultReps(ex2),
      },
    };
    const nextPair = lastPair ?? fallbackPair;
    const nextSetIndex = displayCompletedPairs.length + 1;
    const nextPairCount = displayCompletedPairs.length + 1;
    if (nextPairCount > ex1.sets) {
      setExtraSetsByExerciseIndex((prev) => ({
        ...prev,
        [viewingExerciseIndex]: Math.max(prev?.[viewingExerciseIndex] ?? 0, nextPairCount - ex1.sets),
      }));
    }

    updateExerciseInSession(sessionExerciseIndex, (exercise) => {
      const nextSets = [...(exercise.sets || []), { ...nextPair.ex1 }];
      const nextPartner = exercise.b2bPartner
        ? { ...exercise.b2bPartner, sets: [...(exercise.b2bPartner.sets || []), { ...nextPair.ex2 }] }
        : {
            name: ex2.name,
            sets: [{ ...nextPair.ex2 }],
          };
      return {
        ...exercise,
        sets: nextSets,
        b2bPartner: nextPartner,
      };
    });

    setCompletedExercisesCache((prev) => prev.map((cache) => {
      if (cache.exerciseIndex !== viewingExerciseIndex) return cache;
      const nextPairs = [...(cache.completedPairs || []), { ...nextPair }];
      return { ...cache, completedPairs: nextPairs };
    }));

    void autosaveWorkout({
      type: 'b2b_set',
      exerciseName: ex1.name,
      partnerName: ex2.name,
      setIndex: nextSetIndex,
      weight: nextPair.ex1.weight,
      reps: nextPair.ex1.reps,
      partnerWeight: nextPair.ex2.weight,
      partnerReps: nextPair.ex2.reps,
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
                      <div className={`grid ${!ex1RepsOnly && showRepsInput1 ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
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
                        {showRepsInput1 && (
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
                        )}
                      </div>
                    </div>

                    <div className="bg-zinc-900 rounded-lg p-3">
                      <div className="text-purple-300 text-xs mb-2">{ex2.name}</div>
                      <div className={`grid ${!ex2RepsOnly && showRepsInput2 ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
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
                        {showRepsInput2 && (
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
                        )}
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
    const reviewRepsInput1 = !ex1TimeOnly;
    const reviewRepsInput2 = !ex2TimeOnly;
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
                      <div className={`grid ${reviewMetricInput1 && reviewRepsInput1 ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
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
                        {reviewRepsInput1 && (
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
                        )}
                      </div>
                    </div>

                    <div className="bg-zinc-900 rounded-lg p-3">
                      <div className="text-purple-300 text-xs mb-2">{ex2.name}</div>
                      <div className={`grid ${reviewMetricInput2 && reviewRepsInput2 ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
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
                        {reviewRepsInput2 && (
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
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        <div className="flex flex-wrap items-center gap-3 mt-6">
          {viewingCachedData && displayCompletedPairs.length > 0 && (
            <button
              onClick={handleAddReviewPair}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              + Add another set
              </button>
            )}
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
            SET {currentSetIndex} of {targetSetCount}
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
                              Set {setNum}: {formatSetSummary(weight, reps, ex1MetricInfo, ex1Machine)}
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
                              Set {setNum}: {formatSetSummary(weight, reps, ex2MetricInfo, ex2Machine)}
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
            <div className={`grid ${showTargetMetric1 && showTargetReps1 ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
              {showTargetMetric1 && (
                <div className="text-center">
                  <div className="text-zinc-500 text-xs mb-1">
                    {getMetricLabelText(ex1MetricInfo, ex1Machine)}
                  </div>
                  <div className="text-white text-lg font-semibold">
                    {formatMetric(ex1.targetWeight, ex1MetricInfo, ex1Machine)}
                  </div>
                </div>
              )}
              {showTargetReps1 && (
                <div className="text-center">
                  <div className="text-zinc-500 text-xs mb-1">Reps</div>
                  <div className="text-white text-lg font-semibold">
                    {ex1.targetReps}
                  </div>
                </div>
              )}
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
              {ex1TimeOnly ? (
                <div className="space-y-3 mb-3">
                  <div className="bg-zinc-900 rounded-lg p-3">
                    <div className="mt-1 flex flex-col items-center gap-2">
                      {isEditingB2bTimeTarget1 ? (
                        <div
                          className="flex items-center gap-2"
                          onBlur={(event) => {
                            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                              setIsEditingB2bTimeTarget1(false);
                            }
                          }}
                        >
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={2}
                            value={ex1MinutesInput ?? formatTimePart(ex1TargetParts.minutes)}
                            onFocus={(event) => {
                              event.currentTarget.select();
                              if (ex1MinutesInput === null && ex1TargetParts.minutes === 0) {
                                setEx1MinutesInput('');
                              }
                            }}
                            onChange={(event) => {
                              const nextRaw = sanitizeTimeInput(event.target.value);
                              setEx1MinutesInput(nextRaw);
                              const nextMinutes = Math.min(99, parseTimeInput(nextRaw));
                              const nextSeconds = ex1TargetParts.seconds;
                              const nextTotal = nextMinutes * 60 + nextSeconds;
                              setB2bTimeTargetSeconds1(nextTotal);
                              b2bTimer1.setDuration(nextTotal);
                            }}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter' || event.key === 'Escape') {
                                setIsEditingB2bTimeTarget1(false);
                              }
                            }}
                            autoFocus
                            className="w-14 bg-zinc-800 text-white text-5xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                          <span className="text-white text-5xl font-bold">:</span>
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={2}
                            value={ex1SecondsInput ?? formatTimePart(ex1TargetParts.seconds)}
                            onFocus={(event) => {
                              event.currentTarget.select();
                              if (ex1SecondsInput === null && ex1TargetParts.seconds === 0) {
                                setEx1SecondsInput('');
                              }
                            }}
                            onChange={(event) => {
                              const nextRaw = sanitizeTimeInput(event.target.value);
                              setEx1SecondsInput(nextRaw);
                              const nextSeconds = Math.min(59, parseTimeInput(nextRaw));
                              const nextTotal = ex1TargetParts.minutes * 60 + nextSeconds;
                              setB2bTimeTargetSeconds1(nextTotal);
                              b2bTimer1.setDuration(nextTotal);
                            }}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter' || event.key === 'Escape') {
                                setIsEditingB2bTimeTarget1(false);
                              }
                            }}
                            className="w-14 bg-zinc-800 text-white text-5xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            if (b2bTimer1.isRunning) return;
                            setIsEditingB2bTimeTarget1(true);
                          }}
                          disabled={b2bTimer1.isRunning}
                          className="text-white text-5xl font-bold tabular-nums focus:outline-none disabled:opacity-60"
                        >
                          {formatTimerDisplay(b2bTimer1.remainingSeconds)}
                        </button>
                      )}
                      <div className="text-[10px] text-zinc-500">
                        {b2bTimer1.isRunning ? 'Timer running' : 'Tap time to edit target'}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditingB2bTimeTarget1(false);
                            b2bTimer1.start();
                          }}
                          disabled={b2bTimer1.isRunning || b2bTimeTargetSeconds1 <= 0}
                          className="rounded bg-zinc-700 px-2 py-1 text-xs text-white hover:bg-zinc-600 disabled:opacity-50"
                        >
                          Start
                        </button>
                        <button
                          type="button"
                          onClick={() => b2bTimer1.pause()}
                          disabled={!b2bTimer1.isRunning}
                          className="rounded bg-zinc-700 px-2 py-1 text-xs text-white disabled:opacity-50"
                        >
                          Pause
                        </button>
                        <button
                          type="button"
                          onClick={() => b2bTimer1.reset()}
                          disabled={b2bTimer1.isRunning || b2bTimer1.remainingSeconds === b2bTimeTargetSeconds1}
                          className="rounded bg-zinc-700 px-2 py-1 text-xs text-white disabled:opacity-50"
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="bg-zinc-900 rounded-lg p-3">
                    <label className="text-zinc-400 text-xs block mb-1">Actual (sec)</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={formatMetricValueInput(setData1.weight, ex1MetricInfo, true)}
                      onChange={(e) => {
                        const nextValue = parseMetricValueInput(e.target.value, ex1MetricInfo);
                        if (nextValue !== null) {
                          setSetData1((prev) => ({ ...prev, weight: nextValue, reps: 0 }));
                        }
                      }}
                      className="w-full bg-zinc-800 text-white text-2xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              ) : (
                <div className={`grid ${ex1InputColumnClass} gap-3 mb-3`}>
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
                  {showRepsInput1 && (
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
                  )}
                </div>
              )}

              <div className="bg-zinc-900 rounded p-3 mb-3">
                <div className="text-zinc-500 text-xs mb-1">Form Tips</div>
                <p className="text-zinc-300 text-sm">{getFormTips(ex1.tips)}</p>
              </div>

              <button
                onClick={() => handleCompleteB2BExercise()}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg text-lg font-bold transition-colors"
              >
                ✓ Complete Exercise 1
              </button>
            </>
          ) : (
            <>
              {/* Inactive: Show entered data */}
              <div className={`grid ${showRepsInput1 ? 'grid-cols-2' : 'grid-cols-1'} gap-3 mb-3`}>
                <div className="bg-zinc-900 rounded p-3 text-center">
                  <div className="text-zinc-500 text-xs mb-1">
                    {getMetricLabelText(ex1MetricInfo, ex1Machine)}
                  </div>
                  <div className="text-white text-xl font-semibold">
                    {formatMetric(setData1.weight, ex1MetricInfo, ex1Machine)}
                  </div>
                </div>
                {showRepsInput1 && (
                  <div className="bg-zinc-900 rounded p-3 text-center">
                    <div className="text-zinc-500 text-xs mb-1">Reps</div>
                    <div className="text-white text-xl font-semibold">
                      {setData1.reps}
                    </div>
                  </div>
                )}
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
            <div className={`grid ${showTargetMetric2 && showTargetReps2 ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
              {showTargetMetric2 && (
                <div className="text-center">
                  <div className="text-zinc-500 text-xs mb-1">
                    {getMetricLabelText(ex2MetricInfo, ex2Machine)}
                  </div>
                  <div className="text-white text-lg font-semibold">
                    {formatMetric(ex2.targetWeight, ex2MetricInfo, ex2Machine)}
                  </div>
                </div>
              )}
              {showTargetReps2 && (
                <div className="text-center">
                  <div className="text-zinc-500 text-xs mb-1">Reps</div>
                  <div className="text-white text-lg font-semibold">
                    {ex2.targetReps}
                  </div>
                </div>
              )}
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
              {ex2TimeOnly ? (
                <div className="space-y-3 mb-3">
                  <div className="bg-zinc-900 rounded-lg p-3">
                    <div className="mt-1 flex flex-col items-center gap-2">
                      {isEditingB2bTimeTarget2 ? (
                        <div
                          className="flex items-center gap-2"
                          onBlur={(event) => {
                            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                              setIsEditingB2bTimeTarget2(false);
                            }
                          }}
                        >
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={2}
                            value={ex2MinutesInput ?? formatTimePart(ex2TargetParts.minutes)}
                            onFocus={(event) => {
                              event.currentTarget.select();
                              if (ex2MinutesInput === null && ex2TargetParts.minutes === 0) {
                                setEx2MinutesInput('');
                              }
                            }}
                            onChange={(event) => {
                              const nextRaw = sanitizeTimeInput(event.target.value);
                              setEx2MinutesInput(nextRaw);
                              const nextMinutes = Math.min(99, parseTimeInput(nextRaw));
                              const nextSeconds = ex2TargetParts.seconds;
                              const nextTotal = nextMinutes * 60 + nextSeconds;
                              setB2bTimeTargetSeconds2(nextTotal);
                              b2bTimer2.setDuration(nextTotal);
                            }}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter' || event.key === 'Escape') {
                                setIsEditingB2bTimeTarget2(false);
                              }
                            }}
                            autoFocus
                            className="w-14 bg-zinc-800 text-white text-5xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                          <span className="text-white text-5xl font-bold">:</span>
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={2}
                            value={ex2SecondsInput ?? formatTimePart(ex2TargetParts.seconds)}
                            onFocus={(event) => {
                              event.currentTarget.select();
                              if (ex2SecondsInput === null && ex2TargetParts.seconds === 0) {
                                setEx2SecondsInput('');
                              }
                            }}
                            onChange={(event) => {
                              const nextRaw = sanitizeTimeInput(event.target.value);
                              setEx2SecondsInput(nextRaw);
                              const nextSeconds = Math.min(59, parseTimeInput(nextRaw));
                              const nextTotal = ex2TargetParts.minutes * 60 + nextSeconds;
                              setB2bTimeTargetSeconds2(nextTotal);
                              b2bTimer2.setDuration(nextTotal);
                            }}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter' || event.key === 'Escape') {
                                setIsEditingB2bTimeTarget2(false);
                              }
                            }}
                            className="w-14 bg-zinc-800 text-white text-5xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            if (b2bTimer2.isRunning) return;
                            setIsEditingB2bTimeTarget2(true);
                          }}
                          disabled={b2bTimer2.isRunning}
                          className="text-white text-5xl font-bold tabular-nums focus:outline-none disabled:opacity-60"
                        >
                          {formatTimerDisplay(b2bTimer2.remainingSeconds)}
                        </button>
                      )}
                      <div className="text-[10px] text-zinc-500">
                        {b2bTimer2.isRunning ? 'Timer running' : 'Tap time to edit target'}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditingB2bTimeTarget2(false);
                            b2bTimer2.start();
                          }}
                          disabled={b2bTimer2.isRunning || b2bTimeTargetSeconds2 <= 0}
                          className="rounded bg-zinc-700 px-2 py-1 text-xs text-white hover:bg-zinc-600 disabled:opacity-50"
                        >
                          Start
                        </button>
                        <button
                          type="button"
                          onClick={() => b2bTimer2.pause()}
                          disabled={!b2bTimer2.isRunning}
                          className="rounded bg-zinc-700 px-2 py-1 text-xs text-white disabled:opacity-50"
                        >
                          Pause
                        </button>
                        <button
                          type="button"
                          onClick={() => b2bTimer2.reset()}
                          disabled={b2bTimer2.isRunning || b2bTimer2.remainingSeconds === b2bTimeTargetSeconds2}
                          className="rounded bg-zinc-700 px-2 py-1 text-xs text-white disabled:opacity-50"
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="bg-zinc-900 rounded-lg p-3">
                    <label className="text-zinc-400 text-xs block mb-1">Actual (sec)</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={formatMetricValueInput(setData2.weight, ex2MetricInfo, true)}
                      onChange={(e) => {
                        const nextValue = parseMetricValueInput(e.target.value, ex2MetricInfo);
                        if (nextValue !== null) {
                          setSetData2((prev) => ({ ...prev, weight: nextValue, reps: 0 }));
                        }
                      }}
                      className="w-full bg-zinc-800 text-white text-2xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              ) : (
                <div className={`grid ${ex2InputColumnClass} gap-3 mb-3`}>
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
                  {showRepsInput2 && (
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
                  )}
                </div>
              )}

              <div className="bg-zinc-900 rounded p-3 mb-3">
                <div className="text-zinc-500 text-xs mb-1">Form Tips</div>
                <p className="text-zinc-300 text-sm">{getFormTips(ex2.tips)}</p>
              </div>

              <div className="space-y-3">
                {(!isReviewMode && currentExerciseInPair === 1 && currentSetIndex === targetSetCount && currentSetIndex >= 3) ? (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleCompleteB2BExercise(true)}
                      className="w-full bg-rose-700 hover:bg-rose-600 text-white py-3 rounded-lg text-sm font-bold transition-colors"
                    >
                      ✓ Complete Set {currentSetIndex} + Add another set
                    </button>
                    <button
                      onClick={() => handleCompleteB2BExercise()}
                      className="w-full bg-rose-700 hover:bg-rose-600 text-white py-3 rounded-lg text-sm font-bold transition-colors"
                    >
                      ✓ Complete Set {currentSetIndex}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleCompleteB2BExercise()}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg text-lg font-bold transition-colors"
                  >
                    ✓ Complete Exercise 2
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Inactive: Show entered data */}
              <div className={`grid ${showRepsInput2 ? 'grid-cols-2' : 'grid-cols-1'} gap-3 mb-3`}>
                <div className="bg-zinc-900 rounded p-3 text-center">
                  <div className="text-zinc-500 text-xs mb-1">
                    {getMetricLabelText(ex2MetricInfo, ex2Machine)}
                  </div>
                  <div className="text-white text-xl font-semibold">
                    {formatMetric(setData2.weight, ex2MetricInfo, ex2Machine)}
                  </div>
                </div>
                {showRepsInput2 && (
                  <div className="bg-zinc-900 rounded p-3 text-center">
                    <div className="text-zinc-500 text-xs mb-1">Reps</div>
                    <div className="text-white text-xl font-semibold">
                      {setData2.reps}
                    </div>
                  </div>
                )}
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
                  ✓ {ex1.name}: {formatSetSummary(pair.ex1.weight, pair.ex1.reps, ex1MetricInfo, ex1Machine)}
                </div>
                <div className="text-zinc-300 text-xs ml-2">
                  ✓ {ex2.name}: {formatSetSummary(pair.ex2.weight, pair.ex2.reps, ex2MetricInfo, ex2Machine)}
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
};


export function SingleExerciseView({ context }: { context: ActiveWorkoutViewContext }) {
  const {
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
  } = context;
  const exercise = exerciseToDisplay as SingleExercise;
  const metricInfo = getMetricInfo(exercise);
  const hasWarmup = resolveHasWarmup(exercise);
  const isWarmupSet = hasWarmup && warmupDecision === 'include' && currentSetIndex === 0;
  const isRepsOnly = isRepsOnlyMetric(metricInfo.primaryMetric);
  const isTimeOnly = isTimeMetric(metricInfo.primaryMetric);
  const isMachine = !!exercise.isMachine && isWeightMetric(metricInfo.primaryMetric);
  const showMachineToggle = isMachine && !isRepsOnly;
  const showMetricInput = !isRepsOnly && !(isMachine && machineOnly);
  const showRepsInput = !isTimeOnly;
  const inputColumnClass = showMetricInput && showRepsInput ? 'grid-cols-2' : 'grid-cols-1';
  const singleTargetParts = splitTimeParts(timeTargetSeconds);
  const [singleMinutesInput, setSingleMinutesInput] = useState<string | null>(null);
  const [singleSecondsInput, setSingleSecondsInput] = useState<string | null>(null);

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
  const targetSetCount = getTargetSetCount(currentExerciseIndex, exercise.sets);
  const showExtraSetOption = !isReviewMode
    && !showWarmupPrompt
    && !isWarmupSet
    && currentSetIndex === targetSetCount
    && currentSetIndex >= 3;
  useEffect(() => {
    if (!isEditingTimeTarget) {
      setSingleMinutesInput(null);
      setSingleSecondsInput(null);
    }
  }, [isEditingTimeTarget]);

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
};

const handleAddReviewSingleSet = () => {
  if (!viewingCachedData) return;
  const sessionExerciseIndex = viewingCachedData.sessionExerciseIndex;
  if (sessionExerciseIndex === null || sessionExerciseIndex === undefined) return;

  const defaultWorkingSet = {
    weight: isRepsOnly ? 0 : exercise.targetWeight,
    reps: getDefaultReps(exercise),
  };
  const lastSet = displayCompletedSets[displayCompletedSets.length - 1];
  const nextSet = (displayWarmupCompleted && displayCompletedSets.length === 1)
    ? defaultWorkingSet
    : (lastSet ?? defaultWorkingSet);
  const nextSetIndex = displayWarmupCompleted
    ? displayCompletedSets.length
    : displayCompletedSets.length + 1;
  const nextWorkingCount = displayWarmupCompleted
    ? displayCompletedSets.length
    : displayCompletedSets.length + 1;
  if (nextWorkingCount > exercise.sets) {
    setExtraSetsByExerciseIndex((prev) => ({
      ...prev,
      [viewingExerciseIndex]: Math.max(prev?.[viewingExerciseIndex] ?? 0, nextWorkingCount - exercise.sets),
    }));
  }

  updateExerciseInSession(sessionExerciseIndex, (sessionExercise) => {
    const nextSets = [...(sessionExercise.sets || []), { weight: nextSet.weight, reps: nextSet.reps }];
    return {
      ...sessionExercise,
      sets: nextSets,
    };
  });

  setCompletedExercisesCache((prev) => prev.map((cache) => {
    if (cache.exerciseIndex !== viewingExerciseIndex) return cache;
    const nextCompleted = [...(cache.completedSets || []), { weight: nextSet.weight, reps: nextSet.reps }];
    return { ...cache, completedSets: nextCompleted };
  }));

  void autosaveWorkout({
    type: 'single_set',
    exerciseName: exercise.name,
    setIndex: nextSetIndex,
    weight: nextSet.weight,
    reps: nextSet.reps,
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
                  <div className={`grid ${!isRepsOnly && showRepsInput ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
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
                    {showRepsInput && (
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
                    )}
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
  const reviewRepsInput = !isTimeOnly;
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
                  <div className={`grid ${reviewMetricInput && reviewRepsInput ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
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
                    {reviewRepsInput && (
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
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 mt-6">
          {viewingCachedData && displayCompletedSets.length > 0 && (
            <button
              onClick={handleAddReviewSingleSet}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              + Add another set
            </button>
          )}
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
            {formatSetSummary(exercise.targetWeight, exercise.targetReps, metricInfo, isMachine)}
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
                Warmup: {formatSetSummary(lastExerciseLog.warmup_weight, lastExerciseLog.warmup_reps, metricInfo, isMachine)}
              </div>
            )}
            {([1, 2, 3, 4] as const).map((setNum) => {
              const weight = getLogSetValue(lastExerciseLog, setNum, 'weight');
              const reps = getLogSetValue(lastExerciseLog, setNum, 'reps');
              if (weight !== null && reps !== null) {
                return (
                  <div key={setNum} className="text-zinc-300 text-sm">
                    Set {setNum}: {formatSetSummary(weight, reps, metricInfo, isMachine)}
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
        <div className={`grid ${!isRepsOnly && showRepsInput ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
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
          {showRepsInput && (
            <div className="bg-zinc-900 rounded p-3 text-center">
              <div className="text-zinc-500 text-xs mb-1">Reps</div>
              <div className="text-white text-xl font-semibold">
                {exercise.targetReps}
              </div>
            </div>
          )}
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
          {isTimeOnly ? (
              <div className="space-y-4 mb-4">
                <div className="bg-zinc-900 rounded-lg p-4">
                  <div className="flex flex-col items-center gap-3">
                    {isEditingTimeTarget ? (
                      <div
                        className="flex items-center gap-3"
                        onBlur={(event) => {
                          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                            setIsEditingTimeTarget(false);
                          }
                        }}
                      >
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={2}
                          value={singleMinutesInput ?? formatTimePart(singleTargetParts.minutes)}
                          onFocus={(event) => {
                            event.currentTarget.select();
                            if (singleMinutesInput === null && singleTargetParts.minutes === 0) {
                              setSingleMinutesInput('');
                            }
                          }}
                          onChange={(event) => {
                            const nextRaw = sanitizeTimeInput(event.target.value);
                            setSingleMinutesInput(nextRaw);
                            const nextMinutes = Math.min(99, parseTimeInput(nextRaw));
                            const nextSeconds = singleTargetParts.seconds;
                            const nextTotal = nextMinutes * 60 + nextSeconds;
                            setTimeTargetSeconds(nextTotal);
                            singleTimer.setDuration(nextTotal);
                          }}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === 'Escape') {
                              setIsEditingTimeTarget(false);
                            }
                          }}
                          autoFocus
                          className="w-20 bg-zinc-800 text-white text-6xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-rose-600"
                        />
                        <span className="text-white text-6xl font-bold">:</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={2}
                          value={singleSecondsInput ?? formatTimePart(singleTargetParts.seconds)}
                          onFocus={(event) => {
                            event.currentTarget.select();
                            if (singleSecondsInput === null && singleTargetParts.seconds === 0) {
                              setSingleSecondsInput('');
                            }
                          }}
                          onChange={(event) => {
                            const nextRaw = sanitizeTimeInput(event.target.value);
                            setSingleSecondsInput(nextRaw);
                            const nextSeconds = Math.min(59, parseTimeInput(nextRaw));
                            const nextTotal = singleTargetParts.minutes * 60 + nextSeconds;
                            setTimeTargetSeconds(nextTotal);
                            singleTimer.setDuration(nextTotal);
                          }}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === 'Escape') {
                              setIsEditingTimeTarget(false);
                            }
                          }}
                          className="w-20 bg-zinc-800 text-white text-6xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-rose-600"
                        />
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          if (singleTimer.isRunning) return;
                          setIsEditingTimeTarget(true);
                        }}
                        disabled={singleTimer.isRunning}
                        className="text-white text-6xl font-bold tabular-nums focus:outline-none disabled:opacity-60"
                      >
                        {formatTimerDisplay(singleTimer.remainingSeconds)}
                      </button>
                    )}
                    <div className="text-xs text-zinc-500">
                      {singleTimer.isRunning ? 'Timer running' : 'Tap time to edit target'}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingTimeTarget(false);
                          singleTimer.start();
                        }}
                        disabled={singleTimer.isRunning || timeTargetSeconds <= 0}
                        className="rounded bg-zinc-700 px-3 py-1 text-sm text-white hover:bg-zinc-600 disabled:opacity-50"
                      >
                        Start
                      </button>
                      <button
                        type="button"
                        onClick={() => singleTimer.pause()}
                        disabled={!singleTimer.isRunning}
                        className="rounded bg-zinc-700 px-3 py-1 text-sm text-white disabled:opacity-50"
                      >
                        Pause
                      </button>
                      <button
                        type="button"
                        onClick={() => singleTimer.reset()}
                        disabled={singleTimer.isRunning || singleTimer.remainingSeconds === timeTargetSeconds}
                        className="rounded bg-zinc-700 px-3 py-1 text-sm text-white disabled:opacity-50"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              <div className="bg-zinc-900 rounded-lg p-4">
                <label className="text-zinc-400 text-sm block mb-2">Actual (sec)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formatMetricValueInput(setData.weight, metricInfo, true)}
                  onChange={(e) => {
                    const nextValue = parseMetricValueInput(e.target.value, metricInfo);
                    if (nextValue !== null) {
                      setSetData({ ...setData, weight: nextValue, reps: 0 });
                    }
                  }}
                  className="w-full bg-zinc-800 text-white text-3xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-rose-600"
                />
              </div>
            </div>
          ) : (
            <div className={`grid ${inputColumnClass} gap-4 mb-4`}>
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
              {showRepsInput && (
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
              )}
            </div>
          )}

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
                onClick={() => handleCompleteSet()}
                className="bg-rose-700 hover:bg-rose-600 text-white py-4 rounded-lg text-lg font-bold transition-colors"
              >
                ✓ Complete Warmup
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {showExtraSetOption ? (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleCompleteSet(true)}
                    className="w-full bg-rose-700 hover:bg-rose-600 text-white py-4 rounded-lg text-base font-bold transition-colors"
                  >
                    ✓ Complete Set {currentSetIndex} + Add another set
                  </button>
                  <button
                    onClick={() => handleCompleteSet()}
                    className="w-full bg-rose-700 hover:bg-rose-600 text-white py-4 rounded-lg text-base font-bold transition-colors"
                  >
                    ✓ Complete Set {currentSetIndex}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleCompleteSet()}
                  className="w-full bg-rose-700 hover:bg-rose-600 text-white py-4 rounded-lg text-xl font-bold transition-colors"
                >
                  ✓ Complete Set {currentSetIndex}
                </button>
              )}
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
                ✓ {label}: {formatSetSummary(set.weight, set.reps, metricInfo, isMachine)}
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
};
