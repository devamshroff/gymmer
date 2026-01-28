'use client';

import { useState } from 'react';

interface QuickExerciseFormProps {
  onSubmit: (exercise: {
    name: string;
    videoUrl?: string;
    tips?: string;
    muscleGroups?: string[];
    equipment?: string;
    difficulty?: string;
  }) => Promise<void>;
  onCancel: () => void;
}

export default function QuickExerciseForm({ onSubmit, onCancel }: QuickExerciseFormProps) {
  const [name, setName] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [tips, setTips] = useState('');
  const [equipment, setEquipment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        videoUrl: videoUrl.trim() || undefined,
        tips: tips.trim() || undefined,
        equipment: equipment || undefined
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-800 rounded-lg p-6 max-w-md w-full border-2 border-green-600">
        <h2 className="text-2xl font-bold text-white mb-4">Create New Exercise</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Exercise Name - Required */}
          <div>
            <label className="text-zinc-300 text-sm font-semibold block mb-2">
              Exercise Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Barbell Bench Press"
              className="w-full bg-zinc-900 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              autoFocus
            />
          </div>

          {/* Equipment - Optional */}
          <div>
            <label className="text-zinc-300 text-sm font-semibold block mb-2">
              Equipment
            </label>
            <select
              value={equipment}
              onChange={(e) => setEquipment(e.target.value)}
              className="w-full bg-zinc-900 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em',
                paddingRight: '2.5rem'
              }}
            >
              <option value="">Select equipment (optional)</option>
              <option value="Barbell">Barbell</option>
              <option value="Dumbbells">Dumbbells</option>
              <option value="Bodyweight">Bodyweight</option>
              <option value="Machine">Machine</option>
              <option value="Cable">Cable</option>
              <option value="Bands">Bands</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Video URL - Optional */}
          <div>
            <label className="text-zinc-300 text-sm font-semibold block mb-2">
              Video URL
            </label>
            <p className="text-zinc-500 text-xs mb-2">
              If left empty, will default to YouTube search for "{name || 'exercise name'}"
            </p>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/..."
              className="w-full bg-zinc-900 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Tips - Optional */}
          <div>
            <label className="text-zinc-300 text-sm font-semibold block mb-2">
              Tips
            </label>
            <textarea
              value={tips}
              onChange={(e) => setTips(e.target.value)}
              placeholder="Form tips, cues, etc."
              rows={3}
              className="w-full bg-zinc-900 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>

          {/* Buttons */}
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
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold transition-colors"
            >
              {submitting ? 'Creating...' : 'Create & Select'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
