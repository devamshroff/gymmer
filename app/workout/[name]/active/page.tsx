'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { WorkoutPlan, Exercise, SingleExercise, B2BExercise } from '@/lib/types';
import { addExerciseToSession } from '@/lib/workout-session';
import ExerciseSelector from '@/app/components/ExerciseSelector';
import SupersetSelector from '@/app/components/SupersetSelector';
import { getFormTips, getVideoUrl } from '@/lib/workout-media';
import { acknowledgeChangeWarning, hasChangeWarningAck, loadSessionWorkout, saveSessionWorkout } from '@/lib/session-workout';
import Header from '@/app/components/Header';
import WorkoutNavHeader from '@/app/components/WorkoutNavHeader';

interface SetData {
  weight: number;
  reps: number;
}

type ExerciseOption = {
  id: number;
  name: string;
  video_url: string | null;
  tips: string | null;
  equipment?: string | null;
  is_custom?: number;
};

function normalizeDateString(value: string): string {
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(value)) {
    return `${value.replace(' ', 'T')}Z`;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return `${value}T00:00:00Z`;
  }
  return value;
}

function formatLocalDate(value?: string | null): string {
  if (!value) return 'Unknown date';
  const date = new Date(normalizeDateString(value));
  if (Number.isNaN(date.getTime())) return 'Unknown date';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function ActiveWorkoutContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [workout, setWorkout] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [initialIndexSet, setInitialIndexSet] = useState(false);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTimeRemaining, setRestTimeRemaining] = useState(0);

  // Single exercise state
  const [setData, setSetData] = useState<SetData>({ weight: 0, reps: 0 });
  const [completedSets, setCompletedSets] = useState<SetData[]>([]);

  // B2B/Superset state
  const [currentExerciseInPair, setCurrentExerciseInPair] = useState(0); // 0 or 1
  const [setData1, setSetData1] = useState<SetData>({ weight: 0, reps: 0 });
  const [setData2, setSetData2] = useState<SetData>({ weight: 0, reps: 0 });
  const [completedPairs, setCompletedPairs] = useState<Array<{ ex1: SetData; ex2: SetData }>>([]);

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionTimeRemaining, setTransitionTimeRemaining] = useState(60);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showExerciseTypePicker, setShowExerciseTypePicker] = useState(false);
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [showSupersetSelector, setShowSupersetSelector] = useState(false);
  const [exerciseActionMode, setExerciseActionMode] = useState<'add' | 'replace' | null>(null);
  const [showChangeWarning, setShowChangeWarning] = useState(false);
  const pendingChangeRef = useRef<(() => void) | null>(null);

  // Last exercise log from database
  const [lastExerciseLog, setLastExerciseLog] = useState<any>(null);
  const [lastPartnerExerciseLog, setLastPartnerExerciseLog] = useState<any>(null);

  // Review mode: cache completed exercises and track viewing
  type CompletedExerciseCache = {
    exerciseIndex: number;
    exerciseName: string;
    type: 'single' | 'b2b';
    completedSets?: SetData[];
    completedPairs?: Array<{ ex1: SetData; ex2: SetData }>;
  };
  const [completedExercisesCache, setCompletedExercisesCache] = useState<CompletedExerciseCache[]>([]);
  const [viewingExerciseIndex, setViewingExerciseIndex] = useState(0); // Which exercise we're viewing (can be past/current)

  // Get routineId from URL params (for public/favorited routines)
  const routineIdParam = searchParams.get('routineId');
  const routineQuery = routineIdParam ? `?routineId=${routineIdParam}` : '';

  useEffect(() => {
    async function fetchWorkout() {
      try {
        let apiUrl = `/api/workout/${params.name}`;
        if (routineIdParam) {
          apiUrl += `?routineId=${routineIdParam}`;
        }
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Workout not found');
        }
        const data = await response.json();
        const baseWorkout = data.workout as WorkoutPlan;
        const sessionWorkout = loadSessionWorkout(baseWorkout.name, routineIdParam);
        const resolvedWorkout = sessionWorkout || baseWorkout;
        setWorkout(resolvedWorkout);

        // Check for index in URL (for navigation from other sections)
        const indexParam = searchParams.get('index');
        let startIndex = 0;
        if (indexParam && !initialIndexSet) {
          const idx = parseInt(indexParam, 10);
          if (!isNaN(idx) && idx >= 0 && idx < resolvedWorkout.exercises.length) {
            startIndex = idx;
            setCurrentExerciseIndex(idx);
            setViewingExerciseIndex(idx);
          }
          setInitialIndexSet(true);
        }

        // Initialize exercise at startIndex
        const exercise = resolvedWorkout.exercises[startIndex];
        if (exercise.type === 'single') {
          // Check if warmup is needed
          const needsWarmup = exercise.warmupWeight !== exercise.targetWeight;
          setSetData({
            weight: needsWarmup ? exercise.warmupWeight : exercise.targetWeight,
            reps: exercise.targetReps,
          });
          // If no warmup needed, start at set 1 instead of set 0
          if (!needsWarmup) {
            setCurrentSetIndex(1);
          }
        } else {
          // B2B exercise - no warmups, start at set 1
          const b2bEx = exercise as B2BExercise;
          setSetData1({
            weight: b2bEx.exercises[0].targetWeight,
            reps: b2bEx.exercises[0].targetReps,
          });
          setSetData2({
            weight: b2bEx.exercises[1].targetWeight,
            reps: b2bEx.exercises[1].targetReps,
          });
          setCurrentSetIndex(1);
          setCurrentExerciseInPair(0); // Start with first exercise
        }
      } catch (error) {
        console.error('Error fetching workout:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchWorkout();
  }, [params.name, searchParams, routineIdParam, initialIndexSet]);

  // Rest timer countdown
  useEffect(() => {
    if (isResting && restTimeRemaining > 0) {
      const timer = setTimeout(() => {
        setRestTimeRemaining(restTimeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isResting && restTimeRemaining === 0) {
      // Vibrate when rest is complete
      if ('vibrate' in navigator) {
        navigator.vibrate(500);
      }
    }
  }, [isResting, restTimeRemaining]);

  // Transition timer countdown
  useEffect(() => {
    if (isTransitioning && transitionTimeRemaining > 0) {
      const timer = setTimeout(() => {
        setTransitionTimeRemaining(transitionTimeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isTransitioning && transitionTimeRemaining === 0 && workout) {
      // Transition complete - move to next exercise
      const nextExerciseIndex = currentExerciseIndex + 1;
      setIsTransitioning(false);
      setCurrentExerciseIndex(nextExerciseIndex);
      setViewingExerciseIndex(nextExerciseIndex); // Keep viewing in sync with active exercise
      setCompletedSets([]);

      // Initialize next exercise
      const nextExercise = workout.exercises[nextExerciseIndex];
      if (nextExercise.type === 'single') {
        // Check if warmup is needed
        const needsWarmup = nextExercise.warmupWeight !== nextExercise.targetWeight;
        setSetData({
          weight: needsWarmup ? nextExercise.warmupWeight : nextExercise.targetWeight,
          reps: nextExercise.targetReps,
        });
        setCurrentSetIndex(needsWarmup ? 0 : 1);
      } else {
        // B2B exercise - no warmups, start at set 1
        const b2bEx = nextExercise as B2BExercise;
        setSetData1({
          weight: b2bEx.exercises[0].targetWeight,
          reps: b2bEx.exercises[0].targetReps,
        });
        setSetData2({
          weight: b2bEx.exercises[1].targetWeight,
          reps: b2bEx.exercises[1].targetReps,
        });
        setCurrentSetIndex(1);
        setCurrentExerciseInPair(0);
        setCompletedPairs([]);
      }
    }
  }, [isTransitioning, transitionTimeRemaining, workout, currentExerciseIndex]);

  // Fetch last exercise log(s) from database when exercise changes
  useEffect(() => {
    async function fetchLastExerciseLog() {
      if (!workout) return;

      const currentExercise = workout.exercises[currentExerciseIndex];

      const fetchLog = async (exerciseName: string) => {
        try {
          const response = await fetch(
            `/api/last-exercise?exerciseName=${encodeURIComponent(exerciseName)}`
          );
          if (!response.ok) return null;
          const data = await response.json();
          return data.lastLog;
        } catch (error) {
          console.error('Error fetching last exercise log:', error);
          return null;
        }
      };

      if (currentExercise.type === 'single') {
        const log = await fetchLog(currentExercise.name);
        setLastExerciseLog(log);
        setLastPartnerExerciseLog(null);
      } else {
        const b2bExercise = currentExercise as B2BExercise;
        const [log1, log2] = await Promise.all([
          fetchLog(b2bExercise.exercises[0].name),
          fetchLog(b2bExercise.exercises[1].name),
        ]);
        setLastExerciseLog(log1);
        setLastPartnerExerciseLog(log2);
      }
    }

    fetchLastExerciseLog();
  }, [workout, currentExerciseIndex]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-white text-2xl mb-4">Workout not found</div>
          <Link href="/" className="text-blue-400 hover:text-blue-300">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const currentExercise = workout.exercises[currentExerciseIndex];

  // Review mode: determine if viewing a previous exercise
  const isReviewMode = viewingExerciseIndex < currentExerciseIndex;
  const viewingExercise = workout.exercises[viewingExerciseIndex];
  const viewingCachedData = completedExercisesCache.find(cache => cache.exerciseIndex === viewingExerciseIndex);
  const lastExerciseDate = lastExerciseLog?.completed_at || lastExerciseLog?.created_at;
  const lastPartnerExerciseDate = lastPartnerExerciseLog?.completed_at || lastPartnerExerciseLog?.created_at;

  // Calculate total workout items for progress
  const totalItems =
    workout.preWorkoutStretches.length +
    workout.exercises.length +
    (workout.cardio ? 1 : 0) +
    workout.postWorkoutStretches.length;
  const currentProgress = workout.preWorkoutStretches.length + currentExerciseIndex + 1;
  const progressPercentage = (currentProgress / totalItems) * 100;

  // B2B Exercise Handlers
  const handleCompleteB2BExercise = () => {
    const b2bExercise = currentExercise as B2BExercise;

    if (currentExerciseInPair === 0) {
      // Just completed first exercise, immediately move to second
      setCurrentExerciseInPair(1);
    } else {
      // Completed both exercises in the pair
      const newCompletedPairs = [...completedPairs, { ex1: setData1, ex2: setData2 }];
      const totalSets = b2bExercise.exercises[0].sets;

      console.log('B2B Completion Check:', {
        newCompletedPairsLength: newCompletedPairs.length,
        totalSets,
        shouldContinue: newCompletedPairs.length < totalSets
      });

      // Guard: Don't allow completing more sets than total
      if (newCompletedPairs.length > totalSets) {
        console.log('Already completed all sets, ignoring duplicate click');
        return;
      }

      setCompletedPairs(newCompletedPairs);

      if (newCompletedPairs.length < totalSets) {
        // More sets to go - no rest, immediately continue to next set
        setCurrentSetIndex(currentSetIndex + 1);
        setCurrentExerciseInPair(0); // Reset to first exercise for next round
      } else {
        // All sets complete - save to session and show transition to next exercise
        console.log('Finishing B2B exercise');
        addExerciseToSession({
          name: b2bExercise.exercises[0].name,
          type: 'b2b',
          sets: newCompletedPairs.map(pair => pair.ex1),
          b2bPartner: {
            name: b2bExercise.exercises[1].name,
            sets: newCompletedPairs.map(pair => pair.ex2),
          },
        });

        // Cache completed B2B exercise for review
        setCompletedExercisesCache([...completedExercisesCache, {
          exerciseIndex: currentExerciseIndex,
          exerciseName: b2bExercise.exercises[0].name,
          type: 'b2b',
          completedPairs: newCompletedPairs,
        }]);

        if (currentExerciseIndex < workout!.exercises.length - 1) {
          setIsResting(false);
          setIsTransitioning(true);
          setTransitionTimeRemaining(60);
        } else {
          // All exercises done - always go to cardio (optional)
          router.push(`/workout/${encodeURIComponent(workout!.name)}/cardio${routineQuery}`);
        }
      }
    }
  };

  // Single Exercise Handlers
  const handleCompleteSet = () => {
    const newCompletedSets = [...completedSets, setData];
    setCompletedSets(newCompletedSets);

    const exercise = currentExercise as SingleExercise;

    if (currentSetIndex <= exercise.sets) {
      // More sets to go - start rest timer
      setIsResting(true);
      setRestTimeRemaining(exercise.restTime);
      setCurrentSetIndex(currentSetIndex + 1);

      // Auto-update weight for next set (if it was warmup, switch to working weight)
      if (currentSetIndex === 0) {
        setSetData({
          weight: exercise.targetWeight,
          reps: exercise.targetReps,
        });
      }
    } else {
      // Exercise complete - save to session
      const hasWarmup = exercise.warmupWeight !== exercise.targetWeight;
      addExerciseToSession({
        name: exercise.name,
        type: 'single',
        warmup: hasWarmup ? newCompletedSets[0] : undefined,
        sets: hasWarmup ? newCompletedSets.slice(1) : newCompletedSets,
      });

      // Cache completed exercise for review
      setCompletedExercisesCache([...completedExercisesCache, {
        exerciseIndex: currentExerciseIndex,
        exerciseName: exercise.name,
        type: 'single',
        completedSets: newCompletedSets,
      }]);

      // Show transition to next exercise
      if (currentExerciseIndex < workout.exercises.length - 1) {
        setIsResting(false);
        setIsTransitioning(true);
        setTransitionTimeRemaining(60);
      } else {
        // All exercises done - always go to cardio (optional)
        router.push(`/workout/${encodeURIComponent(workout.name)}/cardio${routineQuery}`);
      }
    }
  };

  const handleSkipRest = () => {
    setIsResting(false);
    setRestTimeRemaining(0);
  };

  const handleSkipWarmup = () => {
    const exercise = currentExercise as SingleExercise;
    // Move to set 1 (first working set)
    setCurrentSetIndex(1);
    setSetData({
      weight: exercise.targetWeight,
      reps: exercise.targetReps,
    });
  };

  const handleAddTime = () => {
    setRestTimeRemaining(restTimeRemaining + 15);
  };

  const handleSkipTransition = () => {
    setTransitionTimeRemaining(0);
  };

  const handleEndExercise = () => {
    console.log('handleEndExercise called', {
      exerciseType: currentExercise.type,
      currentExerciseIndex,
      totalExercises: workout!.exercises.length
    });

    // Save completed sets and move to next exercise
    if (currentExercise.type === 'single') {
      const exercise = currentExercise as SingleExercise;
      const hasWarmup = exercise.warmupWeight !== exercise.targetWeight;

      if (completedSets.length > 0) {
        addExerciseToSession({
          name: exercise.name,
          type: 'single',
          warmup: hasWarmup ? completedSets[0] : undefined,
          sets: hasWarmup ? completedSets.slice(1) : completedSets,
        });

        // Cache for review
        setCompletedExercisesCache([...completedExercisesCache, {
          exerciseIndex: currentExerciseIndex,
          exerciseName: exercise.name,
          type: 'single',
          completedSets: completedSets,
        }]);
      }
    } else {
      // B2B exercise
      const b2bExercise = currentExercise as B2BExercise;

      console.log('Ending B2B exercise early', {
        completedPairsLength: completedPairs.length
      });

      if (completedPairs.length > 0) {
        addExerciseToSession({
          name: b2bExercise.exercises[0].name,
          type: 'b2b',
          sets: completedPairs.map(pair => pair.ex1),
          b2bPartner: {
            name: b2bExercise.exercises[1].name,
            sets: completedPairs.map(pair => pair.ex2),
          },
        });

        // Cache for review
        setCompletedExercisesCache([...completedExercisesCache, {
          exerciseIndex: currentExerciseIndex,
          exerciseName: b2bExercise.exercises[0].name,
          type: 'b2b',
          completedPairs: completedPairs,
        }]);
      }
    }

    // Move to next exercise or finish
    if (currentExerciseIndex < workout!.exercises.length - 1) {
      console.log('Moving to next exercise');
      setIsResting(false);
      setIsTransitioning(true);
      setTransitionTimeRemaining(60);
      // Keep viewing index synced so next exercise isn't in read-only mode
      setViewingExerciseIndex(currentExerciseIndex);
    } else {
      console.log('All exercises done, going to cardio');
      // All exercises done - always go to cardio (optional)
      router.push(`/workout/${encodeURIComponent(workout!.name)}/cardio${routineQuery}`);
    }
  };

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // If viewing a previous exercise, go back one more
    if (viewingExerciseIndex > 0) {
      setViewingExerciseIndex(viewingExerciseIndex - 1);
    } else if (workout) {
      // At the first exercise, go back to pre-stretches (if any) or exit
      const preStretchCount = workout.preWorkoutStretches?.length || 0;
      if (preStretchCount > 0) {
        router.push(`/stretches/${encodeURIComponent(workout.name)}?index=${preStretchCount - 1}${routineIdParam ? `&routineId=${routineIdParam}` : ''}`);
      } else {
        setShowExitConfirm(true);
      }
    }
  };

  // Handle going to previous section (for WorkoutNavHeader)
  const handlePreviousSection = () => {
    if (!workout) return;

    if (viewingExerciseIndex > 0) {
      setViewingExerciseIndex(viewingExerciseIndex - 1);
    } else {
      // Go to last pre-stretch
      const preStretchCount = workout.preWorkoutStretches?.length || 0;
      if (preStretchCount > 0) {
        router.push(`/stretches/${encodeURIComponent(workout.name)}?index=${preStretchCount - 1}${routineIdParam ? `&routineId=${routineIdParam}` : ''}`);
      }
    }
  };

  const handleForwardClick = () => {
    // Can only go forward if there are completed exercises ahead
    if (viewingExerciseIndex < currentExerciseIndex) {
      setViewingExerciseIndex(viewingExerciseIndex + 1);
    }
  };

  const buildSingleExercise = (exercise: ExerciseOption): SingleExercise => ({
    type: 'single',
    name: exercise.name,
    sets: 3,
    targetReps: 10,
    targetWeight: 0,
    warmupWeight: 0,
    restTime: 60,
    videoUrl: exercise.video_url || '',
    tips: exercise.tips || ''
  });

  const buildSupersetExercise = (exercise1: ExerciseOption, exercise2: ExerciseOption): B2BExercise => ({
    type: 'b2b',
    restTime: 30,
    exercises: [
      {
        name: exercise1.name,
        sets: 3,
        targetReps: 10,
        targetWeight: 0,
        warmupWeight: 0,
        videoUrl: exercise1.video_url || '',
        tips: exercise1.tips || ''
      },
      {
        name: exercise2.name,
        sets: 3,
        targetReps: 10,
        targetWeight: 0,
        warmupWeight: 0,
        videoUrl: exercise2.video_url || '',
        tips: exercise2.tips || ''
      }
    ]
  });

  const applyWorkoutUpdate = (updatedWorkout: WorkoutPlan) => {
    setWorkout(updatedWorkout);
    saveSessionWorkout(updatedWorkout, routineIdParam);
  };

  const resetExerciseStateFor = (exercise: Exercise) => {
    setIsResting(false);
    setRestTimeRemaining(0);
    setIsTransitioning(false);
    setTransitionTimeRemaining(60);
    setCompletedSets([]);
    setCompletedPairs([]);
    setCurrentExerciseInPair(0);
    setLastExerciseLog(null);
    setLastPartnerExerciseLog(null);

    if (exercise.type === 'single') {
      const needsWarmup = exercise.warmupWeight !== exercise.targetWeight;
      setSetData({
        weight: needsWarmup ? exercise.warmupWeight : exercise.targetWeight,
        reps: exercise.targetReps,
      });
      setCurrentSetIndex(needsWarmup ? 0 : 1);
    } else {
      const b2bExercise = exercise as B2BExercise;
      setSetData1({
        weight: b2bExercise.exercises[0].targetWeight,
        reps: b2bExercise.exercises[0].targetReps,
      });
      setSetData2({
        weight: b2bExercise.exercises[1].targetWeight,
        reps: b2bExercise.exercises[1].targetReps,
      });
      setCurrentSetIndex(1);
    }

    setViewingExerciseIndex(currentExerciseIndex);
  };

  const runWithChangeWarning = (action: () => void) => {
    if (!workout) return;
    if (hasChangeWarningAck(workout.name, routineIdParam)) {
      action();
      return;
    }
    pendingChangeRef.current = action;
    setShowChangeWarning(true);
  };

  const handleWarningContinue = () => {
    if (!workout) {
      setShowChangeWarning(false);
      return;
    }
    acknowledgeChangeWarning(workout.name, routineIdParam);
    setShowChangeWarning(false);
    const action = pendingChangeRef.current;
    pendingChangeRef.current = null;
    action?.();
  };

  const handleWarningCancel = () => {
    pendingChangeRef.current = null;
    setShowChangeWarning(false);
  };

  const openExerciseTypePicker = (mode: 'add' | 'replace') => {
    runWithChangeWarning(() => {
      setExerciseActionMode(mode);
      setShowExerciseTypePicker(true);
    });
  };

  const handleSelectSingleExercise = (exercise: ExerciseOption) => {
    if (!workout || !exerciseActionMode) return;
    const nextExercise = buildSingleExercise(exercise);
    const updatedExercises = [...workout.exercises];
    const insertIndex = currentExerciseIndex + 1;

    if (exerciseActionMode === 'add') {
      updatedExercises.splice(insertIndex, 0, nextExercise);
    } else {
      updatedExercises[currentExerciseIndex] = nextExercise;
      resetExerciseStateFor(nextExercise);
    }

    applyWorkoutUpdate({ ...workout, exercises: updatedExercises });
    setExerciseActionMode(null);
    setShowExerciseSelector(false);
  };

  const handleSelectSuperset = (exercise1: ExerciseOption, exercise2: ExerciseOption) => {
    if (!workout || !exerciseActionMode) return;
    const nextExercise = buildSupersetExercise(exercise1, exercise2);
    const updatedExercises = [...workout.exercises];
    const insertIndex = currentExerciseIndex + 1;

    if (exerciseActionMode === 'add') {
      updatedExercises.splice(insertIndex, 0, nextExercise);
    } else {
      updatedExercises[currentExerciseIndex] = nextExercise;
      resetExerciseStateFor(nextExercise);
    }

    applyWorkoutUpdate({ ...workout, exercises: updatedExercises });
    setExerciseActionMode(null);
    setShowSupersetSelector(false);
  };

  const handleExerciseTypeCancel = () => {
    setShowExerciseTypePicker(false);
    setExerciseActionMode(null);
  };

  // Determine which exercise to display (for review mode vs active mode)
  const exerciseToDisplay = isReviewMode ? viewingExercise : currentExercise;
  const exerciseModifyControls = !isReviewMode ? (
    <div className="grid grid-cols-2 gap-3 mb-6">
      <button
        onClick={() => openExerciseTypePicker('add')}
        className="bg-emerald-600/80 hover:bg-emerald-500 text-white py-2 rounded-lg text-sm font-semibold transition-colors"
      >
        + Add Exercise
      </button>
      <button
        onClick={() => openExerciseTypePicker('replace')}
        className="bg-orange-600/80 hover:bg-orange-500 text-white py-2 rounded-lg text-sm font-semibold transition-colors"
      >
        ↺ Replace Exercise
      </button>
    </div>
  ) : null;
  const exerciseModals = (
    <>
      {showChangeWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-lg border border-zinc-700 bg-zinc-900 p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Session-only change</h3>
            <p className="text-sm text-zinc-300 mb-6">
              This edit only applies to today&apos;s workout. Edit the routine to make a permanent change.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleWarningCancel}
                className="rounded-lg bg-zinc-700 py-2 text-sm font-semibold text-white hover:bg-zinc-600"
              >
                Cancel
              </button>
              <button
                onClick={handleWarningContinue}
                className="rounded-lg bg-emerald-600 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {showExerciseTypePicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-sm rounded-lg border border-zinc-700 bg-zinc-900 p-5 text-white">
            <h3 className="text-lg font-semibold mb-4">Choose exercise type</h3>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowExerciseTypePicker(false);
                  setShowExerciseSelector(true);
                }}
                className="w-full rounded-lg bg-emerald-600 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
              >
                Single exercise
              </button>
              <button
                onClick={() => {
                  setShowExerciseTypePicker(false);
                  setShowSupersetSelector(true);
                }}
                className="w-full rounded-lg bg-purple-600 py-2 text-sm font-semibold text-white hover:bg-purple-500"
              >
                Superset
              </button>
              <button
                onClick={handleExerciseTypeCancel}
                className="w-full rounded-lg bg-zinc-700 py-2 text-sm font-semibold text-white hover:bg-zinc-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showExerciseSelector && (
        <ExerciseSelector
          title={exerciseActionMode === 'replace' ? 'Replace Exercise' : 'Add Exercise'}
          onCancel={() => {
            setShowExerciseSelector(false);
            setExerciseActionMode(null);
          }}
          onSelect={handleSelectSingleExercise}
        />
      )}

      {showSupersetSelector && (
        <SupersetSelector
          onCancel={() => {
            setShowSupersetSelector(false);
            setExerciseActionMode(null);
          }}
          onSelect={handleSelectSuperset}
        />
      )}
    </>
  );

  // Handle B2B/Superset exercises
  if (exerciseToDisplay.type === 'b2b') {
    const b2bExercise = exerciseToDisplay as B2BExercise;
    const ex1 = b2bExercise.exercises[0];
    const ex2 = b2bExercise.exercises[1];

    // In review mode, show cached completed pairs
    const displayCompletedPairs = isReviewMode && viewingCachedData
      ? viewingCachedData.completedPairs || []
      : completedPairs;

    // Transition Screen (for B2B)
    if (isTransitioning) {
      return (
        <div className="min-h-screen bg-zinc-900 p-4">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="text-zinc-400">Exercise {currentExerciseIndex + 1}/{workout.exercises.length}</div>
            </div>

            {/* Exercise Names */}
            <h1 className="text-2xl font-bold text-white text-center mb-2">{ex1.name}</h1>
            <div className="text-purple-400 text-center text-lg mb-8">+ {ex2.name}</div>

            {/* Exercise Complete */}
            <div className="text-center mb-8">
              <div className="text-green-500 text-6xl mb-2">✓</div>
              <div className="text-white text-2xl font-semibold">EXERCISE COMPLETE</div>
            </div>

            {/* Transition Timer */}
            <div className={`bg-zinc-800 rounded-lg p-12 mb-8 text-center border-4 ${transitionTimeRemaining === 0 ? 'border-zinc-700' : 'border-orange-600'}`}>
              <div className={`text-xl mb-4 ${transitionTimeRemaining === 0 ? 'text-zinc-400' : 'text-orange-400'}`}>Chilll Outtt</div>
              <div className={`text-8xl font-bold mb-2 ${transitionTimeRemaining === 0 ? 'text-orange-400' : 'text-white'}`}>
                {transitionTimeRemaining}
              </div>
              <div className="text-zinc-400 text-lg">seconds</div>
            </div>

            {/* Timer Controls */}
            <div className="space-y-3">
              <button
                onClick={() => setTransitionTimeRemaining(0)}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg text-lg font-bold transition-colors"
              >
                Skip Timer →
              </button>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setTransitionTimeRemaining(Math.max(0, transitionTimeRemaining - 15))}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  -15s
                </button>
                <button
                  onClick={() => setTransitionTimeRemaining(transitionTimeRemaining + 15)}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  +15s
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Rest Timer Screen (for B2B)
    if (isResting) {
      return (
        <div className="min-h-screen bg-zinc-900 p-4">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="text-zinc-400">Exercise {currentExerciseIndex + 1}/{workout.exercises.length}</div>
            </div>

            {/* Exercise Names */}
            <h1 className="text-2xl font-bold text-white text-center mb-2">{ex1.name}</h1>
            <div className="text-purple-400 text-center text-lg mb-8">+ {ex2.name}</div>

            {/* Set Complete */}
            <div className="text-center mb-8">
              <div className="text-green-500 text-6xl mb-2">✓</div>
              <div className="text-white text-2xl font-semibold">
                SET {completedPairs.length} COMPLETE
              </div>
            </div>

            {/* Rest Timer */}
            <div className={`bg-zinc-800 rounded-lg p-12 mb-8 text-center border-4 ${restTimeRemaining === 0 ? 'border-zinc-700' : 'border-purple-600'}`}>
              <div className={`text-xl mb-4 ${restTimeRemaining === 0 ? 'text-zinc-400' : 'text-purple-400'}`}>REST TIME</div>
              <div className={`text-8xl font-bold mb-2 ${restTimeRemaining === 0 ? 'text-purple-400' : 'text-white'}`}>
                {restTimeRemaining}
              </div>
              <div className="text-zinc-400 text-lg">seconds</div>
            </div>

            {/* Timer Controls */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button
                onClick={handleAddTime}
                className="bg-zinc-700 hover:bg-zinc-600 text-white py-4 rounded-lg text-lg font-semibold transition-colors"
              >
                + Add 15s
              </button>
              <button
                onClick={handleSkipRest}
                className="bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg text-lg font-semibold transition-colors"
              >
                {restTimeRemaining === 0 ? 'Continue Workout' : 'Skip Rest'}
              </button>
            </div>

            {/* Next Set Info */}
            <div className="bg-zinc-800 rounded-lg p-4 text-center">
              <div className="text-zinc-400 text-sm mb-2">Next up:</div>
              <div className="text-white text-xl font-semibold">
                Set {currentSetIndex}
              </div>
              <div className="text-zinc-300 text-base">
                {ex1.name} → {ex2.name}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // B2B Exercise Tracking Screen
    return (
      <div className="min-h-screen bg-zinc-900 p-4 pb-32">
        <div className="max-w-2xl mx-auto">
          <Header />
          {/* Navigation */}
          <WorkoutNavHeader
            exitUrl={`/workout/${encodeURIComponent(workout.name)}${routineQuery}`}
            previousUrl={null}
            onPrevious={handlePreviousSection}
            onNext={isReviewMode ? () => setViewingExerciseIndex(viewingExerciseIndex + 1) : undefined}
          />
          <div className="text-zinc-400 text-right mb-4 -mt-4">Exercise {viewingExerciseIndex + 1}/{workout.exercises.length}</div>

          {/* READ ONLY Banner */}
          {isReviewMode && (
            <div className="bg-yellow-900 border border-yellow-600 rounded-lg p-3 mb-6">
              <div className="text-yellow-200 text-sm font-semibold text-center">
                📖 READ ONLY - Cannot edit completed sets
              </div>
            </div>
          )}

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="text-zinc-500 text-sm text-center mt-2">
              Overall Progress: {currentProgress} / {totalItems}
            </div>
          </div>

          {exerciseModifyControls}

          {/* Superset Title */}
          <div className="text-center mb-6">
            <div className="text-purple-400 text-sm font-bold mb-2">🔄 SUPERSET</div>
            <div className="text-white text-lg font-semibold mb-1">
              SET {currentSetIndex} of {ex1.sets}
            </div>
          </div>

          {/* Last Time Section for B2B */}
          {(lastExerciseLog || lastPartnerExerciseLog) && (
            <div className="bg-zinc-800 rounded-lg p-4 mb-6 border border-zinc-700">
              <div className="text-zinc-400 text-sm mb-3">LAST TIME</div>
              <div className="grid grid-cols-2 gap-4">
                {/* Exercise 1 Last Time */}
                <div>
                  <div className="text-purple-400 text-xs font-semibold mb-1">{ex1.name}</div>
                  {lastExerciseLog ? (
                    <>
                      <div className="text-zinc-500 text-xs mb-2">
                        {formatLocalDate(lastExerciseDate)}
                      </div>
                      <div className="space-y-1">
                        {[1, 2, 3, 4].map((setNum) => {
                          const weight = lastExerciseLog[`set${setNum}_weight`];
                          const reps = lastExerciseLog[`set${setNum}_reps`];
                          if (weight !== null && reps !== null) {
                            return (
                              <div key={setNum} className="text-zinc-300 text-xs">
                                Set {setNum}: {weight} × {reps}
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </>
                  ) : (
                    <div className="text-zinc-500 text-xs">No history yet</div>
                  )}
                </div>
                {/* Exercise 2 Last Time */}
                <div>
                  <div className="text-purple-400 text-xs font-semibold mb-1">{ex2.name}</div>
                  {lastPartnerExerciseLog ? (
                    <>
                      <div className="text-zinc-500 text-xs mb-2">
                        {formatLocalDate(lastPartnerExerciseDate)}
                      </div>
                      <div className="space-y-1">
                        {[1, 2, 3, 4].map((setNum) => {
                          const weight = lastPartnerExerciseLog[`set${setNum}_weight`];
                          const reps = lastPartnerExerciseLog[`set${setNum}_reps`];
                          if (weight !== null && reps !== null) {
                            return (
                              <div key={setNum} className="text-zinc-300 text-xs">
                                Set {setNum}: {weight} × {reps}
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </>
                  ) : (
                    <div className="text-zinc-500 text-xs">No history yet</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Exercise 1 Card */}
          <div className={`bg-zinc-800 rounded-lg p-5 mb-4 transition-all ${
            currentExerciseInPair === 0 ? 'border-2 border-purple-600' : 'border border-zinc-700 opacity-60'
          }`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="text-zinc-500 text-xs mb-1">
                  Exercise 1 of 2 {currentExerciseInPair === 0 ? '(ACTIVE)' : completedPairs.length >= currentSetIndex ? '(Done)' : '(Next)'}
                </div>
                <h2 className="text-xl font-bold text-white mb-2">{ex1.name}</h2>
              </div>
              <a
                href={getVideoUrl(ex1.name, ex1.videoUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-500 hover:text-red-400 text-sm font-medium px-3 py-2 bg-zinc-900 rounded"
              >
                📺 Video
              </a>
            </div>

            {!isReviewMode && currentExerciseInPair === 0 ? (
              <>
                {/* Active: Show inputs */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-zinc-900 rounded-lg p-3">
                    <label className="text-zinc-400 text-xs block mb-1">Weight (lbs)</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={setData1.weight ?? ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '') {
                          setSetData1({ ...setData1, weight: 0 });
                        } else {
                          const num = parseFloat(val);
                          if (!isNaN(num)) {
                            setSetData1({ ...setData1, weight: num });
                          }
                        }
                      }}
                      className="w-full bg-zinc-800 text-white text-2xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="bg-zinc-900 rounded-lg p-3">
                    <label className="text-zinc-400 text-xs block mb-1">Reps</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={setData1.reps ?? ''}
                      onChange={(e) => setSetData1({ ...setData1, reps: parseInt(e.target.value) || 0 })}
                      className="w-full bg-zinc-800 text-white text-2xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="bg-zinc-900 rounded p-3 mb-3">
                  <div className="text-zinc-500 text-xs mb-1">Form Tips</div>
                  <p className="text-zinc-300 text-sm">{getFormTips(ex1.tips)}</p>
                </div>

                <button
                  onClick={handleCompleteB2BExercise}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg text-lg font-bold transition-colors"
                >
                  ✓ Complete Exercise 1
                </button>
              </>
            ) : (
              <>
                {/* Inactive: Show entered data */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-zinc-900 rounded p-3 text-center">
                    <div className="text-zinc-500 text-xs mb-1">Weight</div>
                    <div className="text-white text-xl font-semibold">
                      {setData1.weight} lbs
                    </div>
                  </div>
                  <div className="bg-zinc-900 rounded p-3 text-center">
                    <div className="text-zinc-500 text-xs mb-1">Reps</div>
                    <div className="text-white text-xl font-semibold">
                      {setData1.reps}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Exercise 2 Card */}
          <div className={`bg-zinc-800 rounded-lg p-5 mb-6 transition-all ${
            currentExerciseInPair === 1 ? 'border-2 border-purple-600' : 'border border-zinc-700 opacity-60'
          }`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="text-zinc-500 text-xs mb-1">
                  Exercise 2 of 2 {currentExerciseInPair === 1 ? '(ACTIVE)' : currentExerciseInPair === 0 ? '(Next)' : '(Done)'}
                </div>
                <h2 className="text-xl font-bold text-white mb-2">{ex2.name}</h2>
              </div>
              <a
                href={getVideoUrl(ex2.name, ex2.videoUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-500 hover:text-red-400 text-sm font-medium px-3 py-2 bg-zinc-900 rounded"
              >
                📺 Video
              </a>
            </div>

            {!isReviewMode && currentExerciseInPair === 1 ? (
              <>
                {/* Active: Show inputs */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-zinc-900 rounded-lg p-3">
                    <label className="text-zinc-400 text-xs block mb-1">Weight (lbs)</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={setData2.weight ?? ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '') {
                          setSetData2({ ...setData2, weight: 0 });
                        } else {
                          const num = parseFloat(val);
                          if (!isNaN(num)) {
                            setSetData2({ ...setData2, weight: num });
                          }
                        }
                      }}
                      className="w-full bg-zinc-800 text-white text-2xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="bg-zinc-900 rounded-lg p-3">
                    <label className="text-zinc-400 text-xs block mb-1">Reps</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={setData2.reps ?? ''}
                      onChange={(e) => setSetData2({ ...setData2, reps: parseInt(e.target.value) || 0 })}
                      className="w-full bg-zinc-800 text-white text-2xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="bg-zinc-900 rounded p-3 mb-3">
                  <div className="text-zinc-500 text-xs mb-1">Form Tips</div>
                  <p className="text-zinc-300 text-sm">{getFormTips(ex2.tips)}</p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleCompleteB2BExercise}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg text-lg font-bold transition-colors"
                  >
                    ✓ Complete Exercise 2
                  </button>
                  {completedPairs.length > 0 && (
                    <button
                      onClick={handleEndExercise}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-semibold transition-colors"
                    >
                      End Exercise & Continue
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Inactive: Show entered data */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-zinc-900 rounded p-3 text-center">
                    <div className="text-zinc-500 text-xs mb-1">Weight</div>
                    <div className="text-white text-xl font-semibold">
                      {setData2.weight} lbs
                    </div>
                  </div>
                  <div className="bg-zinc-900 rounded p-3 text-center">
                    <div className="text-zinc-500 text-xs mb-1">Reps</div>
                    <div className="text-white text-xl font-semibold">
                      {setData2.reps}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Completed Sets */}
          {displayCompletedPairs.length > 0 && (
            <div className="bg-zinc-800 rounded-lg p-4 mb-4">
              <div className="text-zinc-400 text-sm mb-2">COMPLETED SETS</div>
              {displayCompletedPairs.map((pair, index) => (
                <div key={index} className="mb-2">
                  <div className="text-green-400 text-sm font-semibold mb-1">Set {index + 1}:</div>
                  <div className="text-zinc-300 text-xs ml-2">
                    ✓ {ex1.name}: {pair.ex1.weight} lbs × {pair.ex1.reps} reps
                  </div>
                  <div className="text-zinc-300 text-xs ml-2">
                    ✓ {ex2.name}: {pair.ex2.weight} lbs × {pair.ex2.reps} reps
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Skip Exercise (only in active mode, not review mode) */}
          {!isReviewMode && (
            <button
              onClick={() => {
                if (currentExerciseIndex < workout.exercises.length - 1) {
                  const nextExerciseIndex = currentExerciseIndex + 1;
                  setCurrentExerciseIndex(nextExerciseIndex);
                  setViewingExerciseIndex(nextExerciseIndex);
                  setCompletedPairs([]);

                  // Initialize next exercise
                  const nextExercise = workout.exercises[nextExerciseIndex];
                  if (nextExercise.type === 'single') {
                    const needsWarmup = nextExercise.warmupWeight !== nextExercise.targetWeight;
                    setSetData({
                      weight: needsWarmup ? nextExercise.warmupWeight : nextExercise.targetWeight,
                      reps: nextExercise.targetReps,
                    });
                    setCurrentSetIndex(needsWarmup ? 0 : 1);
                  } else {
                    const b2bEx = nextExercise as B2BExercise;
                    setSetData1({
                      weight: b2bEx.exercises[0].targetWeight,
                      reps: b2bEx.exercises[0].targetReps,
                    });
                    setSetData2({
                      weight: b2bEx.exercises[1].targetWeight,
                      reps: b2bEx.exercises[1].targetReps,
                    });
                    setCurrentSetIndex(1);
                    setCurrentExerciseInPair(0);
                  }
                } else {
                  // Always go to cardio (optional)
                  router.push(`/workout/${encodeURIComponent(workout.name)}/cardio${routineQuery}`);
                }
              }}
              className="w-full bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Skip Exercise
            </button>
          )}

          {exerciseModals}
        </div>
      </div>
    );
  }

  const exercise = exerciseToDisplay as SingleExercise;
  const isWarmupSet = currentSetIndex === 0;

  // In review mode, show cached completed sets
  const displayCompletedSets = isReviewMode && viewingCachedData
    ? viewingCachedData.completedSets || []
    : completedSets;

  // Transition Screen (between exercises)
  if (isTransitioning) {
    const nextExercise = workout.exercises[currentExerciseIndex + 1];
    const nextExerciseName = nextExercise.type === 'single'
      ? nextExercise.name
      : `${nextExercise.exercises[0].name} / ${nextExercise.exercises[1].name}`;

    return (
      <div className="min-h-screen bg-zinc-900 p-4">
        <div className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-screen">
          {/* Progress Bar */}
          <div className="w-full mb-12">
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Heading */}
          <div className="text-zinc-400 text-xl mb-4">Next Exercise</div>

          {/* Exercise Name */}
          <h1 className="text-4xl font-bold text-white text-center mb-12 px-4">
            {nextExerciseName}
          </h1>

          {/* Countdown Timer */}
          <div className={`bg-zinc-800 rounded-lg p-16 mb-12 text-center border-4 ${transitionTimeRemaining === 0 ? 'border-zinc-700' : 'border-blue-600'}`}>
            <div className={`text-xl mb-4 ${transitionTimeRemaining === 0 ? 'text-zinc-400' : 'text-blue-400'}`}>Chilll Outtt</div>
            <div className={`text-9xl font-bold mb-2 ${transitionTimeRemaining === 0 ? 'text-blue-400' : 'text-white'}`}>
              {transitionTimeRemaining}
            </div>
            <div className="text-zinc-400 text-lg">seconds</div>
          </div>

          {/* Skip Button */}
          <button
            onClick={handleSkipTransition}
            className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-lg text-2xl font-bold transition-colors"
          >
            I'm Ready →
          </button>
        </div>
      </div>
    );
  }

  // Rest Timer Screen
  if (isResting) {
    return (
      <div className="min-h-screen bg-zinc-900 p-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-zinc-400">Exercise {currentExerciseIndex + 1}/{workout.exercises.length}</div>
          </div>

          {/* Exercise Name */}
          <h1 className="text-3xl font-bold text-white text-center mb-8">{exercise.name}</h1>

          {/* Set Complete */}
          <div className="text-center mb-8">
            <div className="text-green-500 text-6xl mb-2">✓</div>
            <div className="text-white text-2xl font-semibold">
              {exercise.warmupWeight !== exercise.targetWeight && completedSets.length === 1
                ? 'WARMUP SET'
                : `SET ${exercise.warmupWeight !== exercise.targetWeight ? completedSets.length - 1 : completedSets.length}`} COMPLETE
            </div>
          </div>

          {/* Rest Timer */}
          <div className={`bg-zinc-800 rounded-lg p-12 mb-8 text-center border-4 ${restTimeRemaining === 0 ? 'border-zinc-700' : 'border-orange-600'}`}>
            <div className={`text-xl mb-4 ${restTimeRemaining === 0 ? 'text-zinc-400' : 'text-orange-400'}`}>REST TIME</div>
            <div className={`text-8xl font-bold mb-2 ${restTimeRemaining === 0 ? 'text-orange-400' : 'text-white'}`}>
              {restTimeRemaining}
            </div>
            <div className="text-zinc-400 text-lg">seconds</div>
          </div>

          {/* Timer Controls */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              onClick={handleAddTime}
              className="bg-zinc-700 hover:bg-zinc-600 text-white py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              + Add 15s
            </button>
            <button
              onClick={handleSkipRest}
              className="bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              {restTimeRemaining === 0 ? 'Continue Workout' : 'Skip Rest'}
            </button>
          </div>

          {/* Next Set Info */}
          <div className="bg-zinc-800 rounded-lg p-4 text-center">
            <div className="text-zinc-400 text-sm mb-2">Next up:</div>
            <div className="text-white text-xl font-semibold">
              Set {currentSetIndex} (Working)
            </div>
            <div className="text-zinc-300 text-lg">
              {exercise.targetWeight} lbs × {exercise.targetReps} reps
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Exit Confirmation Modal
  if (showExitConfirm) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-zinc-800 rounded-lg p-6">
          <h2 className="text-white text-2xl font-bold mb-4">Exit Routine?</h2>
          <p className="text-zinc-300 mb-6">
            You will lose your current routine progress. Completed exercises have been saved to the database.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setShowExitConfirm(false)}
              className="bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Continue
            </button>
            <Link
              href="/"
              className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-colors text-center"
            >
              Exit Routine
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Exercise Tracking Screen
  return (
    <div className="min-h-screen bg-zinc-900 p-4 pb-32">
      <div className="max-w-2xl mx-auto">
        <Header />
        {/* Navigation */}
        <WorkoutNavHeader
          exitUrl={`/workout/${encodeURIComponent(workout.name)}${routineQuery}`}
          previousUrl={null}
          onPrevious={handlePreviousSection}
          onNext={isReviewMode ? () => setViewingExerciseIndex(viewingExerciseIndex + 1) : undefined}
        />
        <div className="text-zinc-400 text-right mb-4 -mt-4">Exercise {viewingExerciseIndex + 1}/{workout.exercises.length}</div>

        {/* READ ONLY Banner */}
        {isReviewMode && (
          <div className="bg-yellow-900 border border-yellow-600 rounded-lg p-3 mb-6">
            <div className="text-yellow-200 text-sm font-semibold text-center">
              📖 READ ONLY - Cannot edit completed sets
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="text-zinc-500 text-sm text-center mt-2">
            Overall Progress: {currentProgress} / {totalItems}
          </div>
        </div>

        {exerciseModifyControls}

        {/* Exercise Name */}
        <h1 className="text-3xl font-bold text-white mb-6">{exercise.name}</h1>

        {/* Last Time Section */}
        {lastExerciseLog && (
          <div className="bg-zinc-800 rounded-lg p-4 mb-6 border border-zinc-700">
            <div className="text-zinc-400 text-sm mb-2">
              LAST TIME ({formatLocalDate(lastExerciseDate)})
            </div>
            <div className="space-y-1">
              {lastExerciseLog.warmup_weight !== null && lastExerciseLog.warmup_reps !== null && (
                <div className="text-zinc-300 text-sm">
                  Warmup: {lastExerciseLog.warmup_weight} lbs × {lastExerciseLog.warmup_reps} reps
                </div>
              )}
              {[1, 2, 3, 4].map((setNum) => {
                const weight = lastExerciseLog[`set${setNum}_weight`];
                const reps = lastExerciseLog[`set${setNum}_reps`];
                if (weight !== null && reps !== null) {
                  return (
                    <div key={setNum} className="text-zinc-300 text-sm">
                      Set {setNum}: {weight} lbs × {reps} reps
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        )}

        {/* Current Set - Only show if not in review mode */}
        {!isReviewMode && (
        <div className="bg-zinc-800 rounded-lg p-6 mb-6 border-2 border-orange-600">
          <div className="text-center mb-4">
            <div className="text-orange-400 text-lg font-semibold mb-2">
              {isWarmupSet ? 'WARMUP SET' : `SET ${currentSetIndex} (WORKING)`}
            </div>
          </div>

          {/* Weight and Reps Inputs */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-zinc-900 rounded-lg p-4">
              <label className="text-zinc-400 text-sm block mb-2">Weight (lbs)</label>
              <input
                type="text"
                inputMode="decimal"
                value={setData.weight ?? ''}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '') {
                    setSetData({ ...setData, weight: 0 });
                  } else {
                    const num = parseFloat(val);
                    if (!isNaN(num)) {
                      setSetData({ ...setData, weight: num });
                    }
                  }
                }}
                className="w-full bg-zinc-800 text-white text-3xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="bg-zinc-900 rounded-lg p-4">
              <label className="text-zinc-400 text-sm block mb-2">Reps</label>
              <input
                type="text"
                inputMode="numeric"
                value={setData.reps ?? ''}
                onChange={(e) => setSetData({ ...setData, reps: parseInt(e.target.value) || 0 })}
                className="w-full bg-zinc-800 text-white text-3xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Complete Set Button(s) */}
          {isWarmupSet ? (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleSkipWarmup}
                className="bg-zinc-700 hover:bg-zinc-600 text-white py-4 rounded-lg text-lg font-semibold transition-colors"
              >
                Skip Warmup
              </button>
              <button
                onClick={handleCompleteSet}
                className="bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg text-lg font-bold transition-colors"
              >
                ✓ Complete Warmup
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                onClick={handleCompleteSet}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg text-xl font-bold transition-colors"
              >
                ✓ Complete Set {currentSetIndex}
              </button>
              {completedSets.length > 0 && (
                <button
                  onClick={handleEndExercise}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-semibold transition-colors"
                >
                  End Exercise & Continue
                </button>
              )}
            </div>
          )}
        </div>
        )}

        {/* Completed Sets */}
        {displayCompletedSets.length > 0 && (
          <div className="bg-zinc-800 rounded-lg p-4 mb-6">
            <div className="text-zinc-400 text-sm mb-2">COMPLETED SETS</div>
            {displayCompletedSets.map((set, index) => (
              <div key={index} className="text-green-400 text-sm mb-1">
                ✓ {index === 0 ? 'Warmup' : `Set ${index}`}: {set.weight} lbs × {set.reps} reps
              </div>
            ))}
          </div>
        )}

        {/* Form Tips */}
        <div className="bg-zinc-800 rounded-lg p-4 mb-4">
          <div className="text-zinc-400 text-sm mb-2">FORM TIPS</div>
          <p className="text-zinc-200 text-base leading-relaxed">{getFormTips(exercise.tips)}</p>
        </div>

        {/* Video and Skip */}
        <div className={isReviewMode ? '' : 'grid grid-cols-2 gap-4'}>
          <a
            href={getVideoUrl(exercise.name, exercise.videoUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-red-600 hover:bg-red-700 text-white text-center py-3 rounded-lg font-semibold transition-colors"
          >
            📺 Watch Video
          </a>
          {!isReviewMode && (
            <button
              onClick={() => {
                if (currentExerciseIndex < workout.exercises.length - 1) {
                  const nextExerciseIndex = currentExerciseIndex + 1;
                  setCurrentExerciseIndex(nextExerciseIndex);
                  setViewingExerciseIndex(nextExerciseIndex);
                  setCompletedSets([]);

                  // Initialize next exercise
                  const nextExercise = workout.exercises[nextExerciseIndex];
                  if (nextExercise.type === 'single') {
                    const needsWarmup = nextExercise.warmupWeight !== nextExercise.targetWeight;
                    setSetData({
                      weight: needsWarmup ? nextExercise.warmupWeight : nextExercise.targetWeight,
                      reps: nextExercise.targetReps,
                    });
                    setCurrentSetIndex(needsWarmup ? 0 : 1);
                  } else {
                    const b2bEx = nextExercise as B2BExercise;
                    setSetData1({
                      weight: b2bEx.exercises[0].targetWeight,
                      reps: b2bEx.exercises[0].targetReps,
                    });
                    setSetData2({
                      weight: b2bEx.exercises[1].targetWeight,
                      reps: b2bEx.exercises[1].targetReps,
                    });
                    setCurrentSetIndex(1);
                    setCurrentExerciseInPair(0);
                    setCompletedPairs([]);
                  }
                } else {
                  // Always go to cardio (optional)
                  router.push(`/workout/${encodeURIComponent(workout.name)}/cardio${routineQuery}`);
                }
              }}
              className="bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Skip Exercise
            </button>
          )}

          {exerciseModals}
        </div>
      </div>
    </div>
  );
}

export default function ActiveWorkoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    }>
      <ActiveWorkoutContent />
    </Suspense>
  );
}
