'use client';

import { useState, useEffect } from 'react';
import QuickExerciseForm from './QuickExerciseForm';
import { MUSCLE_GROUP_ORDER, formatTypeLabel, parseTagJson, MUSCLE_GROUP_TAGS } from '@/lib/muscle-tags';
import type {
  FreeWorkoutRecommendedExercise,
  FreeWorkoutRecommendedSuperset,
} from '@/lib/session-workout';

interface Exercise {
  id: number;
  name: string;
  video_url: string | null;
  tips: string | null;
  equipment: string | null;
  is_bodyweight?: number | null;
  is_machine?: number | null;
  primary_metric?: string | null;
  metric_unit?: string | null;
  muscle_groups?: string | null;
}

interface ExerciseSelectorProps {
  onSelect: (exercise: Exercise) => void;
  onSelectSuperset?: (exercise1: Exercise, exercise2: Exercise) => void;
  onCancel: () => void;
  onBuildCustomSuperset?: () => void;
  recommendedExercises?: FreeWorkoutRecommendedExercise[];
  recommendedSupersets?: FreeWorkoutRecommendedSuperset[];
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

function normalizeRecommendedExercise(exercise: FreeWorkoutRecommendedExercise): Exercise {
  return {
    id: exercise.id,
    name: exercise.name,
    video_url: exercise.video_url ?? null,
    tips: exercise.tips ?? null,
    equipment: exercise.equipment ?? null,
    is_bodyweight: exercise.is_bodyweight ?? null,
    is_machine: exercise.is_machine ?? null,
    primary_metric: exercise.primary_metric ?? null,
    metric_unit: exercise.metric_unit ?? null,
    muscle_groups: exercise.muscle_groups ?? null,
  };
}

function RecommendationMeta({
  historyCount,
  recentCount,
}: {
  historyCount?: number | null;
  recentCount?: number | null;
}) {
  if (!historyCount && !recentCount) return null;
  return (
    <div className="mt-1 text-xs text-zinc-400">
      {typeof recentCount === 'number' && recentCount > 0 ? `${recentCount} recent` : null}
      {typeof recentCount === 'number' && recentCount > 0 && typeof historyCount === 'number' && historyCount > 0
        ? ' · '
        : null}
      {typeof historyCount === 'number' && historyCount > 0 ? `${historyCount} total` : null}
    </div>
  );
}

export default function ExerciseSelector({
  onSelect,
  onSelectSuperset,
  onCancel,
  onBuildCustomSuperset,
  recommendedExercises = [],
  recommendedSupersets = [],
  title,
}: ExerciseSelectorProps) {
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
        is_bodyweight: typeof data.is_bodyweight === 'number' ? data.is_bodyweight : null,
        primary_metric: typeof data.primary_metric === 'string' ? data.primary_metric : null,
        metric_unit: typeof data.metric_unit === 'string' ? data.metric_unit : null
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
  const showRecommendations = !searchQuery;
  const showRecommendedExercises = showRecommendations && recommendedExercises.length > 0;
  const showRecommendedSupersets =
    showRecommendations && Boolean(onSelectSuperset) && recommendedSupersets.length > 0;

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
      <div className="bg-zinc-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] flex flex-col border-2 border-blue-600">
        <h2 className="text-2xl font-bold text-white mb-4">{title || 'Select Exercise'}</h2>

        {/* Search & quick actions */}
        <div className="mb-4 space-y-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exercises or muscle groups..."
            className="w-full bg-zinc-900 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              onClick={() => setShowCreateForm(true)}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold transition-colors"
            >
              + Create New Exercise
            </button>
            {onBuildCustomSuperset && (
              <button
                onClick={onBuildCustomSuperset}
                className="w-full bg-purple-700 hover:bg-purple-600 text-white py-3 rounded-lg font-bold transition-colors"
              >
                + Build Custom Superset
              </button>
            )}
          </div>
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
              {(showRecommendedExercises || showRecommendedSupersets) && (
                <div className="grid gap-4 xl:grid-cols-2">
                  {showRecommendedExercises && (
                    <div className="space-y-2 rounded-xl border border-emerald-900/60 bg-zinc-900/50 p-4">
                      <div className="text-xs uppercase tracking-wide text-emerald-300">Most Popular Exercises</div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {recommendedExercises.map((exercise) => (
                          <button
                            key={`recommended-exercise-${exercise.id}`}
                            onClick={() => onSelect(normalizeRecommendedExercise(exercise))}
                            className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-left transition-colors hover:border-emerald-500 hover:bg-zinc-800"
                          >
                            <div className="text-white font-semibold">{exercise.name}</div>
                            {exercise.equipment && (
                              <div className="mt-1 text-sm text-zinc-400">{exercise.equipment}</div>
                            )}
                            <RecommendationMeta
                              historyCount={exercise.history_count}
                              recentCount={exercise.recent_count}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {showRecommendedSupersets && (
                    <div className="space-y-2 rounded-xl border border-purple-900/60 bg-zinc-900/50 p-4">
                      <div className="text-xs uppercase tracking-wide text-purple-300">Common Pairings</div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {recommendedSupersets.map((pair, index) => (
                          <button
                            key={`recommended-superset-${pair.exercise1.id}-${pair.exercise2.id}-${index}`}
                            onClick={() => onSelectSuperset?.(
                              normalizeRecommendedExercise(pair.exercise1),
                              normalizeRecommendedExercise(pair.exercise2)
                            )}
                            className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-left transition-colors hover:border-purple-500 hover:bg-zinc-800"
                          >
                            <div className="text-white font-semibold">
                              {pair.exercise1.name} + {pair.exercise2.name}
                            </div>
                            <div className="mt-1 text-sm text-zinc-400">
                              {pair.recentCount > 0 ? `${pair.recentCount} recent` : 'No recent pairings'} · {pair.totalCount} total
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {groupedExercises.map(({ type, exercises: groupExercises }) => (
                <div key={type} className="space-y-2">
                  <div className="text-xs uppercase tracking-wide text-zinc-400">
                    {showRecommendations ? `All Exercises · ${formatTypeLabel(type)}` : formatTypeLabel(type)}
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                    {groupExercises.map((exercise) => (
                      <button
                        key={exercise.id}
                        onClick={() => onSelect(exercise)}
                        className="rounded-lg border-2 border-zinc-700 bg-zinc-900 p-3 text-left transition-colors hover:border-blue-500 hover:bg-zinc-700"
                      >
                        <div className="text-white font-semibold">{exercise.name}</div>
                        {exercise.equipment && (
                          <div className="mt-1 text-sm text-zinc-400">{exercise.equipment}</div>
                        )}
                      </button>
                    ))}
                  </div>
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
