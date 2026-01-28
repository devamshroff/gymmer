'use client';

import { useEffect, useState, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { WorkoutPlan, Stretch } from '@/lib/types';
import Header from '@/app/components/Header';
import WorkoutNavHeader from '@/app/components/WorkoutNavHeader';
import StretchCard from '@/app/components/StretchCard';
import LoadingScreen from '@/app/components/LoadingScreen';
import ErrorScreen from '@/app/components/ErrorScreen';

function PostStretchesContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [workout, setWorkout] = useState<WorkoutPlan | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

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
        setWorkout(data.workout);

        // Check for index in URL (for navigation from other sections)
        const indexParam = searchParams.get('index');
        if (indexParam) {
          const idx = parseInt(indexParam, 10);
          const stretchCount = data.workout.postWorkoutStretches?.length || 0;
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
        <button
          onClick={() => router.push(`/workout/${workoutName}/summary${routineQuery}`)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-bold transition-colors"
        >
          View Summary →
        </button>
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
