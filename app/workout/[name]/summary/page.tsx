'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { WorkoutPlan } from '@/lib/types';
import { getWorkoutSession, clearWorkoutSession, WorkoutSessionData } from '@/lib/workout-session';

export default function SummaryPage() {
  const params = useParams();
  const [workout, setWorkout] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState<WorkoutSessionData | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [totalVolume, setTotalVolume] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  const handleExport = () => {
    if (!sessionData) return;

    const exportData = {
      workoutName: sessionData.workoutName,
      date: new Date().toISOString(),
      exercises: sessionData.exercises.map((ex) => ({
        type: ex.type,
        name: ex.name,
        warmup: ex.warmup,
        sets: ex.sets,
        b2bPartner: ex.b2bPartner,
      })),
      cardio: sessionData.cardio || null,
      totalVolume,
      totalDurationMinutes: totalDuration,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sessionData.workoutName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
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

  useEffect(() => {
    async function loadAndSaveSession() {
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

      // Save to database
      setSaving(true);
      try {
        const response = await fetch('/api/save-workout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(session),
        });

        if (!response.ok) {
          throw new Error('Failed to save workout');
        }

        setSaved(true);
        // Clear localStorage after successful save
        clearWorkoutSession();
      } catch (error) {
        console.error('Error saving workout:', error);
      } finally {
        setSaving(false);
      }
    }

    loadAndSaveSession();
  }, []);

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
              {saving && <div className="text-yellow-400 text-sm mt-2">Saving to database...</div>}
              {saved && <div className="text-green-400 text-sm mt-2">✓ Saved to database</div>}
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
                <div className="text-zinc-400 text-sm">{sessionData.cardio.time}</div>
              </div>
            )}
          </div>
        )}

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
