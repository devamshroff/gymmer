'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { EXERCISE_TYPES } from '@/lib/constants';
import { formatStretchTimer } from '@/lib/stretch-utils';

const STORAGE_KEY = 'ai_routine_draft';

type Stretch = {
  name: string;
  timerSeconds?: number;
  tips?: string;
};

type SingleExercise = {
  type: typeof EXERCISE_TYPES.single;
  name: string;
  sets?: number;
  targetReps?: number;
  targetWeight?: number;
  warmupWeight?: number;
  restTime?: number;
  tips?: string;
};

type B2BExercise = {
  type: typeof EXERCISE_TYPES.b2b;
  exercises: Array<{
    name: string;
    sets?: number;
    targetReps?: number;
    targetWeight?: number;
    warmupWeight?: number;
    tips?: string;
  }>;
};

type WorkoutPlan = {
  name?: string;
  description?: string;
  exercises?: Array<SingleExercise | B2BExercise>;
  preWorkoutStretches?: Stretch[];
  postWorkoutStretches?: Stretch[];
  cardio?: {
    type?: string;
    duration?: string;
    intensity?: string;
    tips?: string;
  };
};

function buildPreview(plan: WorkoutPlan | null) {
  return {
    name: plan?.name || 'Untitled',
    description: plan?.description || '',
    exercises: Array.isArray(plan?.exercises) ? plan.exercises.length : 0,
    preStretches: Array.isArray(plan?.preWorkoutStretches) ? plan.preWorkoutStretches.length : 0,
    postStretches: Array.isArray(plan?.postWorkoutStretches) ? plan.postWorkoutStretches.length : 0,
    hasCardio: !!plan?.cardio,
  };
}

function StretchPreviewItem({ stretch }: { stretch: Stretch }) {
  return (
    <div className="bg-zinc-800 rounded-lg p-4 border-2 border-zinc-700 mb-2">
      <div className="text-white font-semibold">{stretch.name}</div>
      <div className="text-zinc-400 text-sm">{formatStretchTimer(stretch.timerSeconds)}</div>
      {stretch.tips && (
        <div className="text-zinc-500 text-xs mt-1">{stretch.tips}</div>
      )}
    </div>
  );
}

