'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { WorkoutPlan, Stretch } from '@/lib/types';
import Header from '@/app/components/Header';
import WorkoutNavHeader from '@/app/components/WorkoutNavHeader';
import StretchCard from '@/app/components/StretchCard';
import StretchSelector from '@/app/components/StretchSelector';
import LoadingScreen from '@/app/components/LoadingScreen';
import ErrorScreen from '@/app/components/ErrorScreen';
import { acknowledgeChangeWarning, hasChangeWarningAck, loadSessionWorkout, saveSessionWorkout } from '@/lib/session-workout';

type StretchOption = {
  id: number;
  name: string;
  duration: string;
  type: string;
  muscle_groups: string | null;
  video_url: string | null;
  tips: string | null;
  is_custom: number;
};

function PostStretchesContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [workout, setWorkout] = useState<WorkoutPlan | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showStretchSelector, setShowStretchSelector] = useState(false);
  const [stretchActionMode, setStretchActionMode] = useState<'add' | 'replace' | null>(null);
  const [showChangeWarning, setShowChangeWarning] = useState(false);
  const pendingChangeRef = useRef<(() => void) | null>(null);

  // Get routineId from URL params (for public/favorited routines)
  const routineIdParam = searchParams.get('routineId');
  const routineQuery = routineIdParam ? `?routineId=${routineIdParam}` : '';

  useEffect(() => {
    async function fetchWorkout() {
      try {
        let apiUrl = `/api/workout/${params.name}`;
        if (routineIdParam) {
          apiUrl += `?routineId=${routineIdParam}`;
        }
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Workout not found');
        }
        const data = await response.json();
        const baseWorkout = data.workout as WorkoutPlan;
        const sessionWorkout = loadSessionWorkout(baseWorkout.name, routineIdParam);
        const resolvedWorkout = sessionWorkout || baseWorkout;
        setWorkout(resolvedWorkout);

        // Check for index in URL (for navigation from other sections)
        const indexParam = searchParams.get('index');
        if (indexParam) {
          const idx = parseInt(indexParam, 10);
          const stretchCount = resolvedWorkout.postWorkoutStretches?.length || 0;
          if (!isNaN(idx) && idx >= 0 && idx < stretchCount) {
            setCurrentIndex(idx);
          }
        }
      } catch (error) {
        console.error('Error fetching workout:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchWorkout();
  }, [params.name, searchParams, routineIdParam]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!workout) {
    return <ErrorScreen message="Workout not found" />;
  }

  const stretches = workout.postWorkoutStretches || [];
  const workoutName = encodeURIComponent(workout.name);

  // If no stretches, show message and skip to summary
  if (stretches.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center p-4">
        <div className="text-white text-2xl mb-4">No post-workout stretches</div>
        <div className="w-full max-w-xs space-y-3">
          <button
            onClick={() => openStretchSelector('add')}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg text-base font-semibold transition-colors"
          >
            + Add Stretch
          </button>
          <button
            onClick={() => router.push(`/workout/${workoutName}/summary${routineQuery}`)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-base font-semibold transition-colors"
          >
            View Summary →
          </button>
        </div>

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

        {showStretchSelector && (
          <StretchSelector
            title="Add Stretch"
            filterType="post_workout"
            onCancel={() => {
              setShowStretchSelector(false);
              setStretchActionMode(null);
            }}
            onSelect={handleSelectStretch}
          />
        )}
      </div>
    );
  }

  const currentStretch = stretches[currentIndex];

  // Calculate total workout items for progress
  const preStretchCount = (workout.preWorkoutStretches || []).length;
  const postStretchCount = stretches.length;
  const totalItems =
    preStretchCount +
    workout.exercises.length +
    1 + // cardio (always count)
    postStretchCount;
  const currentProgress =
    preStretchCount +
    workout.exercises.length +
    1 + // cardio
    currentIndex +
    1;
  const progressPercentage = (currentProgress / totalItems) * 100;

  const handleNext = () => {
    if (currentIndex < stretches.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Move to summary
      router.push(`/workout/${workoutName}/summary${routineQuery}`);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      // At index 0, go back to cardio
      router.push(`/workout/${workoutName}/cardio${routineQuery}`);
    }
  };

  const handleSkipAll = () => {
    router.push(`/workout/${workoutName}/summary${routineQuery}`);
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

  const openStretchSelector = (mode: 'add' | 'replace') => {
    runWithChangeWarning(() => {
      setStretchActionMode(mode);
      setShowStretchSelector(true);
    });
  };

  const handleSelectStretch = (stretch: StretchOption) => {
    if (!workout || !stretchActionMode) return;
    const updatedStretch: Stretch = {
      name: stretch.name,
      duration: stretch.duration,
      timerSeconds: 0,
      videoUrl: stretch.video_url || '',
      tips: stretch.tips || ''
    };

    const updatedStretches = [...stretches];
    const insertIndex = Math.min(currentIndex + 1, updatedStretches.length);

    if (stretchActionMode === 'add') {
      updatedStretches.splice(insertIndex, 0, updatedStretch);
    } else {
      updatedStretches[currentIndex] = updatedStretch;
    }

    const updatedWorkout = { ...workout, postWorkoutStretches: updatedStretches };
    setWorkout(updatedWorkout);
    saveSessionWorkout(updatedWorkout, routineIdParam);
    setStretchActionMode(null);
    setShowStretchSelector(false);
  };

  return (
    <div className="min-h-screen bg-zinc-900 p-4">
      <div className="max-w-2xl mx-auto">
        <Header />
        {/* Navigation */}
        <WorkoutNavHeader
          exitUrl={`/workout/${workoutName}${routineQuery}`}
          previousUrl={null}
          onPrevious={handlePrevious}
          skipLabel="Skip All"
          onSkip={handleSkipAll}
        />

        {/* Title */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-white mb-2">POST-WORKOUT STRETCH</h1>
          <div className="text-zinc-400 text-lg">
            {currentIndex + 1} of {stretches.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="text-zinc-500 text-sm text-center mt-2">
            Overall Progress: {currentProgress} / {totalItems}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => openStretchSelector('add')}
            className="bg-emerald-600/80 hover:bg-emerald-500 text-white py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            + Add Stretch
          </button>
          <button
            onClick={() => openStretchSelector('replace')}
            className="bg-orange-600/80 hover:bg-orange-500 text-white py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            ↺ Replace Stretch
          </button>
        </div>

        {/* Stretch Card */}
        <StretchCard
          stretch={currentStretch}
          timerKey={currentIndex}
          variant="post"
        />

        {/* Navigation Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handlePrevious}
            className="bg-zinc-700 hover:bg-zinc-600 text-white py-4 rounded-lg text-lg font-semibold transition-colors"
          >
            ← Previous
          </button>
          <button
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg text-lg font-semibold transition-colors"
          >
            {currentIndex < stretches.length - 1 ? 'Next Stretch →' : 'View Summary →'}
          </button>
        </div>

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

        {showStretchSelector && (
          <StretchSelector
            title={stretchActionMode === 'replace' ? 'Replace Stretch' : 'Add Stretch'}
            filterType="post_workout"
            onCancel={() => {
              setShowStretchSelector(false);
              setStretchActionMode(null);
            }}
            onSelect={handleSelectStretch}
          />
        )}
      </div>
    </div>
  );
}

export default function PostStretchesPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <PostStretchesContent />
    </Suspense>
  );
}
