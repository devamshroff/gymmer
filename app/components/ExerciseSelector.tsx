'use client';

import { useState, useEffect } from 'react';
import QuickExerciseForm from './QuickExerciseForm';
import { MUSCLE_GROUP_ORDER, formatTypeLabel, parseTagJson, MUSCLE_GROUP_TAGS } from '@/lib/muscle-tags';

interface Exercise {
  id: number;
  name: string;
  video_url: string | null;
  tips: string | null;
  equipment: string | null;
  is_bodyweight?: number | null;
  muscle_groups?: string | null;
}

interface ExerciseSelectorProps {
  onSelect: (exercise: Exercise) => void;
  onCancel: () => void;
  title?: string;
}

const FALLBACK_GROUP = 'other';

function getMuscleGroups(exercise: Exercise): string[] {
  return parseTagJson(exercise.muscle_groups, MUSCLE_GROUP_TAGS);
}

function groupExercisesByType(items: Exercise[]): Array<{ type: string; exercises: Exercise[] }> {
  const grouped = new Map<string, Exercise[]>();
  const sorted = [...items].sort((a, b) => a.name.localeCompare(b.name));

  for (const exercise of sorted) {
    const tags = getMuscleGroups(exercise);
    const keys = tags.length > 0 ? tags : [FALLBACK_GROUP];
    for (const key of keys) {
      const list = grouped.get(key);
      if (list) {
        list.push(exercise);
      } else {
        grouped.set(key, [exercise]);
      }
    }
  }

  const order = [...MUSCLE_GROUP_ORDER, FALLBACK_GROUP];
  const keys = Array.from(grouped.keys()).sort((a, b) => {
    const aIndex = order.indexOf(a);
    const bIndex = order.indexOf(b);
    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  return keys.map((key) => ({ type: key, exercises: grouped.get(key) || [] }));
}

export default function ExerciseSelector({ onSelect, onCancel, title }: ExerciseSelectorProps) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const response = await fetch('/api/exercises');
      const data = await response.json();
      setExercises(data.exercises);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExercise = async (exerciseData: any) => {
    try {
      const response = await fetch('/api/exercises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exerciseData)
      });

      if (!response.ok) {
        throw new Error('Failed to create exercise');
      }

      const data = await response.json();

      // Fetch updated list
      await fetchExercises();

      // Find the newly created exercise and select it
      const newExercise = exercises.find(e => e.id === data.id) || {
        id: data.id,
        name: exerciseData.name,
        video_url: exerciseData.videoUrl || null,
        tips: exerciseData.tips || null,
        equipment: exerciseData.equipment || null,
        is_bodyweight: typeof data.is_bodyweight === 'number' ? data.is_bodyweight : null
      };

      onSelect(newExercise);
    } catch (error) {
      console.error('Error creating exercise:', error);
      alert('Failed to create exercise. Please try again.');
    }
  };

  const filteredExercises = exercises.filter((exercise) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const tagText = getMuscleGroups(exercise).join(' ').toLowerCase();
    return exercise.name.toLowerCase().includes(query) || tagText.includes(query);
  });
  const groupedExercises = groupExercisesByType(filteredExercises);

  if (showCreateForm) {
    return (
      <QuickExerciseForm
        onSubmit={handleCreateExercise}
        onCancel={() => setShowCreateForm(false)}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-800 rounded-lg p-6 max-w-3xl w-full max-h-[90vh] flex flex-col border-2 border-blue-600">
        <h2 className="text-2xl font-bold text-white mb-4">{title || 'Select Exercise'}</h2>

        {/* Search & Create */}
        <div className="mb-4 space-y-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exercises or muscle groups..."
            className="w-full bg-zinc-900 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />

          <button
            onClick={() => setShowCreateForm(true)}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold transition-colors"
          >
            + Create New Exercise
          </button>
        </div>

        {/* Exercise List */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-2">
          {loading ? (
            <div className="text-center text-zinc-400 py-8">Loading exercises...</div>
          ) : groupedExercises.length === 0 ? (
            <div className="text-center text-zinc-400 py-8">
              {searchQuery ? 'No exercises found' : 'No exercises available'}
            </div>
          ) : (
            <div className="space-y-4">
              {groupedExercises.map(({ type, exercises: groupExercises }) => (
                <div key={type} className="space-y-2">
                  <div className="text-xs uppercase tracking-wide text-zinc-400">
                    {formatTypeLabel(type)}
                  </div>
                  {groupExercises.map((exercise) => (
                    <button
                      key={exercise.id}
                      onClick={() => onSelect(exercise)}
                      className="w-full bg-zinc-900 hover:bg-zinc-700 text-left p-4 rounded-lg transition-colors border-2 border-zinc-700 hover:border-blue-500"
                    >
                      <div>
                        <div className="text-white font-semibold">{exercise.name}</div>
                        {exercise.equipment && (
                          <div className="text-zinc-400 text-sm mt-1">{exercise.equipment}</div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cancel Button */}
        <button
          onClick={onCancel}
          className="w-full bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-lg font-semibold transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