function ExercisePreviewItem({ exercise }: { exercise: SingleExercise | B2BExercise }) {
  if (exercise.type === EXERCISE_TYPES.b2b) {
    const [ex1, ex2] = exercise.exercises || [];
    return (
      <div className="bg-zinc-800 rounded-lg p-4 border-2 border-purple-700 mb-2">
        <div className="text-purple-400 text-xs font-bold mb-2">SUPERSET</div>
        <div className="text-white font-semibold">{ex1?.name || 'Exercise 1'}</div>
        <div className="text-zinc-500 text-xs mt-1">
          Sets: {ex1?.sets ?? 'N/A'} • Reps: {ex1?.targetReps ?? 'N/A'} • Weight: {ex1?.targetWeight ?? 'N/A'}
        </div>
        <div className="text-purple-400 text-sm my-1">+</div>
        <div className="text-white font-semibold">{ex2?.name || 'Exercise 2'}</div>
        <div className="text-zinc-500 text-xs mt-1">
          Sets: {ex2?.sets ?? 'N/A'} • Reps: {ex2?.targetReps ?? 'N/A'} • Weight: {ex2?.targetWeight ?? 'N/A'}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-800 rounded-lg p-4 border-2 border-zinc-700 mb-2">
      <div className="text-white font-semibold">{exercise.name}</div>
      <div className="text-zinc-500 text-xs mt-1">
        Sets: {exercise.sets ?? 'N/A'} • Reps: {exercise.targetReps ?? 'N/A'} • Weight: {exercise.targetWeight ?? 'N/A'}
      </div>
      {typeof exercise.restTime === 'number' && (
        <div className="text-zinc-500 text-xs mt-1">Rest: {exercise.restTime}s</div>
      )}
      {typeof exercise.warmupWeight === 'number' && (
        <div className="text-zinc-500 text-xs mt-1">Warmup: {exercise.warmupWeight}</div>
      )}
      {exercise.tips && (
        <div className="text-zinc-500 text-xs mt-1">{exercise.tips}</div>
      )}
    </div>
  );
}

export default function AiRoutinePreviewPage() {
  const router = useRouter();
  const [planText, setPlanText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [mode, setMode] = useState<'preview' | 'edit'>('preview');
  const [showPreStretchSelector, setShowPreStretchSelector] = useState(false);
  const [showPostStretchSelector, setShowPostStretchSelector] = useState(false);
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [showSupersetSelector, setShowSupersetSelector] = useState(false);
  const [showCardioForm, setShowCardioForm] = useState(false);
  const [insertPreStretchAt, setInsertPreStretchAt] = useState<number | null>(null);
  const [insertPostStretchAt, setInsertPostStretchAt] = useState<number | null>(null);
  const [insertExerciseAt, setInsertExerciseAt] = useState<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setPlanText(stored);
    }
  }, []);

  const parsedPlan = useMemo(() => {
    if (!planText.trim()) return null;
    try {
      return JSON.parse(planText) as WorkoutPlan;
    } catch {
      return null;
    }
  }, [planText]);

  const preview = useMemo(() => buildPreview(parsedPlan), [parsedPlan]);

  const updatePlan = (updater: (plan: WorkoutPlan) => WorkoutPlan) => {
    if (!planText.trim()) return;
    try {
      const parsed = JSON.parse(planText) as WorkoutPlan;
      const updated = updater(parsed);
      setPlanText(JSON.stringify(updated, null, 2));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated, null, 2));
    } catch {
      setError('JSON is invalid. Please fix it before editing.');
    }
  };

  const handleDeleteExercise = (index: number) => {
    updatePlan((plan) => {
      const exercises = Array.isArray(plan.exercises) ? [...plan.exercises] : [];
      exercises.splice(index, 1);
      return { ...plan, exercises };
    });
  };

  const handleDeleteStretch = (index: number, type: 'pre' | 'post') => {
    updatePlan((plan) => {
      if (type === 'pre') {
        const pre = Array.isArray(plan.preWorkoutStretches) ? [...plan.preWorkoutStretches] : [];
        pre.splice(index, 1);
        return { ...plan, preWorkoutStretches: pre };
      }
      const post = Array.isArray(plan.postWorkoutStretches) ? [...plan.postWorkoutStretches] : [];
      post.splice(index, 1);
      return { ...plan, postWorkoutStretches: post };
    });
  };

  const handleSelectPreStretch = (stretch: any) => {
    setShowPreStretchSelector(false);
    updatePlan((plan) => {
      const pre = Array.isArray(plan.preWorkoutStretches) ? [...plan.preWorkoutStretches] : [];
      const insertAt = insertPreStretchAt ?? pre.length;
      pre.splice(insertAt, 0, {
        name: stretch.name,
        timerSeconds: stretch.timer_seconds ?? 0,
        tips: stretch.tips || undefined
      });
      return { ...plan, preWorkoutStretches: pre };
    });
    setInsertPreStretchAt(null);
  };

  const handleSelectPostStretch = (stretch: any) => {
    setShowPostStretchSelector(false);
    updatePlan((plan) => {
      const post = Array.isArray(plan.postWorkoutStretches) ? [...plan.postWorkoutStretches] : [];
      const insertAt = insertPostStretchAt ?? post.length;
      post.splice(insertAt, 0, {
        name: stretch.name,
        timerSeconds: stretch.timer_seconds ?? 0,
        tips: stretch.tips || undefined
      });
      return { ...plan, postWorkoutStretches: post };
    });
    setInsertPostStretchAt(null);
  };

  const handleSelectExercise = (exercise: any) => {
    setShowExerciseSelector(false);
    updatePlan((plan) => {
      const exercises = Array.isArray(plan.exercises) ? [...plan.exercises] : [];
      const insertAt = insertExerciseAt ?? exercises.length;
      exercises.splice(insertAt, 0, {
        type: EXERCISE_TYPES.single,
        name: exercise.name,
        sets: 3,
        targetReps: 10,
        targetWeight: 0,
        warmupWeight: 0,
        restTime: 60,
        tips: exercise.tips || undefined
      });
      return { ...plan, exercises };
    });
    setInsertExerciseAt(null);
  };

  const handleSelectSuperset = (exercise1: any, exercise2: any) => {
    setShowSupersetSelector(false);
    updatePlan((plan) => {
      const exercises = Array.isArray(plan.exercises) ? [...plan.exercises] : [];
      const insertAt = insertExerciseAt ?? exercises.length;
      exercises.splice(insertAt, 0, {
        type: EXERCISE_TYPES.b2b,
        exercises: [
          {
            name: exercise1.name,
            sets: 3,
            targetReps: 10,
            targetWeight: 0,
            warmupWeight: 0,
            tips: exercise1.tips || undefined
          },
          {
            name: exercise2.name,
            sets: 3,
            targetReps: 10,
            targetWeight: 0,
            warmupWeight: 0,
            tips: exercise2.tips || undefined
          }
        ]
      });
      return { ...plan, exercises };
    });
    setInsertExerciseAt(null);
  };

  const handleSaveCardio = (cardioData: { type: string; duration: string; intensity: string; tips: string }) => {
    updatePlan((plan) => ({ ...plan, cardio: cardioData }));
    setShowCardioForm(false);
  };

  const handleDeleteCardio = () => {
    updatePlan((plan) => {
      const next = { ...plan };
      delete next.cardio;
      return next;
    });
  };

  const handleSave = async () => {
    if (!planText.trim()) return;
    let workoutPlan: WorkoutPlan;
    try {
      workoutPlan = JSON.parse(planText);
    } catch {
      setError('JSON is invalid. Please fix it before saving.');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch('/api/routines/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workoutPlan }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to save routine');
      }

      localStorage.removeItem(STORAGE_KEY);
      setSuccess(`Saved "${workoutPlan.name}" to your routines.`);
      setTimeout(() => router.push('/routines'), 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to save routine');
    } finally {
      setSaving(false);
    }
  };

  if (!planText.trim()) {
    return (
      <div className="min-h-screen bg-zinc-900 p-4">
        <div className="max-w-3xl mx-auto py-12">
          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
            <h1 className="text-2xl font-bold text-white mb-2">No routine to preview</h1>
            <p className="text-zinc-400 mb-4">
              Generate a routine first, then click “View Workout”.
            </p>
            <button
              onClick={() => router.push('/routines/ai')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold"
            >
              Back to AI Builder
            </button>
          </div>
        </div>
      </div>
    );
  }

  const exercises = parsedPlan?.exercises || [];
  const preStretches = parsedPlan?.preWorkoutStretches || [];
  const postStretches = parsedPlan?.postWorkoutStretches || [];
  const cardio = parsedPlan?.cardio;

  return (
    <div className="min-h-screen bg-zinc-900 p-4 pb-32">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Routine Preview</h1>
            <p className="text-zinc-400 text-sm">Review, edit, and save your AI workout.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMode('preview')}
              className={`text-sm font-semibold ${
                mode === 'preview' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Preview
            </button>
            <button
              onClick={() => setMode('edit')}
              className={`text-sm font-semibold ${
                mode === 'edit' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Edit
            </button>
            <button
              onClick={() => router.push('/routines/ai')}
              className="text-zinc-400 hover:text-zinc-200 text-sm font-semibold"
            >
              Back to AI Builder
            </button>
          </div>
        </div>

        {mode === 'preview' ? (
          <>
            <Card paddingClassName="p-6" className="mb-6">
              <h2 className="text-2xl font-bold text-white">{preview.name}</h2>
              {preview.description && (
                <div className="text-zinc-400 mt-2">{preview.description}</div>
              )}
            </Card>

            {/* Pre-Workout Stretches */}
            <section className="mb-8">
              <SectionHeader icon="🟢" iconClassName="text-green-500" label="Pre-Workout Stretches" />
              {preStretches.length === 0 ? (
                <EmptyState message="No pre-workout stretches" className="mb-2" />
              ) : (
                preStretches.map((stretch, index) => (
                  <StretchPreviewItem key={`pre-${index}`} stretch={stretch} />
                ))
              )}
            </section>

            {/* Exercises */}
            <section className="mb-8">
              <SectionHeader icon="🔥" iconClassName="text-orange-500" label="Exercises" />
              {exercises.length === 0 ? (
                <EmptyState message="No exercises" className="mb-2" />
              ) : (
                exercises.map((exercise, index) => (
                  <ExercisePreviewItem key={`ex-${index}`} exercise={exercise} />
                ))
              )}
            </section>

            {/* Cardio (Optional) */}
            <section className="mb-8">
              <SectionHeader icon="❤️" iconClassName="text-red-500" label="Cardio (Optional)" />
              {cardio ? (
                <CardioItem
                  cardio={{
                    type: cardio.type || 'Cardio',
                    duration: cardio.duration,
                    intensity: cardio.intensity,
                    tips: cardio.tips
                  }}
                />
              ) : (
                <EmptyState message="No cardio" className="mb-2" />
              )}
            </section>

            {/* Post-Workout Stretches */}
            <section className="mb-8">
              <SectionHeader icon="🔵" iconClassName="text-blue-500" label="Post-Workout Stretches" />
              {postStretches.length === 0 ? (
                <EmptyState message="No post-workout stretches" className="mb-2" />
              ) : (
                postStretches.map((stretch, index) => (
                  <StretchPreviewItem key={`post-${index}`} stretch={stretch} />
                ))
              )}
            </section>
          </>
        ) : (
          <>
            <Card paddingClassName="p-6" className="mb-6">
              <label className="text-zinc-400 text-sm block mb-2">Routine Name</label>
              <input
                value={parsedPlan?.name || ''}
                onChange={(e) => {
                  const name = e.target.value;
                  updatePlan((plan) => ({ ...plan, name }));
                }}
                className="w-full bg-zinc-900 text-white px-4 py-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <label className="text-zinc-400 text-sm block mb-2">Description</label>
              <textarea
                value={parsedPlan?.description || ''}
                onChange={(e) => {
                  const description = e.target.value;
                  updatePlan((plan) => ({ ...plan, description }));
                }}
                className="w-full bg-zinc-900 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </Card>

            {/* Pre-Workout Stretches */}
            <section className="mb-8">
              <SectionHeader icon="🟢" iconClassName="text-green-500" label="Pre-Workout Stretches" />
              <AddButton
                onClick={() => { setInsertPreStretchAt(0); setShowPreStretchSelector(true); }}
                label="Add Pre-Stretch"
                color="green"
              />

              {preStretches.length === 0 ? (
                <EmptyState message="No pre-workout stretches" className="mb-2" />
              ) : (
                preStretches.map((stretch, index) => (
                  <div key={`pre-${index}`}>
                    <StretchItem
                      stretch={{ name: stretch.name, timerSeconds: stretch.timerSeconds }}
                      onDelete={() => handleDeleteStretch(index, 'pre')}
                    />
                    <AddButton
                      onClick={() => { setInsertPreStretchAt(index + 1); setShowPreStretchSelector(true); }}
                      label="Add Pre-Stretch"
                      color="green"
                    />
                  </div>
                ))
              )}
            </section>

            {/* Exercises */}
            <section className="mb-8">
              <SectionHeader icon="🔥" iconClassName="text-orange-500" label="Exercises" />
              <ExerciseAddRow
                onAddExercise={() => { setInsertExerciseAt(0); setShowExerciseSelector(true); }}
                onAddSuperset={() => { setInsertExerciseAt(0); setShowSupersetSelector(true); }}
              />

              {exercises.length === 0 ? (
                <EmptyState message="No exercises" className="mb-2" />
              ) : (
                exercises.map((exercise, index) => (
                  <div key={`ex-${index}`}>
                    <ExerciseItem
                      exercise={
                        exercise.type === EXERCISE_TYPES.b2b
                          ? {
                              exercise_name: exercise.exercises?.[0]?.name || 'Exercise 1',
                              exercise_type: EXERCISE_TYPES.b2b,
                              b2b_partner_name: exercise.exercises?.[1]?.name || 'Exercise 2'
                            }
                          : {
                              exercise_name: exercise.name,
                              exercise_type: EXERCISE_TYPES.single,
                              b2b_partner_name: null
                            }
                      }
                      onDelete={() => handleDeleteExercise(index)}
                    />
                    <ExerciseAddRow
                      onAddExercise={() => { setInsertExerciseAt(index + 1); setShowExerciseSelector(true); }}
                      onAddSuperset={() => { setInsertExerciseAt(index + 1); setShowSupersetSelector(true); }}
                    />
                  </div>
                ))
              )}
            </section>

            {/* Cardio (Optional) */}
            <section className="mb-8">
              <SectionHeader icon="❤️" iconClassName="text-red-500" label="Cardio (Optional)" />
              {cardio ? (
                <CardioItem
                  cardio={{
                    type: cardio.type || 'Cardio',
                    duration: cardio.duration,
                    intensity: cardio.intensity,
                    tips: cardio.tips
                  }}
                  onDelete={handleDeleteCardio}
                />
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
              <AddButton
                onClick={() => { setInsertPostStretchAt(0); setShowPostStretchSelector(true); }}
                label="Add Post-Stretch"
                color="blue"
              />

              {postStretches.length === 0 ? (
                <EmptyState message="No post-workout stretches" className="mb-2" />
              ) : (
                postStretches.map((stretch, index) => (
                  <div key={`post-${index}`}>
                    <StretchItem
                      stretch={{ name: stretch.name, timerSeconds: stretch.timerSeconds }}
                      onDelete={() => handleDeleteStretch(index, 'post')}
                    />
                    <AddButton
                      onClick={() => { setInsertPostStretchAt(index + 1); setShowPostStretchSelector(true); }}
                      label="Add Post-Stretch"
                      color="blue"
                    />
                  </div>
                ))
              )}
            </section>
          </>
        )}

        {error && (
          <div className="mt-6 bg-red-900/50 border border-red-600 text-red-200 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-6 bg-emerald-900/50 border border-emerald-600 text-emerald-200 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}
      </div>

      <BottomActionBar maxWidthClassName="max-w-4xl">
        <button
          onClick={handleSave}
          disabled={!planText.trim() || saving}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white py-4 rounded-lg text-xl font-bold transition-colors"
        >
          {saving ? 'Saving...' : 'Save & Exit'}
        </button>
      </BottomActionBar>

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
