'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { WorkoutPlan, Exercise, SingleExercise, B2BExercise } from '@/lib/types';

interface SetData {
  weight: number;
  reps: number;
}

export default function ActiveWorkoutPage() {
  const params = useParams();
  const router = useRouter();
  const [workout, setWorkout] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTimeRemaining, setRestTimeRemaining] = useState(0);
  const [setData, setSetData] = useState<SetData>({ weight: 0, reps: 0 });
  const [completedSets, setCompletedSets] = useState<SetData[]>([]);

  useEffect(() => {
    async function fetchWorkout() {
      try {
        const response = await fetch(`/api/workout/${params.name}`);
        if (!response.ok) {
          throw new Error('Workout not found');
        }
        const data = await response.json();
        setWorkout(data.workout);

        // Initialize first exercise weight/reps
        const firstExercise = data.workout.exercises[0];
        if (firstExercise.type === 'single') {
          setSetData({
            weight: firstExercise.warmupWeight,
            reps: firstExercise.targetReps,
          });
        }
      } catch (error) {
        console.error('Error fetching workout:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchWorkout();
  }, [params.name]);

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

  // Calculate total workout items for progress
  const totalItems =
    workout.preWorkoutStretches.length +
    workout.exercises.length +
    (workout.cardio ? 1 : 0) +
    workout.postWorkoutStretches.length;
  const currentProgress = workout.preWorkoutStretches.length + currentExerciseIndex + 1;
  const progressPercentage = (currentProgress / totalItems) * 100;

  const handleCompleteSet = () => {
    setCompletedSets([...completedSets, setData]);

    const exercise = currentExercise as SingleExercise;

    if (currentSetIndex < exercise.sets) {
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
      // Exercise complete - move to next exercise or cardio
      if (currentExerciseIndex < workout.exercises.length - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1);
        setCurrentSetIndex(0);
        setCompletedSets([]);

        // Initialize next exercise
        const nextExercise = workout.exercises[currentExerciseIndex + 1];
        if (nextExercise.type === 'single') {
          setSetData({
            weight: nextExercise.warmupWeight,
            reps: nextExercise.targetReps,
          });
        }
        setIsResting(false);
      } else {
        // All exercises done - go to cardio or post-workout stretches
        if (workout.cardio) {
          router.push(`/workout/${encodeURIComponent(workout.name)}/cardio`);
        } else {
          router.push(`/workout/${encodeURIComponent(workout.name)}/post-stretches`);
        }
      }
    }
  };

  const handleSkipRest = () => {
    setIsResting(false);
    setRestTimeRemaining(0);
  };

  const handleAddTime = () => {
    setRestTimeRemaining(restTimeRemaining + 15);
  };

  if (currentExercise.type !== 'single') {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
        <div className="text-white text-xl">B2B exercises coming soon...</div>
      </div>
    );
  }

  const exercise = currentExercise as SingleExercise;
  const isWarmupSet = currentSetIndex === 0;

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
              {currentSetIndex === 0 ? 'WARMUP SET' : `SET ${currentSetIndex}`} COMPLETE
            </div>
          </div>

          {/* Rest Timer */}
          <div className="bg-zinc-800 rounded-lg p-12 mb-8 text-center border-4 border-orange-600">
            <div className="text-orange-400 text-xl mb-4">REST TIME</div>
            <div className="text-white text-8xl font-bold mb-2">
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
              {currentSetIndex === 0 ? 'Set 1 (Working)' : `Set ${currentSetIndex + 1} (Working)`}
            </div>
            <div className="text-zinc-300 text-lg">
              {exercise.targetWeight} lbs × {exercise.targetReps} reps
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Exercise Tracking Screen
  return (
    <div className="min-h-screen bg-zinc-900 p-4 pb-32">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Link href={`/workout/${encodeURIComponent(workout.name)}`} className="text-blue-400 hover:text-blue-300">
            ← Back
          </Link>
          <div className="text-zinc-400">Exercise {currentExerciseIndex + 1}/{workout.exercises.length}</div>
        </div>

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

        {/* Exercise Name */}
        <h1 className="text-3xl font-bold text-white mb-6">{exercise.name}</h1>

        {/* Last Time Section (TODO: fetch from database) */}
        <div className="bg-zinc-800 rounded-lg p-4 mb-6 border border-zinc-700">
          <div className="text-zinc-400 text-sm mb-2">LAST TIME (Dec 15, 2024)</div>
          <div className="space-y-1">
            <div className="text-zinc-300 text-sm">Set 1: 10 lbs × 8 reps</div>
            <div className="text-zinc-300 text-sm">Set 2: 15 lbs × 8 reps</div>
            <div className="text-zinc-300 text-sm">Set 3: 15 lbs × 7 reps</div>
          </div>
        </div>

        {/* Current Set */}
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
                type="number"
                value={setData.weight}
                onChange={(e) => setSetData({ ...setData, weight: parseFloat(e.target.value) || 0 })}
                className="w-full bg-zinc-800 text-white text-3xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="bg-zinc-900 rounded-lg p-4">
              <label className="text-zinc-400 text-sm block mb-2">Reps</label>
              <input
                type="number"
                value={setData.reps}
                onChange={(e) => setSetData({ ...setData, reps: parseInt(e.target.value) || 0 })}
                className="w-full bg-zinc-800 text-white text-3xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Complete Set Button */}
          <button
            onClick={handleCompleteSet}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg text-xl font-bold transition-colors"
          >
            ✓ Complete {isWarmupSet ? 'Warmup Set' : `Set ${currentSetIndex}`}
          </button>
        </div>

        {/* Completed Sets */}
        {completedSets.length > 0 && (
          <div className="bg-zinc-800 rounded-lg p-4 mb-6">
            <div className="text-zinc-400 text-sm mb-2">COMPLETED SETS</div>
            {completedSets.map((set, index) => (
              <div key={index} className="text-green-400 text-sm mb-1">
                ✓ {index === 0 ? 'Warmup' : `Set ${index}`}: {set.weight} lbs × {set.reps} reps
              </div>
            ))}
          </div>
        )}

        {/* Form Tips */}
        <div className="bg-zinc-800 rounded-lg p-4 mb-4">
          <div className="text-zinc-400 text-sm mb-2">FORM TIPS</div>
          <p className="text-zinc-200 text-base leading-relaxed">{exercise.tips}</p>
        </div>

        {/* Video and Skip */}
        <div className="grid grid-cols-2 gap-4">
          <a
            href={exercise.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-red-600 hover:bg-red-700 text-white text-center py-3 rounded-lg font-semibold transition-colors"
          >
            📺 Video
          </a>
          <button
            onClick={() => {
              if (currentExerciseIndex < workout.exercises.length - 1) {
                setCurrentExerciseIndex(currentExerciseIndex + 1);
                setCurrentSetIndex(0);
                setCompletedSets([]);
              } else {
                if (workout.cardio) {
                  router.push(`/workout/${encodeURIComponent(workout.name)}/cardio`);
                } else {
                  router.push(`/workout/${encodeURIComponent(workout.name)}/post-stretches`);
                }
              }
            }}
            className="bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            Skip Exercise
          </button>
        </div>
      </div>
    </div>
  );
}
