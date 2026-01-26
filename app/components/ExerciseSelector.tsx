'use client';

import { useState, useEffect } from 'react';
import QuickExerciseForm from './QuickExerciseForm';

interface Exercise {
  id: number;
  name: string;
  video_url: string | null;
  tips: string | null;
  equipment: string | null;
  is_custom: number;
}

interface ExerciseSelectorProps {
  onSelect: (exercise: Exercise) => void;
  onCancel: () => void;
  title?: string;
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
        is_custom: 1
      };

      onSelect(newExercise);
    } catch (error) {
      console.error('Error creating exercise:', error);
      alert('Failed to create exercise. Please try again.');
    }
  };

  const filteredExercises = exercises.filter(ex =>
    ex.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            placeholder="Search exercises..."
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
          ) : filteredExercises.length === 0 ? (
            <div className="text-center text-zinc-400 py-8">
              {searchQuery ? 'No exercises found' : 'No exercises available'}
            </div>
          ) : (
            filteredExercises.map((exercise) => (
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
            ))
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
