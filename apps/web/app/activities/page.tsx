'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { ActivityLog } from '@/lib/types';
import {
  ACTIVITY_PRESETS,
  presetForActivityLabel,
  toggleActivitySelection,
  visibleActivityPresets,
} from '@/lib/activity-types';
import {
  isCardioReminderSupported,
  subscribeToCardioReminder,
  syncExistingCardioReminderSubscription,
  unsubscribeFromCardioReminder,
} from '@/lib/pwa/push-reminders';

const MANUAL_PRESETS = [
  'Yoga',
  'Biking',
  'Running',
  'Soccer',
  'Basketball',
  'Swimming',
  'Hiking',
  'Rowing',
];

function todayInputValue(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function normalizeDateInput(value: string | null): string | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T12:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10) === value ? value : null;
}

function initialActivityDate(): string {
  if (typeof window === 'undefined') return todayInputValue();
  const params = new URLSearchParams(window.location.search);
  return normalizeDateInput(params.get('date')) || todayInputValue();
}

function shiftDay(value: string, days: number): string {
  const date = new Date(`${value}T12:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

function formatDayHeading(value: string): string {
  const today = todayInputValue();
  if (value === today) return 'Today';
  if (value === shiftDay(today, -1)) return 'Yesterday';
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date(`${value}T12:00:00.000Z`));
}

function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (remaining === 0) return `${hours} hr`;
  return `${hours} hr ${remaining} min`;
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [activityDate, setActivityDate] = useState(initialActivityDate);

  // Tile picker state for the selected day.
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [details, setDetails] = useState<Record<string, string>>({});
  const [hasWorkoutSession, setHasWorkoutSession] = useState(false);
  const [dayLoading, setDayLoading] = useState(true);
  const [dayDirty, setDayDirty] = useState(false);
  const [daySaving, setDaySaving] = useState(false);
  const [daySaved, setDaySaved] = useState(false);
  const [dayError, setDayError] = useState<string | null>(null);

  // Detailed (timed) entry form.
  const [showManualForm, setShowManualForm] = useState(false);
  const [activityType, setActivityType] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [reminderSupported, setReminderSupported] = useState(false);
  const [reminderStatus, setReminderStatus] = useState<'idle' | 'enabled' | 'saving' | 'error'>('idle');
  const [reminderMessage, setReminderMessage] = useState<string | null>(null);

  const loadActivities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/activities?limit=50');
      if (!response.ok) throw new Error('Could not load activities.');
      const data = await response.json();
      setActivities(Array.isArray(data.activities) ? data.activities : []);
    } catch (loadError) {
      console.error('Error loading activities:', loadError);
      setError('Could not load activities.');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDay = useCallback(async (day: string) => {
    setDayLoading(true);
    setDayError(null);
    try {
      const response = await fetch(`/api/activities?date=${encodeURIComponent(day)}`);
      if (!response.ok) throw new Error('Could not load this day.');
      const data = await response.json();
      const dayActivities: ActivityLog[] = Array.isArray(data.activities) ? data.activities : [];

      setSelectedSlugs(Array.isArray(data.selectedSlugs) ? data.selectedSlugs : []);
      setHasWorkoutSession(Boolean(data.hasWorkoutSession));

      // Seed the "Which class?" style inputs from what is already saved.
      const seededDetails: Record<string, string> = {};
      for (const activity of dayActivities) {
        if (activity.source !== 'tile' || !activity.notes) continue;
        const preset = presetForActivityLabel(activity.activity_type);
        if (preset?.detailPrompt) seededDetails[preset.slug] = activity.notes;
      }
      setDetails(seededDetails);
      setDayDirty(false);
      setDaySaved(false);
    } catch (loadError) {
      console.error('Error loading day activities:', loadError);
      setDayError('Could not load this day.');
    } finally {
      setDayLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadActivities();
  }, [loadActivities]);

  useEffect(() => {
    void loadDay(activityDate);
  }, [activityDate, loadDay]);

  useEffect(() => {
    const supported = isCardioReminderSupported();
    setReminderSupported(supported);
    if (!supported || typeof window === 'undefined') return;

    let cancelled = false;
    void syncExistingCardioReminderSubscription()
      .then((result) => {
        if (cancelled) return;
        if (result.ok && result.synced) {
          setReminderStatus('enabled');
          setReminderMessage('Nightly reminders are on.');
          return;
        }
        // A browser with no push subscription but a server-side record means the
        // push service expired the subscription and reminders silently stopped.
        // Say so instead of looking indistinguishable from "never enabled".
        if (result.ok && !result.synced) {
          setReminderStatus('idle');
          if (result.hadServerSubscription) {
            setReminderMessage(
              'Reminders stopped because this device’s subscription expired. Tap Enable to restart them.'
            );
          }
          return;
        }
        if (!result.ok) {
          setReminderStatus('error');
          setReminderMessage(result.reason);
        }
      })
      .catch(() => {
        if (cancelled) return;
        setReminderStatus('error');
        setReminderMessage('Could not sync notification settings.');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const visiblePresets = useMemo(
    () => visibleActivityPresets({ hasWorkoutSession, selected: selectedSlugs }),
    [hasWorkoutSession, selectedSlugs]
  );

  const hiddenByWorkout = ACTIVITY_PRESETS.length - visiblePresets.length;

  const summary = useMemo(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const recent = activities.filter((activity) => new Date(activity.activity_date) >= thirtyDaysAgo);
    const totalMinutes = recent.reduce(
      (total, activity) => total + (activity.duration_minutes ?? 0),
      0
    );
    const topTypes = new Map<string, number>();
    for (const activity of recent) {
      topTypes.set(activity.activity_type, (topTypes.get(activity.activity_type) || 0) + 1);
    }
    const topActivity = Array.from(topTypes.entries()).sort((a, b) => b[1] - a[1])[0] || null;

    return {
      count: recent.length,
      totalMinutes,
      topActivity,
    };
  }, [activities]);

  const handleToggleTile = (slug: string) => {
    setSelectedSlugs((current) => toggleActivitySelection(current, slug));
    setDayDirty(true);
    setDaySaved(false);
  };

  const handleDetailChange = (slug: string, value: string) => {
    setDetails((current) => ({ ...current, [slug]: value }));
    setDayDirty(true);
    setDaySaved(false);
  };

  const handleSaveDay = async () => {
    setDaySaving(true);
    setDayError(null);
    try {
      const response = await fetch(`/api/activities?date=${encodeURIComponent(activityDate)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slugs: selectedSlugs, details }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Could not save activities.');

      setSelectedSlugs(Array.isArray(data.selectedSlugs) ? data.selectedSlugs : []);
      setDayDirty(false);
      setDaySaved(true);
      await loadActivities();
    } catch (saveError) {
      console.error('Error saving day activities:', saveError);
      setDayError(saveError instanceof Error ? saveError.message : 'Could not save activities.');
    } finally {
      setDaySaving(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityType,
          durationMinutes: durationMinutes === '' ? null : Number(durationMinutes),
          activityDate,
          notes,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Could not save activity.');
      }

      setActivities((current) => [data.activity, ...current]
        .sort((a, b) => b.activity_date.localeCompare(a.activity_date) || b.id - a.id)
        .slice(0, 50));
      setActivityType('');
      setDurationMinutes('');
      setNotes('');
      setSaved(true);
    } catch (saveError) {
      console.error('Error saving activity:', saveError);
      setError(saveError instanceof Error ? saveError.message : 'Could not save activity.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (activity: ActivityLog) => {
    setDeletingId(activity.id);
    setError(null);

    try {
      const response = await fetch(`/api/activities?id=${activity.id}`, { method: 'DELETE' });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error || 'Could not delete activity.');
      }
      setActivities((current) => current.filter((entry) => entry.id !== activity.id));
      await loadDay(activityDate);
    } catch (deleteError) {
      console.error('Error deleting activity:', deleteError);
      setError(deleteError instanceof Error ? deleteError.message : 'Could not delete activity.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEnableReminder = async () => {
    setReminderStatus('saving');
    setReminderMessage(null);
    const result = await subscribeToCardioReminder();
    if (result.ok) {
      setReminderStatus('enabled');
      setReminderMessage('Nightly reminders are on.');
      return;
    }
    setReminderStatus('error');
    setReminderMessage(result.reason);
  };

  const handleDisableReminder = async () => {
    setReminderStatus('saving');
    const result = await unsubscribeFromCardioReminder();
    if (result.ok) {
      setReminderStatus('idle');
      setReminderMessage('Nightly reminders are off.');
      return;
    }
    setReminderStatus('error');
    setReminderMessage(result.reason);
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-4 text-white">
      <main className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300">
              Activity
            </p>
            <h1 className="mt-2 text-3xl font-bold">What did you do?</h1>
          </div>
          <Link
            href="/"
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-200 transition-colors hover:bg-zinc-800"
          >
            Home
          </Link>
        </div>

        <section
          data-testid="activity-day-picker"
          className="rounded-lg border border-zinc-800 bg-zinc-900/70 p-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">{formatDayHeading(activityDate)}</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Pick everything that applies. Tap again to remove.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Previous day"
                onClick={() => setActivityDate((current) => shiftDay(current, -1))}
                className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm font-semibold text-zinc-200 transition-colors hover:bg-zinc-800"
              >
                ‹
              </button>
              <input
                type="date"
                aria-label="Activity date"
                value={activityDate}
                onChange={(event) => {
                  const next = normalizeDateInput(event.target.value);
                  if (next) setActivityDate(next);
                }}
                className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <button
                type="button"
                aria-label="Next day"
                onClick={() => setActivityDate((current) => shiftDay(current, 1))}
                className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm font-semibold text-zinc-200 transition-colors hover:bg-zinc-800"
              >
                ›
              </button>
            </div>
          </div>

          {dayLoading ? (
            <p className="mt-4 text-sm text-zinc-400">Loading this day...</p>
          ) : (
            <>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {visiblePresets.map((preset) => {
                  const isSelected = selectedSlugs.includes(preset.slug);
                  return (
                    <div key={preset.slug} className="flex flex-col gap-2">
                      <button
                        type="button"
                        aria-pressed={isSelected}
                        data-testid={`activity-tile-${preset.slug}`}
                        onClick={() => handleToggleTile(preset.slug)}
                        className={[
                          'flex h-24 flex-col items-center justify-center gap-2 rounded-xl border px-3 py-3 text-center transition-colors',
                          isSelected
                            ? 'border-emerald-500 bg-emerald-500/15 text-emerald-100'
                            : 'border-zinc-700 bg-zinc-950 text-zinc-300 hover:border-emerald-500/50 hover:text-emerald-200',
                        ].join(' ')}
                      >
                        <span aria-hidden className="text-2xl leading-none">
                          {preset.icon}
                        </span>
                        <span className="text-sm font-semibold leading-tight">{preset.label}</span>
                      </button>

                      {preset.detailPrompt && isSelected && (
                        <input
                          type="text"
                          aria-label={preset.detailPrompt}
                          placeholder={preset.detailPrompt}
                          maxLength={500}
                          value={details[preset.slug] || ''}
                          onChange={(event) => handleDetailChange(preset.slug, event.target.value)}
                          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {hiddenByWorkout > 0 && (
                <p className="mt-3 text-xs text-zinc-500">
                  Strength training is hidden because a Gymmer workout is already logged for this day.
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => void handleSaveDay()}
                  disabled={daySaving || !dayDirty}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {daySaving ? 'Saving...' : 'Save'}
                </button>
                {daySaved && !dayDirty && (
                  <span data-testid="day-saved" className="text-sm text-emerald-300">
                    Saved
                  </span>
                )}
                {!daySaved && !dayDirty && selectedSlugs.length > 0 && (
                  <span className="text-sm text-zinc-500">
                    {selectedSlugs.length} logged for this day
                  </span>
                )}
              </div>

              {dayError && <div className="mt-3 text-sm text-red-400">{dayError}</div>}
            </>
          )}
        </section>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.2fr]">
          <section className="space-y-4">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/70 p-5">
              <button
                type="button"
                onClick={() => setShowManualForm((current) => !current)}
                className="flex w-full items-center justify-between gap-3 text-left"
              >
                <span className="text-lg font-semibold">Add with details</span>
                <span className="text-sm text-zinc-400">{showManualForm ? 'Hide' : 'Show'}</span>
              </button>
              <p className="mt-1 text-sm text-zinc-400">
                For anything not on a tile, or when you want to record how long it took.
              </p>

              {showManualForm && (
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="activity-type" className="text-sm font-semibold text-zinc-200">
                      Activity
                    </label>
                    <input
                      id="activity-type"
                      list="activity-presets"
                      value={activityType}
                      onChange={(event) => setActivityType(event.target.value)}
                      placeholder="Yoga class, bike ride, soccer..."
                      maxLength={80}
                      required
                      className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                    <datalist id="activity-presets">
                      {MANUAL_PRESETS.map((preset) => (
                        <option key={preset} value={preset} />
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label htmlFor="duration-minutes" className="text-sm font-semibold text-zinc-200">
                      Minutes <span className="font-normal text-zinc-500">(optional)</span>
                    </label>
                    <input
                      id="duration-minutes"
                      type="number"
                      min={1}
                      max={1440}
                      value={durationMinutes}
                      onChange={(event) => setDurationMinutes(event.target.value)}
                      className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label htmlFor="activity-notes" className="text-sm font-semibold text-zinc-200">
                      Notes
                    </label>
                    <textarea
                      id="activity-notes"
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      rows={3}
                      maxLength={500}
                      placeholder="Optional"
                      className="mt-2 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="submit"
                      disabled={saving}
                      className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {saving ? 'Saving...' : 'Log Activity'}
                    </button>
                    {saved && <span className="text-sm text-emerald-300">Saved</span>}
                  </div>

                  {error && <div className="text-sm text-red-400">{error}</div>}
                </form>
              )}
            </div>

            <div className="rounded-lg border border-zinc-800 bg-zinc-900/70 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold">Nightly Reminder</h2>
                  <p className="mt-1 text-sm text-zinc-400">
                    10:00 PM reminder opens this page.
                  </p>
                </div>
                {reminderStatus === 'enabled' ? (
                  <button
                    type="button"
                    onClick={() => void handleDisableReminder()}
                    className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm font-semibold text-zinc-200 transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Turn Off
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => void handleEnableReminder()}
                    disabled={!reminderSupported || reminderStatus === 'saving'}
                    className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {reminderStatus === 'saving' ? 'Saving...' : 'Enable'}
                  </button>
                )}
              </div>
              {!reminderSupported && (
                <p className="mt-3 text-sm text-amber-300">
                  Push reminders are not available in this browser.
                </p>
              )}
              {reminderMessage && (
                <p className={[
                  'mt-3 text-sm',
                  reminderStatus === 'error' ? 'text-red-400' : 'text-emerald-300'
                ].join(' ')}>
                  {reminderMessage}
                </p>
              )}
            </div>
          </section>

          <section className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/70 p-4">
                <p className="text-xs text-zinc-400">Last 30 days</p>
                <p className="mt-2 text-3xl font-semibold">{summary.count}</p>
              </div>
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/70 p-4">
                <p className="text-xs text-zinc-400">Timed minutes</p>
                <p className="mt-2 text-3xl font-semibold">{summary.totalMinutes}</p>
              </div>
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/70 p-4">
                <p className="text-xs text-zinc-400">Top activity</p>
                <p className="mt-2 truncate text-lg font-semibold">
                  {summary.topActivity ? summary.topActivity[0] : 'None'}
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-zinc-800 bg-zinc-900/70 p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">Recent Activities</h2>
                <button
                  type="button"
                  onClick={() => void loadActivities()}
                  disabled={loading}
                  className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Refresh
                </button>
              </div>

              {loading ? (
                <p className="mt-4 text-sm text-zinc-400">Loading activities...</p>
              ) : activities.length === 0 ? (
                <p className="mt-4 text-sm text-zinc-400">No activities logged yet.</p>
              ) : (
                <div className="mt-4 space-y-3">
                  {activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-base font-semibold text-white">
                            {activity.activity_type}
                          </h3>
                          <p className="mt-1 text-sm text-zinc-400">
                            {formatDate(activity.activity_date)}
                            {activity.duration_minutes !== null
                              ? ` - ${formatMinutes(activity.duration_minutes)}`
                              : ''}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => void handleDelete(activity)}
                          disabled={deletingId === activity.id}
                          className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition-colors hover:border-red-500/60 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {deletingId === activity.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                      {activity.notes && (
                        <p className="mt-3 whitespace-pre-wrap text-sm text-zinc-300">
                          {activity.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
