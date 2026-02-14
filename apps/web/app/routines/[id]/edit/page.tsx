'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
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
import { invalidateWorkoutBootstrapCache } from '@/lib/workout-bootstrap';
import {
  clearSessionChanges,
  hasSessionChanges,
  loadSessionChanges,
  removeSessionExerciseChange,
  removeSessionStretchChange,
  type SessionChanges,
  type SessionExerciseChange,
  type SessionStretchChange,
} from '@/lib/session-changes';

interface RoutineStretch {
  id: number;
  stretch_id: number;
  name: string;
  timerSeconds: number;
  muscle_groups: string | null;
}

interface RoutineExercise {
  id: number;
  exercise_id1: number;
  exercise_name: string;
  exercise_id2: number | null;
  exercise2_name: string | null;
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
  const searchParams = useSearchParams();
  const routineId = params.id as string;
  const showSessionChanges = searchParams.get('sessionChanges') === '1';

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
  const [sessionChanges, setSessionChanges] = useState<SessionChanges | null>(null);
  const [draggingPreIndex, setDraggingPreIndex] = useState<number | null>(null);
  const [draggingExerciseIndex, setDraggingExerciseIndex] = useState<number | null>(null);
  const [draggingPostIndex, setDraggingPostIndex] = useState<number | null>(null);
  const [dragOverPreIndex, setDragOverPreIndex] = useState<number | null>(null);
  const [dragOverExerciseIndex, setDragOverExerciseIndex] = useState<number | null>(null);
  const [dragOverPostIndex, setDragOverPostIndex] = useState<number | null>(null);

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

  const invalidateBootstrapCache = (nameOverride?: string) => {
    invalidateWorkoutBootstrapCache({
      routineId,
      routineName: nameOverride ?? routineName,
    });
  };

  useEffect(() => {
    loadRoutine();
  }, [routineId]);

  const reorderList = <T,>(list: T[], from: number, to: number): T[] => {
    const next = list.slice();
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    return next;
  };

