'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { WorkoutPlan, Stretch } from '@/lib/types';
import Timer from '@/app/components/Timer';

export default function PostStretchesPage() {
  const params = useParams();
  const router = useRouter();
  const [workout, setWorkout] = useState<WorkoutPlan | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWorkout() {
      try {
        const response = await fetch(`/api/workout/${params.name}`);
        if (!response.ok) {
          throw new Error('Workout not found');
        }
        const data = await response.json();
        setWorkout(data.workout);
      } catch (error) {
        console.error('Error fetching workout:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchWorkout();
  }, [params.name]);

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
          <Link href="/" className="text-blue-400 hover:text-blue-300">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const stretches = workout.postWorkoutStretches || [];

  // If no stretches, show message and skip to summary
  if (stretches.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center p-4">
        <div className="text-white text-2xl mb-4">No post-workout stretches</div>
        <button
          onClick={() => router.push(`/workout/${encodeURIComponent(workout.name)}/summary`)}
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
    (workout.cardio ? 1 : 0) +
    postStretchCount;
  const currentProgress =
    preStretchCount +
    workout.exercises.length +
    (workout.cardio ? 1 : 0) +
    currentIndex +
    1;
  const progressPercentage = (currentProgress / totalItems) * 100;

  const handleNext = () => {
    console.log('handleNext called', {
      currentIndex,
      stretchesLength: stretches.length,
      isLast: currentIndex >= stretches.length - 1,
      workoutName: workout.name,
      encodedName: encodeURIComponent(workout.name)
    });

    if (currentIndex < stretches.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Move to summary
      console.log('Navigating to summary...');
      router.push(`/workout/${encodeURIComponent(workout.name)}/summary`);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSkipAll = () => {
    router.push(`/workout/${encodeURIComponent(workout.name)}/summary`);
  };

  return (
    <div className="min-h-screen bg-zinc-900 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Link href={`/workout/${encodeURIComponent(workout.name)}`} className="text-blue-400 hover:text-blue-300">
            ← Back
          </Link>
          <button onClick={handleSkipAll} className="text-zinc-400 hover:text-zinc-300">
            Skip All →
          </button>
        </div>

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
        <div className="bg-zinc-800 rounded-lg p-8 border-2 border-blue-600 mb-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🧘</div>
            <h2 className="text-3xl font-bold text-white mb-4">{currentStretch.name}</h2>
            <div className="text-xl text-blue-400 font-semibold mb-4">{currentStretch.duration}</div>
          </div>

          {/* Timer */}
          <Timer key={currentIndex} duration={currentStretch.duration} />

          <div className="bg-zinc-900 rounded-lg p-4 mb-6">
            <div className="text-zinc-400 text-sm mb-2">Tips:</div>
            <p className="text-zinc-200 text-lg leading-relaxed">{currentStretch.tips}</p>
          </div>

          <a
            href={currentStretch.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-red-600 hover:bg-red-700 text-white text-center py-3 rounded-lg text-lg font-semibold transition-colors"
          >
            📺 Watch Video
          </a>
        </div>

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
            className="bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg text-lg font-semibold transition-colors"
          >
            {currentIndex < stretches.length - 1 ? 'Next Stretch →' : 'View Summary →'}
          </button>
        </div>
      </div>
    </div>
  );
}
