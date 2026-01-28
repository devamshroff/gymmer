'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface PublicRoutine {
  id: number;
  name: string;
  description: string | null;
  user_id: string;
  creator_username: string | null;
  creator_name: string | null;
  created_at: string;
}

export default function BrowseRoutinesPage() {
  const router = useRouter();
  const [routines, setRoutines] = useState<PublicRoutine[]>([]);
  const [favoritedIds, setFavoritedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState<number | null>(null);

  useEffect(() => {
    fetchPublicRoutines();
  }, []);

  async function fetchPublicRoutines() {
    try {
      const response = await fetch('/api/routines/public');
      if (response.ok) {
        const data = await response.json();
        setRoutines(data.routines || []);

        // Check which ones are already favorited
        const favResponse = await fetch('/api/routines/favorites');
        if (favResponse.ok) {
          const favData = await favResponse.json();
          const favIds = new Set((favData.routines || []).map((r: any) => r.id));
          setFavoritedIds(favIds as Set<number>);
        }
      }
    } catch (error) {
      console.error('Error fetching public routines:', error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleFavorite(routineId: number) {
    setActionInProgress(routineId);
    const isFavorited = favoritedIds.has(routineId);

    try {
      const response = await fetch(`/api/routines/${routineId}/favorite`, {
        method: isFavorited ? 'DELETE' : 'POST',
      });

      if (response.ok) {
        const newFavorites = new Set(favoritedIds);
        if (isFavorited) {
          newFavorites.delete(routineId);
        } else {
          newFavorites.add(routineId);
        }
        setFavoritedIds(newFavorites);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setActionInProgress(null);
    }
  }

  async function cloneRoutine(routineId: number, routineName: string) {
    setActionInProgress(routineId);

    try {
      const response = await fetch(`/api/routines/${routineId}/clone`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: `${routineName} (Copy)` }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/routines/${data.routineId}`);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to clone routine');
      }
    } catch (error) {
      console.error('Error cloning routine:', error);
      alert('Failed to clone routine');
    } finally {
      setActionInProgress(null);
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
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-3xl font-bold text-white">Browse Public Routines</h1>
        </div>

        <p className="text-zinc-400 mb-6">
          Discover routines shared by other users. Favorite them to use directly, or clone to customize.
        </p>

        {routines.length === 0 ? (
          <div className="text-center text-zinc-500 text-lg py-12">
            No public routines available yet.
          </div>
        ) : (
          <div className="space-y-4">
            {routines.map((routine) => {
              const isFavorited = favoritedIds.has(routine.id);
              const isProcessing = actionInProgress === routine.id;

              return (
                <div
                  key={routine.id}
                  className="bg-zinc-800 rounded-lg p-6 border-2 border-zinc-700"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-1">
                        {routine.name}
                      </h3>
                      <p className="text-sm text-zinc-400">
                        by{' '}
                        <span className="text-purple-400">
                          @{routine.creator_username || routine.creator_name || 'Anonymous'}
                        </span>
                      </p>
                    </div>
                  </div>

                  {routine.description && (
                    <p className="text-zinc-400 text-sm mb-4">{routine.description}</p>
                  )}

                  <div className="flex gap-3">
                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(routine.id)}
                      disabled={isProcessing}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                        isFavorited
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-zinc-700 hover:bg-zinc-600 text-zinc-300'
                      } disabled:opacity-50`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill={isFavorited ? 'currentColor' : 'none'}
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={isFavorited ? 0 : 2}
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                      {isFavorited ? 'Favorited' : 'Favorite'}
                    </button>

                    {/* Use Routine Button (links to workout page) */}
                    <Link
                      href={`/workout/${encodeURIComponent(routine.name)}?routineId=${routine.id}`}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-green-600 hover:bg-green-700 text-white transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Start
                    </Link>

                    {/* Clone Button */}
                    <button
                      onClick={() => cloneRoutine(routine.id, routine.name)}
                      disabled={isProcessing}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Clone
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
