'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { WorkoutPlan } from '@/lib/types';
import { loadSessionTargetsMeta, loadSessionWorkout } from '@/lib/session-workout';
import { getWorkoutSession, WorkoutSessionData } from '@/lib/workout-session';
import { EXERCISE_TYPES, type ExercisePrimaryMetric } from '@/lib/constants';
import {
  DEFAULT_HEIGHT_UNIT,
  DEFAULT_WEIGHT_UNIT,
  convertWeightFromStorage,
  normalizeHeightUnit,
  normalizeWeightUnit,
} from '@/lib/units';
import type { HeightUnit, WeightUnit } from '@/lib/units';
import {
  formatMetricDisplay,
  isRepsOnlyMetric,
  isTimeMetric,
  isWeightMetric,
  resolvePrimaryMetric,
} from '@/lib/metric-utils';

type ReportTarget = {
  name: string;
  targetWeight: number | null;
  targetReps: number | null;
  isBodyweight?: boolean;
  isMachine?: boolean;
  primaryMetric?: ExercisePrimaryMetric;
  metricUnit?: string | null;
};

function extractReportTargets(plan: WorkoutPlan | null): ReportTarget[] {
  if (!plan) return [];
  const targets: ReportTarget[] = [];
  for (const exercise of plan.exercises) {
    if (exercise.type === EXERCISE_TYPES.single) {
      targets.push({
        name: exercise.name,
        targetWeight: Number.isFinite(exercise.targetWeight) ? exercise.targetWeight : null,
        targetReps: Number.isFinite(exercise.targetReps) ? exercise.targetReps : null,
        isBodyweight: exercise.isBodyweight ?? false,
        isMachine: exercise.isMachine ?? false,
        primaryMetric: exercise.primaryMetric,
        metricUnit: exercise.metricUnit ?? null
      });
    } else {
      const [ex1, ex2] = exercise.exercises;
      targets.push({
        name: ex1.name,
        targetWeight: Number.isFinite(ex1.targetWeight) ? ex1.targetWeight : null,
        targetReps: Number.isFinite(ex1.targetReps) ? ex1.targetReps : null,
        isBodyweight: ex1.isBodyweight ?? false,
        isMachine: ex1.isMachine ?? false,
        primaryMetric: ex1.primaryMetric,
        metricUnit: ex1.metricUnit ?? null
      });
      targets.push({
        name: ex2.name,
        targetWeight: Number.isFinite(ex2.targetWeight) ? ex2.targetWeight : null,
        targetReps: Number.isFinite(ex2.targetReps) ? ex2.targetReps : null,
        isBodyweight: ex2.isBodyweight ?? false,
        isMachine: ex2.isMachine ?? false,
        primaryMetric: ex2.primaryMetric,
        metricUnit: ex2.metricUnit ?? null
      });
    }
  }
  return targets;
}

