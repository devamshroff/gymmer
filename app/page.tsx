'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { WorkoutPlan } from '@/lib/types';

export default function Home() {
  const [workouts, setWorkouts] = useState<WorkoutPlan[]>([]);
  const [lastWorkoutDates, setLastWorkoutDates] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWorkouts() {
      try {
        const response = await fetch('/api/workouts');
        const data = await response.json();
        setWorkouts(data.workouts);

        // Fetch last workout date for each workout
        const dates: Record<string, string | null> = {};
        for (const workout of data.workouts) {
          try {
            const historyResponse = await fetch(`/api/workout-history?name=${encodeURIComponent(workout.name)}`);
            const historyData = await historyResponse.json();
            dates[workout.name] = historyData.lastDate;
          } catch (error) {
            console.error(`Error fetching history for ${workout.name}:`, error);
            dates[workout.name] = null;
          }
        }
        setLastWorkoutDates(dates);
      } catch (error) {
        console.error('Error fetching workouts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchWorkouts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 p-4">
      <main className="max-w-2xl mx-auto py-8">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Gym Tracker
        </h1>

        <div className="space-y-4">
          {workouts.length === 0 ? (
            <div className="text-center text-zinc-400 text-lg">
              No workout plans found. Add a workout plan JSON file to the public/workout-plans directory.
            </div>
          ) : (
            workouts.map((workout, index) => {
              const lastDate = lastWorkoutDates[workout.name];
              const formattedDate = lastDate
                ? new Date(lastDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Never';

              return (
                <Link
                  key={index}
                  href={`/workout/${encodeURIComponent(workout.name)}`}
                  className="block bg-zinc-800 hover:bg-zinc-700 transition-colors rounded-lg p-6 border-2 border-zinc-700"
                >
                  <h2 className="text-2xl font-semibold text-white mb-2">
                    {workout.name}
                  </h2>
                  <div className="flex justify-between items-center">
                    <div className="text-zinc-400">
                      {workout.exercises.length} exercises
                    </div>
                    <div className="text-sm text-zinc-500">
                      Last: <span className={lastDate ? "text-blue-400" : "text-zinc-600"}>{formattedDate}</span>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>

        <Link
          href="/upload"
          className="mt-8 block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-4 rounded-lg text-lg font-semibold transition-colors"
        >
          Upload New Workout Plan
        </Link>
      </main>
    </div>
  );
}
