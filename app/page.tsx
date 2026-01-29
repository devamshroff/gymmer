'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import UsernameSetup from './components/UsernameSetup';

interface Routine {
  id: number;
  name: string;
  description: string | null;
  is_public: number;
  user_id: string;
  creator_username?: string;
  creator_name?: string;
  is_favorited?: number;
  created_at: string;
  updated_at: string;
}

interface UserInfo {
  id: string;
  username: string | null;
  hasUsername: boolean;
}

function normalizeDateString(value: string): string {
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(value)) {
    return `${value.replace(' ', 'T')}Z`;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return `${value}T00:00:00Z`;
  }
  return value;
}

function formatLocalDate(value?: string | null): string {
  if (!value) return 'Never';
  const date = new Date(normalizeDateString(value));
  if (Number.isNaN(date.getTime())) return 'Unknown';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function Home() {
  const router = useRouter();
  const [myRoutines, setMyRoutines] = useState<Routine[]>([]);
  const [favoritedRoutines, setFavoritedRoutines] = useState<Routine[]>([]);
  const [publicRoutinesPreview, setPublicRoutinesPreview] = useState<Routine[]>([]);
  const [lastWorkoutDates, setLastWorkoutDates] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [showUsernameSetup, setShowUsernameSetup] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  async function fetchUserInfo() {
    try {
      const response = await fetch('/api/user');
      if (response.ok) {
        const data = await response.json();
        setUserInfo(data);
        if (!data.hasUsername) {
          setShowUsernameSetup(true);
        } else {
          fetchRoutines();
        }
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      fetchRoutines();
    }
  }

  async function fetchRoutines() {
    try {
      // Fetch user's own routines
      const routinesResponse = await fetch('/api/routines');
      const routinesData = await routinesResponse.json();
      setMyRoutines(routinesData.routines || []);

      // Fetch favorited routines
      const favoritesResponse = await fetch('/api/routines/favorites');
      const favoritesData = await favoritesResponse.json();
      setFavoritedRoutines(favoritesData.routines || []);

      // Fetch public routines preview (first 3)
      const publicResponse = await fetch('/api/routines/public');
      const publicData = await publicResponse.json();
      setPublicRoutinesPreview((publicData.routines || []).slice(0, 3));

      // Combine all routines to fetch last workout dates
      const allRoutines = [...(routinesData.routines || []), ...(favoritesData.routines || [])];

      // Fetch last workout date for each routine
      const dates: Record<string, string | null> = {};
      for (const routine of allRoutines) {
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

  function handleUsernameComplete(username: string) {
    setUserInfo(prev => prev ? { ...prev, username, hasUsername: true } : null);
    setShowUsernameSetup(false);
    fetchRoutines();
  }

  async function removeFavorite(routineId: number) {
    try {
      const response = await fetch(`/api/routines/${routineId}/favorite`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setFavoritedRoutines(favoritedRoutines.filter(r => r.id !== routineId));
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  }

  if (showUsernameSetup) {
    return <UsernameSetup onComplete={handleUsernameComplete} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  const renderRoutineCard = (routine: Routine, isOwned: boolean) => {
    const lastDate = lastWorkoutDates[routine.name];
    const formattedDate = formatLocalDate(lastDate);
    const encodedName = encodeURIComponent(routine.name);
    const previewHref = `/workout/${encodedName}?routineId=${routine.id}&preview=1`;
    const startHref = `/stretches/${encodedName}?routineId=${routine.id}`;

    return (
      <div
        key={`routine-${routine.id}`}
        className="bg-zinc-800 hover:bg-zinc-700 transition-colors rounded-lg p-6 border-2 border-zinc-700"
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="text-2xl font-semibold text-white">{routine.name}</h3>
            <div className="text-zinc-400 text-sm">
              {!isOwned && routine.creator_username && (
                <span>by @{routine.creator_username}</span>
              )}
              {!isOwned && !routine.creator_username && routine.creator_name && (
                <span>by {routine.creator_name}</span>
              )}
              {isOwned && routine.description && routine.description}
              {isOwned && !routine.description && '\u00A0'}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-zinc-500">
              Last:{' '}
              <span className={lastDate ? "text-blue-400" : "text-zinc-600"}>
                {formattedDate}
              </span>
            </div>
            {!isOwned && (
              <button
                onClick={() => removeFavorite(routine.id)}
                className="text-red-500 hover:text-red-400 p-1"
                title="Remove from favorites"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={previewHref}
            className="px-4 py-2 rounded-lg font-medium bg-zinc-700 hover:bg-zinc-600 text-zinc-200 transition-colors"
          >
            Preview
          </Link>
          <Link
            href={startHref}
            className="px-4 py-2 rounded-lg font-medium bg-green-600 hover:bg-green-700 text-white transition-colors"
          >
            Start
          </Link>
          {isOwned && (
            <Link
              href={`/routines/${routine.id}/edit`}
              className="px-4 py-2 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              Edit
            </Link>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-900 p-4">
      <main className="max-w-2xl mx-auto py-8">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          <span className="block text-gray-200">welcome to</span>
          <span className="text-emerald-700 font-bold">GYMMER</span>
        </h1>

        {userInfo?.username && (
          <p className="text-center text-zinc-400 mb-6">
            Logged in as <span className="text-green-400">@{userInfo.username}</span>
          </p>
        )}

        {/* Create New Routine Button */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="mb-6 block w-full bg-green-600 hover:bg-green-700 text-white text-center py-4 rounded-lg text-lg font-bold transition-colors"
        >
          + Create New Routine
        </button>

        {/* My Routines Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-zinc-300 mb-4">My Routines</h2>
          <div className="space-y-4">
            {myRoutines.length === 0 ? (
              <div className="text-center text-zinc-500 text-lg py-4">
                No routines yet. Create one above or browse public routines.
              </div>
            ) : (
              myRoutines.map((routine) => renderRoutineCard(routine, true))
            )}
          </div>
        </div>

        {/* Favorited Routines Section */}
        {favoritedRoutines.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-zinc-300 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              Favorited Routines
            </h2>
            <div className="space-y-4">
              {favoritedRoutines.map((routine) => renderRoutineCard(routine, false))}
            </div>
          </div>
        )}

        <Link
          href="/routines/import"
          className="mt-4 block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-4 rounded-lg text-lg font-semibold transition-colors"
        >
          Import Routine from JSON
        </Link>

        {/* Public Routines Preview Section */}
        {publicRoutinesPreview.length > 0 && (
          <div className="mt-8 pt-8 border-t border-zinc-700">
            <h2 className="text-xl font-semibold text-zinc-300 mb-4">Discover Public Routines</h2>
            <div className="space-y-3">
              {publicRoutinesPreview.map((routine) => (
                <div
                  key={`public-${routine.id}`}
                  className="bg-zinc-800 rounded-lg p-4 border border-zinc-700"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{routine.name}</h3>
                      <p className="text-sm text-zinc-400">
                        by <span className="text-purple-400">@{routine.creator_username || routine.creator_name || 'Anonymous'}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/routines/browse"
              className="mt-4 block w-full bg-purple-600 hover:bg-purple-700 text-white text-center py-3 rounded-lg font-semibold transition-colors"
            >
              Browse All Public Routines
            </Link>
          </div>
        )}

        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-2">Create a new routine</h2>
              <p className="text-zinc-400 text-sm mb-6">
                Choose how you want to build your next workout.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/routines/builder')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-lg font-semibold"
                >
                  Manual Builder
                </button>
                <button
                  onClick={() => router.push('/routines/ai')}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3 rounded-lg text-lg font-semibold"
                >
                  AI-Assisted
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 py-3 rounded-lg text-sm font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
