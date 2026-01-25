'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { WorkoutPlan, Exercise, SingleExercise, B2BExercise } from '@/lib/types';
import { addExerciseToSession } from '@/lib/workout-session';

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
          // Check if warmup is needed
          const needsWarmup = firstExercise.warmupWeight !== firstExercise.targetWeight;
          setSetData({
            weight: needsWarmup ? firstExercise.warmupWeight : firstExercise.targetWeight,
            reps: firstExercise.targetReps,
          });
          // If no warmup needed, start at set 1 instead of set 0
          if (!needsWarmup) {
            setCurrentSetIndex(1);
          }
        } else {
          // B2B exercise - no warmups, start at set 1
          const b2bEx = firstExercise as B2BExercise;
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

  // B2B Exercise Handlers
  const handleCompleteB2BExercise = () => {
    const b2bExercise = currentExercise as B2BExercise;

    if (currentExerciseInPair === 0) {
      // Just completed first exercise, immediately move to second
      setCurrentExerciseInPair(1);
    } else {
      // Completed both exercises in the pair
      const newCompletedPairs = [...completedPairs, { ex1: setData1, ex2: setData2 }];
      setCompletedPairs(newCompletedPairs);

      if (newCompletedPairs.length < b2bExercise.exercises[0].sets) {
        // More sets to go - no rest, immediately continue to next set
        setCurrentSetIndex(currentSetIndex + 1);
        setCurrentExerciseInPair(0); // Reset to first exercise for next round
      } else {
        // All sets complete - save to session and show transition to next exercise
        addExerciseToSession({
          name: b2bExercise.exercises[0].name,
          type: 'b2b',
          sets: newCompletedPairs.map(pair => pair.ex1),
          b2bPartner: {
            name: b2bExercise.exercises[1].name,
            sets: newCompletedPairs.map(pair => pair.ex2),
          },
        });

        if (currentExerciseIndex < workout!.exercises.length - 1) {
          setIsResting(false);
          setIsTransitioning(true);
          setTransitionTimeRemaining(60);
        } else {
          // All exercises done - go to cardio or post-workout stretches
          if (workout!.cardio) {
            router.push(`/workout/${encodeURIComponent(workout!.name)}/cardio`);
          } else {
            router.push(`/workout/${encodeURIComponent(workout!.name)}/post-stretches`);
          }
        }
      }
    }
  };

  // Single Exercise Handlers
  const handleCompleteSet = () => {
    const newCompletedSets = [...completedSets, setData];
    setCompletedSets(newCompletedSets);

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
      // Exercise complete - save to session
      const hasWarmup = exercise.warmupWeight !== exercise.targetWeight;
      addExerciseToSession({
        name: exercise.name,
        type: 'single',
        warmup: hasWarmup ? newCompletedSets[0] : undefined,
        sets: hasWarmup ? newCompletedSets.slice(1) : newCompletedSets,
      });

      // Show transition to next exercise
      if (currentExerciseIndex < workout.exercises.length - 1) {
        setIsResting(false);
        setIsTransitioning(true);
        setTransitionTimeRemaining(60);
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
      }
    } else {
      // B2B exercise
      const b2bExercise = currentExercise as B2BExercise;

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
      }
    }

    // Move to next exercise or finish
    if (currentExerciseIndex < workout!.exercises.length - 1) {
      setIsResting(false);
      setIsTransitioning(true);
      setTransitionTimeRemaining(60);
    } else {
      // All exercises done - go to cardio or post-workout stretches
      if (workout!.cardio) {
        router.push(`/workout/${encodeURIComponent(workout!.name)}/cardio`);
      } else {
        router.push(`/workout/${encodeURIComponent(workout!.name)}/post-stretches`);
      }
    }
  };

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowExitConfirm(true);
  };

  // Handle B2B/Superset exercises
  if (currentExercise.type === 'b2b') {
    const b2bExercise = currentExercise as B2BExercise;
    const ex1 = b2bExercise.exercises[0];
    const ex2 = b2bExercise.exercises[1];

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
                Set {currentSetIndex + 1}
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
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <button onClick={handleBackClick} className="text-blue-400 hover:text-blue-300">
              ← Back
            </button>
            <div className="text-zinc-400">Exercise {currentExerciseIndex + 1}/{workout.exercises.length}</div>
          </div>

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

          {/* Superset Title */}
          <div className="text-center mb-6">
            <div className="text-purple-400 text-sm font-bold mb-2">🔄 SUPERSET</div>
            <div className="text-white text-lg font-semibold mb-1">
              SET {currentSetIndex} of {ex1.sets}
            </div>
          </div>

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
                href={ex1.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-500 hover:text-red-400 text-sm font-medium px-3 py-2 bg-zinc-900 rounded"
              >
                📺 Video
              </a>
            </div>

            {currentExerciseInPair === 0 ? (
              <>
                {/* Active: Show inputs */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-zinc-900 rounded-lg p-3">
                    <label className="text-zinc-400 text-xs block mb-1">Weight (lbs)</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={setData1.weight || ''}
                      onChange={(e) => setSetData1({ ...setData1, weight: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-zinc-800 text-white text-2xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="bg-zinc-900 rounded-lg p-3">
                    <label className="text-zinc-400 text-xs block mb-1">Reps</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={setData1.reps || ''}
                      onChange={(e) => setSetData1({ ...setData1, reps: parseInt(e.target.value) || 0 })}
                      className="w-full bg-zinc-800 text-white text-2xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="bg-zinc-900 rounded p-3 mb-3">
                  <div className="text-zinc-500 text-xs mb-1">Form Tips</div>
                  <p className="text-zinc-300 text-sm">{ex1.tips}</p>
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
                href={ex2.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-500 hover:text-red-400 text-sm font-medium px-3 py-2 bg-zinc-900 rounded"
              >
                📺 Video
              </a>
            </div>

            {currentExerciseInPair === 1 ? (
              <>
                {/* Active: Show inputs */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-zinc-900 rounded-lg p-3">
                    <label className="text-zinc-400 text-xs block mb-1">Weight (lbs)</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={setData2.weight || ''}
                      onChange={(e) => setSetData2({ ...setData2, weight: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-zinc-800 text-white text-2xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="bg-zinc-900 rounded-lg p-3">
                    <label className="text-zinc-400 text-xs block mb-1">Reps</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={setData2.reps || ''}
                      onChange={(e) => setSetData2({ ...setData2, reps: parseInt(e.target.value) || 0 })}
                      className="w-full bg-zinc-800 text-white text-2xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="bg-zinc-900 rounded p-3 mb-3">
                  <div className="text-zinc-500 text-xs mb-1">Form Tips</div>
                  <p className="text-zinc-300 text-sm">{ex2.tips}</p>
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
          {completedPairs.length > 0 && (
            <div className="bg-zinc-800 rounded-lg p-4 mb-4">
              <div className="text-zinc-400 text-sm mb-2">COMPLETED SETS</div>
              {completedPairs.map((pair, index) => (
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

          {/* Skip Exercise */}
          <button
            onClick={() => {
              if (currentExerciseIndex < workout.exercises.length - 1) {
                const nextExerciseIndex = currentExerciseIndex + 1;
                setCurrentExerciseIndex(nextExerciseIndex);
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
                if (workout.cardio) {
                  router.push(`/workout/${encodeURIComponent(workout.name)}/cardio`);
                } else {
                  router.push(`/workout/${encodeURIComponent(workout.name)}/post-stretches`);
                }
              }
            }}
            className="w-full bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            Skip Exercise
          </button>
        </div>
      </div>
    );
  }

  const exercise = currentExercise as SingleExercise;
  const isWarmupSet = currentSetIndex === 0;

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
              {completedSets.length === 1 ? 'WARMUP SET' : `SET ${completedSets.length - 1}`} COMPLETE
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
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button onClick={handleBackClick} className="text-blue-400 hover:text-blue-300">
            ← Back
          </button>
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
                type="text"
                inputMode="decimal"
                value={setData.weight || ''}
                onChange={(e) => setSetData({ ...setData, weight: parseFloat(e.target.value) || 0 })}
                className="w-full bg-zinc-800 text-white text-3xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="bg-zinc-900 rounded-lg p-4">
              <label className="text-zinc-400 text-sm block mb-2">Reps</label>
              <input
                type="text"
                inputMode="numeric"
                value={setData.reps || ''}
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
                const nextExerciseIndex = currentExerciseIndex + 1;
                setCurrentExerciseIndex(nextExerciseIndex);
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
