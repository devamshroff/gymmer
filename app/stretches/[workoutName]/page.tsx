'use client';

import { useEffect, useState, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { WorkoutPlan, Stretch } from '@/lib/types';
import { initWorkoutSession } from '@/lib/workout-session';
import Header from '@/app/components/Header';
import WorkoutNavHeader from '@/app/components/WorkoutNavHeader';
import StretchCard from '@/app/components/StretchCard';
import LoadingScreen from '@/app/components/LoadingScreen';
import ErrorScreen from '@/app/components/ErrorScreen';

function StretchesContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [workout, setWorkout] = useState<WorkoutPlan | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWorkout() {
      try {
        const response = await fetch(`/api/workout/${params.workoutName}`);
        if (!response.ok) {
          throw new Error('Workout not found');
        }
        const data = await response.json();
        setWorkout(data.workout);
        // Initialize workout session when workout is loaded
        initWorkoutSession(data.workout.name);

        // Check for index in URL (for navigation from other sections)
        const indexParam = searchParams.get('index');
        if (indexParam) {
          const idx = parseInt(indexParam, 10);
          const stretchCount = data.workout.preWorkoutStretches?.length || 0;
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
  }, [params.workoutName, searchParams]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!workout) {
    return <ErrorScreen message="Workout not found" />;
  }

  const stretches = workout.preWorkoutStretches || [];
  const workoutName = encodeURIComponent(workout.name);

  // If no stretches, show message and skip to exercises
  if (stretches.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center p-4">
        <div className="text-white text-2xl mb-4">No pre-workout stretches</div>
        <button
          onClick={() => router.push(`/workout/${workoutName}/active`)}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-bold transition-colors"
        >
          Start Exercises →
        </button>
      </div>
    );
  }

  const currentStretch = stretches[currentIndex];

  // Calculate total workout items for progress
  const postStretchCount = (workout.postWorkoutStretches || []).length;
  const totalItems =
    stretches.length +
    workout.exercises.length +
    1 + // cardio (always count it for progress)
    postStretchCount;
  const currentProgress = currentIndex + 1;
  const progressPercentage = (currentProgress / totalItems) * 100;

  const handleNext = () => {
    if (currentIndex < stretches.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Move to exercises
      router.push(`/workout/${workoutName}/active`);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
    // At index 0, previous is disabled (no previous section)
  };

  const handleSkipAll = () => {
    router.push(`/workout/${workoutName}/active`);
  };

  return (
    <div className="min-h-screen bg-zinc-900 p-4">
      <div className="max-w-2xl mx-auto">
        <Header />
        {/* Navigation */}
        <WorkoutNavHeader
          exitUrl={`/workout/${workoutName}`}
          previousUrl={null} // Handle internally
          onPrevious={currentIndex > 0 ? handlePrevious : undefined}
          skipLabel="Skip All"
          onSkip={handleSkipAll}
        />

        {/* Title */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-white mb-2">PRE-WORKOUT STRETCH</h1>
          <div className="text-zinc-400 text-lg">
            {currentIndex + 1} of {stretches.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="text-zinc-500 text-sm text-center mt-2">
            Overall Progress: {currentProgress} / {totalItems}
          </div>
        </div>

        {/* Stretch Card */}
        <StretchCard
          stretch={currentStretch}
          timerKey={currentIndex}
          variant="pre"
        />

        {/* Navigation Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`py-4 rounded-lg text-lg font-semibold transition-colors ${
              currentIndex === 0
                ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                : 'bg-zinc-700 hover:bg-zinc-600 text-white'
            }`}
          >
            ← Previous
          </button>
          <button
            onClick={handleNext}
            className="bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg text-lg font-semibold transition-colors"
          >
            {currentIndex < stretches.length - 1 ? 'Next Stretch →' : 'Start Exercises →'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StretchesPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <StretchesContent />
    </Suspense>
  );
}
