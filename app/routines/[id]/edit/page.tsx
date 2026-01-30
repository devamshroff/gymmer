'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ExerciseSelector from '@/app/components/ExerciseSelector';
import SupersetSelector from '@/app/components/SupersetSelector';
import StretchSelector from '@/app/components/StretchSelector';
import {
  AddButton,
  CardioForm,
  CardioItem,
  ExerciseAddRow,
  ExerciseItem,
  StretchItem
} from '@/app/components/RoutineEditParts';
import { BottomActionBar, Card, EmptyState, SectionHeader } from '@/app/components/SharedUi';

interface RoutineStretch {
  id: number;
  stretch_id: number;
  name: string;
  duration: string;
  muscle_groups: string | null;
}

interface RoutineExercise {
  id: number;
  exercise_id: number;
  exercise_name: string;
  exercise_type: 'single' | 'b2b';
  b2b_partner_id: number | null;
  b2b_partner_name: string | null;
}

interface RoutineCardio {
  type: string;
  duration: string;
  intensity: string;
  tips: string;
}

export default function EditRoutinePage() {
  const params = useParams();
  const router = useRouter();
  const routineId = params.id as string;

  const [routineName, setRoutineName] = useState('');
  const [routineNameDraft, setRoutineNameDraft] = useState('');
  const [savingName, setSavingName] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [preStretches, setPreStretches] = useState<RoutineStretch[]>([]);
  const [exercises, setExercises] = useState<RoutineExercise[]>([]);
  const [postStretches, setPostStretches] = useState<RoutineStretch[]>([]);
  const [cardio, setCardio] = useState<RoutineCardio | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPublic, setIsPublic] = useState(true);

  // Modal states
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [showSupersetSelector, setShowSupersetSelector] = useState(false);
  const [showPreStretchSelector, setShowPreStretchSelector] = useState(false);
  const [showPostStretchSelector, setShowPostStretchSelector] = useState(false);
  const [showCardioForm, setShowCardioForm] = useState(false);

  // Insert position tracking
  const [insertExerciseAt, setInsertExerciseAt] = useState<number | null>(null);
  const [insertPreStretchAt, setInsertPreStretchAt] = useState<number | null>(null);
  const [insertPostStretchAt, setInsertPostStretchAt] = useState<number | null>(null);

  useEffect(() => {
    loadRoutine();
  }, [routineId]);

  const loadRoutine = async () => {
    try {
      // Get routine details
      const routineRes = await fetch(`/api/routines/${routineId}`);
      const routineData = await routineRes.json();
      setRoutineName(routineData.routine.name);
      setRoutineNameDraft(routineData.routine.name);
      setExercises(routineData.exercises);
      setIsPublic(routineData.routine.is_public === 1);

      // For stretches and cardio, load from workout API
      const workoutRes = await fetch(`/api/workout/${encodeURIComponent(routineData.routine.name)}`);
      const workoutData = await workoutRes.json();

      // Get all stretches to match IDs
      const allStretchesRes = await fetch('/api/stretches');
      const allStretchesData = await allStretchesRes.json();

      const preStretchData = workoutData.workout.preWorkoutStretches.map((s: any, idx: number) => {
        const dbStretch = allStretchesData.stretches.find((db: any) => db.name === s.name);
        return {
          id: idx,
          stretch_id: dbStretch?.id || 0,
          name: s.name,
          duration: s.duration,
          muscle_groups: dbStretch?.muscle_groups || null
        };
      });

      const postStretchData = workoutData.workout.postWorkoutStretches.map((s: any, idx: number) => {
        const dbStretch = allStretchesData.stretches.find((db: any) => db.name === s.name);
        return {
          id: idx,
          stretch_id: dbStretch?.id || 0,
          name: s.name,
          duration: s.duration,
          muscle_groups: dbStretch?.muscle_groups || null
        };
      });

      setPreStretches(preStretchData);
      setPostStretches(postStretchData);

      // Set cardio if exists
      if (workoutData.workout.cardio) {
        setCardio(workoutData.workout.cardio);
      }
    } catch (error) {
      console.error('Error loading routine:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete handlers
  const handleDeletePreStretch = async (index: number) => {
    const stretch = preStretches[index];
    try {
      await fetch(`/api/routines/${routineId}/stretches?stretchId=${stretch.stretch_id}&type=pre`, {
        method: 'DELETE'
      });

      const newStretches = preStretches.filter((_, i) => i !== index);
      setPreStretches(newStretches);

      const newOrder = newStretches.map(s => s.stretch_id);
      await fetch(`/api/routines/${routineId}/stretches`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'pre', order: newOrder })
      });
    } catch (error) {
      console.error('Error deleting stretch:', error);
    }
  };

  const handleDeletePostStretch = async (index: number) => {
    const stretch = postStretches[index];
    try {
      await fetch(`/api/routines/${routineId}/stretches?stretchId=${stretch.stretch_id}&type=post`, {
        method: 'DELETE'
      });

      const newStretches = postStretches.filter((_, i) => i !== index);
      setPostStretches(newStretches);

      const newOrder = newStretches.map(s => s.stretch_id);
      await fetch(`/api/routines/${routineId}/stretches`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'post', order: newOrder })
      });
    } catch (error) {
      console.error('Error deleting stretch:', error);
    }
  };

  const handleDeleteExercise = async (index: number) => {
    const exercise = exercises[index];
    try {
      await fetch(`/api/routines/${routineId}/exercises?exerciseConfigId=${exercise.id}`, {
        method: 'DELETE'
      });

      const newExercises = exercises.filter((_, i) => i !== index);
      setExercises(newExercises);

      const newOrder = newExercises.map(e => e.id);
      await fetch(`/api/routines/${routineId}/exercises`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: newOrder })
      });
    } catch (error) {
      console.error('Error deleting exercise:', error);
    }
  };

  const handleDeleteCardio = async () => {
    try {
      await fetch(`/api/routines/${routineId}/cardio`, {
        method: 'DELETE'
      });
      setCardio(null);
    } catch (error) {
      console.error('Error deleting cardio:', error);
    }
  };

  // Add handlers - opening modals
  const handleAddPreStretch = (insertAt: number) => {
    setInsertPreStretchAt(insertAt);
    setShowPreStretchSelector(true);
  };

  const handleAddPostStretch = (insertAt: number) => {
    setInsertPostStretchAt(insertAt);
    setShowPostStretchSelector(true);
  };

  const handleAddExercise = (insertAt: number) => {
    setInsertExerciseAt(insertAt);
    setShowExerciseSelector(true);
  };

  const handleAddSuperset = (insertAt: number) => {
    setInsertExerciseAt(insertAt);
    setShowSupersetSelector(true);
  };

  // Select handlers - from modals
  const handleSelectPreStretch = async (stretch: any) => {
    setShowPreStretchSelector(false);
    const insertAt = insertPreStretchAt ?? preStretches.length;

    const stretchIds = preStretches.map(s => s.stretch_id);
    stretchIds.splice(insertAt, 0, stretch.id);

    await fetch(`/api/routines/${routineId}/stretches`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'pre', order: stretchIds })
    });

    const newStretch: RoutineStretch = {
      id: Date.now(),
      stretch_id: stretch.id,
      name: stretch.name,
      duration: stretch.duration,
      muscle_groups: stretch.muscle_groups
    };
    const newStretches = [...preStretches];
    newStretches.splice(insertAt, 0, newStretch);
    setPreStretches(newStretches);
    setInsertPreStretchAt(null);
  };

  const handleSelectPostStretch = async (stretch: any) => {
    setShowPostStretchSelector(false);
    const insertAt = insertPostStretchAt ?? postStretches.length;

    const stretchIds = postStretches.map(s => s.stretch_id);
    stretchIds.splice(insertAt, 0, stretch.id);

    await fetch(`/api/routines/${routineId}/stretches`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'post', order: stretchIds })
    });

    const newStretch: RoutineStretch = {
      id: Date.now(),
      stretch_id: stretch.id,
      name: stretch.name,
      duration: stretch.duration,
      muscle_groups: stretch.muscle_groups
    };
    const newStretches = [...postStretches];
    newStretches.splice(insertAt, 0, newStretch);
    setPostStretches(newStretches);
    setInsertPostStretchAt(null);
  };

  const handleSelectExercise = async (exercise: any) => {
    setShowExerciseSelector(false);
    const insertAt = insertExerciseAt ?? exercises.length;

    try {
      const response = await fetch(`/api/routines/${routineId}/exercises`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseId: exercise.id,
          exerciseType: 'single',
          sets: 3,
          targetReps: 10,
          targetWeight: 0,
          warmupWeight: 0,
          restTime: 60
        })
      });

      const data = await response.json();

      const newExercise: RoutineExercise = {
        id: data.id,
        exercise_id: exercise.id,
        exercise_name: exercise.name,
        exercise_type: 'single',
        b2b_partner_id: null,
        b2b_partner_name: null
      };

      const newExercises = [...exercises];
      newExercises.splice(insertAt, 0, newExercise);
      setExercises(newExercises);

      const newOrder = newExercises.map(e => e.id);
      await fetch(`/api/routines/${routineId}/exercises`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: newOrder })
      });
    } catch (error) {
      console.error('Error adding exercise:', error);
    }

    setInsertExerciseAt(null);
  };

  const handleSelectSuperset = async (exercise1: any, exercise2: any) => {
    setShowSupersetSelector(false);
    const insertAt = insertExerciseAt ?? exercises.length;

    try {
      const response = await fetch(`/api/routines/${routineId}/exercises`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseId: exercise1.id,
          exerciseType: 'b2b',
          sets: 3,
          targetReps: 10,
          targetWeight: 0,
          warmupWeight: 0,
          restTime: 30,
          b2bPartnerId: exercise2.id,
          b2bSets: 3,
          b2bTargetReps: 10,
          b2bTargetWeight: 0,
          b2bWarmupWeight: 0
        })
      });

      const data = await response.json();

      const newExercise: RoutineExercise = {
        id: data.id,
        exercise_id: exercise1.id,
        exercise_name: exercise1.name,
        exercise_type: 'b2b',
        b2b_partner_id: exercise2.id,
        b2b_partner_name: exercise2.name
      };

      const newExercises = [...exercises];
      newExercises.splice(insertAt, 0, newExercise);
      setExercises(newExercises);

      const newOrder = newExercises.map(e => e.id);
      await fetch(`/api/routines/${routineId}/exercises`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: newOrder })
      });
    } catch (error) {
      console.error('Error adding superset:', error);
    }

    setInsertExerciseAt(null);
  };

  const handleSaveCardio = async (cardioData: RoutineCardio) => {
    try {
      await fetch(`/api/routines/${routineId}/cardio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cardioData)
      });
      setCardio(cardioData);
      setShowCardioForm(false);
    } catch (error) {
      console.error('Error saving cardio:', error);
    }
  };

  const handlePrivacyChange = async (newIsPublic: boolean) => {
    try {
      await fetch(`/api/routines/${routineId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: newIsPublic })
      });
      setIsPublic(newIsPublic);
    } catch (error) {
      console.error('Error updating privacy:', error);
    }
  };

  const handleSaveName = async () => {
    const nextName = routineNameDraft.trim();
    if (!nextName || nextName === routineName) return;

    setSavingName(true);
    setNameError(null);
    try {
      const response = await fetch(`/api/routines/${routineId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nextName })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to update routine name');
      }

      setRoutineName(nextName);
      setRoutineNameDraft(nextName);
    } catch (error) {
      console.error('Error updating routine name:', error);
      setNameError(error instanceof Error ? error.message : 'Failed to update routine name');
    } finally {
      setSavingName(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading routine...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 p-4 pb-24">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-blue-400 hover:text-blue-300 mb-4 block"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-white">Edit: {routineName}</h1>
        </div>

        <Card paddingClassName="p-4 mb-6">
          <label className="block text-zinc-400 text-sm mb-2">Routine name</label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="text"
              value={routineNameDraft}
              onChange={(e) => setRoutineNameDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveName();
              }}
              className="flex-1 bg-zinc-800 text-white px-3 py-2 rounded border border-zinc-600 focus:outline-none focus:border-green-500"
              placeholder="Routine name"
            />
            <button
              onClick={handleSaveName}
              disabled={savingName || routineNameDraft.trim() === routineName || !routineNameDraft.trim()}
              className="px-4 py-2 rounded-lg font-semibold bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {savingName ? 'Saving...' : 'Save Name'}
            </button>
          </div>
          {nameError && (
            <div className="text-red-400 text-sm mt-2">{nameError}</div>
          )}
        </Card>

        {/* Pre-Workout Stretches */}
        <section className="mb-8">
          <SectionHeader icon="🟢" iconClassName="text-green-500" label="Pre-Workout Stretches" />

          <AddButton onClick={() => handleAddPreStretch(0)} label="Add Pre-Stretch" color="green" />

          {preStretches.map((stretch, index) => (
            <div key={`pre-${index}`}>
              <StretchItem
                stretch={stretch}
                onDelete={() => handleDeletePreStretch(index)}
              />
              <AddButton onClick={() => handleAddPreStretch(index + 1)} label="Add Pre-Stretch" color="green" />
            </div>
          ))}

          {preStretches.length === 0 && (
            <EmptyState message="No pre-workout stretches" className="mb-2" />
          )}
        </section>

        {/* Exercises */}
        <section className="mb-8">
          <SectionHeader icon="🔥" iconClassName="text-orange-500" label="Exercises" />

          <ExerciseAddRow
            onAddExercise={() => handleAddExercise(0)}
            onAddSuperset={() => handleAddSuperset(0)}
          />

          {exercises.map((exercise, index) => (
            <div key={`ex-${index}`}>
              <ExerciseItem
                exercise={exercise}
                onDelete={() => handleDeleteExercise(index)}
              />
              <ExerciseAddRow
                onAddExercise={() => handleAddExercise(index + 1)}
                onAddSuperset={() => handleAddSuperset(index + 1)}
              />
            </div>
          ))}

          {exercises.length === 0 && (
            <EmptyState message="No exercises" className="mb-2" />
          )}
        </section>

        {/* Cardio (Optional) */}
        <section className="mb-8">
          <SectionHeader icon="❤️" iconClassName="text-red-500" label="Cardio (Optional)" />

          {cardio ? (
            <CardioItem cardio={cardio} onDelete={handleDeleteCardio} />
          ) : (
            <button
              onClick={() => setShowCardioForm(true)}
              className="w-full py-3 text-sm rounded bg-red-900/50 text-white hover:bg-red-800/50 transition-colors"
            >
              + Add Cardio
            </button>
          )}
        </section>

        {/* Post-Workout Stretches */}
        <section className="mb-8">
          <SectionHeader icon="🔵" iconClassName="text-blue-500" label="Post-Workout Stretches" />

          <AddButton onClick={() => handleAddPostStretch(0)} label="Add Post-Stretch" color="blue" />

          {postStretches.map((stretch, index) => (
            <div key={`post-${index}`}>
              <StretchItem
                stretch={stretch}
                onDelete={() => handleDeletePostStretch(index)}
              />
              <AddButton onClick={() => handleAddPostStretch(index + 1)} label="Add Post-Stretch" color="blue" />
            </div>
          ))}

          {postStretches.length === 0 && (
            <EmptyState message="No post-workout stretches" className="mb-2" />
          )}
        </section>

        {/* Privacy Setting */}
        <section className="mb-8">
          <Card paddingClassName="p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={!isPublic}
                onChange={(e) => handlePrivacyChange(!e.target.checked)}
                className="w-5 h-5 rounded border-zinc-600 bg-zinc-900 text-green-600 focus:ring-green-500 focus:ring-offset-zinc-800 cursor-pointer"
              />
              <span className="text-zinc-300">
                Make this routine private
                <span className="block text-zinc-500 text-xs">
                  Private routines won't appear in the public browse page
                </span>
              </span>
            </label>
          </Card>
        </section>

        {/* Done Button */}
        <BottomActionBar maxWidthClassName="max-w-2xl">
          <button
            onClick={() => router.push(`/workout/${encodeURIComponent(routineName)}`)}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg text-xl font-bold transition-colors"
          >
            Done Editing
          </button>
        </BottomActionBar>
      </div>

      {/* Modals */}
      {showPreStretchSelector && (
        <StretchSelector
          onSelect={handleSelectPreStretch}
          onCancel={() => { setShowPreStretchSelector(false); setInsertPreStretchAt(null); }}
          filterType="pre_workout"
        />
      )}

      {showPostStretchSelector && (
        <StretchSelector
          onSelect={handleSelectPostStretch}
          onCancel={() => { setShowPostStretchSelector(false); setInsertPostStretchAt(null); }}
          filterType="post_workout"
        />
      )}

      {showExerciseSelector && (
        <ExerciseSelector
          onSelect={handleSelectExercise}
          onCancel={() => { setShowExerciseSelector(false); setInsertExerciseAt(null); }}
        />
      )}

      {showSupersetSelector && (
        <SupersetSelector
          onSelect={handleSelectSuperset}
          onCancel={() => { setShowSupersetSelector(false); setInsertExerciseAt(null); }}
        />
      )}

      {showCardioForm && (
        <CardioForm
          onSave={handleSaveCardio}
          onCancel={() => setShowCardioForm(false)}
        />
      )}
    </div>
  );
}
