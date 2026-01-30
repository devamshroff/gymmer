'use client';

import { useState, useEffect } from 'react';
import QuickExerciseForm from './QuickExerciseForm';
import { EXERCISE_TYPE_ORDER, formatTypeLabel, parseTagJson } from '@/lib/muscle-tags';

interface Exercise {
  id: number;
  name: string;
  video_url: string | null;
  tips: string | null;
  equipment: string | null;
  is_bodyweight?: number | null;
  exercise_type?: string | null;
  muscle_groups?: string | null;
  is_custom: number;
}

interface SupersetSelectorProps {
  onSelect: (exercise1: Exercise, exercise2: Exercise) => void;
  onCancel: () => void;
}

const FALLBACK_GROUP = 'other';

function getExerciseTypeTags(exercise: Exercise): string[] {
  return parseTagJson(exercise.exercise_type);
}

function groupExercisesByType(items: Exercise[]): Array<{ type: string; exercises: Exercise[] }> {
  const grouped = new Map<string, Exercise[]>();
  const sorted = [...items].sort((a, b) => a.name.localeCompare(b.name));

  for (const exercise of sorted) {
    const tags = getExerciseTypeTags(exercise);
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

  const order = [...EXERCISE_TYPE_ORDER, FALLBACK_GROUP];
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

export default function SupersetSelector({ onSelect, onCancel }: SupersetSelectorProps) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [searchQuery1, setSearchQuery1] = useState('');
  const [searchQuery2, setSearchQuery2] = useState('');
  const [loading, setLoading] = useState(true);
  const [exercise1, setExercise1] = useState<Exercise | null>(null);
  const [exercise2, setExercise2] = useState<Exercise | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createTarget, setCreateTarget] = useState<'exercise1' | 'exercise2' | null>(null);

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
      await fetchExercises();

      const newExercise: Exercise = {
        id: data.id,
        name: exerciseData.name,
        video_url: exerciseData.videoUrl || null,
        tips: exerciseData.tips || null,
        equipment: exerciseData.equipment || null,
        is_custom: 1
      };

      if (createTarget === 'exercise1') {
        setExercise1(newExercise);
        setSearchQuery1('');
      } else if (createTarget === 'exercise2') {
        setExercise2(newExercise);
        setSearchQuery2('');
      }

      setShowCreateForm(false);
      setCreateTarget(null);
    } catch (error) {
      console.error('Error creating exercise:', error);
      alert('Failed to create exercise. Please try again.');
    }
  };

  const filteredExercises1 = exercises.filter((exercise) => {
    if (!searchQuery1) return true;
    const query = searchQuery1.toLowerCase();
    const tagText = getExerciseTypeTags(exercise).join(' ').toLowerCase();
    return exercise.name.toLowerCase().includes(query) || tagText.includes(query);
  });

  const filteredExercises2 = exercises.filter((exercise) => {
    if (!searchQuery2) return true;
    const query = searchQuery2.toLowerCase();
    const tagText = getExerciseTypeTags(exercise).join(' ').toLowerCase();
    return exercise.name.toLowerCase().includes(query) || tagText.includes(query);
  });

  const groupedExercises1 = groupExercisesByType(filteredExercises1);
  const groupedExercises2 = groupExercisesByType(filteredExercises2);

  const handleConfirm = () => {
    if (exercise1 && exercise2) {
      onSelect(exercise1, exercise2);
    }
  };

  if (showCreateForm) {
    return (
      <QuickExerciseForm
        onSubmit={handleCreateExercise}
        onCancel={() => {
          setShowCreateForm(false);
          setCreateTarget(null);
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] flex flex-col border-2 border-purple-600">
        <h2 className="text-2xl font-bold text-white mb-4">Create Superset</h2>
        <p className="text-zinc-400 text-sm mb-4">Select two exercises to pair together</p>

        <div className="flex-1 overflow-hidden flex gap-4 mb-4">
          {/* Exercise 1 Selection */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="mb-2">
              <div className="text-purple-400 text-sm font-bold mb-2">Exercise 1</div>
              {exercise1 ? (
                <div className="bg-purple-900/30 border-2 border-purple-500 rounded-lg p-3 flex items-center justify-between">
                  <span className="text-white font-semibold">{exercise1.name}</span>
                  <button
                    onClick={() => setExercise1(null)}
                    className="text-purple-300 hover:text-white text-sm"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={searchQuery1}
                    onChange={(e) => setSearchQuery1(e.target.value)}
                    placeholder="Search exercises or types..."
                    className="w-full bg-zinc-900 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setCreateTarget('exercise1');
                      setShowCreateForm(true);
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-semibold transition-colors"
                  >
                    + Create New Exercise
                  </button>
                </div>
              )}
            </div>

            {!exercise1 && (
              <div className="flex-1 overflow-y-auto space-y-2">
                {loading ? (
                  <div className="text-center text-zinc-400 py-4">Loading...</div>
                ) : groupedExercises1.length === 0 ? (
                  <div className="text-center text-zinc-400 py-4">No exercises found</div>
                ) : (
                  <div className="space-y-4">
                    {groupedExercises1.map(({ type, exercises: groupExercises }) => (
                      <div key={type} className="space-y-2">
                        <div className="text-[10px] uppercase tracking-wide text-zinc-400">
                          {formatTypeLabel(type)}
                        </div>
                        {groupExercises.map((exercise) => (
                          <button
                            key={exercise.id}
                            onClick={() => setExercise1(exercise)}
                            className="w-full bg-zinc-900 hover:bg-zinc-700 text-left p-3 rounded-lg transition-colors border border-zinc-700 hover:border-purple-500"
                          >
                            <div className="text-white text-sm font-semibold">{exercise.name}</div>
                            {exercise.equipment && (
                              <div className="text-zinc-400 text-xs mt-1">{exercise.equipment}</div>
                            )}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center">
            <div className="text-purple-400 text-2xl font-bold">+</div>
          </div>

          {/* Exercise 2 Selection */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="mb-2">
              <div className="text-purple-400 text-sm font-bold mb-2">Exercise 2</div>
              {exercise2 ? (
                <div className="bg-purple-900/30 border-2 border-purple-500 rounded-lg p-3 flex items-center justify-between">
                  <span className="text-white font-semibold">{exercise2.name}</span>
                  <button
                    onClick={() => setExercise2(null)}
                    className="text-purple-300 hover:text-white text-sm"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={searchQuery2}
                    onChange={(e) => setSearchQuery2(e.target.value)}
                    placeholder="Search exercises or types..."
                    className="w-full bg-zinc-900 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    onClick={() => {
                      setCreateTarget('exercise2');
                      setShowCreateForm(true);
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-semibold transition-colors"
                  >
                    + Create New Exercise
                  </button>
                </div>
              )}
            </div>

            {!exercise2 && (
              <div className="flex-1 overflow-y-auto space-y-2">
                {loading ? (
                  <div className="text-center text-zinc-400 py-4">Loading...</div>
                ) : groupedExercises2.length === 0 ? (
                  <div className="text-center text-zinc-400 py-4">No exercises found</div>
                ) : (
                  <div className="space-y-4">
                    {groupedExercises2.map(({ type, exercises: groupExercises }) => (
                      <div key={type} className="space-y-2">
                        <div className="text-[10px] uppercase tracking-wide text-zinc-400">
                          {formatTypeLabel(type)}
                        </div>
                        {groupExercises.map((exercise) => (
                          <button
                            key={exercise.id}
                            onClick={() => setExercise2(exercise)}
                            className="w-full bg-zinc-900 hover:bg-zinc-700 text-left p-3 rounded-lg transition-colors border border-zinc-700 hover:border-purple-500"
                          >
                            <div className="text-white text-sm font-semibold">{exercise.name}</div>
                            {exercise.equipment && (
                              <div className="text-zinc-400 text-xs mt-1">{exercise.equipment}</div>
                            )}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!exercise1 || !exercise2}
            className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold transition-colors"
          >
            Add Superset
          </button>
        </div>
      </div>
    </div>
  );
}
