'use client';

import { useState } from 'react';
import { STRETCH_MUSCLE_TAGS, formatTypeLabel } from '@/lib/muscle-tags';

interface QuickStretchFormProps {
  onSubmit: (stretch: {
    name: string;
    duration?: string;
    timerSeconds?: number;
    videoUrl?: string;
    tips?: string;
    muscleGroups?: string[];
  }) => Promise<void>;
  onCancel: () => void;
}

export default function QuickStretchForm({ onSubmit, onCancel }: QuickStretchFormProps) {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [tips, setTips] = useState('');
  const [muscleGroups, setMuscleGroups] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const durationValue = duration.trim();
    const durationSecondsRaw = durationValue ? Number(durationValue) : NaN;
    const durationSeconds = Number.isFinite(durationSecondsRaw) && durationSecondsRaw > 0
      ? Math.round(durationSecondsRaw)
      : undefined;
    const normalizedDuration = durationSeconds ? `${durationSeconds} seconds` : undefined;
    const parsedMuscleGroups = muscleGroups.map((entry) => entry.trim()).filter(Boolean);

    setSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        duration: normalizedDuration,
        timerSeconds: durationSeconds,
        videoUrl: videoUrl.trim() || undefined,
        tips: tips.trim() || undefined,
        muscleGroups: parsedMuscleGroups.length ? parsedMuscleGroups : undefined
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-800 rounded-lg p-6 max-w-md w-full border-2 border-blue-700">
        <h2 className="text-2xl font-bold text-white mb-4">Create New Stretch</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-zinc-300 text-sm font-semibold block mb-2">
              Stretch Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Hamstring Stretch"
              className="w-full bg-zinc-900 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="text-zinc-300 text-sm font-semibold block mb-2">
              Duration (seconds)
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g., 30"
              className="w-full bg-zinc-900 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="text-zinc-300 text-sm font-semibold block mb-2">
              Muscle Groups <span className="text-zinc-500">(up to 2)</span>
            </label>
            <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2">
              {muscleGroups.length === 0 ? (
                <span className="text-zinc-500 text-sm">Select muscle groups below</span>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {muscleGroups.map((group) => (
                  <button
                    key={group}
                    type="button"
                    onClick={() => setMuscleGroups((prev) => prev.filter((tag) => tag !== group))}
                    className="inline-flex items-center gap-1 rounded-full border border-blue-600/40 bg-blue-700/30 px-3 py-1 text-xs font-semibold text-blue-100 transition hover:border-blue-400 hover:bg-blue-600/60"
                  >
                      {formatTypeLabel(group)}
                      <span aria-hidden>×</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-3">
              <div className="relative">
                <select
                  value=""
                  onChange={(e) => {
                    const nextValue = e.target.value;
                    if (!nextValue) return;
                    setMuscleGroups((prev) => {
                      if (prev.includes(nextValue)) return prev;
                      if (prev.length >= 2) return prev;
                      return [...prev, nextValue];
                    });
                    e.currentTarget.value = '';
                  }}
                  className="w-full appearance-none bg-zinc-900 text-white px-4 py-2 pr-10 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="" disabled>
                    Add a muscle group...
                  </option>
                  {STRETCH_MUSCLE_TAGS.filter((group) => group !== 'unknown').map((group) => (
                    <option key={group} value={group}>
                      {formatTypeLabel(group)}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
                  ▾
                </span>
              </div>
              <p className="mt-2 text-xs text-zinc-500">
                Choose up to two muscle groups.
              </p>
            </div>
          </div>

          <div>
            <label className="text-zinc-300 text-sm font-semibold block mb-2">
              Video URL
            </label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/..."
              className="w-full bg-zinc-900 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="text-zinc-300 text-sm font-semibold block mb-2">
              Tips
            </label>
            <textarea
              value={tips}
              onChange={(e) => setTips(e.target.value)}
              placeholder="Form tips, cues, etc."
              rows={3}
              className="w-full bg-zinc-900 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
            />
          </div>

          <p className="text-xs text-zinc-400">
            Duration, video URL, tips, and muscle groups will be auto-filled with AI if empty.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || submitting}
              className="bg-blue-700 hover:bg-blue-800 disabled:bg-blue-900 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold transition-colors"
            >
              {submitting ? 'Creating...' : 'Create & Select'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
