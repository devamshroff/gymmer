'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { WorkoutPlan } from '@/lib/types';
import { addCardioToSession } from '@/lib/workout-session';
import Header from '@/app/components/Header';
import WorkoutNavHeader from '@/app/components/WorkoutNavHeader';
import { Card } from '@/app/components/SharedUi';

const CARDIO_TYPES = [
  { value: 'Treadmill', label: 'Treadmill', icon: '🏃' },
  { value: 'Bike', label: 'Stationary Bike', icon: '🚴' },
  { value: 'Elliptical', label: 'Elliptical', icon: '🏋️' },
  { value: 'Rowing', label: 'Rowing Machine', icon: '🚣' },
  { value: 'Stairmaster', label: 'Stairmaster', icon: '🪜' },
  { value: 'Other', label: 'Other', icon: '💪' },
];

export default function CardioPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [workout, setWorkout] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDone, setIsDone] = useState(false);

  // Get routineId from URL params (for public/favorited routines)
  const routineIdParam = searchParams.get('routineId');
  const routineQuery = routineIdParam ? `?routineId=${routineIdParam}` : '';

  // Cardio inputs
  const [cardioType, setCardioType] = useState('Treadmill');
  const [duration, setDuration] = useState('');
  const [speed, setSpeed] = useState<string>('');
  const [incline, setIncline] = useState<string>('');

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
        setWorkout(data.workout);

        // If workout has predefined cardio, use those values as defaults
        if (data.workout.cardio) {
          setCardioType(data.workout.cardio.type || 'Treadmill');
        }
      } catch (error) {
        console.error('Error fetching workout:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchWorkout();
  }, [params.name]);

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

  // Calculate total workout items for progress
  const preStretchCount = (workout.preWorkoutStretches || []).length;
  const postStretchCount = (workout.postWorkoutStretches || []).length;
  const totalItems = preStretchCount + workout.exercises.length + 1 + postStretchCount;
  const currentProgress = preStretchCount + workout.exercises.length + 1;
  const progressPercentage = (currentProgress / totalItems) * 100;

  const handleComplete = () => {
    // Save cardio data to session
    if (duration.trim()) {
      addCardioToSession({
        type: cardioType,
        time: duration.trim(),
        speed: speed ? parseFloat(speed) : undefined,
        incline: incline ? parseFloat(incline) : undefined,
      });
    }

    setIsDone(true);
    setTimeout(() => {
      router.push(`/workout/${encodeURIComponent(workout.name)}/post-stretches${routineQuery}`);
    }, 1000);
  };

  const handleSkip = () => {
    router.push(`/workout/${encodeURIComponent(workout.name)}/post-stretches${routineQuery}`);
  };

  const handlePrevious = () => {
    // Go back to last exercise
    const exerciseCount = workout.exercises?.length || 0;
    if (exerciseCount > 0) {
      router.push(`/workout/${encodeURIComponent(workout.name)}/active?index=${exerciseCount - 1}${routineIdParam ? `&routineId=${routineIdParam}` : ''}`);
    }
  };

  // Get the selected cardio type info
  const selectedCardioInfo = CARDIO_TYPES.find(t => t.value === cardioType) || CARDIO_TYPES[0];

  return (
    <div className="min-h-screen bg-zinc-900 p-4">
      <div className="max-w-2xl mx-auto">
        <Header />
        {/* Navigation */}
        <WorkoutNavHeader
          exitUrl={`/workout/${encodeURIComponent(workout.name)}${routineQuery}`}
          previousUrl={null}
          onPrevious={handlePrevious}
          skipLabel="Skip Cardio"
          onSkip={handleSkip}
        />

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-500 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="text-zinc-500 text-sm text-center mt-2">
            Overall Progress: {currentProgress} / {totalItems}
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">CARDIO</h1>
          <div className="text-zinc-400 text-lg">Optional - Skip if you want</div>
        </div>

        {/* Cardio Card */}
        <Card paddingClassName="p-6" borderClassName="border-red-600" className="mb-8">
          {/* Cardio Type Selector */}
          <div className="mb-6">
            <label className="text-zinc-400 text-sm block mb-3">Type</label>
            <div className="grid grid-cols-3 gap-2">
              {CARDIO_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setCardioType(type.value)}
                  className={`p-3 rounded-lg text-center transition-colors ${
                    cardioType === type.value
                      ? 'bg-red-600 text-white border-2 border-red-400'
                      : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600 border-2 border-transparent'
                  }`}
                >
                  <div className="text-2xl mb-1">{type.icon}</div>
                  <div className="text-xs">{type.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Duration Input */}
          <div className="mb-4">
            <label className="text-zinc-400 text-sm block mb-2">Duration (minutes)</label>
            <input
              type="text"
              inputMode="numeric"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g., 15"
              className="w-full bg-zinc-900 text-white text-2xl text-center rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Speed and Incline (side by side) */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-zinc-400 text-sm block mb-2">Speed (mph)</label>
              <input
                type="text"
                inputMode="decimal"
                value={speed}
                onChange={(e) => setSpeed(e.target.value)}
                placeholder="e.g., 6.5"
                className="w-full bg-zinc-900 text-white text-xl text-center rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="text-zinc-400 text-sm block mb-2">Incline (%)</label>
              <input
                type="text"
                inputMode="decimal"
                value={incline}
                onChange={(e) => setIncline(e.target.value)}
                placeholder="e.g., 2.5"
                className="w-full bg-zinc-900 text-white text-xl text-center rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Predefined cardio tips if available */}
          {workout.cardio && workout.cardio.tips && (
            <div className="bg-zinc-900 rounded-lg p-4">
              <div className="text-zinc-400 text-sm mb-2">Recommended:</div>
              <div className="text-zinc-300 text-sm mb-1">{workout.cardio.duration} - {workout.cardio.intensity}</div>
              <p className="text-zinc-400 text-sm">{workout.cardio.tips}</p>
            </div>
          )}
        </Card>

        {/* Action Buttons */}
        {!isDone ? (
          <div className="space-y-3">
            <button
              onClick={handleComplete}
              disabled={!duration.trim()}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white py-4 rounded-lg text-xl font-bold transition-colors"
            >
              {duration.trim() ? '✓ Log Cardio' : 'Enter duration to log'}
            </button>
            <button
              onClick={handleSkip}
              className="w-full bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-lg text-lg font-semibold transition-colors"
            >
              Skip Cardio
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <div className="text-white text-2xl font-semibold">Great cardio!</div>
          </div>
        )}
      </div>
    </div>
  );
}
