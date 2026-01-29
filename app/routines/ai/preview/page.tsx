'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header';

const STORAGE_KEY = 'ai_routine_draft';

type Stretch = {
  name: string;
  duration?: string;
  tips?: string;
};

type SingleExercise = {
  type: 'single';
  name: string;
  sets?: number;
  targetReps?: number;
  targetWeight?: number;
  warmupWeight?: number;
  restTime?: number;
  tips?: string;
};

type B2BExercise = {
  type: 'b2b';
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
      {stretch.duration && (
        <div className="text-zinc-400 text-sm">{stretch.duration}</div>
      )}
      {stretch.tips && (
        <div className="text-zinc-500 text-xs mt-1">{stretch.tips}</div>
      )}
    </div>
  );
}

function ExercisePreviewItem({ exercise }: { exercise: SingleExercise | B2BExercise }) {
  if (exercise.type === 'b2b') {
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
  const [showPreStretchForm, setShowPreStretchForm] = useState(false);
  const [showPostStretchForm, setShowPostStretchForm] = useState(false);
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [showSupersetForm, setShowSupersetForm] = useState(false);
  const [insertPreStretchAt, setInsertPreStretchAt] = useState<number | null>(null);
  const [insertPostStretchAt, setInsertPostStretchAt] = useState<number | null>(null);
  const [insertExerciseAt, setInsertExerciseAt] = useState<number | null>(null);

  const [stretchForm, setStretchForm] = useState<Stretch>({
    name: '',
    duration: '',
    tips: '',
  });
  const [exerciseForm, setExerciseForm] = useState<SingleExercise>({
    type: 'single',
    name: '',
    sets: 3,
    targetReps: 10,
    targetWeight: 0,
    warmupWeight: 0,
    restTime: 60,
    tips: '',
  });
  const [supersetForm, setSupersetForm] = useState<B2BExercise>({
    type: 'b2b',
    exercises: [
      { name: '', sets: 3, targetReps: 10, targetWeight: 0, warmupWeight: 0, tips: '' },
      { name: '', sets: 3, targetReps: 10, targetWeight: 0, warmupWeight: 0, tips: '' },
    ],
  });

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

  const handleAddStretch = (type: 'pre' | 'post') => {
    if (!stretchForm.name?.trim()) return;
    updatePlan((plan) => {
      const next = { ...plan };
      const newStretch: Stretch = {
        name: stretchForm.name.trim(),
        duration: stretchForm.duration?.trim() || undefined,
        tips: stretchForm.tips?.trim() || undefined,
      };
      if (type === 'pre') {
        const pre = Array.isArray(next.preWorkoutStretches) ? [...next.preWorkoutStretches] : [];
        const insertAt = insertPreStretchAt ?? pre.length;
        pre.splice(insertAt, 0, newStretch);
        next.preWorkoutStretches = pre;
      } else {
        const post = Array.isArray(next.postWorkoutStretches) ? [...next.postWorkoutStretches] : [];
        const insertAt = insertPostStretchAt ?? post.length;
        post.splice(insertAt, 0, newStretch);
        next.postWorkoutStretches = post;
      }
      return next;
    });
    setStretchForm({ name: '', duration: '', tips: '' });
    setShowPreStretchForm(false);
    setShowPostStretchForm(false);
    setInsertPreStretchAt(null);
    setInsertPostStretchAt(null);
  };

  const handleAddExercise = () => {
    if (!exerciseForm.name?.trim()) return;
    updatePlan((plan) => {
      const exercises = Array.isArray(plan.exercises) ? [...plan.exercises] : [];
      const insertAt = insertExerciseAt ?? exercises.length;
      exercises.splice(insertAt, 0, {
        type: 'single',
        name: exerciseForm.name.trim(),
        sets: exerciseForm.sets || 3,
        targetReps: exerciseForm.targetReps || 10,
        targetWeight: exerciseForm.targetWeight || 0,
        warmupWeight: exerciseForm.warmupWeight || 0,
        restTime: exerciseForm.restTime || 60,
        tips: exerciseForm.tips?.trim() || undefined,
      });
      return { ...plan, exercises };
    });
    setExerciseForm({
      type: 'single',
      name: '',
      sets: 3,
      targetReps: 10,
      targetWeight: 0,
      warmupWeight: 0,
      restTime: 60,
      tips: '',
    });
    setShowExerciseForm(false);
    setInsertExerciseAt(null);
  };

  const handleAddSuperset = () => {
    const ex1 = supersetForm.exercises[0];
    const ex2 = supersetForm.exercises[1];
    if (!ex1?.name?.trim() || !ex2?.name?.trim()) return;
    updatePlan((plan) => {
      const exercises = Array.isArray(plan.exercises) ? [...plan.exercises] : [];
      const insertAt = insertExerciseAt ?? exercises.length;
      exercises.splice(insertAt, 0, {
        type: 'b2b',
        exercises: [
          {
            name: ex1.name.trim(),
            sets: ex1.sets || 3,
            targetReps: ex1.targetReps || 10,
            targetWeight: ex1.targetWeight || 0,
            warmupWeight: ex1.warmupWeight || 0,
            tips: ex1.tips?.trim() || undefined,
          },
          {
            name: ex2.name.trim(),
            sets: ex2.sets || 3,
            targetReps: ex2.targetReps || 10,
            targetWeight: ex2.targetWeight || 0,
            warmupWeight: ex2.warmupWeight || 0,
            tips: ex2.tips?.trim() || undefined,
          },
        ],
      });
      return { ...plan, exercises };
    });
    setSupersetForm({
      type: 'b2b',
      exercises: [
        { name: '', sets: 3, targetReps: 10, targetWeight: 0, warmupWeight: 0, tips: '' },
        { name: '', sets: 3, targetReps: 10, targetWeight: 0, warmupWeight: 0, tips: '' },
      ],
    });
    setShowSupersetForm(false);
    setInsertExerciseAt(null);
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
      setTimeout(() => router.push('/'), 1500);
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
          <Header />
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
        <Header />
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
            <div className="bg-zinc-800 rounded-lg p-6 border-2 border-zinc-700 mb-6">
              <h2 className="text-2xl font-bold text-white">{preview.name}</h2>
              {preview.description && (
                <div className="text-zinc-400 mt-2">{preview.description}</div>
              )}
            </div>

            {/* Pre-Workout Stretches */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-green-500">🟢</span> Pre-Workout Stretches
              </h2>
              {preStretches.length === 0 ? (
                <div className="text-zinc-500 text-center py-4 bg-zinc-800 rounded-lg mb-2">
                  No pre-workout stretches
                </div>
              ) : (
                preStretches.map((stretch, index) => (
                  <StretchPreviewItem key={`pre-${index}`} stretch={stretch} />
                ))
              )}
            </section>

            {/* Exercises */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-orange-500">🔥</span> Exercises
              </h2>
              {exercises.length === 0 ? (
                <div className="text-zinc-500 text-center py-4 bg-zinc-800 rounded-lg mb-2">
                  No exercises
                </div>
              ) : (
                exercises.map((exercise, index) => (
                  <ExercisePreviewItem key={`ex-${index}`} exercise={exercise} />
                ))
              )}
            </section>

            {/* Cardio (Optional) */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-red-500">❤️</span> Cardio (Optional)
              </h2>
              {cardio ? (
                <div className="bg-zinc-800 rounded-lg p-4 border-2 border-red-900 mb-2">
                  <div className="text-white font-semibold text-lg">{cardio.type || 'Cardio'}</div>
                  {cardio.duration && (
                    <div className="text-zinc-400 text-sm">{cardio.duration}</div>
                  )}
                  {cardio.intensity && (
                    <div className="text-zinc-500 text-sm">{cardio.intensity}</div>
                  )}
                  {cardio.tips && (
                    <div className="text-zinc-500 text-xs mt-1">{cardio.tips}</div>
                  )}
                </div>
              ) : (
                <div className="text-zinc-500 text-center py-4 bg-zinc-800 rounded-lg mb-2">
                  No cardio
                </div>
              )}
            </section>

            {/* Post-Workout Stretches */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-blue-500">🔵</span> Post-Workout Stretches
              </h2>
              {postStretches.length === 0 ? (
                <div className="text-zinc-500 text-center py-4 bg-zinc-800 rounded-lg mb-2">
                  No post-workout stretches
                </div>
              ) : (
                postStretches.map((stretch, index) => (
                  <StretchPreviewItem key={`post-${index}`} stretch={stretch} />
                ))
              )}
            </section>
          </>
        ) : (
          <>
            <div className="bg-zinc-800 rounded-lg p-6 border-2 border-zinc-700 mb-6">
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
            </div>

            {/* Pre-Workout Stretches */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-green-500">🟢</span> Pre-Workout Stretches
              </h2>
              <button
                onClick={() => { setInsertPreStretchAt(0); setShowPreStretchForm(true); }}
                className="w-full py-2 text-sm rounded bg-green-900/50 text-white hover:bg-green-800/50 transition-colors mb-2"
              >
                + Add Pre-Stretch
              </button>

              {preStretches.length === 0 ? (
                <div className="text-zinc-500 text-center py-4 bg-zinc-800 rounded-lg mb-2">
                  No pre-workout stretches
                </div>
              ) : (
                preStretches.map((stretch, index) => (
                  <div key={`pre-${index}`}>
                    <div className="relative">
                      <StretchPreviewItem stretch={stretch} />
                      <button
                        onClick={() => handleDeleteStretch(index, 'pre')}
                        className="absolute top-3 right-3 text-red-500 hover:text-red-400 p-2"
                        title="Delete"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <button
                      onClick={() => { setInsertPreStretchAt(index + 1); setShowPreStretchForm(true); }}
                      className="w-full py-2 text-sm rounded bg-green-900/50 text-white hover:bg-green-800/50 transition-colors mb-2"
                    >
                      + Add Pre-Stretch
                    </button>
                  </div>
                ))
              )}
            </section>

            {/* Exercises */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-orange-500">🔥</span> Exercises
              </h2>
              <div className="flex gap-2 mb-2">
                <button
                  onClick={() => { setInsertExerciseAt(0); setShowExerciseForm(true); }}
                  className="flex-1 py-2 text-sm rounded bg-orange-900/60 text-white hover:bg-orange-800/60 transition-colors"
                >
                  + Exercise
                </button>
                <button
                  onClick={() => { setInsertExerciseAt(0); setShowSupersetForm(true); }}
                  className="flex-1 py-2 text-sm rounded bg-purple-900/60 text-white hover:bg-purple-800/60 transition-colors"
                >
                  + Superset
                </button>
              </div>

              {exercises.length === 0 ? (
                <div className="text-zinc-500 text-center py-4 bg-zinc-800 rounded-lg mb-2">
                  No exercises
                </div>
              ) : (
                exercises.map((exercise, index) => (
                  <div key={`ex-${index}`}>
                    <div className="relative">
                      <ExercisePreviewItem exercise={exercise} />
                      <button
                        onClick={() => handleDeleteExercise(index)}
                        className="absolute top-3 right-3 text-red-500 hover:text-red-400 p-2"
                        title="Delete"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex gap-2 mb-2">
                      <button
                        onClick={() => { setInsertExerciseAt(index + 1); setShowExerciseForm(true); }}
                        className="flex-1 py-2 text-sm rounded bg-orange-900/60 text-white hover:bg-orange-800/60 transition-colors"
                      >
                        + Exercise
                      </button>
                      <button
                        onClick={() => { setInsertExerciseAt(index + 1); setShowSupersetForm(true); }}
                        className="flex-1 py-2 text-sm rounded bg-purple-900/60 text-white hover:bg-purple-800/60 transition-colors"
                      >
                        + Superset
                      </button>
                    </div>
                  </div>
                ))
              )}
            </section>

            {/* Cardio (Optional) */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-red-500">❤️</span> Cardio (Optional)
              </h2>
              {cardio ? (
                <div className="bg-zinc-800 rounded-lg p-4 border-2 border-red-900 mb-2">
                  <div className="text-white font-semibold text-lg">{cardio.type || 'Cardio'}</div>
                  {cardio.duration && (
                    <div className="text-zinc-400 text-sm">{cardio.duration}</div>
                  )}
                  {cardio.intensity && (
                    <div className="text-zinc-500 text-sm">{cardio.intensity}</div>
                  )}
                  {cardio.tips && (
                    <div className="text-zinc-500 text-xs mt-1">{cardio.tips}</div>
                  )}
                </div>
              ) : (
                <div className="text-zinc-500 text-center py-4 bg-zinc-800 rounded-lg mb-2">
                  No cardio
                </div>
              )}
            </section>

            {/* Post-Workout Stretches */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-blue-500">🔵</span> Post-Workout Stretches
              </h2>
              <button
                onClick={() => { setInsertPostStretchAt(0); setShowPostStretchForm(true); }}
                className="w-full py-2 text-sm rounded bg-blue-900/50 text-white hover:bg-blue-800/50 transition-colors mb-2"
              >
                + Add Post-Stretch
              </button>

              {postStretches.length === 0 ? (
                <div className="text-zinc-500 text-center py-4 bg-zinc-800 rounded-lg mb-2">
                  No post-workout stretches
                </div>
              ) : (
                postStretches.map((stretch, index) => (
                  <div key={`post-${index}`}>
                    <div className="relative">
                      <StretchPreviewItem stretch={stretch} />
                      <button
                        onClick={() => handleDeleteStretch(index, 'post')}
                        className="absolute top-3 right-3 text-red-500 hover:text-red-400 p-2"
                        title="Delete"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <button
                      onClick={() => { setInsertPostStretchAt(index + 1); setShowPostStretchForm(true); }}
                      className="w-full py-2 text-sm rounded bg-blue-900/50 text-white hover:bg-blue-800/50 transition-colors mb-2"
                    >
                      + Add Post-Stretch
                    </button>
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

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-zinc-900 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleSave}
            disabled={!planText.trim() || saving}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white py-4 rounded-lg text-xl font-bold transition-colors"
          >
            {saving ? 'Saving...' : 'Save & Exit'}
          </button>
        </div>
      </div>

      {showPreStretchForm && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-800 rounded-lg p-6 max-w-md w-full border-2 border-green-700">
            <h2 className="text-xl font-bold text-white mb-4">Add Pre-Stretch</h2>
            <div className="space-y-3 mb-4">
              <input
                value={stretchForm.name || ''}
                onChange={(e) => setStretchForm({ ...stretchForm, name: e.target.value })}
                placeholder="Stretch name"
                className="w-full bg-zinc-900 text-white px-3 py-2 rounded"
              />
              <input
                value={stretchForm.duration || ''}
                onChange={(e) => setStretchForm({ ...stretchForm, duration: e.target.value })}
                placeholder="Duration (e.g., 30 seconds)"
                className="w-full bg-zinc-900 text-white px-3 py-2 rounded"
              />
              <textarea
                value={stretchForm.tips || ''}
                onChange={(e) => setStretchForm({ ...stretchForm, tips: e.target.value })}
                placeholder="Tips (optional)"
                className="w-full bg-zinc-900 text-white px-3 py-2 rounded"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleAddStretch('pre')}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded"
              >
                Add
              </button>
              <button
                onClick={() => { setShowPreStretchForm(false); setInsertPreStretchAt(null); }}
                className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showPostStretchForm && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-800 rounded-lg p-6 max-w-md w-full border-2 border-blue-700">
            <h2 className="text-xl font-bold text-white mb-4">Add Post-Stretch</h2>
            <div className="space-y-3 mb-4">
              <input
                value={stretchForm.name || ''}
                onChange={(e) => setStretchForm({ ...stretchForm, name: e.target.value })}
                placeholder="Stretch name"
                className="w-full bg-zinc-900 text-white px-3 py-2 rounded"
              />
              <input
                value={stretchForm.duration || ''}
                onChange={(e) => setStretchForm({ ...stretchForm, duration: e.target.value })}
                placeholder="Duration (e.g., 45 seconds)"
                className="w-full bg-zinc-900 text-white px-3 py-2 rounded"
              />
              <textarea
                value={stretchForm.tips || ''}
                onChange={(e) => setStretchForm({ ...stretchForm, tips: e.target.value })}
                placeholder="Tips (optional)"
                className="w-full bg-zinc-900 text-white px-3 py-2 rounded"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleAddStretch('post')}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
              >
                Add
              </button>
              <button
                onClick={() => { setShowPostStretchForm(false); setInsertPostStretchAt(null); }}
                className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showExerciseForm && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-800 rounded-lg p-6 max-w-md w-full border-2 border-orange-700">
            <h2 className="text-xl font-bold text-white mb-4">Add Exercise</h2>
            <div className="space-y-3 mb-4">
              <input
                value={exerciseForm.name || ''}
                onChange={(e) => setExerciseForm({ ...exerciseForm, name: e.target.value })}
                placeholder="Exercise name"
                className="w-full bg-zinc-900 text-white px-3 py-2 rounded"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={exerciseForm.sets ?? 3}
                  onChange={(e) => setExerciseForm({ ...exerciseForm, sets: Number(e.target.value) })}
                  placeholder="Sets"
                  className="w-full bg-zinc-900 text-white px-3 py-2 rounded"
                />
                <input
                  type="number"
                  value={exerciseForm.targetReps ?? 10}
                  onChange={(e) => setExerciseForm({ ...exerciseForm, targetReps: Number(e.target.value) })}
                  placeholder="Reps"
                  className="w-full bg-zinc-900 text-white px-3 py-2 rounded"
                />
                <input
                  type="number"
                  value={exerciseForm.targetWeight ?? 0}
                  onChange={(e) => setExerciseForm({ ...exerciseForm, targetWeight: Number(e.target.value) })}
                  placeholder="Weight"
                  className="w-full bg-zinc-900 text-white px-3 py-2 rounded"
                />
                <input
                  type="number"
                  value={exerciseForm.warmupWeight ?? 0}
                  onChange={(e) => setExerciseForm({ ...exerciseForm, warmupWeight: Number(e.target.value) })}
                  placeholder="Warmup"
                  className="w-full bg-zinc-900 text-white px-3 py-2 rounded"
                />
                <input
                  type="number"
                  value={exerciseForm.restTime ?? 60}
                  onChange={(e) => setExerciseForm({ ...exerciseForm, restTime: Number(e.target.value) })}
                  placeholder="Rest (s)"
                  className="w-full bg-zinc-900 text-white px-3 py-2 rounded"
                />
              </div>
              <textarea
                value={exerciseForm.tips || ''}
                onChange={(e) => setExerciseForm({ ...exerciseForm, tips: e.target.value })}
                placeholder="Tips (optional)"
                className="w-full bg-zinc-900 text-white px-3 py-2 rounded"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddExercise}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 rounded"
              >
                Add
              </button>
              <button
                onClick={() => { setShowExerciseForm(false); setInsertExerciseAt(null); }}
                className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showSupersetForm && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-800 rounded-lg p-6 max-w-md w-full border-2 border-purple-700">
            <h2 className="text-xl font-bold text-white mb-4">Add Superset</h2>
            <div className="space-y-4 mb-4">
              {supersetForm.exercises.map((exercise, idx) => (
                <div key={`superset-${idx}`} className="space-y-2">
                  <div className="text-purple-300 text-xs font-semibold">
                    Exercise {idx + 1}
                  </div>
                  <input
                    value={exercise.name || ''}
                    onChange={(e) => {
                      const next = [...supersetForm.exercises];
                      next[idx] = { ...next[idx], name: e.target.value };
                      setSupersetForm({ ...supersetForm, exercises: next });
                    }}
                    placeholder="Exercise name"
                    className="w-full bg-zinc-900 text-white px-3 py-2 rounded"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={exercise.sets ?? 3}
                      onChange={(e) => {
                        const next = [...supersetForm.exercises];
                        next[idx] = { ...next[idx], sets: Number(e.target.value) };
                        setSupersetForm({ ...supersetForm, exercises: next });
                      }}
                      placeholder="Sets"
                      className="w-full bg-zinc-900 text-white px-3 py-2 rounded"
                    />
                    <input
                      type="number"
                      value={exercise.targetReps ?? 10}
                      onChange={(e) => {
                        const next = [...supersetForm.exercises];
                        next[idx] = { ...next[idx], targetReps: Number(e.target.value) };
                        setSupersetForm({ ...supersetForm, exercises: next });
                      }}
                      placeholder="Reps"
                      className="w-full bg-zinc-900 text-white px-3 py-2 rounded"
                    />
                    <input
                      type="number"
                      value={exercise.targetWeight ?? 0}
                      onChange={(e) => {
                        const next = [...supersetForm.exercises];
                        next[idx] = { ...next[idx], targetWeight: Number(e.target.value) };
                        setSupersetForm({ ...supersetForm, exercises: next });
                      }}
                      placeholder="Weight"
                      className="w-full bg-zinc-900 text-white px-3 py-2 rounded"
                    />
                    <input
                      type="number"
                      value={exercise.warmupWeight ?? 0}
                      onChange={(e) => {
                        const next = [...supersetForm.exercises];
                        next[idx] = { ...next[idx], warmupWeight: Number(e.target.value) };
                        setSupersetForm({ ...supersetForm, exercises: next });
                      }}
                      placeholder="Warmup"
                      className="w-full bg-zinc-900 text-white px-3 py-2 rounded"
                    />
                  </div>
                  <textarea
                    value={exercise.tips || ''}
                    onChange={(e) => {
                      const next = [...supersetForm.exercises];
                      next[idx] = { ...next[idx], tips: e.target.value };
                      setSupersetForm({ ...supersetForm, exercises: next });
                    }}
                    placeholder="Tips (optional)"
                    className="w-full bg-zinc-900 text-white px-3 py-2 rounded"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddSuperset}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded"
              >
                Add
              </button>
              <button
                onClick={() => { setShowSupersetForm(false); setInsertExerciseAt(null); }}
                className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
