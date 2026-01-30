'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { WorkoutPlan, Exercise, Stretch, Cardio } from '@/lib/types';
import { getFormTips, getVideoUrl } from '@/lib/workout-media';
import { initWorkoutSession, isSessionMode, resolveSessionMode } from '@/lib/workout-session';
import type { SessionMode } from '@/lib/workout-session';
import { BottomActionBar, Card, SectionHeader } from '@/app/components/SharedUi';
import ExerciseHistoryModal from '@/app/components/ExerciseHistoryModal';

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
  display_mode: 'weight' | 'reps';
  points: ExerciseHistoryPoint[];
};

const WEIGHT_INCREMENT = 2.5;

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
  if (mode === 'maintenance') return { weight: 0.85, reps: 0.85 };
  if (mode === 'light') return { weight: 0.6, reps: 0.6 };
  return { weight: 1.05, reps: 1.05 };
}

export default function WorkoutDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPreview = searchParams.get('preview') === '1';
  const sessionModeParam = searchParams.get('mode');
  const sessionMode = isSessionMode(sessionModeParam) ? sessionModeParam : null;
  const startMode = resolveSessionMode(sessionModeParam, 'incremental');
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
  const [loadingDots, setLoadingDots] = useState('...');

  const baseHistoryTargets = useMemo(() => {
    if (!workout) return {};
    const next: Record<string, { weight?: number | null; reps?: number | null }> = {};
    for (const exercise of workout.exercises) {
      if (exercise.type === 'single') {
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
      if (exercise.type === 'single') {
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

  const computeFallbackTargets = async (
    signal: AbortSignal
  ): Promise<Record<string, ExerciseTarget>> => {
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
    const history: Record<string, ExerciseHistorySeries> = data.history || {};
    const fallback: Record<string, ExerciseTarget> = {};
    const { weight: weightFactor, reps: repsFactor } = getSessionFactors(sessionMode as SessionMode);

    const buildTarget = (exercise: Exercise) => {
      const series = history[exercise.name];
      const points = series?.points || [];
      const { maxWeight, repsAtMax, maxReps } = getMaxWeightAndReps(points);
      const baseWeight = exercise.targetWeight;
      const baseReps = exercise.targetReps;
      const isBodyweight = !!exercise.isBodyweight;
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
        const repFactorForMode = sessionMode === 'incremental' ? 1 : repsFactor;
        const scaledReps = roundUpWhole(sourceReps * repFactorForMode);
        suggestedWeight = Math.max(0, scaledWeight);
        suggestedReps = Math.max(1, scaledReps);
        const repNote = sessionMode === 'incremental'
          ? 'max reps at your max weight'
          : `${Math.round(repsFactor * 100)}% of your max reps`;
        rationale = usesHistory
          ? `Default target uses ${Math.round(weightFactor * 100)}% of your last 30-day max weight and ${repNote}.`
          : 'Default target uses your routine baseline until more history is logged.';
      }

      fallback[exercise.name] = {
        suggestedWeight,
        suggestedReps,
        rationale
      };
    };

    for (const entry of workout.exercises) {
      if (entry.type === 'single') {
        buildTarget(entry);
      } else {
        const [ex1, ex2] = entry.exercises;
        buildTarget(ex1);
        buildTarget(ex2);
      }
    }

    return fallback;
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
    if (!workout || !isPreview || !sessionMode) return;

    let isActive = true;
    const controller = new AbortController();

    const fetchTargets = async () => {
      setTargetsLoading(true);
      setTargetsError(null);
      setTargets({});

      const exercisePayload: Array<{
        name: string;
        type: 'single' | 'b2b';
        sets: number;
        targetWeight: number;
        targetReps: number;
        warmupWeight?: number;
        isBodyweight?: boolean;
      }> = [];

      for (const exercise of workout.exercises) {
        if (exercise.type === 'single') {
          exercisePayload.push({
            name: exercise.name,
            type: 'single',
            sets: exercise.sets,
            targetWeight: exercise.targetWeight,
            targetReps: exercise.targetReps,
            warmupWeight: exercise.warmupWeight,
            isBodyweight: exercise.isBodyweight,
          });
        } else {
          const [ex1, ex2] = exercise.exercises;
          exercisePayload.push({
            name: ex1.name,
            type: 'b2b',
            sets: ex1.sets,
            targetWeight: ex1.targetWeight,
            targetReps: ex1.targetReps,
            warmupWeight: ex1.warmupWeight,
            isBodyweight: ex1.isBodyweight,
          });
          exercisePayload.push({
            name: ex2.name,
            type: 'b2b',
            sets: ex2.sets,
            targetWeight: ex2.targetWeight,
            targetReps: ex2.targetReps,
            warmupWeight: ex2.warmupWeight,
            isBodyweight: ex2.isBodyweight,
          });
        }
      }

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
          throw new Error('Failed to load targets');
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
        setTargetsLoading(false);
      } catch (error: any) {
        if (!isActive) return;
        try {
          const fallbackTargets = await computeFallbackTargets(controller.signal);
          if (!isActive) return;
          setTargets(fallbackTargets);
          setTargetsError('Unable to generate AI-trainer targets at this time.');
        } catch (fallbackError) {
          if (!isActive) return;
          setTargetsError('Unable to generate AI-trainer targets at this time.');
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
              Pick the vibe for this session. Light workouts will be recorded but they will not show up in your progress history graphs.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => handleModeSelect('incremental')}
                className="w-full text-left bg-emerald-700/80 hover:bg-emerald-600 text-white px-4 py-4 rounded-lg font-semibold transition-colors"
              >
                Incremental progress
                <div className="text-emerald-200 text-sm font-normal">Push for some wins today.</div>
              </button>
              <button
                onClick={() => handleModeSelect('maintenance')}
                className="w-full text-left bg-blue-700/70 hover:bg-blue-600 text-white px-4 py-4 rounded-lg font-semibold transition-colors"
              >
                Maintenance
                <div className="text-blue-200 text-sm font-normal">Hold steady and keep the groove.</div>
              </button>
              <button
                onClick={() => handleModeSelect('light')}
                className="w-full text-left bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-4 rounded-lg font-semibold transition-colors"
              >
                Light session
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
                  <div className="text-emerald-400 text-xs mb-1">Session Mode</div>
                  <div className="text-white text-lg font-semibold">
                    {startMode === 'incremental' && 'Incremental progress'}
                    {startMode === 'maintenance' && 'Maintenance'}
                    {startMode === 'light' && 'Light session'}
                  </div>
                  <div className="text-zinc-400 text-sm mt-1">
                    {startMode === 'incremental' && 'Push for small, steady improvements.'}
                    {startMode === 'maintenance' && 'Hold steady and focus on form.'}
                    {startMode === 'light' &&
                      'Easy effort today. This session will not appear in history graphs.'}
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
                    : targetsError
                      ? 'Using default targets for this session.'
                      : 'AI-trainer targets ready.'}
                </p>
                {targetsLoading && (
                  <div className="text-xs text-amber-300 bg-zinc-900 px-3 py-2 rounded">
                    Building your session plan
                  </div>
                )}
              </div>
            </Card>
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
              if (startMode) query.set('mode', startMode);
              const queryString = query.toString();
              initWorkoutSession(workout.name, startMode, routineId);
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
      <div className="text-blue-400 text-xs mb-2">{stretch.duration}</div>
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
}: {
  baseWeight: number;
  baseReps: number;
  suggestion?: ExerciseTarget;
  isBodyweight?: boolean;
}) {
  const targetWeight = suggestion?.suggestedWeight ?? baseWeight;
  const targetReps = suggestion?.suggestedReps ?? baseReps;
  const weightDelta = suggestion?.suggestedWeight != null ? suggestion.suggestedWeight - baseWeight : null;
  const repsDelta = suggestion?.suggestedReps != null ? suggestion.suggestedReps - baseReps : null;
  const showWeight = !isBodyweight;

  const formatDelta = (delta: number) => `${delta > 0 ? '+' : ''}${delta}`;
  const deltaClass = (delta: number) => (delta > 0 ? 'text-emerald-300' : 'text-amber-300');

  return (
    <div className="bg-zinc-900 rounded p-3 border border-emerald-800">
      <div className="text-emerald-400 text-xs mb-2">Today&apos;s target</div>
      <div className={`grid ${showWeight ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
        {showWeight && (
          <div>
            <div className="text-zinc-500 text-xs mb-1">Weight</div>
            <div className="text-white font-semibold text-lg">
              {targetWeight} lbs
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
}: {
  exercise: Exercise;
  index: number;
  onShowHistory: (names: string[]) => void;
  targets: Record<string, ExerciseTarget>;
  showTargets: boolean;
}) {
  if (exercise.type === 'single') {
    const tips = getFormTips(exercise.tips);
    const videoHref = getVideoUrl(exercise.name, exercise.videoUrl);

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
          {/* Weights together */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-950 border border-green-800 rounded p-3">
              <div className="text-green-400 text-xs mb-1">Warmup Weight</div>
              <div className="text-green-300 font-bold text-2xl">{exercise.warmupWeight} lbs</div>
            </div>
            <div className="bg-orange-950 border border-orange-800 rounded p-3">
              <div className="text-orange-400 text-xs mb-1">Working Weight</div>
              <div className="text-orange-300 font-bold text-2xl">{exercise.targetWeight} lbs</div>
            </div>
          </div>

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
          {/* Weights together */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-green-950 border border-green-800 rounded p-2">
              <div className="text-green-400 text-xs mb-1">Warmup</div>
              <div className="text-green-300 font-bold text-xl">{ex1.warmupWeight} lbs</div>
            </div>
            <div className="bg-orange-950 border border-orange-800 rounded p-2">
              <div className="text-orange-400 text-xs mb-1">Working</div>
              <div className="text-orange-300 font-bold text-xl">{ex1.targetWeight} lbs</div>
            </div>
          </div>

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
          {/* Weights together */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-green-950 border border-green-800 rounded p-2">
              <div className="text-green-400 text-xs mb-1">Warmup</div>
              <div className="text-green-300 font-bold text-xl">{ex2.warmupWeight} lbs</div>
            </div>
            <div className="bg-orange-950 border border-orange-800 rounded p-2">
              <div className="text-orange-400 text-xs mb-1">Working</div>
              <div className="text-orange-300 font-bold text-xl">{ex2.targetWeight} lbs</div>
            </div>
          </div>

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
            />
          </div>
        )}
      </div>
    </div>
  );
}
