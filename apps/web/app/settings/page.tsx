'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  DEFAULT_HEIGHT_UNIT,
  DEFAULT_WEIGHT_UNIT,
  normalizeHeightUnit,
  normalizeWeightUnit,
} from '@/lib/units';
import type { HeightUnit, WeightUnit } from '@/lib/units';

export default function SettingsPage() {
  const [restTimeSeconds, setRestTimeSeconds] = useState('60');
  const [supersetRestSeconds, setSupersetRestSeconds] = useState('15');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>(DEFAULT_WEIGHT_UNIT);
  const [heightUnit, setHeightUnit] = useState<HeightUnit>(DEFAULT_HEIGHT_UNIT);
  const [timerSoundEnabled, setTimerSoundEnabled] = useState(true);
  const [timerVibrateEnabled, setTimerVibrateEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const [loadError, setLoadError] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch('/api/user/settings');
        if (response.ok) {
          const settingsData = await response.json();
          if (settingsData?.restTimeSeconds !== undefined) {
            setRestTimeSeconds(String(settingsData.restTimeSeconds));
          }
          if (settingsData?.supersetRestSeconds !== undefined) {
            setSupersetRestSeconds(String(settingsData.supersetRestSeconds));
          }
          if (settingsData?.weightUnit !== undefined) {
            setWeightUnit(normalizeWeightUnit(settingsData.weightUnit));
          }
          if (settingsData?.heightUnit !== undefined) {
            setHeightUnit(normalizeHeightUnit(settingsData.heightUnit));
          }
          if (settingsData?.timerSoundEnabled !== undefined) {
            setTimerSoundEnabled(Boolean(settingsData.timerSoundEnabled));
          }
          if (settingsData?.timerVibrateEnabled !== undefined) {
            setTimerVibrateEnabled(Boolean(settingsData.timerVibrateEnabled));
          }
        } else {
          setLoadError(true);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus('idle');
    setValidationError(null);

    const restSeconds = Number(restTimeSeconds);
    const supersetSeconds = Number(supersetRestSeconds);

    if (!Number.isFinite(restSeconds) || restSeconds < 0) {
      setValidationError('Rest time must be a non-negative number.');
      setSaving(false);
      return;
    }

    if (!Number.isFinite(supersetSeconds) || supersetSeconds < 0) {
      setValidationError('Superset rest time must be a non-negative number.');
      setSaving(false);
      return;
    }

    try {
      const response = await fetch('/api/user/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restTimeSeconds: restSeconds,
          supersetRestSeconds: supersetSeconds,
          weightUnit,
          heightUnit,
          timerSoundEnabled,
          timerVibrateEnabled,
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save');
      }

      setSaveStatus('saved');
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 p-4 text-white">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold mb-2">Settings</h1>
              <p className="text-sm text-zinc-300">
                Adjust rest timers and measurement units. Set a value to 0 seconds to skip the timer between sets.
              </p>
            </div>
            <Link
              href="/profile"
              className="mt-1 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs text-zinc-300 transition-colors hover:bg-zinc-800"
            >
              Back to profile
            </Link>
          </div>

          {loadError && (
            <div className="mt-4 text-sm text-red-400">Could not load settings.</div>
          )}

          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="rest-time" className="text-sm font-semibold text-zinc-200">
                Rest time between sets (seconds)
              </label>
              <input
                id="rest-time"
                type="number"
                min="0"
                value={restTimeSeconds}
                onChange={(event) => setRestTimeSeconds(event.target.value)}
                disabled={loading || saving}
                className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label htmlFor="superset-rest-time" className="text-sm font-semibold text-zinc-200">
                Rest time between superset rounds (seconds)
              </label>
              <input
                id="superset-rest-time"
                type="number"
                min="0"
                value={supersetRestSeconds}
                onChange={(event) => setSupersetRestSeconds(event.target.value)}
                disabled={loading || saving}
                className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <div className="text-sm font-semibold text-zinc-200">Timer feedback</div>
              <div className="mt-2 space-y-2">
                <label className="flex items-center gap-2 text-sm text-zinc-200">
                  <input
                    type="checkbox"
                    checked={timerSoundEnabled}
                    onChange={(event) => setTimerSoundEnabled(event.target.checked)}
                    disabled={loading || saving}
                  />
                  Play sound when timers end
                </label>
                <label className="flex items-center gap-2 text-sm text-zinc-200">
                  <input
                    type="checkbox"
                    checked={timerVibrateEnabled}
                    onChange={(event) => setTimerVibrateEnabled(event.target.checked)}
                    disabled={loading || saving}
                  />
                  Buzz when timers end
                </label>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="weight-unit" className="text-sm font-semibold text-zinc-200">
                  Weight unit
                </label>
                <select
                  id="weight-unit"
                  value={weightUnit}
                  onChange={(event) => setWeightUnit(event.target.value as WeightUnit)}
                  disabled={loading || saving}
                  className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="lbs">lbs</option>
                  <option value="kg">kg</option>
                </select>
              </div>

              <div>
                <label htmlFor="height-unit" className="text-sm font-semibold text-zinc-200">
                  Height unit
                </label>
                <select
                  id="height-unit"
                  value={heightUnit}
                  onChange={(event) => setHeightUnit(event.target.value as HeightUnit)}
                  disabled={loading || saving}
                  className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="in">in</option>
                  <option value="cm">cm</option>
                </select>
              </div>
            </div>
          </div>

          {validationError && (
            <div className="mt-3 text-sm text-red-400">{validationError}</div>
          )}

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving || loading}
              className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:opacity-70"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
            {saveStatus === 'saved' && (
              <span className="text-sm text-emerald-400">Saved</span>
            )}
            {saveStatus === 'error' && (
              <span className="text-sm text-red-400">Could not save settings.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
