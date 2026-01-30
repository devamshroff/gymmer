'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { parseTagJson } from '@/lib/muscle-tags';

interface Stretch {
  id: number;
  name: string;
  duration: string;
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
  const [recommendedPreIds, setRecommendedPreIds] = useState<number[]>([]);
  const [recommendedPostIds, setRecommendedPostIds] = useState<number[]>([]);
  const [recommending, setRecommending] = useState(false);
  const [recommendError, setRecommendError] = useState<string | null>(null);

  useEffect(() => {
    fetchStretches();
  }, []);

  const fetchStretches = async () => {
    try {
      const response = await fetch('/api/stretches');
      const data = await response.json();
      setAllStretches(data.stretches);
      fetchRecommendations(data.stretches);
    } catch (error) {
      console.error('Error fetching stretches:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async (currentStretches: Stretch[]) => {
    setRecommending(true);
    setRecommendError(null);
    try {
      const response = await fetch(`/api/routines/${routineId}/stretch-recommendations`, {
        method: 'POST'
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate recommendations');
      }

      const data = await response.json();
      const createdStretches = data.createdStretches || [];

      if (createdStretches.length > 0) {
        const existingIds = new Set(currentStretches.map((stretch) => stretch.id));
        const newOnes = createdStretches.filter((stretch: Stretch) => !existingIds.has(stretch.id));
        if (newOnes.length > 0) {
          setAllStretches([...currentStretches, ...newOnes]);
        }
      }

      setRecommendedPreIds(data.recommendedPreIds || []);
      setRecommendedPostIds(data.recommendedPostIds || []);
    } catch (error: any) {
      console.error('Error fetching recommendations:', error);
      setRecommendError(error.message || 'Failed to load recommendations');
    } finally {
      setRecommending(false);
    }
  };

  const filteredStretches = allStretches.filter((stretch) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const name = stretch.name.toLowerCase();
    const muscleGroups = getMuscleGroups(stretch).join(' ').toLowerCase();
    return name.includes(query) || muscleGroups.includes(query);
  });
  const recommendedIds = activeTab === 'pre' ? recommendedPreIds : recommendedPostIds;
  const recommendedSet = new Set(recommendedIds);
  const orderedStretches = [
    ...filteredStretches.filter(stretch => recommendedSet.has(stretch.id)),
    ...filteredStretches.filter(stretch => !recommendedSet.has(stretch.id)),
  ];

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

      // Redirect to routines
      router.push('/routines');
    } catch (error) {
      console.error('Error saving stretches:', error);
      alert('Failed to save stretches. Please try again.');
    } finally {
      setSaving(false);
    }
  };

function getMuscleGroups(stretch: Stretch): string[] {
  return parseTagJson(stretch.muscle_groups);
}

  // Get all types covered by selected stretches for the current tab
  const getCoveredGroups = (): string[] => {
    const selectedIds = activeTab === 'pre' ? selectedPreStretches : selectedPostStretches;
    const groupSet = new Set<string>();

    selectedIds.forEach(stretchId => {
      const stretch = allStretches.find(s => s.id === stretchId);
      if (stretch) {
        const muscleGroups = getMuscleGroups(stretch);
        muscleGroups.forEach((tag) => groupSet.add(tag));
      }
    });

    return Array.from(groupSet).sort();
  };

  const coveredGroups = getCoveredGroups();

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
            Muscle Groups Covered ({coveredGroups.length})
          </div>
          {coveredGroups.length === 0 ? (
            <div className="text-zinc-500 text-sm">Select stretches to see muscle coverage</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {coveredGroups.map((muscle, idx) => (
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

        {(recommending || recommendError) && (
          <div className="mb-6">
            {recommending && (
              <div className="text-sm text-zinc-400">
                Finding recommended stretches for this workout...
              </div>
            )}
            {recommendError && (
              <div className="text-sm text-red-300">
                {recommendError}
              </div>
            )}
          </div>
        )}

        {/* Stretches List */}
        <div className="space-y-3 mb-6">
          {orderedStretches.length === 0 ? (
            <div className="text-center text-zinc-400 py-8">
              No stretches found
            </div>
          ) : (
            orderedStretches.map((stretch) => {
              const muscleGroups = getMuscleGroups(stretch);
              const selected = isSelected(stretch.id);
              const isRecommended = recommendedSet.has(stretch.id);

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
                        {isRecommended && (
                          <span className="text-xs text-emerald-200 bg-emerald-900/60 px-2 py-1 rounded">
                            * recommended for this workout
                          </span>
                        )}
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
