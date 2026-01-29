'use client';

import { useState } from 'react';

export function AddButton({
  onClick,
  label,
  color
}: {
  onClick: () => void;
  label: string;
  color: 'green' | 'blue' | 'orange';
}) {
  const colorClasses = {
    green: 'bg-green-900/50 hover:bg-green-800/50',
    blue: 'bg-blue-900/50 hover:bg-blue-800/50',
    orange: 'bg-orange-900/50 hover:bg-orange-800/50'
  };

  return (
    <button
      onClick={onClick}
      className={`w-full py-2 text-sm rounded ${colorClasses[color]} text-white transition-colors mb-2`}
    >
      + {label}
    </button>
  );
}

export function ExerciseAddRow({
  onAddExercise,
  onAddSuperset
}: {
  onAddExercise: () => void;
  onAddSuperset: () => void;
}) {
  return (
    <div className="flex gap-2 mb-2">
      <button
        onClick={onAddExercise}
        className="flex-1 py-2 text-sm rounded bg-orange-900/60 text-white hover:bg-orange-800/60 transition-colors"
      >
        + Exercise
      </button>
      <button
        onClick={onAddSuperset}
        className="flex-1 py-2 text-sm rounded bg-purple-900/60 text-white hover:bg-purple-800/60 transition-colors"
      >
        + Superset
      </button>
    </div>
  );
}

export function StretchItem({
  stretch,
  onDelete
}: {
  stretch: { name: string; duration?: string };
  onDelete: () => void;
}) {
  return (
    <div className="bg-zinc-800 rounded-lg p-4 border-2 border-zinc-700 mb-2 flex items-center justify-between">
      <div>
        <div className="text-white font-semibold">{stretch.name}</div>
        {stretch.duration && (
          <div className="text-zinc-400 text-sm">{stretch.duration}</div>
        )}
      </div>
      <button
        onClick={onDelete}
        className="text-red-500 hover:text-red-400 p-2"
        title="Delete"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}

export function ExerciseItem({
  exercise,
  onDelete
}: {
  exercise: { exercise_name: string; exercise_type: string; b2b_partner_name: string | null };
  onDelete: () => void;
}) {
  const isSuperset = exercise.exercise_type === 'b2b';

  return (
    <div className={`bg-zinc-800 rounded-lg p-4 border-2 ${isSuperset ? 'border-purple-700' : 'border-zinc-700'} mb-2`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {isSuperset && (
            <div className="text-purple-400 text-xs font-bold mb-2">SUPERSET</div>
          )}
          <div className="text-white font-semibold">{exercise.exercise_name}</div>
          {isSuperset && exercise.b2b_partner_name && (
            <>
              <div className="text-purple-400 text-sm my-1">+</div>
              <div className="text-white font-semibold">{exercise.b2b_partner_name}</div>
            </>
          )}
        </div>
        <button
          onClick={onDelete}
          className="text-red-500 hover:text-red-400 p-2"
          title="Delete"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export function CardioItem({
  cardio,
  onDelete
}: {
  cardio: { type: string; duration?: string; intensity?: string; tips?: string };
  onDelete?: () => void;
}) {
  return (
    <div className="bg-zinc-800 rounded-lg p-4 border-2 border-red-900 mb-2">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-white font-semibold text-lg">{cardio.type}</div>
          {cardio.duration && (
            <div className="text-zinc-400 text-sm">{cardio.duration}</div>
          )}
          {cardio.intensity && (
            <div className="text-zinc-500 text-sm">{cardio.intensity}</div>
          )}
          {cardio.tips && (
            <div className="text-zinc-500 text-xs mt-1">{cardio.tips}</div>
          )}
        </div>
        {onDelete && (
          <button
            onClick={onDelete}
            className="text-red-500 hover:text-red-400 p-2"
            title="Delete"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export function CardioForm({
  onSave,
  onCancel
}: {
  onSave: (data: { type: string; duration: string; intensity: string; tips: string }) => void;
  onCancel: () => void;
}) {
  const [type, setType] = useState('');
  const [duration, setDuration] = useState('');
  const [intensity, setIntensity] = useState('');
  const [tips, setTips] = useState('');

  const handleSubmit = () => {
    if (!type.trim() || !duration.trim()) return;
    onSave({ type: type.trim(), duration: duration.trim(), intensity: intensity.trim(), tips: tips.trim() });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-800 rounded-lg p-6 max-w-md w-full border-2 border-red-600">
        <h2 className="text-2xl font-bold text-white mb-4">Add Cardio</h2>

        <div className="space-y-4 mb-6">
          <div>
            <label className="text-zinc-400 text-sm block mb-1">Type *</label>
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="e.g., Incline Walk, Bike, Stairmaster"
              className="w-full bg-zinc-900 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              autoFocus
            />
          </div>

          <div>
            <label className="text-zinc-400 text-sm block mb-1">Duration *</label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g., 15 min, 20 min"
              className="w-full bg-zinc-900 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="text-zinc-400 text-sm block mb-1">Intensity</label>
            <input
              type="text"
              value={intensity}
              onChange={(e) => setIntensity(e.target.value)}
              placeholder="e.g., 12% incline, 3.0 mph"
              className="w-full bg-zinc-900 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="text-zinc-400 text-sm block mb-1">Tips</label>
            <textarea
              value={tips}
              onChange={(e) => setTips(e.target.value)}
              placeholder="Optional tips..."
              rows={2}
              className="w-full bg-zinc-900 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!type.trim() || !duration.trim()}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold transition-colors"
          >
            Add Cardio
          </button>
        </div>
      </div>
    </div>
  );
}
