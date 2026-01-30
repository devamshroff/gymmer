'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { WorkoutPlan } from '@/lib/types';
import { getWorkoutSession, WorkoutSessionData } from '@/lib/workout-session';
import { EXERCISE_TYPES } from '@/lib/constants';

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
  const [report, setReport] = useState<string | null>(null);
  const [reportLoading, setReportLoading] = useState(false);

  // Prevent double-save in React Strict Mode / re-renders
  const hasSavedRef = useRef(false);
  const hasReportedRef = useRef(false);

  // Get routineId from URL params (for public/favorited routines)
  const routineIdParam = searchParams.get('routineId');

  // ---------------------------
  // Fetch workout
  // ---------------------------
  useEffect(() => {
    async function fetchWorkout() {
      try {
        let apiUrl = `/api/workout/${params.name}`;
        if (routineIdParam) {
          apiUrl += `?routineId=${routineIdParam}`;
        }

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Workout not found');

        const data = await response.json();
        setWorkout(data.workout);
      } catch (error) {
        console.error('Error fetching workout:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchWorkout();
  }, [params.name, routineIdParam]);

  // ---------------------------
  // Load session + compute stats
  // ---------------------------
  useEffect(() => {
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

  // ---------------------------
  // AUTO-SAVE WORKOUT (with duplicate protection)
  // ---------------------------
  useEffect(() => {
    if (!sessionData) return;
    if (hasSavedRef.current) return; // React Strict Mode protection

    const sessionKey = `workout-saved-${sessionData.startTime}`;

    // Prevent saving same session twice (refresh / navigation)
    if (localStorage.getItem(sessionKey)) {
      console.log('⚠️ Workout already saved, skipping');
      hasSavedRef.current = true;
      setSaved(true);
      return;
    }

    const saveWorkout = async () => {
      setSaving(true);
      hasSavedRef.current = true;

      try {
        const response = await fetch('/api/save-workout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sessionData),
        });

        if (!response.ok) {
          throw new Error('Failed to save workout');
        }

        // Mark as saved in localStorage
        localStorage.setItem(sessionKey, 'true');
        setSaved(true);
        console.log('✅ Workout auto-saved');
      } catch (error) {
        console.error('❌ Error saving workout:', error);
        hasSavedRef.current = false; // allow retry if needed
      } finally {
        setSaving(false);
      }
    };

    saveWorkout();
  }, [sessionData]);

  // ---------------------------
  // Generate workout report
  // ---------------------------
  useEffect(() => {
    if (!sessionData) return;
    if (hasReportedRef.current) return;

    const routineId = routineIdParam ? Number(routineIdParam) : null;
    if (routineIdParam && Number.isNaN(routineId)) {
      return;
    }

    const generateReport = async () => {
      setReportLoading(true);
      hasReportedRef.current = true;
      try {
        const response = await fetch('/api/workout-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionData,
            routineId: routineId || null
          }),
        });
        if (!response.ok) {
          throw new Error('Failed to generate report');
        }
        const data = await response.json();
        setReport(data.report || null);
      } catch (error) {
        console.error('Error generating report:', error);
        hasReportedRef.current = false;
      } finally {
        setReportLoading(false);
      }
    };

    generateReport();
  }, [sessionData, routineIdParam]);

  // ---------------------------
  // Complete workout = just go to routines
  // ---------------------------
  const handleCompleteWorkout = () => {
    router.push('/routines');
  };

  // ---------------------------
  // UI STATES
  // ---------------------------
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
          <Link href="/routines" className="text-blue-400 hover:text-blue-300">
            Back to routines
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

              {/* Save status indicator */}
              <div className="text-xs mt-2">
                {saving && <span className="text-yellow-400">Saving workout...</span>}
                {saved && <span className="text-green-400">✓ Workout saved</span>}
              </div>
            </div>
          ) : (
            <div className="text-center text-zinc-400">Loading session data...</div>
          )}
        </div>

        {(reportLoading || report) && (
          <div className="bg-zinc-800 rounded-lg p-6 mb-8 border border-zinc-700">
            <div className="text-zinc-300 text-sm font-semibold mb-3">Workout Report</div>
            {reportLoading && (
              <div className="text-zinc-400 text-sm">Generating your report...</div>
            )}
            {report && (
              <div className="text-zinc-200 text-sm whitespace-pre-line">{report}</div>
            )}
          </div>
        )}

        {/* Exercises Summary */}
        {sessionData && (
          <div className="bg-zinc-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">EXERCISES COMPLETED</h2>
            <div className="space-y-4">
              {sessionData.exercises.map((exercise, index) => {
                const exerciseVolume =
                  (exercise.warmup ? exercise.warmup.weight * exercise.warmup.reps : 0) +
                  exercise.sets.reduce((sum, set) => sum + set.weight * set.reps, 0) +
                  (exercise.b2bPartner
                    ? (exercise.b2bPartner.warmup
                        ? exercise.b2bPartner.warmup.weight *
                          exercise.b2bPartner.warmup.reps
                        : 0) +
                      exercise.b2bPartner.sets.reduce(
                        (sum, set) => sum + set.weight * set.reps,
                        0
                      )
                    : 0);

                return (
                  <div key={index} className="border-l-4 border-green-500 pl-3">
                    <div className="text-white font-semibold mb-1">
                      {exercise.type === EXERCISE_TYPES.single
                        ? exercise.name
                        : `B2B: ${exercise.name} / ${exercise.b2bPartner?.name}`}
                    </div>
                    <div className="text-zinc-400 text-sm mb-2">
                      {exercise.sets.length} sets •{' '}
                      {Math.round(exerciseVolume).toLocaleString()} lbs volume
                    </div>
                    <div className="space-y-1 text-xs">
                      {exercise.warmup && (
                        <div className="text-zinc-500">
                          Warmup: {exercise.warmup.weight} lbs ×{' '}
                          {exercise.warmup.reps} reps
                        </div>
                      )}
                      {exercise.sets.map((set, setIndex) => (
                        <div key={setIndex} className="text-zinc-300">
                          Set {setIndex + 1}: {set.weight} lbs × {set.reps} reps
                          {exercise.b2bPartner &&
                            exercise.b2bPartner.sets[setIndex] && (
                              <span className="text-purple-400">
                                {' + '}
                                {exercise.b2bPartner.sets[setIndex].weight} lbs ×{' '}
                                {exercise.b2bPartner.sets[setIndex].reps} reps
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
                <div className="text-white font-semibold mb-1">
                  Cardio: {sessionData.cardio.type}
                </div>
                <div className="text-zinc-400 text-sm">
                  {sessionData.cardio.time} min
                  {sessionData.cardio.speed && ` • ${sessionData.cardio.speed} mph`}
                  {sessionData.cardio.incline &&
                    ` • ${sessionData.cardio.incline}% incline`}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Finish Button */}
        <button
          onClick={handleCompleteWorkout}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg text-xl font-bold transition-colors mb-4"
        >
          ✅ Finish & Go Home
        </button>

      </div>
    </div>
  );
}
