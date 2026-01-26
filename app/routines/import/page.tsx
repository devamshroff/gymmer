'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ImportRoutinePage() {
  const router = useRouter();
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setError(null);
    setSuccess(null);

    try {
      // Read file content
      const text = await file.text();
      const workoutData = JSON.parse(text);

      // Validate basic structure
      if (!workoutData.name || !workoutData.exercises) {
        throw new Error('Invalid workout plan format. Must include "name" and "exercises" fields.');
      }

      // Send to import API
      const response = await fetch('/api/routines/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workoutPlan: workoutData,
          fileName: file.name
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to import routine');
      }

      const data = await response.json();
      setSuccess(`Successfully imported "${workoutData.name}"!`);

      // Redirect to home after 2 seconds
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error: any) {
      console.error('Error importing routine:', error);
      setError(error.message || 'Failed to import routine. Please check the file format.');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 p-4">
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-white mb-2">Import Routine from JSON</h1>
        <p className="text-zinc-400 mb-6">
          Upload a workout plan JSON file to import it into your routines.
        </p>

        <div className="bg-zinc-800 rounded-lg p-6 border-2 border-blue-600 mb-6">
          <label
            htmlFor="file-upload"
            className="block w-full cursor-pointer"
          >
            <div className="border-2 border-dashed border-zinc-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
              <div className="text-4xl mb-4">📁</div>
              <div className="text-white font-semibold mb-2">
                Click to select JSON file
              </div>
              <div className="text-zinc-400 text-sm">
                Or drag and drop your workout plan JSON file here
              </div>
            </div>
            <input
              id="file-upload"
              type="file"
              accept=".json,application/json"
              onChange={handleFileUpload}
              disabled={importing}
              className="hidden"
            />
          </label>

          {importing && (
            <div className="mt-4 text-center text-blue-400">
              Importing routine...
            </div>
          )}

          {error && (
            <div className="mt-4 bg-red-900/50 border-2 border-red-500 text-red-200 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 bg-green-900/50 border-2 border-green-500 text-green-200 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}
        </div>

        <div className="bg-zinc-800 rounded-lg p-6 border-2 border-zinc-700 mb-6">
          <h2 className="text-xl font-bold text-white mb-3">Expected JSON Format</h2>
          <div className="text-zinc-400 text-sm mb-3">
            Your JSON file should follow this structure:
          </div>
          <pre className="bg-zinc-900 p-4 rounded-lg text-xs text-zinc-300 overflow-x-auto">
{`{
  "name": "My Workout Routine",
  "description": "Optional description",
  "exercises": [
    {
      "type": "single",
      "name": "Bench Press",
      "sets": 4,
      "targetReps": 10,
      "targetWeight": 135,
      "warmupWeight": 95,
      "restTime": 120
    },
    {
      "type": "b2b",
      "exercises": [
        {
          "name": "Pull-ups",
          "sets": 3,
          "targetReps": 12
        },
        {
          "name": "Push-ups",
          "sets": 3,
          "targetReps": 15
        }
      ]
    }
  ],
  "preWorkoutStretches": [
    {
      "name": "Arm Circles",
      "duration": "30 seconds"
    }
  ],
  "postWorkoutStretches": [
    {
      "name": "Standing Quad Stretch",
      "duration": "45 seconds each leg"
    }
  ],
  "cardio": {
    "type": "Treadmill",
    "duration": "10 minutes",
    "intensity": "Light"
  }
}`}
          </pre>
        </div>

        <button
          onClick={() => router.push('/')}
          className="w-full bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-lg font-semibold transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
