'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  loadFreeWorkoutSetupCache,
  saveFreeWorkoutSetupCache,
  saveFreeWorkoutSetup,
  saveSessionTargetsMeta,
  saveSessionWorkout,
  type FreeWorkoutSetup,
} from '@/lib/session-workout';
import { buildFreeWorkoutPlan, FREE_WORKOUT_SLUG } from '@/lib/free-workout';
import { initWorkoutSession } from '@/lib/workout-session';
import { SESSION_MODE_DESCRIPTIONS, SESSION_MODE_LABELS, SESSION_MODES, type SessionMode } from '@/lib/constants';

const MODE_CARDS: SessionMode[] = [
  SESSION_MODES.progress,
  SESSION_MODES.maintenance,
  SESSION_MODES.light,
];

type BootstrapResponse = FreeWorkoutSetup;
type ModeStatus = 'idle' | 'warming' | 'ready';

function modeAccent(mode: SessionMode, selected: boolean) {
  if (mode === SESSION_MODES.progress) {
    return selected
      ? 'border-emerald-400 bg-emerald-500/20 text-white'
      : 'border-emerald-900/60 bg-zinc-900 text-emerald-100 hover:border-emerald-500/70';
  }
  if (mode === SESSION_MODES.maintenance) {
    return selected
      ? 'border-sky-400 bg-sky-500/20 text-white'
      : 'border-sky-900/60 bg-zinc-900 text-sky-100 hover:border-sky-500/70';
  }
  return selected
    ? 'border-amber-300 bg-amber-400/20 text-white'
    : 'border-zinc-700 bg-zinc-900 text-zinc-100 hover:border-amber-300/70';
}

function modeUsesAi(mode: SessionMode): boolean {
  return mode === SESSION_MODES.progress;
}

