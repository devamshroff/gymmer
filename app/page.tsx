'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Routine {
  id: number;
  name: string;
  description: string | null;
  is_custom: number;
  source_file: string | null;
  created_at: string;
  updated_at: string;
}

export default function Home() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [lastWorkoutDates, setLastWorkoutDates] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoutines();
  }, []);

  async function fetchRoutines() {
    try {
      // Fetch all routines from database
      const routinesResponse = await fetch('/api/routines');
      const routinesData = await routinesResponse.json();
      setRoutines(routinesData.routines);

      // Fetch last workout date for each routine
      const dates: Record<string, string | null> = {};
      for (const routine of routinesData.routines) {
        try {
          const historyResponse = await fetch(`/api/workout-history?name=${encodeURIComponent(routine.name)}`);
          const historyData = await historyResponse.json();
          dates[routine.name] = historyData.lastDate;
        } catch (error) {
          console.error(`Error fetching history for ${routine.name}:`, error);
          dates[routine.name] = null;
        }
      }

      setLastWorkoutDates(dates);
    } catch (error) {
      console.error('Error fetching routines:', error);
    } finally {
      setLoading(false);
    }
  }

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

        {/* Create New Routine Button */}
        <Link
          href="/routines/builder"
          className="mb-6 block w-full bg-green-600 hover:bg-green-700 text-white text-center py-4 rounded-lg text-lg font-bold transition-colors"
        >
          + Create New Routine
        </Link>

        <div className="space-y-4">
          {routines.length === 0 ? (
            <div className="text-center text-zinc-400 text-lg">
              No routines found. Create a custom routine or import your workout plans.
            </div>
          ) : (
            routines.map((routine) => {
              const lastDate = lastWorkoutDates[routine.name];
              const formattedDate = lastDate
                ? new Date(lastDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Never';

              return (
                <Link
                  key={`routine-${routine.id}`}
                  href={`/workout/${encodeURIComponent(routine.name)}`}
                  className="block bg-zinc-800 hover:bg-zinc-700 transition-colors rounded-lg p-6 border-2 border-zinc-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-semibold text-white">
                      {routine.name}
                    </h2>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-zinc-400">
                      {routine.description || '\u00A0'}
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
          href="/routines/import"
          className="mt-8 block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-4 rounded-lg text-lg font-semibold transition-colors"
        >
          Import Routine from JSON
        </Link>
      </main>
    </div>
  );
}
