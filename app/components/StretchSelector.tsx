'use client';

import { useState, useEffect } from 'react';
import QuickStretchForm from './QuickStretchForm';
import { STRETCH_MUSCLE_ORDER, STRETCH_MUSCLE_TAGS, formatTypeLabel, parseTagJson } from '@/lib/muscle-tags';
import { formatStretchTimer } from '@/lib/stretch-utils';

interface Stretch {
  id: number;
  name: string;
  timer_seconds?: number | null;
  muscle_groups: string | null;
  video_url: string | null;
  tips: string | null;
}

interface StretchSelectorProps {
  onSelect: (stretch: Stretch) => void;
  onCancel: () => void;
  filterType?: 'pre_workout' | 'post_workout';
  title?: string;
}

const FALLBACK_GROUP = 'other';

function getMuscleGroups(stretch: Stretch): string[] {
  return parseTagJson(stretch.muscle_groups, STRETCH_MUSCLE_TAGS);
}

function groupStretchesByMuscleGroup(items: Stretch[]): Array<{ type: string; stretches: Stretch[] }> {
  const grouped = new Map<string, Stretch[]>();
  const sorted = [...items].sort((a, b) => a.name.localeCompare(b.name));

  for (const stretch of sorted) {
    const tags = getMuscleGroups(stretch);
    const keys = tags.length > 0 ? tags : [FALLBACK_GROUP];
    for (const key of keys) {
      const list = grouped.get(key);
      if (list) {
        list.push(stretch);
      } else {
        grouped.set(key, [stretch]);
      }
    }
  }

  const order = [...STRETCH_MUSCLE_ORDER, FALLBACK_GROUP];
  const keys = Array.from(grouped.keys()).sort((a, b) => {
    const aIndex = order.indexOf(a);
    const bIndex = order.indexOf(b);
    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  return keys.map((key) => ({ type: key, stretches: grouped.get(key) || [] }));
}

export default function StretchSelector({ onSelect, onCancel, filterType, title }: StretchSelectorProps) {
  const [stretches, setStretches] = useState<Stretch[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

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

  const handleCreateStretch = async (stretchData: {
    name: string;
    timerSeconds?: number;
    videoUrl?: string;
    tips?: string;
    muscleGroups?: string[];
  }) => {
    try {
      const response = await fetch('/api/stretches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stretchData)
      });

      if (!response.ok) {
        throw new Error('Failed to create stretch');
      }

      const data = await response.json();
      await fetchStretches();

      const muscleGroupsJson = stretchData.muscleGroups?.length
        ? JSON.stringify(stretchData.muscleGroups)
        : null;

      const newStretch: Stretch = {
        id: data.id,
        name: stretchData.name,
        timer_seconds: typeof data.timer_seconds === 'number' ? data.timer_seconds : null,
        muscle_groups: muscleGroupsJson,
        video_url: stretchData.videoUrl || null,
        tips: typeof data.tips === 'string' ? data.tips : stretchData.tips || null
      };

      setShowCreateForm(false);
      onSelect(newStretch);
    } catch (error) {
      console.error('Error creating stretch:', error);
      alert('Failed to create stretch. Please try again.');
    }
  };

  const filteredStretches = stretches.filter((stretch) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const name = stretch.name.toLowerCase();
    const tags = getMuscleGroups(stretch).join(' ').toLowerCase();
    return name.includes(query) || tags.includes(query);
  });
  const groupedStretches = groupStretchesByMuscleGroup(filteredStretches);

  if (showCreateForm) {
    return (
      <QuickStretchForm
        onSubmit={handleCreateStretch}
        onCancel={() => setShowCreateForm(false)}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-800 rounded-lg p-6 max-w-3xl w-full max-h-[90vh] flex flex-col border-2 border-blue-800">
        <h2 className="text-2xl font-bold text-white mb-4">
          {title || (filterType === 'pre_workout' ? 'Select Pre-Workout Stretch' : filterType === 'post_workout' ? 'Select Post-Workout Stretch' : 'Select Stretch')}
        </h2>

        {/* Search & Create */}
        <div className="mb-4 space-y-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or muscle group..."
            className="w-full bg-zinc-900 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
            autoFocus
          />

          <button
            onClick={() => setShowCreateForm(true)}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-bold transition-colors"
          >
            + Create New Stretch
          </button>
        </div>

        {/* Stretch List */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-2">
          {loading ? (
            <div className="text-center text-zinc-400 py-8">Loading stretches...</div>
          ) : groupedStretches.length === 0 ? (
            <div className="text-center text-zinc-400 py-8">
              {searchQuery ? 'No stretches found' : 'No stretches available'}
            </div>
          ) : (
            <div className="space-y-4">
              {groupedStretches.map(({ type, stretches: groupStretches }) => (
                <div key={type} className="space-y-2">
                  <div className="text-xs uppercase tracking-wide text-zinc-400">
                    {formatTypeLabel(type)}
                  </div>
                  {groupStretches.map((stretch) => {
                    const muscleGroups = getMuscleGroups(stretch);
                    return (
                      <button
                        key={stretch.id}
                        onClick={() => onSelect(stretch)}
                        className="w-full bg-zinc-900 hover:bg-zinc-700 text-left p-4 rounded-lg transition-colors border-2 border-zinc-700 hover:border-blue-600"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="text-white font-semibold">{stretch.name}</div>
                            <div className="text-zinc-400 text-sm mt-1">
                              {formatStretchTimer(stretch.timer_seconds)}
                            </div>
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
                  })}
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