  const persistPreStretchOrder = async (items: RoutineStretch[]) => {
    const order = items.map(s => s.stretch_id);
    await fetch(`/api/routines/${routineId}/stretches`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'pre', order })
    });
    invalidateBootstrapCache();
  };

  const persistPostStretchOrder = async (items: RoutineStretch[]) => {
    const order = items.map(s => s.stretch_id);
    await fetch(`/api/routines/${routineId}/stretches`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'post', order })
    });
    invalidateBootstrapCache();
  };

  const persistExerciseOrder = async (items: RoutineExercise[]) => {
    const order = items.map(e => e.id);
    await fetch(`/api/routines/${routineId}/exercises`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order })
    });
    invalidateBootstrapCache();
  };

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
          timerSeconds: s.timerSeconds ?? 0,
          muscle_groups: dbStretch?.muscle_groups || null
        };
      });

      const postStretchData = workoutData.workout.postWorkoutStretches.map((s: any, idx: number) => {
        const dbStretch = allStretchesData.stretches.find((db: any) => db.name === s.name);
        return {
          id: idx,
          stretch_id: dbStretch?.id || 0,
          name: s.name,
          timerSeconds: s.timerSeconds ?? 0,
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

  const syncSessionChanges = () => {
    if (!routineName) return;
    setSessionChanges(loadSessionChanges(routineName, routineId));
  };

  const finalizeSessionChanges = (next: SessionChanges) => {
    setSessionChanges(next);
    if (!hasSessionChanges(next) && routineName) {
      clearSessionChanges(routineName, routineId);
    }
  };

  useEffect(() => {
    if (!showSessionChanges) return;
    syncSessionChanges();
  }, [showSessionChanges, routineName, routineId]);

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
      invalidateBootstrapCache();
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
      invalidateBootstrapCache();
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
      invalidateBootstrapCache();
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
      invalidateBootstrapCache();
    } catch (error) {
      console.error('Error deleting cardio:', error);
    }
  };

  const handleClearSessionChanges = () => {
    if (!routineName) return;
    clearSessionChanges(routineName, routineId);
    setSessionChanges(null);
  };

  const handleAddSessionExercise = async (change: SessionExerciseChange) => {
    if (!routineName) return;
    try {
      const response = await fetch(`/api/routines/${routineId}/exercises`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseId1: change.exercise1.id,
          ...(change.mode === 'superset' && change.exercise2 ? { exerciseId2: change.exercise2.id } : {})
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add exercise to routine');
      }

      const data = await response.json();
      const newExercise: RoutineExercise = {
        id: data.id,
        exercise_id1: change.exercise1.id,
        exercise_name: change.exercise1.name,
        exercise_id2: change.exercise2?.id ?? null,
        exercise2_name: change.exercise2?.name ?? null
      };

      const nextExercises = [...exercises, newExercise];
      setExercises(nextExercises);

      const newOrder = nextExercises.map(e => e.id);
      await fetch(`/api/routines/${routineId}/exercises`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: newOrder })
      });
      invalidateBootstrapCache();

      const nextChanges = removeSessionExerciseChange({
        workoutName: routineName,
        routineId,
        changeId: change.id
      });
      finalizeSessionChanges(nextChanges);
    } catch (error) {
      console.error('Error adding session exercise:', error);
    }
  };

  const handleAddSessionStretch = async (change: SessionStretchChange) => {
    if (!routineName) return;
    const isPre = change.stretchType === 'pre';
    const currentStretches = isPre ? preStretches : postStretches;
    const stretchIds = currentStretches.map(s => s.stretch_id);
    stretchIds.push(change.stretch.id);

    try {
      await fetch(`/api/routines/${routineId}/stretches`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: isPre ? 'pre' : 'post', order: stretchIds })
      });

      const newStretch: RoutineStretch = {
        id: Date.now(),
        stretch_id: change.stretch.id,
        name: change.stretch.name,
        timerSeconds: change.stretch.timer_seconds ?? 0,
        muscle_groups: change.stretch.muscle_groups ?? null
      };

      if (isPre) {
        setPreStretches([...preStretches, newStretch]);
      } else {
        setPostStretches([...postStretches, newStretch]);
      }

      invalidateBootstrapCache();

      const nextChanges = removeSessionStretchChange({
        workoutName: routineName,
        routineId,
        changeId: change.id,
        stretchType: change.stretchType
      });
      finalizeSessionChanges(nextChanges);
    } catch (error) {
      console.error('Error adding session stretch:', error);
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
      timerSeconds: stretch.timer_seconds ?? 0,
      muscle_groups: stretch.muscle_groups
    };
    const newStretches = [...preStretches];
    newStretches.splice(insertAt, 0, newStretch);
    setPreStretches(newStretches);
    setInsertPreStretchAt(null);
    invalidateBootstrapCache();
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
      timerSeconds: stretch.timer_seconds ?? 0,
      muscle_groups: stretch.muscle_groups
    };
    const newStretches = [...postStretches];
    newStretches.splice(insertAt, 0, newStretch);
    setPostStretches(newStretches);
    setInsertPostStretchAt(null);
    invalidateBootstrapCache();
  };

  const handleSelectExercise = async (exercise: any) => {
    setShowExerciseSelector(false);
    const insertAt = insertExerciseAt ?? exercises.length;

    try {
      const response = await fetch(`/api/routines/${routineId}/exercises`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseId1: exercise.id
        })
      });

      const data = await response.json();

      const newExercise: RoutineExercise = {
        id: data.id,
        exercise_id1: exercise.id,
        exercise_name: exercise.name,
        exercise_id2: null,
        exercise2_name: null
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
    invalidateBootstrapCache();
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
          exerciseId1: exercise1.id,
          exerciseId2: exercise2.id
        })
      });

      const data = await response.json();

      const newExercise: RoutineExercise = {
        id: data.id,
        exercise_id1: exercise1.id,
        exercise_name: exercise1.name,
        exercise_id2: exercise2.id,
        exercise2_name: exercise2.name
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
    invalidateBootstrapCache();
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
      invalidateBootstrapCache();
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

      invalidateBootstrapCache(routineName);
      invalidateBootstrapCache(nextName);
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

  const handleMovePreStretch = async (index: number, delta: number) => {
    const targetIndex = index + delta;
    if (targetIndex < 0 || targetIndex >= preStretches.length) return;
    const previous = preStretches;
    const next = reorderList(previous, index, targetIndex);
    setPreStretches(next);
    try {
      await persistPreStretchOrder(next);
    } catch (error) {
      console.error('Error reordering pre-stretches:', error);
      setPreStretches(previous);
    }
  };

  const handleMovePostStretch = async (index: number, delta: number) => {
    const targetIndex = index + delta;
    if (targetIndex < 0 || targetIndex >= postStretches.length) return;
    const previous = postStretches;
    const next = reorderList(previous, index, targetIndex);
    setPostStretches(next);
    try {
      await persistPostStretchOrder(next);
    } catch (error) {
      console.error('Error reordering post-stretches:', error);
      setPostStretches(previous);
    }
  };

  const handleMoveExercise = async (index: number, delta: number) => {
    const targetIndex = index + delta;
    if (targetIndex < 0 || targetIndex >= exercises.length) return;
    const previous = exercises;
    const next = reorderList(previous, index, targetIndex);
    setExercises(next);
    try {
      await persistExerciseOrder(next);
    } catch (error) {
      console.error('Error reordering exercises:', error);
      setExercises(previous);
    }
  };

  const handlePreStretchDrop = async (index: number) => {
    if (draggingPreIndex === null || draggingPreIndex === index) {
      setDragOverPreIndex(null);
      return;
    }
    const previous = preStretches;
    const next = reorderList(previous, draggingPreIndex, index);
    setPreStretches(next);
    setDraggingPreIndex(null);
    setDragOverPreIndex(null);
    try {
      await persistPreStretchOrder(next);
    } catch (error) {
      console.error('Error reordering pre-stretches:', error);
      setPreStretches(previous);
    }
  };

  const handlePostStretchDrop = async (index: number) => {
    if (draggingPostIndex === null || draggingPostIndex === index) {
      setDragOverPostIndex(null);
      return;
    }
    const previous = postStretches;
    const next = reorderList(previous, draggingPostIndex, index);
    setPostStretches(next);
    setDraggingPostIndex(null);
    setDragOverPostIndex(null);
    try {
      await persistPostStretchOrder(next);
    } catch (error) {
      console.error('Error reordering post-stretches:', error);
      setPostStretches(previous);
    }
  };

  const handleExerciseDrop = async (index: number) => {
    if (draggingExerciseIndex === null || draggingExerciseIndex === index) {
      setDragOverExerciseIndex(null);
      return;
    }
    const previous = exercises;
    const next = reorderList(previous, draggingExerciseIndex, index);
    setExercises(next);
    setDraggingExerciseIndex(null);
    setDragOverExerciseIndex(null);
    try {
      await persistExerciseOrder(next);
    } catch (error) {
      console.error('Error reordering exercises:', error);
      setExercises(previous);
    }
  };

  const exerciseChanges = sessionChanges?.exercises ?? [];
  const preStretchChanges = sessionChanges?.preStretches ?? [];
  const postStretchChanges = sessionChanges?.postStretches ?? [];

  return (
    <div className="min-h-screen bg-zinc-900 p-4 pb-24">
      <div className="max-w-5xl mx-auto">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
          <div>
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
            <div
              key={`pre-${stretch.id}`}
              className={dragOverPreIndex === index ? 'ring-2 ring-green-500/70 rounded-lg' : ''}
              onDragOver={(event) => {
                event.preventDefault();
                setDragOverPreIndex(index);
              }}
              onDrop={(event) => {
                event.preventDefault();
                handlePreStretchDrop(index);
              }}
            >
              <StretchItem
                stretch={stretch}
                onDelete={() => handleDeletePreStretch(index)}
                onMoveUp={() => handleMovePreStretch(index, -1)}
                onMoveDown={() => handleMovePreStretch(index, 1)}
                disableMoveUp={index === 0}
                disableMoveDown={index === preStretches.length - 1}
                dragHandleProps={{
                  draggable: true,
                  onDragStart: (event) => {
                    event.dataTransfer.effectAllowed = 'move';
                    event.dataTransfer.setData('text/plain', String(index));
                    setDraggingPreIndex(index);
                  },
                  onDragEnd: () => {
                    setDraggingPreIndex(null);
                    setDragOverPreIndex(null);
                  }
                }}
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
            <div
              key={`ex-${exercise.id}`}
              className={dragOverExerciseIndex === index ? 'ring-2 ring-orange-500/70 rounded-lg' : ''}
              onDragOver={(event) => {
                event.preventDefault();
                setDragOverExerciseIndex(index);
              }}
              onDrop={(event) => {
                event.preventDefault();
                handleExerciseDrop(index);
              }}
            >
              <ExerciseItem
                exercise={exercise}
                onDelete={() => handleDeleteExercise(index)}
                onMoveUp={() => handleMoveExercise(index, -1)}
                onMoveDown={() => handleMoveExercise(index, 1)}
                disableMoveUp={index === 0}
                disableMoveDown={index === exercises.length - 1}
                dragHandleProps={{
                  draggable: true,
                  onDragStart: (event) => {
                    event.dataTransfer.effectAllowed = 'move';
                    event.dataTransfer.setData('text/plain', String(index));
                    setDraggingExerciseIndex(index);
                  },
                  onDragEnd: () => {
                    setDraggingExerciseIndex(null);
                    setDragOverExerciseIndex(null);
                  }
                }}
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
            <div
              key={`post-${stretch.id}`}
              className={dragOverPostIndex === index ? 'ring-2 ring-blue-500/70 rounded-lg' : ''}
              onDragOver={(event) => {
                event.preventDefault();
                setDragOverPostIndex(index);
              }}
              onDrop={(event) => {
                event.preventDefault();
                handlePostStretchDrop(index);
              }}
            >
              <StretchItem
                stretch={stretch}
                onDelete={() => handleDeletePostStretch(index)}
                onMoveUp={() => handleMovePostStretch(index, -1)}
                onMoveDown={() => handleMovePostStretch(index, 1)}
                disableMoveUp={index === 0}
                disableMoveDown={index === postStretches.length - 1}
                dragHandleProps={{
                  draggable: true,
                  onDragStart: (event) => {
                    event.dataTransfer.effectAllowed = 'move';
                    event.dataTransfer.setData('text/plain', String(index));
                    setDraggingPostIndex(index);
                  },
                  onDragEnd: () => {
                    setDraggingPostIndex(null);
                    setDragOverPostIndex(null);
                  }
                }}
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

          {showSessionChanges && (
            <aside className="mt-10 lg:mt-0">
              <div className="rounded-xl border border-amber-500/50 bg-amber-500/10 p-4 text-amber-100">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-amber-300">
                      Session changes
                    </div>
                    <div className="text-sm text-amber-100">
                      Add items you used today into this routine.
                    </div>
                  </div>
                  {hasSessionChanges(sessionChanges) && (
                    <button
                      onClick={handleClearSessionChanges}
                      className="text-xs font-semibold text-amber-200 hover:text-amber-100"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {!hasSessionChanges(sessionChanges) && (
                  <div className="mt-4 text-sm text-amber-200/80">
                    No session changes to review.
                  </div>
                )}

                {exerciseChanges.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <div className="text-xs font-semibold uppercase tracking-wide text-amber-300">
                      Exercises
                    </div>
                    {exerciseChanges.map((change) => (
                      <div
                        key={change.id}
                        className="rounded-lg border border-amber-500/30 bg-zinc-900/60 p-3"
                      >
                        <div className="text-sm font-semibold text-white">
                          {change.mode === 'superset' && change.exercise2
                            ? `${change.exercise1.name} + ${change.exercise2.name}`
                            : change.exercise1.name}
                        </div>
                        <button
                          onClick={() => handleAddSessionExercise(change)}
                          className="mt-2 w-full rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-black hover:bg-amber-400"
                        >
                          Add to routine
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {preStretchChanges.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <div className="text-xs font-semibold uppercase tracking-wide text-amber-300">
                      Pre-Workout Stretches
                    </div>
                    {preStretchChanges.map((change) => (
                      <div
                        key={change.id}
                        className="rounded-lg border border-amber-500/30 bg-zinc-900/60 p-3"
                      >
                        <div className="text-sm font-semibold text-white">
                          {change.stretch.name}
                        </div>
                        <button
                          onClick={() => handleAddSessionStretch(change)}
                          className="mt-2 w-full rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-black hover:bg-amber-400"
                        >
                          Add to routine
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {postStretchChanges.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <div className="text-xs font-semibold uppercase tracking-wide text-amber-300">
                      Post-Workout Stretches
                    </div>
                    {postStretchChanges.map((change) => (
                      <div
                        key={change.id}
                        className="rounded-lg border border-amber-500/30 bg-zinc-900/60 p-3"
                      >
                        <div className="text-sm font-semibold text-white">
                          {change.stretch.name}
                        </div>
                        <button
                          onClick={() => handleAddSessionStretch(change)}
                          className="mt-2 w-full rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-black hover:bg-amber-400"
                        >
                          Add to routine
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </aside>
          )}
        </div>
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
