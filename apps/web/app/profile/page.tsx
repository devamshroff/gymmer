'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ExerciseHistoryModal from '@/app/components/ExerciseHistoryModal';
import {
  DEFAULT_HEIGHT_UNIT,
  DEFAULT_WEIGHT_UNIT,
  normalizeHeightUnit,
  normalizeWeightUnit,
} from '@/lib/units';
import type { HeightUnit, WeightUnit } from '@/lib/units';

interface UserInfo {
  username: string | null;
  name?: string | null;
  email?: string | null;
}

type ProgressLeader = {
  name: string;
  delta: number;
  recentAvg: number | null;
  previousAvg: number | null;
  lastPerformed: string | null;
};

type AnalyticsData = {
  rangeDays: number;
  calendar: {
    year: number;
    month: number;
    startWeekday: number;
    days: Array<{
      date: string;
      count: number;
      workoutNames: string[];
    }>;
  };
  calendarPrev: {
    year: number;
    month: number;
    startWeekday: number;
    days: Array<{
      date: string;
      count: number;
      workoutNames: string[];
    }>;
  };
  summary: {
    workoutsLogged: number;
    avgDuration: number | null;
    longestStreak: number;
    trend: Array<{ day: string; count: number }>;
  };
  topWorkouts: Array<{
    name: string;
    count: number;
    lastCompleted: string;
  }>;
  progressLeaders: {
    volume: ProgressLeader[];
    maxWeight: ProgressLeader[];
  };
  exercises: Array<{
    name: string;
    lastPerformed: string | null;
    sessions: number;
  }>;
};