export default function SummaryPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [workout, setWorkout] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState<WorkoutSessionData | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [totalVolume, setTotalVolume] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [report, setReport] = useState<string | null>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [weightUnit, setWeightUnit] = useState<WeightUnit>(DEFAULT_WEIGHT_UNIT);
  const [heightUnit, setHeightUnit] = useState<HeightUnit>(DEFAULT_HEIGHT_UNIT);

  const getMetricInfo = (entry: {
    primaryMetric?: ExercisePrimaryMetric;
    metricUnit?: string | null;
    isBodyweight?: boolean;
  }) => ({
    primaryMetric: resolvePrimaryMetric(entry.primaryMetric, entry.isBodyweight),
    metricUnit: entry.metricUnit ?? null,
  });

  const formatMetric = (
    value: number,
    entry: { primaryMetric?: ExercisePrimaryMetric; metricUnit?: string | null; isBodyweight?: boolean },
    isMachine?: boolean
  ) => {
    const metricInfo = getMetricInfo(entry);
    return formatMetricDisplay(value, metricInfo.primaryMetric, metricInfo.metricUnit, weightUnit, heightUnit, isMachine);
  };

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
      return formatMetricDisplay(weight, metricInfo.primaryMetric, metricInfo.metricUnit, weightUnit, heightUnit, isMachine);
    }
    return `${formatMetricDisplay(weight, metricInfo.primaryMetric, metricInfo.metricUnit, weightUnit, heightUnit, isMachine)} × ${reps} reps`;
  };

  const formatVolume = (volume: number) =>
    Math.round(convertWeightFromStorage(volume, weightUnit)).toLocaleString();

  const reportTargets = useMemo(() => extractReportTargets(workout), [workout]);
  const reportTargetsByName = useMemo(() => {
    const map = new Map<string, ReportTarget>();
    for (const target of reportTargets) {
      map.set(target.name, target);
    }
    return map;
  }, [reportTargets]);

  // Prevent double-save in React Strict Mode / re-renders
  const hasSavedRef = useRef(false);
  const hasReportedRef = useRef(false);

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

  // Get routineId from URL params (for public/favorited routines)
  const routineIdParam = searchParams.get('routineId');

  // ---------------------------
  // Fetch workout
  // ---------------------------
  useEffect(() => {
    async function fetchWorkout() {
      try {
        let apiUrl = `/api/workout/${params.name}`;
        if (routineIdParam) {
          apiUrl += `?routineId=${routineIdParam}`;
        }

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Workout not found');

        const data = await response.json();
        setWorkout(data.workout);
      } catch (error) {
        console.error('Error fetching workout:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchWorkout();
  }, [params.name, routineIdParam]);

  // ---------------------------
  // Load session + compute stats
  // ---------------------------
  useEffect(() => {
    const session = getWorkoutSession();
    if (!session) {
      console.error('No session data found');
      return;
    }

    setSessionData(session);

    // Calculate total volume (weight-based only)
    let volume = 0;
    for (const exercise of session.exercises) {
      const meta = reportTargetsByName.get(exercise.name);
      const metricInfo = getMetricInfo({
        primaryMetric: exercise.primaryMetric ?? meta?.primaryMetric,
        metricUnit: exercise.metricUnit ?? meta?.metricUnit,
        isBodyweight: meta?.isBodyweight,
      });
      if (isWeightMetric(metricInfo.primaryMetric)) {
        if (exercise.warmup) {
          volume += exercise.warmup.weight * exercise.warmup.reps;
        }
        for (const set of exercise.sets) {
          volume += set.weight * set.reps;
        }
      }
      if (exercise.b2bPartner) {
        const partnerMeta = reportTargetsByName.get(exercise.b2bPartner.name);
        const partnerMetricInfo = getMetricInfo({
          primaryMetric: exercise.b2bPartner.primaryMetric ?? partnerMeta?.primaryMetric,
          metricUnit: exercise.b2bPartner.metricUnit ?? partnerMeta?.metricUnit,
          isBodyweight: partnerMeta?.isBodyweight,
        });
        if (isWeightMetric(partnerMetricInfo.primaryMetric)) {
          if (exercise.b2bPartner.warmup) {
            volume += exercise.b2bPartner.warmup.weight * exercise.b2bPartner.warmup.reps;
          }
          for (const set of exercise.b2bPartner.sets) {
            volume += set.weight * set.reps;
          }
        }
      }
    }
    setTotalVolume(Math.round(volume));

    // Calculate duration
    const startTime = new Date(session.startTime);
    const endTime = new Date();
    const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 60000);
    setTotalDuration(durationMinutes);
  }, [reportTargetsByName]);

  // ---------------------------
  // AUTO-SAVE WORKOUT (with duplicate protection)
  // ---------------------------
  useEffect(() => {
    if (!sessionData) return;
    if (hasSavedRef.current) return; // React Strict Mode protection

    const sessionKey = `workout-saved-${sessionData.startTime}`;

    // Prevent saving same session twice (refresh / navigation)
    if (localStorage.getItem(sessionKey)) {
      console.log('⚠️ Workout already saved, skipping');
      hasSavedRef.current = true;
      setSaved(true);
      return;
    }

    const saveWorkout = async () => {
      setSaving(true);
      hasSavedRef.current = true;

      try {
        const response = await fetch('/api/save-workout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sessionData),
        });

        if (!response.ok) {
          throw new Error('Failed to save workout');
        }

        // Mark as saved in localStorage
        localStorage.setItem(sessionKey, 'true');
        setSaved(true);
        console.log('✅ Workout auto-saved');
      } catch (error) {
        console.error('❌ Error saving workout:', error);
        hasSavedRef.current = false; // allow retry if needed
      } finally {
        setSaving(false);
      }
    };

    saveWorkout();
  }, [sessionData]);

  // ---------------------------
  // Generate workout report
  // ---------------------------
  useEffect(() => {
    if (!sessionData) return;
    if (hasReportedRef.current) return;

    const generateReport = async () => {
      setReportLoading(true);
      hasReportedRef.current = true;
      try {
        const sessionRoutineId = routineIdParam ?? (typeof sessionData.routineId === 'number'
          ? String(sessionData.routineId)
          : null);
        const sessionTargetsPlan = loadSessionWorkout(sessionData.workoutName, sessionRoutineId);
        const reportTargets = extractReportTargets(sessionTargetsPlan);
        const targetsMeta = loadSessionTargetsMeta(sessionData.workoutName, sessionRoutineId);
        const preWorkoutTargets = (targetsMeta || reportTargets.length > 0)
          ? {
            sessionMode: targetsMeta?.sessionMode ?? null,
            source: targetsMeta?.source ?? null,
            encouragement: targetsMeta?.encouragement ?? null,
            goalSummary: targetsMeta?.goalSummary ?? null,
            trendSummary: targetsMeta?.trendSummary ?? null,
            targets: reportTargets
          }
          : null;
        const query = new URLSearchParams();
        if (typeof sessionData.sessionId === 'number') {
          query.set('sessionId', String(sessionData.sessionId));
        }
        if (sessionData.startTime) {
          query.set('sessionKey', sessionData.startTime);
        }
        const checkResponse = await fetch(`/api/workout-report?${query.toString()}`);
        if (checkResponse.ok) {
          const existing = await checkResponse.json();
          if (existing?.report) {
            setReport(existing.report);
            return;
          }
        }

        const response = await fetch('/api/workout-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionData,
            preWorkoutTargets
          }),
        });
        if (!response.ok) {
          throw new Error('Failed to generate report');
        }
        const data = await response.json();
        setReport(data.report || null);
      } catch (error) {
        console.error('Error generating report:', error);
        hasReportedRef.current = false;
      } finally {
        setReportLoading(false);
      }
    };

    generateReport();
  }, [sessionData, routineIdParam]);

  // ---------------------------
  // Complete workout = just go to routines
  // ---------------------------
  const handleCompleteWorkout = () => {
    router.push('/routines');
  };

  // ---------------------------
  // UI STATES
  // ---------------------------
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

  return (
    <div className="min-h-screen bg-zinc-900 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Celebration Header */}
        <div className="text-center mb-8">
          <div className="text-8xl mb-4">🎉</div>
          <h1 className="text-4xl font-bold text-white mb-2">Workout Complete!</h1>
          <div className="text-zinc-400 text-xl mb-2">{workout.name}</div>
          <div className="text-zinc-500">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="bg-zinc-800 rounded-lg p-6 mb-8 border-2 border-green-600">
          {sessionData ? (
            <div className="text-center">
              <div className="text-zinc-400 text-sm mb-2">Total Volume</div>
              <div className="text-white text-4xl font-bold mb-1">
                {formatVolume(totalVolume)} {weightUnit}
              </div>
              <div className="text-zinc-500 text-sm mt-2">
                Duration: {totalDuration} minutes
              </div>

              {/* Save status indicator */}
              <div className="text-xs mt-2">
                {saving && <span className="text-yellow-400">Saving workout...</span>}
                {saved && <span className="text-green-400">✓ Workout saved</span>}
              </div>
            </div>
          ) : (
            <div className="text-center text-zinc-400">Loading session data...</div>
          )}
        </div>

        {(reportLoading || report) && (
          <div className="bg-zinc-800 rounded-lg p-6 mb-8 border border-zinc-700">
            <div className="text-zinc-300 text-sm font-semibold mb-3">Workout Report</div>
            {reportLoading && (
              <div className="text-zinc-400 text-sm">Generating your report...</div>
            )}
            {report && (
              <div className="text-zinc-200 text-sm whitespace-pre-line">{report}</div>
            )}
          </div>
        )}

        {/* Exercises Summary */}
        {sessionData && (
          <div className="bg-zinc-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">EXERCISES COMPLETED</h2>
            <div className="space-y-4">
              {sessionData.exercises.map((exercise, index) => {
                const targetMeta = reportTargetsByName.get(exercise.name);
                const metricInfo = getMetricInfo({
                  primaryMetric: exercise.primaryMetric ?? targetMeta?.primaryMetric,
                  metricUnit: exercise.metricUnit ?? targetMeta?.metricUnit,
                  isBodyweight: targetMeta?.isBodyweight,
                });
                const partnerMeta = exercise.b2bPartner?.name
                  ? reportTargetsByName.get(exercise.b2bPartner.name)
                  : undefined;
                const partnerMetricInfo = getMetricInfo({
                  primaryMetric: exercise.b2bPartner?.primaryMetric ?? partnerMeta?.primaryMetric,
                  metricUnit: exercise.b2bPartner?.metricUnit ?? partnerMeta?.metricUnit,
                  isBodyweight: partnerMeta?.isBodyweight,
                });
                const isMachine = !!exercise.isMachine && isWeightMetric(metricInfo.primaryMetric);
                const isPartnerMachine = !!exercise.b2bPartner?.isMachine
                  && isWeightMetric(partnerMetricInfo.primaryMetric);
                const hasWeightVolume = isWeightMetric(metricInfo.primaryMetric)
                  || (exercise.b2bPartner && isWeightMetric(partnerMetricInfo.primaryMetric));
                let exerciseVolume = 0;
                if (isWeightMetric(metricInfo.primaryMetric)) {
                  exerciseVolume += (exercise.warmup ? exercise.warmup.weight * exercise.warmup.reps : 0) +
                    exercise.sets.reduce((sum, set) => sum + set.weight * set.reps, 0);
                }
                if (exercise.b2bPartner && isWeightMetric(partnerMetricInfo.primaryMetric)) {
                  exerciseVolume += (exercise.b2bPartner.warmup
                    ? exercise.b2bPartner.warmup.weight * exercise.b2bPartner.warmup.reps
                    : 0) +
                    exercise.b2bPartner.sets.reduce(
                      (sum, set) => sum + set.weight * set.reps,
                      0
                    );
                }

                return (
                  <div key={index} className="border-l-4 border-green-500 pl-3">
                    <div className="text-white font-semibold mb-1">
                      {exercise.type === EXERCISE_TYPES.single
                        ? exercise.name
                        : `B2B: ${exercise.name} / ${exercise.b2bPartner?.name}`}
                    </div>
                    <div className="text-zinc-400 text-sm mb-2">
                      {exercise.sets.length} sets
                      {hasWeightVolume && (
                        <> • {formatVolume(exerciseVolume)} {weightUnit} volume</>
                      )}
                    </div>
                    <div className="space-y-1 text-xs">
                      {exercise.warmup && (
                        <div className="text-zinc-500">
                          Warmup: {formatSetSummary(
                            exercise.warmup.weight,
                            exercise.warmup.reps,
                            metricInfo,
                            isMachine
                          )}
                        </div>
                      )}
                      {exercise.sets.map((set, setIndex) => (
                        <div key={setIndex} className="text-zinc-300">
                          Set {setIndex + 1}: {formatSetSummary(
                            set.weight,
                            set.reps,
                            metricInfo,
                            isMachine
                          )}
                          {exercise.b2bPartner &&
                            exercise.b2bPartner.sets[setIndex] && (
                              <span className="text-purple-400">
                                {' + '}
                                {formatSetSummary(
                                  exercise.b2bPartner.sets[setIndex].weight,
                                  exercise.b2bPartner.sets[setIndex].reps,
                                  partnerMetricInfo,
                                  isPartnerMachine
                                )}
                              </span>
                            )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {sessionData.cardio && (
              <div className="mt-4 pt-4 border-t border-zinc-700">
                <div className="text-white font-semibold mb-1">
                  Cardio: {sessionData.cardio.type}
                </div>
                <div className="text-zinc-400 text-sm">
                  {sessionData.cardio.time} min
                  {sessionData.cardio.speed && ` • ${sessionData.cardio.speed} mph`}
                  {sessionData.cardio.incline &&
                    ` • ${sessionData.cardio.incline}% incline`}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Finish Button */}
        <button
          onClick={handleCompleteWorkout}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg text-xl font-bold transition-colors mb-4"
        >
          ✅ Finish & Go Home
        </button>

      </div>
    </div>
  );
}
