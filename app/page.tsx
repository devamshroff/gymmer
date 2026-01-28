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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');

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

  function startEditing(routine: Routine, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setEditingId(routine.id);
    setEditingName(routine.name);
  }

  function cancelEditing(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setEditingId(null);
    setEditingName('');
  }

  async function saveRoutineName(routineId: number, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!editingName.trim()) return;

    try {
      const response = await fetch(`/api/routines/${routineId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editingName.trim() }),
      });

      if (response.ok) {
        setRoutines(routines.map(r =>
          r.id === routineId ? { ...r, name: editingName.trim() } : r
        ));
        setEditingId(null);
        setEditingName('');
      }
    } catch (error) {
      console.error('Error updating routine name:', error);
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
          <span className="block text-gray-200">welcome to</span>
          <span className="text-emerald-700 font-bold">GYMMER</span>
        </h1>

        <h3>
          <span className="block text-gray-200 text-center">Routines are currently shared across all users.</span>
          <span className="block text-gray-200 text-center">Use [NAME] [Routine Name] to help differentiate.</span>
          <span className="block text-gray-200 text-center">Accounts coming soon.</span>
        </h3>

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
              const isEditing = editingId === routine.id;

              return (
                <div
                  key={`routine-${routine.id}`}
                  className="bg-zinc-800 hover:bg-zinc-700 transition-colors rounded-lg p-6 border-2 border-zinc-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    {isEditing ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveRoutineName(routine.id, e as any);
                            if (e.key === 'Escape') { setEditingId(null); setEditingName(''); }
                          }}
                          className="flex-1 bg-zinc-700 text-white text-xl font-semibold px-3 py-1 rounded border border-zinc-500 focus:outline-none focus:border-green-500"
                          autoFocus
                        />
                        <button
                          onClick={(e) => saveRoutineName(routine.id, e)}
                          className="text-green-500 hover:text-green-400 p-1"
                          title="Save"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="text-zinc-400 hover:text-zinc-300 p-1"
                          title="Cancel"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <>
                        <Link
                          href={`/workout/${encodeURIComponent(routine.name)}`}
                          className="text-2xl font-semibold text-white hover:text-green-400 transition-colors"
                        >
                          {routine.name}
                        </Link>
                        <button
                          onClick={(e) => startEditing(routine, e)}
                          className="text-zinc-500 hover:text-zinc-300 p-1 ml-2"
                          title="Edit name"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                  <Link
                    href={`/workout/${encodeURIComponent(routine.name)}`}
                    className="block"
                  >
                    <div className="flex justify-between items-center">
                      <div className="text-zinc-400">
                        {routine.description || '\u00A0'}
                      </div>
                      <div className="text-sm text-zinc-500">
                        Last: <span className={lastDate ? "text-blue-400" : "text-zinc-600"}>{formattedDate}</span>
                      </div>
                    </div>
                  </Link>
                </div>
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
