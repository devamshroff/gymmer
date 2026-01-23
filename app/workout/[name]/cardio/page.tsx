'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { WorkoutPlan } from '@/lib/types';

export default function CardioPage() {
  const params = useParams();
  const router = useRouter();
  const [workout, setWorkout] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDone, setIsDone] = useState(false);

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

  if (!workout || !workout.cardio) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-white text-2xl mb-4">No cardio found</div>
          <Link href="/" className="text-blue-400 hover:text-blue-300">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const cardio = workout.cardio;

  // Calculate total workout items for progress
  const totalItems =
    workout.preWorkoutStretches.length +
    workout.exercises.length +
    (workout.cardio ? 1 : 0) +
    workout.postWorkoutStretches.length;
  const currentProgress = workout.preWorkoutStretches.length + workout.exercises.length + 1;
  const progressPercentage = (currentProgress / totalItems) * 100;

  const handleComplete = () => {
    setIsDone(true);
    setTimeout(() => {
      router.push(`/workout/${encodeURIComponent(workout.name)}/post-stretches`);
    }, 1000);
  };

  const handleSkip = () => {
    router.push(`/workout/${encodeURIComponent(workout.name)}/post-stretches`);
  };

  return (
    <div className="min-h-screen bg-zinc-900 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Link href={`/workout/${encodeURIComponent(workout.name)}`} className="text-blue-400 hover:text-blue-300">
            ← Back
          </Link>
          <button onClick={handleSkip} className="text-zinc-400 hover:text-zinc-300">
            Skip →
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="text-zinc-500 text-sm text-center mt-2">
            Overall Progress: {currentProgress} / {totalItems}
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">CARDIO</h1>
          <div className="text-zinc-400 text-lg">Optional Finisher</div>
        </div>

        {/* Cardio Card */}
        <div className="bg-zinc-800 rounded-lg p-8 border-2 border-red-600 mb-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">❤️</div>
            <h2 className="text-3xl font-bold text-white mb-2">{cardio.type}</h2>
            <div className="text-2xl text-blue-400 font-semibold mb-2">{cardio.duration}</div>
            <div className="text-xl text-zinc-300">{cardio.intensity}</div>
          </div>

          <div className="bg-zinc-900 rounded-lg p-4">
            <div className="text-zinc-400 text-sm mb-2">Tips:</div>
            <p className="text-zinc-200 text-lg leading-relaxed">{cardio.tips}</p>
          </div>
        </div>

        {/* Action Buttons */}
        {!isDone ? (
          <button
            onClick={handleComplete}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg text-xl font-bold transition-colors"
          >
            ✓ Complete Cardio
          </button>
        ) : (
          <div className="text-center">
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <div className="text-white text-2xl font-semibold">Great work!</div>
          </div>
        )}
      </div>
    </div>
  );
}
