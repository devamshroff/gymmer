'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { WorkoutPlan } from '@/lib/types';
import { getWorkoutSession, clearWorkoutSession, WorkoutSessionData } from '@/lib/workout-session';
import Header from '@/app/components/Header';
import { Card } from '@/app/components/SharedUi';

export default function StatsPage() {
  const params = useParams();
  const [workout, setWorkout] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState<WorkoutSessionData | null>(null);
  const [totalVolume, setTotalVolume] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

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

  useEffect(() => {
    // Load session data from localStorage
    const session = getWorkoutSession();
    if (!session) {
      console.error('No session data found');
      return;
    }

    setSessionData(session);

    // Calculate total volume
    let volume = 0;
    for (const exercise of session.exercises) {
      if (exercise.warmup) {
        volume += exercise.warmup.weight * exercise.warmup.reps;
      }
      for (const set of exercise.sets) {
        volume += set.weight * set.reps;
      }
      if (exercise.b2bPartner) {
        if (exercise.b2bPartner.warmup) {
          volume += exercise.b2bPartner.warmup.weight * exercise.b2bPartner.warmup.reps;
        }
        for (const set of exercise.b2bPartner.sets) {
          volume += set.weight * set.reps;
        }
      }
    }
    setTotalVolume(Math.round(volume));

    // Calculate duration
    const startTime = new Date(session.startTime);
    const endTime = new Date();
    const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 60000);
    setTotalDuration(durationMinutes);
  }, []);

  const handleExportJSON = () => {
    if (!sessionData) return;

    const dataStr = JSON.stringify(sessionData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `workout-${sessionData.workoutName}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Clear localStorage after export
    clearWorkoutSession();
  };

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
        <Header />
        {/* Stats Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">💪</div>
          <h1 className="text-3xl font-bold text-white mb-2">Workout Stats</h1>
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

        {/* Summary Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card paddingClassName="p-6" borderClassName="border-blue-600">
            <div className="text-zinc-400 text-sm mb-2">Total Volume</div>
            <div className="text-white text-3xl font-bold">
              {totalVolume.toLocaleString()}
            </div>
            <div className="text-zinc-500 text-sm">lbs</div>
          </Card>
          <Card paddingClassName="p-6" borderClassName="border-green-600">
            <div className="text-zinc-400 text-sm mb-2">Duration</div>
            <div className="text-white text-3xl font-bold">
              {totalDuration}
            </div>
            <div className="text-zinc-500 text-sm">minutes</div>
          </Card>
        </div>

        {/* Exercises Summary */}
        {sessionData && (
          <Card paddingClassName="p-6" borderWidthClassName="border-0" className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">EXERCISE BREAKDOWN</h2>
            <div className="space-y-6">
              {sessionData.exercises.map((exercise, index) => {
                const exerciseVolume =
                  (exercise.warmup ? exercise.warmup.weight * exercise.warmup.reps : 0) +
                  exercise.sets.reduce((sum, set) => sum + set.weight * set.reps, 0) +
                  (exercise.b2bPartner ?
                    (exercise.b2bPartner.warmup ? exercise.b2bPartner.warmup.weight * exercise.b2bPartner.warmup.reps : 0) +
                    exercise.b2bPartner.sets.reduce((sum, set) => sum + set.weight * set.reps, 0)
                    : 0);

                return (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 pb-4 border-b border-zinc-700 last:border-b-0">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="text-white font-bold text-lg mb-1">
                          {exercise.type === 'single'
                            ? exercise.name
                            : `B2B: ${exercise.name} / ${exercise.b2bPartner?.name}`}
                        </div>
                        <div className="text-zinc-400 text-sm">
                          {exercise.sets.length} sets • {Math.round(exerciseVolume).toLocaleString()} lbs
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {exercise.warmup && (
                        <div className="bg-zinc-700 rounded p-2 text-sm">
                          <span className="text-zinc-400">Warmup:</span>{' '}
                          <span className="text-white font-semibold">{exercise.warmup.weight} lbs</span> × {exercise.warmup.reps} reps
                        </div>
                      )}
                      {exercise.sets.map((set, setIndex) => (
                        <div key={setIndex} className="bg-zinc-700 rounded p-2 text-sm">
                          <span className="text-zinc-400">Set {setIndex + 1}:</span>{' '}
                          <span className="text-white font-semibold">{set.weight} lbs</span> × {set.reps} reps
                          {exercise.b2bPartner && exercise.b2bPartner.sets[setIndex] && (
                            <div className="mt-1 text-purple-400">
                              + <span className="font-semibold">{exercise.b2bPartner.sets[setIndex].weight} lbs</span> × {exercise.b2bPartner.sets[setIndex].reps} reps
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            {sessionData.cardio && (
              <div className="mt-6 pt-6 border-t border-zinc-700">
                <div className="text-white font-bold text-lg mb-1">Cardio</div>
                <div className="text-zinc-400">
                  {sessionData.cardio.type} • {sessionData.cardio.time}
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Export JSON Button */}
        <button
          onClick={handleExportJSON}
          disabled={!sessionData}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white py-4 rounded-lg text-lg font-bold transition-colors mb-4"
        >
          📥 Export Workout JSON
        </button>

        {/* Back to Home */}
        <Link
          href="/"
          className="block w-full bg-zinc-700 hover:bg-zinc-600 text-white text-center py-4 rounded-lg text-lg font-semibold transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
