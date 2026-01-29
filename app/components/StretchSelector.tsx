'use client';

import { useState, useEffect } from 'react';

interface Stretch {
  id: number;
  name: string;
  duration: string;
  type: string;
  muscle_groups: string | null;
  video_url: string | null;
  tips: string | null;
  is_custom: number;
}

interface StretchSelectorProps {
  onSelect: (stretch: Stretch) => void;
  onCancel: () => void;
  filterType?: 'pre_workout' | 'post_workout';
  title?: string;
}

export default function StretchSelector({ onSelect, onCancel, filterType, title }: StretchSelectorProps) {
  const [stretches, setStretches] = useState<Stretch[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStretches();
  }, []);

  const fetchStretches = async () => {
    try {
      const response = await fetch('/api/stretches');
      const data = await response.json();
      setStretches(data.stretches);
    } catch (error) {
      console.error('Error fetching stretches:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMuscleGroupTags = (muscleGroupsJson: string | null): string[] => {
    if (!muscleGroupsJson) return [];
    try {
      return JSON.parse(muscleGroupsJson);
    } catch {
      return [];
    }
  };

  const filteredStretches = stretches
    .filter(s => !filterType || s.type === filterType)
    .filter(s => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      const name = s.name.toLowerCase();
      const muscles = getMuscleGroupTags(s.muscle_groups).join(' ').toLowerCase();
      return name.includes(query) || muscles.includes(query);
    });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-800 rounded-lg p-6 max-w-3xl w-full max-h-[90vh] flex flex-col border-2 border-blue-800">
        <h2 className="text-2xl font-bold text-white mb-4">
          {title || (filterType === 'pre_workout' ? 'Select Pre-Workout Stretch' : filterType === 'post_workout' ? 'Select Post-Workout Stretch' : 'Select Stretch')}
        </h2>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or muscle group..."
            className="w-full bg-zinc-900 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
            autoFocus
          />
        </div>

        {/* Stretch List */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-2">
          {loading ? (
            <div className="text-center text-zinc-400 py-8">Loading stretches...</div>
          ) : filteredStretches.length === 0 ? (
            <div className="text-center text-zinc-400 py-8">
              {searchQuery ? 'No stretches found' : 'No stretches available'}
            </div>
          ) : (
            filteredStretches.map((stretch) => {
              const muscleGroups = getMuscleGroupTags(stretch.muscle_groups);
              return (
                <button
                  key={stretch.id}
                  onClick={() => onSelect(stretch)}
                  className="w-full bg-zinc-900 hover:bg-zinc-700 text-left p-4 rounded-lg transition-colors border-2 border-zinc-700 hover:border-blue-600"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-white font-semibold">{stretch.name}</div>
                      <div className="text-zinc-400 text-sm mt-1">{stretch.duration}</div>
                      {muscleGroups.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {muscleGroups.map((muscle, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-zinc-700 text-zinc-300 px-2 py-1 rounded"
                            >
                              {muscle}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
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
