'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import ExerciseSelector from '@/app/components/ExerciseSelector';
import SupersetSelector from '@/app/components/SupersetSelector';
import StretchSelector from '@/app/components/StretchSelector';

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
  const [preStretches, setPreStretches] = useState<RoutineStretch[]>([]);
  const [exercises, setExercises] = useState<RoutineExercise[]>([]);
  const [postStretches, setPostStretches] = useState<RoutineStretch[]>([]);
  const [cardio, setCardio] = useState<RoutineCardio | null>(null);
  const [loading, setLoading] = useState(true);

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
      setExercises(routineData.exercises);

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
        <Header />

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

        {/* Pre-Workout Stretches */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-green-500">🟢</span> Pre-Workout Stretches
          </h2>

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
            <div className="text-zinc-500 text-center py-4 bg-zinc-800 rounded-lg mb-2">
              No pre-workout stretches
            </div>
          )}
        </section>

        {/* Exercises */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-orange-500">🔥</span> Exercises
          </h2>

          <div className="flex gap-2 mb-2">
            <button
              onClick={() => handleAddExercise(0)}
              className="flex-1 py-2 text-sm rounded bg-orange-900/60 text-white hover:bg-orange-800/60 transition-colors"
            >
              + Exercise
            </button>
            <button
              onClick={() => handleAddSuperset(0)}
              className="flex-1 py-2 text-sm rounded bg-purple-900/60 text-white hover:bg-purple-800/60 transition-colors"
            >
              + Superset
            </button>
          </div>

          {exercises.map((exercise, index) => (
            <div key={`ex-${index}`}>
              <ExerciseItem
                exercise={exercise}
                onDelete={() => handleDeleteExercise(index)}
              />
              <div className="flex gap-2 my-2">
                <button
                  onClick={() => handleAddExercise(index + 1)}
                  className="flex-1 py-2 text-sm rounded bg-orange-900/60 text-white hover:bg-orange-800/60 transition-colors"
                >
                  + Exercise
                </button>
                <button
                  onClick={() => handleAddSuperset(index + 1)}
                  className="flex-1 py-2 text-sm rounded bg-purple-900/60 text-white hover:bg-purple-800/60 transition-colors"
                >
                  + Superset
                </button>
              </div>
            </div>
          ))}

          {exercises.length === 0 && (
            <div className="text-zinc-500 text-center py-4 bg-zinc-800 rounded-lg mb-2">
              No exercises
            </div>
          )}
        </section>

        {/* Cardio (Optional) */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-red-500">❤️</span> Cardio (Optional)
          </h2>

          {cardio ? (
            <div className="bg-zinc-800 rounded-lg p-4 border-2 border-red-900 mb-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-white font-semibold text-lg">{cardio.type}</div>
                  <div className="text-zinc-400 text-sm">{cardio.duration}</div>
                  {cardio.intensity && (
                    <div className="text-zinc-500 text-sm">{cardio.intensity}</div>
                  )}
                </div>
                <button
                  onClick={handleDeleteCardio}
                  className="text-red-500 hover:text-red-400 p-2"
                  title="Delete"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
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
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-blue-500">🔵</span> Post-Workout Stretches
          </h2>

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
            <div className="text-zinc-500 text-center py-4 bg-zinc-800 rounded-lg mb-2">
              No post-workout stretches
            </div>
          )}
        </section>

        {/* Done Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-zinc-900 border-t border-zinc-800">
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => router.push(`/workout/${encodeURIComponent(routineName)}`)}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg text-xl font-bold transition-colors"
            >
              Done Editing
            </button>
          </div>
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

// Sub-components
function AddButton({ onClick, label, color }: { onClick: () => void; label: string; color: 'green' | 'blue' | 'orange' }) {
  const colorClasses = {
    green: 'bg-green-900/50 hover:bg-green-800/50',
    blue: 'bg-blue-900/50 hover:bg-blue-800/50',
    orange: 'bg-orange-900/50 hover:bg-orange-800/50'
  };

  return (
    <button
      onClick={onClick}
      className={`w-full py-2 text-sm rounded ${colorClasses[color]} text-white transition-colors mb-2`}
    >
      + {label}
    </button>
  );
}

function StretchItem({ stretch, onDelete }: { stretch: { name: string; duration: string }; onDelete: () => void }) {
  return (
    <div className="bg-zinc-800 rounded-lg p-4 border-2 border-zinc-700 mb-2 flex items-center justify-between">
      <div>
        <div className="text-white font-semibold">{stretch.name}</div>
        <div className="text-zinc-400 text-sm">{stretch.duration}</div>
      </div>
      <button
        onClick={onDelete}
        className="text-red-500 hover:text-red-400 p-2"
        title="Delete"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}

function ExerciseItem({ exercise, onDelete }: { exercise: { exercise_name: string; exercise_type: string; b2b_partner_name: string | null }; onDelete: () => void }) {
  const isSuperset = exercise.exercise_type === 'b2b';

  return (
    <div className={`bg-zinc-800 rounded-lg p-4 border-2 ${isSuperset ? 'border-purple-700' : 'border-zinc-700'} mb-2`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {isSuperset && (
            <div className="text-purple-400 text-xs font-bold mb-2">SUPERSET</div>
          )}
          <div className="text-white font-semibold">{exercise.exercise_name}</div>
          {isSuperset && exercise.b2b_partner_name && (
            <>
              <div className="text-purple-400 text-sm my-1">+</div>
              <div className="text-white font-semibold">{exercise.b2b_partner_name}</div>
            </>
          )}
        </div>
        <button
          onClick={onDelete}
          className="text-red-500 hover:text-red-400 p-2"
          title="Delete"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function CardioForm({ onSave, onCancel }: { onSave: (data: { type: string; duration: string; intensity: string; tips: string }) => void; onCancel: () => void }) {
  const [type, setType] = useState('');
  const [duration, setDuration] = useState('');
  const [intensity, setIntensity] = useState('');
  const [tips, setTips] = useState('');

  const handleSubmit = () => {
    if (!type.trim() || !duration.trim()) return;
    onSave({ type: type.trim(), duration: duration.trim(), intensity: intensity.trim(), tips: tips.trim() });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-800 rounded-lg p-6 max-w-md w-full border-2 border-red-600">
        <h2 className="text-2xl font-bold text-white mb-4">Add Cardio</h2>

        <div className="space-y-4 mb-6">
          <div>
            <label className="text-zinc-400 text-sm block mb-1">Type *</label>
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="e.g., Incline Walk, Bike, Stairmaster"
              className="w-full bg-zinc-900 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              autoFocus
            />
          </div>

          <div>
            <label className="text-zinc-400 text-sm block mb-1">Duration *</label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g., 15 min, 20 min"
              className="w-full bg-zinc-900 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="text-zinc-400 text-sm block mb-1">Intensity</label>
            <input
              type="text"
              value={intensity}
              onChange={(e) => setIntensity(e.target.value)}
              placeholder="e.g., 12% incline, 3.0 mph"
              className="w-full bg-zinc-900 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="text-zinc-400 text-sm block mb-1">Tips</label>
            <textarea
              value={tips}
              onChange={(e) => setTips(e.target.value)}
              placeholder="Optional tips..."
              rows={2}
              className="w-full bg-zinc-900 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!type.trim() || !duration.trim()}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold transition-colors"
          >
            Add Cardio
          </button>
        </div>
      </div>
    </div>
  );
}
