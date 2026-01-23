'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { WorkoutPlan, Exercise, Stretch, Cardio } from '@/lib/types';

export default function WorkoutDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [workout, setWorkout] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWorkout() {
      try {
        const response = await fetch(`/api/workout/${params.name}`);
        if (!response.ok) {
          throw new Error('Workout not found');
        }
        const data = await response.json();
        setWorkout(data.workout);
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
        <div className="text-white text-2xl">Loading workout...</div>
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

  return (
    <div className="min-h-screen bg-zinc-900 p-4 pb-32">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
            ← Back to workouts
          </Link>
          <h1 className="text-4xl font-bold text-white">{workout.name}</h1>
        </div>

        {/* Pre-Workout Stretches */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-green-500">🟢</span> Pre-Workout Stretches
          </h2>
          <div className="text-zinc-400 text-sm mb-4">Dynamic stretches · 5-8 minutes</div>
          <div className="grid grid-cols-2 gap-3">
            {workout.preWorkoutStretches.map((stretch, index) => (
              <StretchCard key={index} stretch={stretch} index={index} />
            ))}
          </div>
        </section>

        {/* Exercises */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-orange-500">🔥</span> Exercises
          </h2>
          <div className="text-zinc-400 text-sm mb-4">{workout.exercises.length} exercises</div>
          <div className="space-y-4">
            {workout.exercises.map((exercise, index) => (
              <ExerciseCard key={index} exercise={exercise} index={index} />
            ))}
          </div>
        </section>

        {/* Cardio (Optional) */}
        {workout.cardio && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-red-500">❤️</span> Cardio (Optional)
            </h2>
            <div className="bg-zinc-800 rounded-lg p-5 border-2 border-red-600">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{workout.cardio.type}</h3>
                  <div className="text-blue-400 text-lg mb-1">{workout.cardio.duration}</div>
                  <div className="text-zinc-400 text-sm">{workout.cardio.intensity}</div>
                </div>
              </div>
              <div className="bg-zinc-900 rounded p-3">
                <div className="text-zinc-500 text-xs mb-1">Tips</div>
                <p className="text-zinc-300 text-sm">{workout.cardio.tips}</p>
              </div>
            </div>
          </section>
        )}

        {/* Post-Workout Stretches */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-blue-500">🔵</span> Post-Workout Stretches
          </h2>
          <div className="text-zinc-400 text-sm mb-4">Static stretches · 8-10 minutes</div>
          <div className="grid grid-cols-2 gap-3">
            {workout.postWorkoutStretches.map((stretch, index) => (
              <StretchCard key={index} stretch={stretch} index={index} />
            ))}
          </div>
        </section>

        {/* Start Workout Button - Fixed at bottom */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-zinc-900 border-t border-zinc-800">
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => router.push(`/stretches/${encodeURIComponent(workout.name)}`)}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg text-xl font-bold transition-colors"
            >
              Start Workout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StretchCard({ stretch, index }: { stretch: Stretch; index: number }) {
  return (
    <div className="bg-zinc-800 rounded-lg p-3 border border-zinc-700">
      <div className="text-zinc-500 text-xs mb-1">#{index + 1}</div>
      <h3 className="text-sm font-semibold text-white mb-1">{stretch.name}</h3>
      <div className="text-blue-400 text-xs mb-2">{stretch.duration}</div>
      <p className="text-zinc-400 text-xs mb-2 leading-relaxed">{stretch.tips}</p>
      <a
        href={stretch.videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-red-500 hover:text-red-400 text-xs font-medium px-2 py-1 bg-zinc-900 rounded inline-block"
      >
        📺 Video
      </a>
    </div>
  );
}

function ExerciseCard({ exercise, index }: { exercise: Exercise; index: number }) {
  if (exercise.type === 'single') {
    return (
      <div className="bg-zinc-800 rounded-lg p-5 border-2 border-zinc-700">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="text-zinc-500 text-sm mb-1">Exercise #{index + 1}</div>
            <h3 className="text-xl font-bold text-white mb-2">{exercise.name}</h3>
          </div>
          <a
            href={exercise.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-500 hover:text-red-400 text-sm font-medium px-3 py-2 bg-zinc-900 rounded"
          >
            📺 Video
          </a>
        </div>

        <div className="space-y-2 mb-3">
          {/* Weights together */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-950 border border-green-800 rounded p-3">
              <div className="text-green-400 text-xs mb-1">Warmup Weight</div>
              <div className="text-green-300 font-bold text-2xl">{exercise.warmupWeight} lbs</div>
            </div>
            <div className="bg-orange-950 border border-orange-800 rounded p-3">
              <div className="text-orange-400 text-xs mb-1">Working Weight</div>
              <div className="text-orange-300 font-bold text-2xl">{exercise.targetWeight} lbs</div>
            </div>
          </div>

          {/* Sets & Rest */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-900 rounded p-3">
              <div className="text-zinc-500 text-xs mb-1">Rest Time</div>
              <div className="text-white font-semibold text-2xl">{exercise.restTime}s</div>
            </div>
            <div className="bg-zinc-900 rounded p-3">
              <div className="text-zinc-500 text-xs mb-1">Sets × Reps</div>
              <div className="text-white font-semibold text-2xl">
                {exercise.sets} × {exercise.targetReps}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 rounded p-3">
          <div className="text-zinc-500 text-xs mb-1">Form Tips</div>
          <p className="text-zinc-300 text-sm">{exercise.tips}</p>
        </div>
      </div>
    );
  }

  // B2B Exercise
  const [ex1, ex2] = exercise.exercises;

  return (
    <div className="bg-zinc-800 rounded-lg p-5 border-2 border-purple-700">
      <div className="text-purple-400 text-sm font-bold mb-3">
        🔄 B2B SUPERSET · Exercise #{index + 1}
      </div>

      {/* Exercise 1 */}
      <div className="mb-3">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="text-zinc-500 text-xs mb-1">Exercise 1 of 2</div>
            <h3 className="text-lg font-bold text-white mb-2">{ex1.name}</h3>
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

        <div className="space-y-2">
          {/* Weights together */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-green-950 border border-green-800 rounded p-2">
              <div className="text-green-400 text-xs mb-1">Warmup</div>
              <div className="text-green-300 font-bold text-xl">{ex1.warmupWeight} lbs</div>
            </div>
            <div className="bg-orange-950 border border-orange-800 rounded p-2">
              <div className="text-orange-400 text-xs mb-1">Working</div>
              <div className="text-orange-300 font-bold text-xl">{ex1.targetWeight} lbs</div>
            </div>
          </div>

          {/* Sets × Reps and Tips */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-zinc-900 rounded p-2">
              <div className="text-zinc-500 text-xs mb-1">Sets × Reps</div>
              <div className="text-white font-semibold text-xl">
                {ex1.sets} × {ex1.targetReps}
              </div>
            </div>
            <div className="bg-zinc-900 rounded p-2">
              <div className="text-zinc-500 text-xs mb-1">Form Tips</div>
              <p className="text-zinc-400 text-xs">{ex1.tips}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rest Time Card */}
      <div className="my-4">
        <div className="bg-purple-950 border-2 border-purple-700 rounded-lg p-4">
          <div className="text-center">
            <div className="text-purple-400 text-sm mb-1">Rest Between Exercises</div>
            <div className="text-purple-300 font-bold text-3xl">{exercise.restTime}s</div>
          </div>
        </div>
      </div>

      {/* Exercise 2 */}
      <div className="mt-3">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="text-zinc-500 text-xs mb-1">Exercise 2 of 2</div>
            <h3 className="text-lg font-bold text-white mb-2">{ex2.name}</h3>
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

        <div className="space-y-2">
          {/* Weights together */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-green-950 border border-green-800 rounded p-2">
              <div className="text-green-400 text-xs mb-1">Warmup</div>
              <div className="text-green-300 font-bold text-xl">{ex2.warmupWeight} lbs</div>
            </div>
            <div className="bg-orange-950 border border-orange-800 rounded p-2">
              <div className="text-orange-400 text-xs mb-1">Working</div>
              <div className="text-orange-300 font-bold text-xl">{ex2.targetWeight} lbs</div>
            </div>
          </div>

          {/* Sets × Reps and Tips */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-zinc-900 rounded p-2">
              <div className="text-zinc-500 text-xs mb-1">Sets × Reps</div>
              <div className="text-white font-semibold text-xl">
                {ex2.sets} × {ex2.targetReps}
              </div>
            </div>
            <div className="bg-zinc-900 rounded p-2">
              <div className="text-zinc-500 text-xs mb-1">Form Tips</div>
              <p className="text-zinc-400 text-xs">{ex2.tips}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
