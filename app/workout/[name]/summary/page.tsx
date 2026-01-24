'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { WorkoutPlan } from '@/lib/types';

export default function SummaryPage() {
  const params = useParams();
  const [workout, setWorkout] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState(true);

  const handleExport = () => {
    if (!workout) return;

    const workoutSession = {
      workoutName: workout.name,
      date: new Date().toISOString(),
      exercises: workout.exercises.map((ex) => {
        if (ex.type === 'single') {
          return {
            type: 'single',
            name: ex.name,
            sets: ex.sets,
            targetWeight: ex.targetWeight,
            targetReps: ex.targetReps,
            // TODO: Add actual logged sets data when we have persistence
          };
        } else {
          return {
            type: 'b2b',
            exercise1: ex.exercises[0].name,
            exercise2: ex.exercises[1].name,
            sets: ex.exercises[0].sets,
            // TODO: Add actual logged sets data when we have persistence
          };
        }
      }),
      cardio: workout.cardio ? {
        type: workout.cardio.type,
        targetDuration: workout.cardio.duration,
        // TODO: Add actual duration when we have persistence
      } : null,
    };

    const blob = new Blob([JSON.stringify(workoutSession, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workout.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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

        {/* Export Button */}
        <button
          onClick={handleExport}
          className="w-full bg-zinc-700 hover:bg-zinc-600 text-white py-4 rounded-lg text-lg font-semibold transition-colors mb-4"
        >
          📥 Export Workout JSON
        </button>

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
