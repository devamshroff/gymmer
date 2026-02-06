'use client';

import { useEffect, useState, type ButtonHTMLAttributes } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import UsernameSetup from '@/app/components/UsernameSetup';

interface Routine {
  id: number;
  name: string;
  description: string | null;
  is_public: number;
  user_id: string;
  creator_username?: string;
  creator_name?: string;
  is_favorited?: number;
  last_workout_date?: string | null;
  created_at: string;
  updated_at: string;
  like_count?: number | null;
  clone_count?: number | null;
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

export default function RoutinesPage() {
  const router = useRouter();
  const [myRoutines, setMyRoutines] = useState<Routine[]>([]);
  const [favoritedRoutines, setFavoritedRoutines] = useState<Routine[]>([]);
  const [publicRoutinesPreview, setPublicRoutinesPreview] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggingRoutineIndex, setDraggingRoutineIndex] = useState<number | null>(null);
  const [dragOverRoutineIndex, setDragOverRoutineIndex] = useState<number | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [showUsernameSetup, setShowUsernameSetup] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Routine | null>(null);
  const [deletingRoutine, setDeletingRoutine] = useState(false);

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

  async function confirmDeleteRoutine() {
    if (!deleteTarget || deletingRoutine) return;
    setDeletingRoutine(true);

    try {
      const response = await fetch(`/api/routines/${deleteTarget.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete routine');
      }

      setMyRoutines((prev) => prev.filter((routine) => routine.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (error) {
      console.error('Error deleting routine:', error);
      alert('Failed to delete routine. Please try again.');
    } finally {
      setDeletingRoutine(false);
    }
  }

  function cancelDeleteRoutine() {
    if (deletingRoutine) return;
    setDeleteTarget(null);
  }

  const reorderList = <T,>(list: T[], from: number, to: number): T[] => {
    const next = list.slice();
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    return next;
  };

  async function persistRoutineOrder(items: Routine[]) {
    const order = items.map((routine) => routine.id);
    const response = await fetch('/api/routines/reorder', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order }),
    });
    if (!response.ok) {
      throw new Error('Failed to reorder routines');
    }
  }

  async function handleMoveRoutine(index: number, delta: number) {
    const targetIndex = index + delta;
    if (targetIndex < 0 || targetIndex >= myRoutines.length) return;
    const previous = myRoutines;
    const next = reorderList(previous, index, targetIndex);
    setMyRoutines(next);
    try {
      await persistRoutineOrder(next);
    } catch (error) {
      console.error('Error reordering routines:', error);
      setMyRoutines(previous);
    }
  }

  async function handleRoutineDrop(index: number) {
    if (draggingRoutineIndex === null || draggingRoutineIndex === index) {
      setDragOverRoutineIndex(null);
      return;
    }
    const previous = myRoutines;
    const next = reorderList(previous, draggingRoutineIndex, index);
    setMyRoutines(next);
    setDraggingRoutineIndex(null);
    setDragOverRoutineIndex(null);
    try {
      await persistRoutineOrder(next);
    } catch (error) {
      console.error('Error reordering routines:', error);
      setMyRoutines(previous);
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

  const renderRoutineCard = (
    routine: Routine,
    isOwned: boolean,
    reorderControls?: {
      onMoveUp?: () => void;
      onMoveDown?: () => void;
      disableMoveUp?: boolean;
      disableMoveDown?: boolean;
      dragHandleProps?: ButtonHTMLAttributes<HTMLButtonElement>;
    }
  ) => {
    const lastDate = routine.last_workout_date || null;
    const formattedDate = formatLocalDate(lastDate);
    const encodedName = encodeURIComponent(routine.name);
    const startHref = `/workout/${encodedName}?routineId=${routine.id}&preview=1`;

    return (
      <div
        key={`routine-${routine.id}`}
        className="bg-zinc-800 hover:bg-zinc-700 transition-colors rounded-lg p-6 border-2 border-zinc-700"
      >
        <div className="grid grid-cols-[1fr_auto] grid-rows-[auto_auto] gap-x-4 gap-y-2">
          <div className="col-span-1 row-span-2 grid grid-cols-[auto_1fr] grid-rows-[auto_auto] gap-x-6 gap-y-2 items-start">
            {reorderControls?.dragHandleProps && (
              <button
                {...reorderControls.dragHandleProps}
                type="button"
                className={`self-center row-span-2 p-2 rounded bg-zinc-700/60 text-zinc-200 hover:bg-zinc-600/70 cursor-grab active:cursor-grabbing ${reorderControls.dragHandleProps.className ?? ''}`}
                aria-label="Drag to reorder"
                title="Drag to reorder"
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                  <path d="M7 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm9 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM7 10a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm9 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM7 15.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm9 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                </svg>
              </button>
            )}
            <div className="col-start-2 row-start-1">
              <h3 className="text-2xl font-semibold text-white">{routine.name}</h3>
              {(!isOwned && (routine.creator_username || routine.creator_name)) || (isOwned && routine.description) ? (
                <div className="text-zinc-400 text-sm mt-1">
                  {!isOwned && routine.creator_username && (
                    <span>by @{routine.creator_username}</span>
                  )}
                  {!isOwned && !routine.creator_username && routine.creator_name && (
                    <span>by {routine.creator_name}</span>
                  )}
                  {isOwned && routine.description && routine.description}
                </div>
              ) : null}
              {isOwned && (
                <div className="text-xs text-zinc-500 mt-1">
                  {routine.like_count ?? 0} Likes | {routine.clone_count ?? 0} Clones
                </div>
              )}
            </div>
            <div className="col-start-2 row-start-2 flex flex-wrap items-center gap-2">
              <Link
                href={startHref}
                className="px-4 py-2 rounded-lg font-medium bg-red-900 hover:bg-red-800 text-red-100 transition-colors inline-flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M6.5 4.8a1 1 0 0 1 1 0l10 6a1 1 0 0 1 0 1.8l-10 6A1 1 0 0 1 6 17.8V6.2a1 1 0 0 1 .5-1.4z" />
                </svg>
                Start
              </Link>
              {isOwned && (
                <Link
                  href={`/routines/${routine.id}/edit`}
                  className="px-4 py-2 rounded-lg font-medium bg-blue-800 hover:bg-blue-700 text-white transition-colors inline-flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M4 17.3V20h2.7l8-8-2.7-2.7-8 8zm15.7-9.6a1 1 0 0 0 0-1.4l-2-2a1 1 0 0 0-1.4 0l-1.6 1.6L18.1 9l1.6-1.3z" />
                  </svg>
                  Edit
                </Link>
              )}
            </div>
          </div>
          <div className="col-start-2 row-start-1 flex items-center gap-2 justify-end">
            <div className="text-sm text-zinc-500 whitespace-nowrap shrink-0">
              Last:{' '}
              <span className={lastDate ? "text-blue-300" : "text-zinc-600"}>
                {formattedDate}
              </span>
            </div>
            {!isOwned && (
              <button
                onClick={() => removeFavorite(routine.id)}
                className="text-red-400 hover:text-red-300 p-1"
                title="Remove from favorites"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </button>
            )}
          </div>
          {isOwned && (
            <div className="col-start-2 row-start-2 flex items-center justify-end self-center">
              <button
                onClick={() => setDeleteTarget(routine)}
                className="p-2 text-red-700 hover:text-red-600 translate-y-2"
                aria-label="Delete routine"
                title="Delete routine"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5.5 w-5.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M19.5 6h-15" />
                  <path d="M8.5 6V4.5a1.5 1.5 0 0 1 1.5-1.5h4a1.5 1.5 0 0 1 1.5 1.5V6" />
                  <path d="M6.5 6l1 13a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2l1-13" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-900 p-4">
      <main className="max-w-2xl mx-auto py-8">
        <div className="flex justify-end mb-4">
          <Link
            href="/profile"
            className="inline-flex items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 p-3 text-zinc-200 transition-colors hover:border-emerald-600 hover:text-emerald-300"
            aria-label="Open profile"
            title="Profile"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.6h19.2v-2.6c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </Link>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">My Routines</h1>
          <p className="text-sm text-zinc-400">
            Build, track, and favorite workouts you want to run again.
          </p>
          {userInfo?.username && (
            <p className="mt-2 text-sm text-zinc-500">
              Signed in as <span className="text-emerald-300">@{userInfo.username}</span>
            </p>
          )}
        </div>

        {/* Create New Routine Button */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="mb-3 block w-full bg-purple-900 hover:bg-purple-800 text-white text-center py-4 rounded-lg text-lg font-bold transition-colors"
        >
          + Create New Routine
        </button>

        <div className="mb-8">
          <Link
            href="/routines/import"
            className="block w-full rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-3 text-center text-sm font-semibold transition-colors"
          >
            Import Routine from JSON
          </Link>
        </div>

        {/* My Routines Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-zinc-300 mb-4">My Routines</h2>
        <div className="space-y-4">
          {myRoutines.length === 0 ? (
            <div className="text-center text-zinc-500 text-lg py-4">
              No routines yet. Create one above or browse public routines.
            </div>
          ) : (
            myRoutines.map((routine, index) => (
              <div
                key={`routine-${routine.id}`}
                className={dragOverRoutineIndex === index ? 'ring-2 ring-emerald-500/70 rounded-lg' : ''}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragOverRoutineIndex(index);
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  handleRoutineDrop(index);
                }}
              >
                {renderRoutineCard(routine, true, {
                  onMoveUp: () => handleMoveRoutine(index, -1),
                  onMoveDown: () => handleMoveRoutine(index, 1),
                  disableMoveUp: index === 0,
                  disableMoveDown: index === myRoutines.length - 1,
                  dragHandleProps: {
                    draggable: true,
                    onDragStart: (event) => {
                      event.dataTransfer.effectAllowed = 'move';
                      event.dataTransfer.setData('text/plain', String(index));
                      setDraggingRoutineIndex(index);
                    },
                    onDragEnd: () => {
                      setDraggingRoutineIndex(null);
                      setDragOverRoutineIndex(null);
                    },
                  },
                })}
              </div>
            ))
          )}
        </div>
      </div>

        {/* Favorited Routines Section */}
        {favoritedRoutines.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-zinc-300 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              Favorited Routines
            </h2>
            <div className="space-y-4">
              {favoritedRoutines.map((routine) => renderRoutineCard(routine, false))}
            </div>
          </div>
        )}

        {/* Public Routines Preview Section */}
        {publicRoutinesPreview.length > 0 && (
          <div className="mt-8 pt-8 border-t border-zinc-700">
            <h2 className="text-xl font-semibold text-zinc-300 mb-4">Discover Public Routines</h2>
            <Link
              href="/routines/browse"
              className="mb-4 block w-full bg-purple-900 hover:bg-purple-800 text-white text-center py-3 rounded-lg font-semibold transition-colors"
            >
              Browse All Public Routines
            </Link>
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
                        by <span className="text-purple-300">@{routine.creator_username || routine.creator_name || 'Anonymous'}</span>
                      </p>
                      <p className="text-xs text-zinc-500 mt-1">
                        {routine.like_count ?? 0} Likes | {routine.clone_count ?? 0} Clones
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
                  className="w-full bg-green-700 hover:bg-green-600 text-white py-3 rounded-lg text-lg font-semibold"
                >
                  Manual Builder
                </button>
                <button
                  onClick={() => router.push('/routines/ai')}
                  className="w-full bg-emerald-800 hover:bg-emerald-700 text-white py-3 rounded-lg text-lg font-semibold"
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

        {deleteTarget && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-2">Delete Routine</h2>
              <p className="text-zinc-400 text-sm mb-6">
                This will permanently delete &quot;{deleteTarget.name}&quot;.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={confirmDeleteRoutine}
                  className="flex-1 bg-red-800 hover:bg-red-700 text-white py-3 rounded-lg text-sm font-semibold"
                  disabled={deletingRoutine}
                >
                  {deletingRoutine ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  onClick={cancelDeleteRoutine}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 py-3 rounded-lg text-sm font-semibold"
                  disabled={deletingRoutine}
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
