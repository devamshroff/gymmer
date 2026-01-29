'use client';

import { useEffect, useState } from 'react';
import Header from '@/app/components/Header';

export default function GoalsPage() {
  const [goals, setGoals] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    async function fetchGoals() {
      try {
        const response = await fetch('/api/goals');
        if (!response.ok) throw new Error('Failed to load goals');
        const data = await response.json();
        setGoals(data.goals || '');
      } catch (error) {
        console.error('Error fetching goals:', error);
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchGoals();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus('idle');
    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goals }),
      });
      if (!response.ok) throw new Error('Failed to save');
      setSaveStatus('saved');
    } catch (error) {
      console.error('Error saving goals:', error);
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 p-4 text-white">
      <div className="mx-auto max-w-2xl">
        <Header />
        <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-6">
          <h1 className="text-2xl font-bold mb-2">Workout Goals</h1>
          <p className="text-sm text-zinc-300 mb-4">
            What are your fitness goals? Share goals like strength, hypertrophy, rehab focus, equipment limits, or weekly targets.
            We&apos;ll use this for AI-assisted routines and post-workout reports.
          </p>
          {loadError && (
            <div className="mb-3 text-sm text-red-400">Could not load goals.</div>
          )}

          <label htmlFor="goals" className="text-sm font-semibold text-zinc-200">
            Goals & preferences
          </label>
          <textarea
            id="goals"
            rows={8}
            value={goals}
            onChange={(event) => setGoals(event.target.value)}
            disabled={loading || saving}
            placeholder="Example: Build strength in squat/bench, avoid knee-heavy plyometrics, 4 days/week, focus on upper body hypertrophy."
            className="mt-2 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving || loading}
              className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-emerald-900"
            >
              {saving ? 'Saving...' : 'Save Goals'}
            </button>
            {saveStatus === 'saved' && (
              <span className="text-sm text-emerald-400">Saved</span>
            )}
            {saveStatus === 'error' && (
              <span className="text-sm text-red-400">Could not save goals.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