export default function ProfilePage() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [weightUnit, setWeightUnit] = useState<WeightUnit>(DEFAULT_WEIGHT_UNIT);
  const [heightUnit, setHeightUnit] = useState<HeightUnit>(DEFAULT_HEIGHT_UNIT);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [goalsText, setGoalsText] = useState('');
  const [goalsSaving, setGoalsSaving] = useState(false);
  const [goalsStatus, setGoalsStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const [goalsLoadError, setGoalsLoadError] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState(false);
  const [progressMetric, setProgressMetric] = useState<'volume' | 'maxWeight'>('maxWeight');
  const [range, setRange] = useState<'30d' | '6mo' | '1y'>('30d');
  const [monthOffset, setMonthOffset] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [historyExerciseNames, setHistoryExerciseNames] = useState<string[]>([]);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const [userResponse, settingsResponse, goalsResponse] = await Promise.all([
          fetch('/api/user'),
          fetch('/api/user/settings'),
          fetch('/api/goals')
        ]);

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUserInfo({
            username: userData.username || null,
            name: userData.name || null,
            email: userData.email || null
          });
        }

        if (settingsResponse.ok) {
          const settingsData = await settingsResponse.json();
          if (settingsData?.weightUnit !== undefined) {
            setWeightUnit(normalizeWeightUnit(settingsData.weightUnit));
          }
          if (settingsData?.heightUnit !== undefined) {
            setHeightUnit(normalizeHeightUnit(settingsData.heightUnit));
          }
        }

        if (goalsResponse.ok) {
          const goalsData = await goalsResponse.json();
          setGoalsText(goalsData.goals || '');
        } else {
          setGoalsLoadError(true);
        }

      } catch (error) {
        console.error('Error loading profile settings:', error);
        setLoadError(true);
        setGoalsLoadError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function fetchAnalytics() {
      setAnalyticsLoading(true);
      setAnalyticsError(false);
      try {
        const response = await fetch(`/api/profile/analytics?range=${range}&monthOffset=${monthOffset}`);
        if (!response.ok) {
          throw new Error('Failed to load analytics');
        }
        const analyticsData = await response.json();
        if (isMounted) {
          setAnalytics(analyticsData);
        }
      } catch (error) {
        console.error('Error loading analytics:', error);
        if (isMounted) {
          setAnalyticsError(true);
        }
      } finally {
        if (isMounted) {
          setAnalyticsLoading(false);
        }
      }
    }

    fetchAnalytics();
    return () => {
      isMounted = false;
    };
  }, [monthOffset, range]);

  const displayName = userInfo?.username
    ? `@${userInfo.username}`
    : userInfo?.name || userInfo?.email || 'Profile';

  const progressLeaders = analytics
    ? progressMetric === 'volume'
      ? analytics.progressLeaders.volume
      : analytics.progressLeaders.maxWeight
    : [];
  const trendMax = analytics?.summary.trend.reduce((max, entry) => Math.max(max, entry.count), 0) || 1;
  const monthLabel = analytics
    ? new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
      new Date(Date.UTC(analytics.calendar.year, analytics.calendar.month - 1, 15))
    )
    : '';
  const prevMonthLabel = analytics
    ? new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
      new Date(Date.UTC(analytics.calendarPrev.year, analytics.calendarPrev.month - 1, 15))
    )
    : '';
  const formatShortDate = (value: string | null) => {
    if (!value) return '—';
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(value));
  };
  const formatNumber = (value: number | null) => {
    if (value === null || !Number.isFinite(value)) return '—';
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
  };
  const rangeLabel = range === '6mo' ? 'Last 6 Months' : range === '1y' ? 'Last 12 Months' : 'Last 30 Days';
  const openExerciseHistory = (exerciseName: string) => {
    setHistoryExerciseNames([exerciseName]);
    setShowHistory(true);
  };
  const closeExerciseHistory = () => {
    setShowHistory(false);
    setHistoryExerciseNames([]);
  };

  const handleGoalsSave = async () => {
    setGoalsSaving(true);
    setGoalsStatus('idle');

    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goals: goalsText })
      });

      if (!response.ok) {
        throw new Error('Failed to save');
      }

      setGoalsStatus('saved');
    } catch (error) {
      console.error('Error saving goals:', error);
      setGoalsStatus('error');
    } finally {
      setGoalsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 p-4 text-white">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold mb-2">{displayName}</h1>
              <p className="text-sm text-zinc-300 mb-6">
                Review your analytics and update your fitness goals. Adjust rest timers and units in settings.
              </p>
            </div>
            <Link
              href="/settings"
              aria-label="Open settings"
              className="mt-1 flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-lg text-zinc-200 transition-colors hover:bg-zinc-800"
            >
              ⚙️
            </Link>
          </div>

          {loadError && (
            <div className="mb-3 text-sm text-red-400">Could not load profile data.</div>
          )}

          <div className="mb-8 border-b border-zinc-700 pb-6">
            <h2 className="text-2xl font-bold mb-2">Fitness Goals and Background</h2>
            <p className="text-sm text-zinc-300 mb-4">
              What are your fitness goals? Share goals like strength, hypertrophy, rehab focus, equipment limits, or weekly targets.
              Also please share any relevant background about you! Age, Gender, Sports you are into..
              We&apos;ll use this for AI-assisted routines and post-workout reports.
            </p>
            {goalsLoadError && (
              <div className="mb-3 text-sm text-red-400">Could not load goals.</div>
            )}

            <label htmlFor="goals" className="text-sm font-semibold text-zinc-200">
              Goals & preferences
            </label>
            <textarea
              id="goals"
              rows={8}
              value={goalsText}
              onChange={(event) => setGoalsText(event.target.value)}
              disabled={loading || goalsSaving}
              placeholder="Example: Build strength in squat/bench, avoid knee-heavy plyometrics, 4 days/week, focus on upper body hypertrophy."
              className="mt-2 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-600 analytics-scroll"
            />

            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={handleGoalsSave}
                disabled={loading || goalsSaving}
                className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:opacity-70"
              >
                {goalsSaving ? 'Saving...' : 'Save Goals'}
              </button>
              {goalsStatus === 'saved' && (
                <span className="text-sm text-emerald-400">Saved</span>
              )}
              {goalsStatus === 'error' && (
                <span className="text-sm text-red-400">Could not save goals.</span>
              )}
            </div>
          </div>

          <div className="mb-8 border-b border-zinc-700 pb-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold mb-1">Training Analytics</h2>
                <p className="text-sm text-zinc-300">
                  Last 30 days of workouts, progress, and consistency.
                </p>
              </div>
              <div className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs text-zinc-400">
                Updated daily
              </div>
            </div>

            {analyticsError && (
              <div className="mt-3 text-sm text-red-400">Could not load analytics.</div>
            )}

            {analyticsLoading && (
              <div className="mt-4 text-sm text-zinc-400">Loading analytics...</div>
            )}

            {!analyticsLoading && analytics && (
              <div className="mt-5 space-y-4">
                <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr] lg:items-stretch">
                  <div className="rounded-lg border border-zinc-700 bg-zinc-900/60 p-4 h-full flex flex-col">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Workout Calendar</h3>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setMonthOffset((prev) => prev - 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-xs text-zinc-300 transition-colors hover:bg-zinc-800"
                          aria-label="Previous month"
                        >
                          ←
                        </button>
                        <span className="text-xs text-zinc-400">{monthLabel}</span>
                        <button
                          type="button"
                          onClick={() => setMonthOffset((prev) => Math.min(prev + 1, 0))}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-xs text-zinc-300 transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                          aria-label="Next month"
                          disabled={monthOffset >= 0}
                        >
                          →
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-7 gap-2 text-[11px] text-zinc-500">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((label) => (
                        <div key={label} className="text-center uppercase tracking-wide">
                          {label}
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 grid grid-cols-7 gap-2">
                      {Array.from({ length: analytics.calendar.startWeekday }).map((_, index) => (
                        <div key={`pad-${index}`} />
                      ))}
                      {analytics.calendar.days.map((day) => {
                        const hasWorkouts = day.count > 0;
                        const dayNumber = Number(day.date.slice(-2));
                        const names = day.workoutNames.slice(0, 3).join(', ');
                        return (
                          <div
                            key={day.date}
                            title={names ? `${day.count} workout${day.count > 1 ? 's' : ''}: ${names}` : 'No workouts'}
                            className={[
                              'rounded-md border px-2 py-2 text-xs transition-colors',
                              hasWorkouts
                                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100'
                                : 'border-zinc-800 bg-zinc-950/40 text-zinc-500'
                            ].join(' ')}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{dayNumber}</span>
                              {hasWorkouts && (
                                <span className="text-[10px] font-semibold text-emerald-300">
                                  {day.count}
                                </span>
                              )}
                            </div>
                            {hasWorkouts && (
                              <div className="mt-1 truncate text-[10px] text-emerald-200/80">
                                {day.workoutNames[0]}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-zinc-200">Previous Month</h4>
                      <span className="text-xs text-zinc-400">{prevMonthLabel}</span>
                    </div>
                    <div className="mt-3 grid grid-cols-7 gap-2">
                      {Array.from({ length: analytics.calendarPrev.startWeekday }).map((_, index) => (
                        <div key={`prev-pad-${index}`} />
                      ))}
                      {analytics.calendarPrev.days.map((day) => {
                        const hasWorkouts = day.count > 0;
                        const dayNumber = Number(day.date.slice(-2));
                        const names = day.workoutNames.slice(0, 3).join(', ');
                        return (
                          <div
                            key={`prev-${day.date}`}
                            title={names ? `${day.count} workout${day.count > 1 ? 's' : ''}: ${names}` : 'No workouts'}
                            className={[
                              'rounded-md border px-2 py-2 text-xs transition-colors',
                              hasWorkouts
                                ? 'border-emerald-500/25 bg-emerald-500/5 text-emerald-100'
                                : 'border-zinc-800 bg-zinc-950/40 text-zinc-500'
                            ].join(' ')}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{dayNumber}</span>
                              {hasWorkouts && (
                                <span className="text-[10px] font-semibold text-emerald-300/80">
                                  {day.count}
                                </span>
                              )}
                            </div>
                            {hasWorkouts && (
                              <div className="mt-1 truncate text-[10px] text-emerald-200/70">
                                {day.workoutNames[0]}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-4 h-full">
                    <div className="rounded-lg border border-zinc-700 bg-zinc-900/60 p-4">
                      <h3 className="text-lg font-semibold">{rangeLabel}</h3>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-md border border-zinc-800 bg-zinc-950/50 p-3">
                          <p className="text-xs text-zinc-400">Workouts logged</p>
                          <p className="mt-2 text-3xl font-semibold text-white">
                            {analytics.summary.workoutsLogged}
                          </p>
                        </div>
                        <div className="rounded-md border border-zinc-800 bg-zinc-950/50 p-3">
                          <p className="text-xs text-zinc-400">Avg session duration</p>
                          <p className="mt-2 text-3xl font-semibold text-white">
                            {analytics.summary.avgDuration !== null ? (
                              <>
                                {Math.round(analytics.summary.avgDuration)}{' '}
                                <span className="text-lg text-zinc-300">min</span>
                              </>
                            ) : (
                              '—'
                            )}
                          </p>
                        </div>
                        <div className="rounded-md border border-zinc-800 bg-zinc-950/50 p-3">
                          <p className="text-xs text-zinc-400">Longest streak</p>
                          <p className="mt-2 text-3xl font-semibold text-white">
                            {analytics.summary.longestStreak}
                          </p>
                        </div>
                        <div className="rounded-md border border-zinc-800 bg-zinc-950/50 p-3">
                          <p className="text-xs text-zinc-400">Active days</p>
                          <p className="mt-2 text-3xl font-semibold text-white">
                            {analytics.summary.trend.filter((point) => point.count > 0).length}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-zinc-700 bg-zinc-900/60 p-4">
                      <h3 className="text-lg font-semibold">Most-Done Workouts</h3>
                      {analytics.topWorkouts.length === 0 ? (
                        <p className="mt-3 text-sm text-zinc-400">No workouts logged yet.</p>
                      ) : (
                        <div className="mt-3 max-h-56 overflow-y-auto pr-1 space-y-3 analytics-scroll">
                          {analytics.topWorkouts.map((workout) => (
                            <div key={workout.name} className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-semibold text-white">{workout.name}</p>
                                <p className="text-xs text-zinc-500">
                                  Last: {formatShortDate(workout.lastCompleted)}
                                </p>
                              </div>
                              <div className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                                {workout.count}x
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="w-full max-w-sm rounded-lg border border-zinc-700 bg-zinc-900/60 p-2">
                    <div className="grid grid-cols-3 gap-2 rounded-full border border-zinc-700 bg-zinc-900 p-1">
                      {[
                        { value: '30d', label: '30 Days' },
                        { value: '6mo', label: '6 Months' },
                        { value: '1y', label: '1 Year' },
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setRange(option.value as '30d' | '6mo' | '1y')}
                          className={[
                            'rounded-full px-3 py-1 text-center text-xs font-semibold transition-colors',
                            range === option.value
                              ? 'bg-emerald-500/20 text-emerald-200'
                              : 'text-zinc-400 hover:text-zinc-200'
                          ].join(' ')}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-zinc-700 bg-zinc-900/60 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold">Progress Leaders</h3>
                      <p className="text-xs text-zinc-400">
                        Biggest gains in the selected range.
                      </p>
                    </div>
                    <div className="flex rounded-full border border-zinc-700 bg-zinc-900 p-1">
                      <button
                        type="button"
                        onClick={() => setProgressMetric('maxWeight')}
                        className={[
                          'rounded-full px-3 py-1 text-xs font-semibold transition-colors',
                          progressMetric === 'maxWeight'
                            ? 'bg-emerald-500/20 text-emerald-200'
                            : 'text-zinc-400 hover:text-zinc-200'
                        ].join(' ')}
                      >
                        Max Weight
                      </button>
                      <button
                        type="button"
                        onClick={() => setProgressMetric('volume')}
                        className={[
                          'rounded-full px-3 py-1 text-xs font-semibold transition-colors',
                          progressMetric === 'volume'
                            ? 'bg-emerald-500/20 text-emerald-200'
                            : 'text-zinc-400 hover:text-zinc-200'
                        ].join(' ')}
                      >
                        Volume
                      </button>
                    </div>
                  </div>

                  {progressLeaders.length === 0 ? (
                    <p className="mt-4 text-sm text-zinc-400">
                      Keep logging workouts to surface progress trends here.
                    </p>
                  ) : (
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      {progressLeaders.map((leader) => (
                        <div
                          key={leader.name}
                          className="rounded-md border border-zinc-800 bg-zinc-950/50 p-3"
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-white">{leader.name}</p>
                            <span className="text-xs font-semibold text-emerald-300">
                              +{formatNumber(leader.delta)}
                              {progressMetric === 'maxWeight' ? ` ${weightUnit}` : ''}
                            </span>
                          </div>
                          <p className="mt-2 text-xs text-zinc-400">
                            {progressMetric === 'volume'
                              ? `Avg volume ${formatNumber(leader.previousAvg)} → ${formatNumber(leader.recentAvg)}`
                              : `Avg max ${formatNumber(leader.previousAvg)} → ${formatNumber(leader.recentAvg)} ${weightUnit}`}
                          </p>
                          <p className="mt-1 text-xs text-zinc-500">
                            Last performed {formatShortDate(leader.lastPerformed)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-lg border border-zinc-700 bg-zinc-900/60 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Exercise History</h3>
                      <p className="text-xs text-zinc-400">
                        Tap any exercise to view its history chart.
                      </p>
                    </div>
                  </div>

                  {analytics.exercises.length === 0 ? (
                    <p className="mt-4 text-sm text-zinc-400">
                      No exercise logs yet. Complete a workout to start tracking history.
                    </p>
                  ) : (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {analytics.exercises.map((exercise) => (
                        <div
                          key={exercise.name}
                          className="flex items-start justify-between gap-3 rounded-md border border-zinc-800 bg-zinc-950/50 p-3"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white">{exercise.name}</p>
                            <p className="mt-1 text-xs text-zinc-500">
                              Last: {formatShortDate(exercise.lastPerformed)}
                            </p>
                            <p className="text-xs text-zinc-500">
                              Sessions: {exercise.sessions}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => openExerciseHistory(exercise.name)}
                            aria-label={`View ${exercise.name} history`}
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/10 text-sm text-emerald-200 transition-colors hover:bg-emerald-500/20"
                          >
                            📈
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      <ExerciseHistoryModal
        open={showHistory}
        onClose={closeExerciseHistory}
        exerciseNames={historyExerciseNames}
        title="Exercise History"
        weightUnit={weightUnit}
        heightUnit={heightUnit}
      />
    </div>
  );
}
