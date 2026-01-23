'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { WorkoutPlan } from '@/lib/types';

export default function SummaryPage() {
  const params = useParams();
  const [workout, setWorkout] = useState<WorkoutPlan | null>(null);
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

        {/* Summary Stats (TODO: calculate from actual logged data) */}
        <div className="bg-zinc-800 rounded-lg p-6 mb-8 border-2 border-green-600">
          <div className="text-center">
            <div className="text-zinc-400 text-sm mb-2">Total Volume</div>
            <div className="text-white text-4xl font-bold mb-1">12,450 lbs</div>
            <div className="text-green-400 text-lg">+850 lbs vs last time ⬆</div>
          </div>
        </div>

        {/* Exercises Summary */}
        <div className="bg-zinc-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">EXERCISES COMPLETED</h2>
          <div className="space-y-3">
            {workout.exercises.map((exercise, index) => (
              <div key={index} className="border-l-4 border-green-500 pl-3">
                <div className="text-white font-semibold">
                  {exercise.type === 'single' ? exercise.name : `B2B: ${exercise.exercises[0].name} / ${exercise.exercises[1].name}`}
                </div>
                <div className="text-zinc-400 text-sm">
                  {exercise.type === 'single' ? `${exercise.sets} sets` : `${exercise.exercises[0].sets} sets`} • Volume data coming soon
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Back to Home */}
        <Link
          href="/"
          className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-4 rounded-lg text-xl font-semibold transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
