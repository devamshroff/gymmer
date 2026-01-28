'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { WorkoutPlan } from '@/lib/types';
import { getWorkoutSession, WorkoutSessionData } from '@/lib/workout-session';
import Header from '@/app/components/Header';

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

  // Get routineId from URL params (for public/favorited routines)
  const routineIdParam = searchParams.get('routineId');

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

  const handleCompleteWorkout = async () => {
    if (!sessionData) return;

    setSaving(true);
    try {
      const response = await fetch('/api/save-workout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData),
      });

      if (!response.ok) {
        throw new Error('Failed to save workout');
      }

      setSaved(true);
      // Navigate to stats page
      router.push(`/workout/${encodeURIComponent(workout!.name)}/stats`);
    } catch (error) {
      console.error('Error saving workout:', error);
      alert('Failed to save workout. Please try again.');
    } finally {
      setSaving(false);
    }
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
                {totalVolume.toLocaleString()} lbs
              </div>
              <div className="text-zinc-500 text-sm mt-2">
                Duration: {totalDuration} minutes
              </div>
            </div>
          ) : (
            <div className="text-center text-zinc-400">Loading session data...</div>
          )}
        </div>

        {/* Exercises Summary */}
        {sessionData && (
          <div className="bg-zinc-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">EXERCISES COMPLETED</h2>
            <div className="space-y-4">
              {sessionData.exercises.map((exercise, index) => {
                const exerciseVolume =
                  (exercise.warmup ? exercise.warmup.weight * exercise.warmup.reps : 0) +
                  exercise.sets.reduce((sum, set) => sum + set.weight * set.reps, 0) +
                  (exercise.b2bPartner ?
                    (exercise.b2bPartner.warmup ? exercise.b2bPartner.warmup.weight * exercise.b2bPartner.warmup.reps : 0) +
                    exercise.b2bPartner.sets.reduce((sum, set) => sum + set.weight * set.reps, 0)
                    : 0);

                return (
                  <div key={index} className="border-l-4 border-green-500 pl-3">
                    <div className="text-white font-semibold mb-1">
                      {exercise.type === 'single'
                        ? exercise.name
                        : `B2B: ${exercise.name} / ${exercise.b2bPartner?.name}`}
                    </div>
                    <div className="text-zinc-400 text-sm mb-2">
                      {exercise.sets.length} sets • {Math.round(exerciseVolume).toLocaleString()} lbs volume
                    </div>
                    <div className="space-y-1 text-xs">
                      {exercise.warmup && (
                        <div className="text-zinc-500">
                          Warmup: {exercise.warmup.weight} lbs × {exercise.warmup.reps} reps
                        </div>
                      )}
                      {exercise.sets.map((set, setIndex) => (
                        <div key={setIndex} className="text-zinc-300">
                          Set {setIndex + 1}: {set.weight} lbs × {set.reps} reps
                          {exercise.b2bPartner && exercise.b2bPartner.sets[setIndex] && (
                            <span className="text-purple-400">
                              {' + '}{exercise.b2bPartner.sets[setIndex].weight} lbs × {exercise.b2bPartner.sets[setIndex].reps} reps
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
                <div className="text-white font-semibold mb-1">Cardio: {sessionData.cardio.type}</div>
                <div className="text-zinc-400 text-sm">
                  {sessionData.cardio.time} min
                  {sessionData.cardio.speed && ` • ${sessionData.cardio.speed} mph`}
                  {sessionData.cardio.incline && ` • ${sessionData.cardio.incline}% incline`}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Complete Workout Button */}
        <button
          onClick={handleCompleteWorkout}
          disabled={saving}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white py-4 rounded-lg text-xl font-bold transition-colors mb-4"
        >
          {saving ? 'Saving...' : '🎉 Complete Workout!'}
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
