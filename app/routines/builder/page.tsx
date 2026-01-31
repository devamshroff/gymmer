'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ExerciseSelector from '@/app/components/ExerciseSelector';
import SupersetSelector from '@/app/components/SupersetSelector';
import { Card } from '@/app/components/SharedUi';
import { EXERCISE_TYPES } from '@/lib/constants';

function RoutineBuilderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const existingId = searchParams.get('id');

  const [routineName, setRoutineName] = useState('');
  const [routineId, setRoutineId] = useState<number | null>(null);
  const [exercises, setExercises] = useState<any[]>([]);
  const [creating, setCreating] = useState(false);
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [showSupersetSelector, setShowSupersetSelector] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingExisting, setLoadingExisting] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);

  // Load existing routine if ID is provided
  useEffect(() => {
    if (existingId) {
      loadExistingRoutine(existingId);
    }
  }, [existingId]);

  const loadExistingRoutine = async (id: string) => {
    setLoadingExisting(true);
    try {
      const response = await fetch(`/api/routines/${id}`);
      if (!response.ok) throw new Error('Failed to load routine');

      const data = await response.json();
      setRoutineId(parseInt(id));
      setRoutineName(data.routine.name);

      // Convert exercises to local format
      const loadedExercises = data.exercises.map((ex: any) => {
        if (ex.exercise_id2) {
          return {
            type: EXERCISE_TYPES.b2b,
            exercise1: { id: ex.exercise_id1, name: ex.exercise_name },
            exercise2: { id: ex.exercise_id2, name: ex.exercise2_name }
          };
        }
        return { id: ex.exercise_id1, name: ex.exercise_name };
      });
      setExercises(loadedExercises);
    } catch (error) {
      console.error('Error loading routine:', error);
      setError('Failed to load routine');
    } finally {
      setLoadingExisting(false);
    }
  };

  const handleCreateRoutine = async () => {
    if (!routineName.trim()) return;

    setCreating(true);
    setError(null);
    try {
      const response = await fetch('/api/routines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: routineName.trim(), isPublic: !isPrivate })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create routine');
      }

      const data = await response.json();
      setRoutineId(data.id);
    } catch (error: any) {
      console.error('Error creating routine:', error);
      setError(error.message || 'Failed to create routine. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleSelectExercise = async (exercise: any) => {
    console.log('Exercise selected:', exercise);
    setShowExerciseSelector(false);

    if (!routineId) return;

    // Regular single exercise
    try {
      const response = await fetch(`/api/routines/${routineId}/exercises`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseId1: exercise.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add exercise to routine');
      }

      // Add to local list
      setExercises([...exercises, exercise]);
    } catch (error) {
      console.error('Error adding exercise:', error);
      alert('Failed to add exercise to routine. Please try again.');
    }
  };

  const handleSelectSuperset = async (exercise1: any, exercise2: any) => {
    setShowSupersetSelector(false);

    if (!routineId) return;

    try {
      const response = await fetch(`/api/routines/${routineId}/exercises`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseId1: exercise1.id,
          exerciseId2: exercise2.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add superset to routine');
      }

      // Add superset to local list
      setExercises([...exercises, {
        type: EXERCISE_TYPES.b2b,
        exercise1,
        exercise2
      }]);
    } catch (error) {
      console.error('Error adding superset:', error);
      alert('Failed to add superset to routine. Please try again.');
    }
  };

  if (loadingExisting) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading routine...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">
          {routineId ? 'Edit Routine' : 'Create New Routine'}
        </h1>

        {!routineId ? (
          // Step 1: Create routine
          <Card paddingClassName="p-6" borderClassName="border-green-600">
            <label className="text-zinc-300 text-sm font-semibold block mb-2">
              Routine Name
            </label>
            <input
              type="text"
              value={routineName}
              onChange={(e) => {
                setRoutineName(e.target.value);
                setError(null); // Clear error when user types
              }}
              placeholder="e.g., Upper Body Day A"
              className="w-full bg-zinc-900 text-white px-4 py-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
              autoFocus
            />

            <label className="flex items-center gap-3 mb-4 cursor-pointer">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="w-5 h-5 rounded border-zinc-600 bg-zinc-900 text-green-600 focus:ring-green-500 focus:ring-offset-zinc-800 cursor-pointer"
              />
              <span className="text-zinc-300 text-sm">
                Make this routine private
                <span className="block text-zinc-500 text-xs">
                  Private routines won't appear in the public browse page
                </span>
              </span>
            </label>

            {error && (
              <div className="bg-red-900/50 border-2 border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <button
              onClick={handleCreateRoutine}
              disabled={!routineName.trim() || creating}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold transition-colors"
            >
              {creating ? 'Creating...' : 'Create Routine'}
            </button>
          </Card>
        ) : (
          // Step 2: Add exercises
          <div>
            <Card paddingClassName="p-6" className="mb-6">
              <h2 className="text-xl font-bold text-white">{routineName}</h2>
            </Card>

            {/* Exercise list */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Exercises</h3>
              {exercises.length === 0 ? (
                <div className="bg-zinc-800 rounded-lg p-8 text-center border-2 border-dashed border-zinc-700">
                  <p className="text-zinc-400">No exercises added yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {exercises.map((exercise, index) => (
                    exercise.type === EXERCISE_TYPES.b2b ? (
                      <div key={index} className="bg-zinc-800 rounded-lg p-4 border-2 border-purple-700">
                        <div className="text-purple-400 text-xs font-bold mb-2">SUPERSET</div>
                        <div className="text-white font-semibold">{exercise.exercise1.name}</div>
                        <div className="text-zinc-500 text-sm my-1">+</div>
                        <div className="text-white font-semibold">{exercise.exercise2.name}</div>
                      </div>
                    ) : (
                      <div key={index} className="bg-zinc-800 rounded-lg p-4 border-2 border-zinc-700">
                        <div className="text-white font-semibold">{exercise.name}</div>
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>

            {/* Add exercise buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowExerciseSelector(true)}
                className="bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg text-lg font-bold transition-colors"
              >
                + Exercise
              </button>
              <button
                onClick={() => setShowSupersetSelector(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-lg text-lg font-bold transition-colors"
              >
                + Superset
              </button>
            </div>

            {/* Continue to Stretches button */}
            {exercises.length > 0 && (
              <button
                onClick={() => router.push(`/routines/${routineId}/stretches`)}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg text-lg font-bold transition-colors"
              >
                Continue to Stretches
              </button>
            )}

            {/* Back button */}
            <button
              onClick={() => router.push('/routines')}
              className="w-full mt-4 bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Back to Routines
            </button>
          </div>
        )}

        {/* Exercise Selector Modal */}
        {showExerciseSelector && (
          <ExerciseSelector
            onSelect={handleSelectExercise}
            onCancel={() => setShowExerciseSelector(false)}
          />
        )}

        {/* Superset Selector Modal */}
        {showSupersetSelector && (
          <SupersetSelector
            onSelect={handleSelectSuperset}
            onCancel={() => setShowSupersetSelector(false)}
          />
        )}
      </div>
    </div>
  );
}

export default function RoutineBuilderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    }>
      <RoutineBuilderContent />
    </Suspense>
  );
}
