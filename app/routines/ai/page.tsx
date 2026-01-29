'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import { Card } from '@/app/components/SharedUi';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const STORAGE_KEY = 'ai_routine_draft';
const PROMPT_KEY = 'ai_routine_prompt';

function buildPreview(plan: any) {
  return {
    name: plan?.name || 'Untitled',
    exercises: Array.isArray(plan?.exercises) ? plan.exercises.length : 0,
    preStretches: Array.isArray(plan?.preWorkoutStretches) ? plan.preWorkoutStretches.length : 0,
    postStretches: Array.isArray(plan?.postWorkoutStretches) ? plan.postWorkoutStretches.length : 0,
    hasCardio: !!plan?.cardio,
  };
}

export default function AiRoutinePage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatingDots, setGeneratingDots] = useState('.');
  const [planText, setPlanText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [generated, setGenerated] = useState(false);

  const parsedPlan = useMemo(() => {
    if (!planText.trim()) return null;
    try {
      return JSON.parse(planText);
    } catch {
      return null;
    }
  }, [planText]);

  const preview = useMemo(() => buildPreview(parsedPlan), [parsedPlan]);

  useEffect(() => {
    if (!generating) {
      setGeneratingDots('.');
      return;
    }

    const timer = setInterval(() => {
      setGeneratingDots((prev) => {
        if (prev === '...') return '.';
        return `${prev}.`;
      });
    }, 450);

    return () => clearInterval(timer);
  }, [generating]);

  useEffect(() => {
    const storedPrompt = localStorage.getItem(PROMPT_KEY);
    if (storedPrompt) {
      setPrompt(storedPrompt);
    }
  }, []);

  const handleGenerate = async () => {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) return;

    setGenerating(true);
    setError(null);
    setSuccess(null);
    setGenerated(false);
    localStorage.setItem(PROMPT_KEY, trimmedPrompt);
    setMessages((prev) => [...prev, { role: 'user', content: trimmedPrompt }]);

    try {
      const response = await fetch('/api/routines/ai-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: trimmedPrompt }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate routine');
      }

      const data = await response.json();
      const text = JSON.stringify(data.workoutPlan, null, 2);
      setPlanText(text);
      setGenerated(true);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Generated "${data.workoutPlan.name}". Review and edit below.` },
      ]);
      setPrompt('');
    } catch (err: any) {
      setError(err.message || 'Failed to generate routine');
    } finally {
      setGenerating(false);
    }
  };

  const handleViewWorkout = () => {
    if (!planText.trim()) return;
    try {
      JSON.parse(planText);
    } catch {
      setError('JSON is invalid. Please fix it before previewing.');
      return;
    }
    localStorage.setItem(STORAGE_KEY, planText);
    router.push('/routines/ai/preview');
  };

  return (
    <div className="min-h-screen bg-zinc-900 p-4">
      <div className="max-w-3xl mx-auto py-8">
        <Header />
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">AI-Assisted Routine</h1>
          <button
            onClick={() => router.push('/')}
            className="text-zinc-400 hover:text-zinc-200 text-sm font-semibold"
          >
            Exit
          </button>
        </div>

        <Card paddingClassName="p-6" borderClassName="border-emerald-700" className="mb-6">
          <h2 className="text-lg font-semibold text-white mb-2">Describe your workout</h2>
          <p className="text-zinc-400 text-sm mb-4">
            Include your goals, target muscles, exercises you dislike, injuries or restrictions,
            where you’re working out (home/gym), available equipment, and time.
          </p>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: 45-minute pull day focused on hypertrophy. Target lats and biceps. No deadlifts. Mild shoulder impingement. Home gym with dumbbells and pull-up bar."
            className="w-full min-h-[120px] bg-zinc-900 text-white p-4 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-4"
          />
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-2">
              {generated && (
                <div className="text-emerald-200 text-sm font-semibold flex items-center gap-2">
                  <span className="text-xl">✓</span> Routine generated!
                </div>
              )}
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || generating}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-900 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold"
              >
                {generating ? `Generating${generatingDots}` : 'Generate Routine'}
              </button>
            </div>
            <button
              onClick={() => setPrompt('')}
              disabled={!prompt.trim() || generating}
              className="text-zinc-400 hover:text-zinc-200 text-sm"
            >
              Clear
            </button>
          </div>
        </Card>

        {messages.length > 0 && (
          <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">Conversation</h2>
            <div className="space-y-3">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={message.role === 'user'
                    ? 'bg-zinc-900 text-zinc-200 p-3 rounded-lg'
                    : 'bg-emerald-900/40 text-emerald-100 p-3 rounded-lg'}
                >
                  <div className="text-xs uppercase tracking-wide mb-1 text-zinc-400">
                    {message.role === 'user' ? 'You' : 'Assistant'}
                  </div>
                  <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
          <h2 className="text-lg font-semibold text-white mb-3">Routine Preview</h2>
          {parsedPlan ? (
            <div className="space-y-4">
              <div className="space-y-2 text-sm text-zinc-300">
                <div><span className="text-zinc-500">Name:</span> {preview.name}</div>
                <div><span className="text-zinc-500">Exercises:</span> {preview.exercises}</div>
                <div><span className="text-zinc-500">Pre-stretches:</span> {preview.preStretches}</div>
                <div><span className="text-zinc-500">Post-stretches:</span> {preview.postStretches}</div>
                <div><span className="text-zinc-500">Cardio:</span> {preview.hasCardio ? 'Yes' : 'No'}</div>
              </div>
              <button
                onClick={handleViewWorkout}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg text-sm font-semibold"
              >
                View Workout
              </button>
            </div>
          ) : (
            <div className="text-zinc-500 text-sm">
              Generate a routine to preview it here.
            </div>
          )}
        </div>

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
    </div>
  );
}
