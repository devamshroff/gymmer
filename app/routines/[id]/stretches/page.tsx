'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface Stretch {
  id: number;
  name: string;
  duration: string;
  type: string;
  muscle_groups: string | null;
  tips: string | null;
  video_url: string | null;
  is_custom: number;
}

export default function RoutineStretchesPage() {
  const router = useRouter();
  const params = useParams();
  const routineId = params.id as string;

  const [allStretches, setAllStretches] = useState<Stretch[]>([]);
  const [selectedPreStretches, setSelectedPreStretches] = useState<number[]>([]);
  const [selectedPostStretches, setSelectedPostStretches] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<'pre' | 'post'>('pre');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchStretches();
  }, []);

  const fetchStretches = async () => {
    try {
      const response = await fetch('/api/stretches');
      const data = await response.json();
      setAllStretches(data.stretches);
    } catch (error) {
      console.error('Error fetching stretches:', error);
    } finally {
      setLoading(false);
    }
  };

  const preWorkoutStretches = allStretches.filter(s => s.type === 'pre_workout');
  const postWorkoutStretches = allStretches.filter(s => s.type === 'post_workout');

  const filteredStretches = (activeTab === 'pre' ? preWorkoutStretches : postWorkoutStretches)
    .filter(stretch => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      const name = stretch.name.toLowerCase();
      const muscleGroups = stretch.muscle_groups ?
        JSON.parse(stretch.muscle_groups).join(' ').toLowerCase() : '';
      return name.includes(query) || muscleGroups.includes(query);
    });

  const toggleStretch = (stretchId: number) => {
    if (activeTab === 'pre') {
      if (selectedPreStretches.includes(stretchId)) {
        setSelectedPreStretches(selectedPreStretches.filter(id => id !== stretchId));
      } else {
        setSelectedPreStretches([...selectedPreStretches, stretchId]);
      }
    } else {
      if (selectedPostStretches.includes(stretchId)) {
        setSelectedPostStretches(selectedPostStretches.filter(id => id !== stretchId));
      } else {
        setSelectedPostStretches([...selectedPostStretches, stretchId]);
      }
    }
  };

  const isSelected = (stretchId: number) => {
    return activeTab === 'pre'
      ? selectedPreStretches.includes(stretchId)
      : selectedPostStretches.includes(stretchId);
  };

  const handleSaveAndFinish = async () => {
    setSaving(true);
    try {
      // Save pre-workout stretches
      for (let i = 0; i < selectedPreStretches.length; i++) {
        await fetch(`/api/routines/${routineId}/stretches`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            stretchId: selectedPreStretches[i],
            type: 'pre',
            orderIndex: i
          })
        });
      }

      // Save post-workout stretches
      for (let i = 0; i < selectedPostStretches.length; i++) {
        await fetch(`/api/routines/${routineId}/stretches`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            stretchId: selectedPostStretches[i],
            type: 'post',
            orderIndex: i
          })
        });
      }

      // Redirect to home
      router.push('/');
    } catch (error) {
      console.error('Error saving stretches:', error);
      alert('Failed to save stretches. Please try again.');
    } finally {
      setSaving(false);
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

  // Get all muscles covered by selected stretches for the current tab
  const getCoveredMuscles = (): string[] => {
    const selectedIds = activeTab === 'pre' ? selectedPreStretches : selectedPostStretches;
    const muscleSet = new Set<string>();

    selectedIds.forEach(stretchId => {
      const stretch = allStretches.find(s => s.id === stretchId);
      if (stretch) {
        const muscles = getMuscleGroupTags(stretch.muscle_groups);
        muscles.forEach(muscle => muscleSet.add(muscle));
      }
    });

    return Array.from(muscleSet).sort();
  };

  const coveredMuscles = getCoveredMuscles();

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading stretches...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Select Stretches</h1>
        <p className="text-zinc-400 mb-6">
          Choose stretches for your routine. You can select multiple.
        </p>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('pre')}
            className={`flex-1 py-3 rounded-lg font-bold transition-colors ${
              activeTab === 'pre'
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            Pre-Workout ({selectedPreStretches.length})
          </button>
          <button
            onClick={() => setActiveTab('post')}
            className={`flex-1 py-3 rounded-lg font-bold transition-colors ${
              activeTab === 'post'
                ? 'bg-purple-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            Post-Workout ({selectedPostStretches.length})
          </button>
        </div>

        {/* Muscle Coverage Display */}
        <div className={`rounded-lg p-4 mb-6 border-2 ${
          activeTab === 'pre' ? 'bg-blue-900/20 border-blue-700' : 'bg-purple-900/20 border-purple-700'
        }`}>
          <div className="text-sm font-semibold text-zinc-300 mb-2">
            Muscles Covered ({coveredMuscles.length})
          </div>
          {coveredMuscles.length === 0 ? (
            <div className="text-zinc-500 text-sm">Select stretches to see muscle coverage</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {coveredMuscles.map((muscle, idx) => (
                <span
                  key={idx}
                  className={`text-sm px-3 py-1 rounded-full ${
                    activeTab === 'pre'
                      ? 'bg-blue-600 text-white'
                      : 'bg-purple-600 text-white'
                  }`}
                >
                  {muscle}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Search Bar */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or muscle group..."
          className="w-full bg-zinc-800 text-white px-4 py-3 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Stretches List */}
        <div className="space-y-3 mb-6">
          {filteredStretches.length === 0 ? (
            <div className="text-center text-zinc-400 py-8">
              No stretches found
            </div>
          ) : (
            filteredStretches.map((stretch) => {
              const muscleGroups = getMuscleGroupTags(stretch.muscle_groups);
              const selected = isSelected(stretch.id);

              return (
                <button
                  key={stretch.id}
                  onClick={() => toggleStretch(stretch.id)}
                  className={`w-full text-left p-4 rounded-lg transition-all border-2 ${
                    selected
                      ? activeTab === 'pre'
                        ? 'bg-blue-900/30 border-blue-500'
                        : 'bg-purple-900/30 border-purple-500'
                      : 'bg-zinc-800 border-zinc-700 hover:border-zinc-600'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-semibold">{stretch.name}</h3>
                        {selected && (
                          <span className={`text-xs px-2 py-1 rounded ${
                            activeTab === 'pre' ? 'bg-blue-600' : 'bg-purple-600'
                          } text-white`}>
                            ✓ Selected
                          </span>
                        )}
                      </div>
                      <div className="text-zinc-400 text-sm mb-2">{stretch.duration}</div>
                      {muscleGroups.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {muscleGroups.map((muscle: string, idx: number) => (
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

        {/* Action Buttons */}
        <div className="sticky bottom-4 bg-zinc-900 pt-4 space-y-3">
          <button
            onClick={handleSaveAndFinish}
            disabled={saving}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white py-4 rounded-lg text-lg font-bold transition-colors"
          >
            {saving ? 'Saving...' : 'Save & Finish Routine'}
          </button>

          <button
            onClick={() => router.push(`/routines/builder?id=${routineId}`)}
            className="w-full bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            Back to Exercises
          </button>
        </div>
      </div>
    </div>
  );
}
