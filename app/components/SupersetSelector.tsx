'use client';

import { useState, useEffect } from 'react';

interface Exercise {
  id: number;
  name: string;
  video_url: string | null;
  tips: string | null;
  equipment: string | null;
  is_custom: number;
}

interface SupersetSelectorProps {
  onSelect: (exercise1: Exercise, exercise2: Exercise) => void;
  onCancel: () => void;
}

export default function SupersetSelector({ onSelect, onCancel }: SupersetSelectorProps) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [searchQuery1, setSearchQuery1] = useState('');
  const [searchQuery2, setSearchQuery2] = useState('');
  const [loading, setLoading] = useState(true);
  const [exercise1, setExercise1] = useState<Exercise | null>(null);
  const [exercise2, setExercise2] = useState<Exercise | null>(null);

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

  const filteredExercises1 = exercises.filter(ex =>
    ex.name.toLowerCase().includes(searchQuery1.toLowerCase())
  );

  const filteredExercises2 = exercises.filter(ex =>
    ex.name.toLowerCase().includes(searchQuery2.toLowerCase())
  );

  const handleConfirm = () => {
    if (exercise1 && exercise2) {
      onSelect(exercise1, exercise2);
    }
  };

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
                <input
                  type="text"
                  value={searchQuery1}
                  onChange={(e) => setSearchQuery1(e.target.value)}
                  placeholder="Search exercises..."
                  className="w-full bg-zinc-900 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  autoFocus
                />
              )}
            </div>

            {!exercise1 && (
              <div className="flex-1 overflow-y-auto space-y-2">
                {loading ? (
                  <div className="text-center text-zinc-400 py-4">Loading...</div>
                ) : filteredExercises1.length === 0 ? (
                  <div className="text-center text-zinc-400 py-4">No exercises found</div>
                ) : (
                  filteredExercises1.map((exercise) => (
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
                  ))
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
                <input
                  type="text"
                  value={searchQuery2}
                  onChange={(e) => setSearchQuery2(e.target.value)}
                  placeholder="Search exercises..."
                  className="w-full bg-zinc-900 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              )}
            </div>

            {!exercise2 && (
              <div className="flex-1 overflow-y-auto space-y-2">
                {loading ? (
                  <div className="text-center text-zinc-400 py-4">Loading...</div>
                ) : filteredExercises2.length === 0 ? (
                  <div className="text-center text-zinc-400 py-4">No exercises found</div>
                ) : (
                  filteredExercises2.map((exercise) => (
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
                  ))
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