export default function FreeWorkoutSetupPage() {
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState<SessionMode | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modeStatus, setModeStatus] = useState<Record<SessionMode, ModeStatus>>({
    [SESSION_MODES.progress]: 'idle',
    [SESSION_MODES.maintenance]: 'idle',
    [SESSION_MODES.light]: 'idle',
  });
  const fastPreloadRef = useRef<Partial<Record<SessionMode, Promise<BootstrapResponse>>>>({});
  const didPrimeRef = useRef(false);

  const markModeStatus = (mode: SessionMode, status: ModeStatus) => {
    setModeStatus((prev) => ({
      ...prev,
      [mode]: prev[mode] === 'ready' ? 'ready' : status,
    }));
  };

  const fetchBootstrap = async (
    mode: SessionMode,
    options?: { skipAi?: boolean; forceRefresh?: boolean }
  ): Promise<BootstrapResponse> => {
    const { skipAi = false, forceRefresh = false } = options ?? {};
    if (!forceRefresh) {
      const cached = loadFreeWorkoutSetupCache(mode);
      if (cached) {
        markModeStatus(mode, 'ready');
        return cached;
      }
    }

    const response = await fetch('/api/free-workout/bootstrap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionMode: mode, skipAi }),
    });

    if (!response.ok) {
      throw new Error('Failed to prepare free workout');
    }

    const data = await response.json() as BootstrapResponse;
    saveFreeWorkoutSetupCache(mode, data);
    markModeStatus(mode, 'ready');
    return data;
  };

  useEffect(() => {
    if (didPrimeRef.current) return;
    didPrimeRef.current = true;

    let cancelled = false;

    for (const mode of MODE_CARDS) {
      if (loadFreeWorkoutSetupCache(mode)) {
        markModeStatus(mode, 'ready');
      } else {
        markModeStatus(mode, 'warming');
        const request = fetchBootstrap(mode, { skipAi: true });
        fastPreloadRef.current[mode] = request;
        void request.catch((preloadError) => {
          console.error(`Failed to warm free workout targets for ${mode}:`, preloadError);
          if (!cancelled) {
            setModeStatus((prev) => ({
              ...prev,
              [mode]: 'idle',
            }));
          }
        });
      }
    }

    const upgradeProgressMode = async () => {
      const mode = SESSION_MODES.progress;
      if (cancelled) return;
      try {
        await (fastPreloadRef.current[mode] ?? Promise.resolve(loadFreeWorkoutSetupCache(mode) as BootstrapResponse));
        if (cancelled) return;
        const upgraded = await fetchBootstrap(mode, { forceRefresh: true });
        saveFreeWorkoutSetupCache(mode, upgraded);
      } catch (upgradeError) {
        console.error(`Failed to upgrade free workout targets for ${mode}:`, upgradeError);
      }
    };

    void upgradeProgressMode();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleStart = async () => {
    if (!selectedMode || isStarting) return;
    setIsStarting(true);
    setError(null);

    try {
      let data = loadFreeWorkoutSetupCache(selectedMode);
      if (!data) {
        data = await (fastPreloadRef.current[selectedMode]
          ?? fetchBootstrap(selectedMode, { skipAi: !modeUsesAi(selectedMode) }));
      }
      const plan = buildFreeWorkoutPlan();

      saveFreeWorkoutSetup(data);
      saveSessionWorkout(plan, null);
      saveSessionTargetsMeta(plan.name, null, {
        encouragement: data.encouragement,
        goalSummary: data.goalSummary,
        trendSummary: data.trendSummary,
        source: data.source,
        sessionMode: data.sessionMode,
      });
      initWorkoutSession(plan.name, null);
      router.push(`/workout/${encodeURIComponent(FREE_WORKOUT_SLUG)}/active?free=1`);
    } catch (startError) {
      console.error('Error starting free workout:', startError);
      setError('Could not prepare your free workout. Try again.');
      setIsStarting(false);
    }
  };

  const selectedModeStatus = selectedMode ? modeStatus[selectedMode] : 'idle';

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-8 text-white">
      <main className="mx-auto max-w-2xl">
        <Link href="/" className="inline-flex items-center text-sm text-emerald-300 hover:text-emerald-200">
          ← Back home
        </Link>

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl shadow-black/20 sm:p-8">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Free Workout</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">How are you feeling today?</h1>
            <p className="mt-3 max-w-xl text-sm text-zinc-400">
              Pick the mode for this session. We&apos;ll preload targets for exercises you&apos;ve already done so
              adding them during the workout is instant.
            </p>
          </div>

          <div className="space-y-3">
            {MODE_CARDS.map((mode) => {
              const selected = selectedMode === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setSelectedMode(mode)}
                  className={`w-full rounded-2xl border px-5 py-5 text-left transition ${modeAccent(mode, selected)}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-lg font-semibold">{SESSION_MODE_LABELS[mode]}</div>
                      <div className="mt-1 text-sm opacity-80">{SESSION_MODE_DESCRIPTIONS[mode]}</div>
                    </div>
                    <div
                      className={`h-5 w-5 rounded-full border ${
                        selected ? 'border-current bg-current' : 'border-zinc-500'
                      }`}
                      aria-hidden="true"
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-900/70 bg-red-950/40 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <div className="mt-4 text-sm text-zinc-400">
            {selectedMode && selectedModeStatus === 'ready'
              ? selectedMode === SESSION_MODES.progress
                ? 'Baseline progress targets are ready. AI refinement warms in the background.'
                : 'Targets for this mode are warmed up and ready.'
              : 'Targets for all three modes warm in the background while you choose.'}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleStart}
              disabled={!selectedMode || isStarting}
              className="inline-flex flex-1 items-center justify-center rounded-2xl bg-emerald-600 px-5 py-4 text-base font-bold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
            >
              {isStarting ? 'Preparing workout...' : 'Start free workout'}
            </button>
            <Link
              href="/routines"
              className="inline-flex items-center justify-center rounded-2xl border border-zinc-700 px-5 py-4 text-sm font-semibold text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-800"
            >
              Go to routines
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
