import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { getAllExercises, getUserGoals } from '@/lib/database';

const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

function extractJson(content: string): string {
  const fencedMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fencedMatch?.[1]) {
    return fencedMatch[1];
  }
  return content;
}

function buildSystemPrompt(exerciseNames: string[], goalsText?: string | null): string {
  const goalsLine = goalsText ? `User goals: ${goalsText}` : 'User goals: (not provided)';
  return [
    'You are a gym trainer helping users make consistent, incremental progress.',
    'Generate a workout routine JSON.',
    'Output ONLY valid JSON with this exact shape:',
    '{',
    '  "name": string,',
    '  "description": string (optional),',
    '  "exercises": [',
    '    { "type": "single", "name": string, "sets": number, "targetReps": number, "targetWeight": number, "warmupWeight": number, "restTime": number, "videoUrl": string (optional), "tips": string (optional) },',
    '    { "type": "b2b", "exercises": [ { "name": string, "sets": number, "targetReps": number, "targetWeight": number, "warmupWeight": number, "videoUrl": string (optional), "tips": string (optional) }, { ... } ] }',
    '  ],',
    '  "preWorkoutStretches": [ { "name": string, "duration": string, "videoUrl": string (optional), "tips": string (optional) } ],',
    '  "postWorkoutStretches": [ { "name": string, "duration": string, "videoUrl": string (optional), "tips": string (optional) } ],',
    '  "cardio": { "type": string, "duration": string, "intensity": string, "tips": string (optional) } (optional)',
    '}',
    'Use realistic weights/reps and keep names concise.',
    'Include preWorkoutStretches and postWorkoutStretches with at least 4 items each; increase counts for larger routines.',
    'Ensure every primary muscle used has at least one pre-workout and one post-workout stretch.',
    'Incorporate user goals, target muscles, disliked exercises, restrictions, available equipment, location, and time constraints when provided.',
    'Prefer existing exercises from the list below when possible.',
    'If a needed exercise is not in the list, you may invent a new one with a clear name.',
    goalsLine,
    `Available exercises: ${exerciseNames.join(', ')}`,
    'No markdown, no explanations, JSON only.'
  ].join('\n');
}

export async function POST(request: NextRequest) {
  const authResult = await requireAuth();
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'Missing OPENAI_API_KEY' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const prompt = String(body?.prompt || '').trim();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const allExercises = await getAllExercises();
    const exerciseNames = allExercises.map((exercise) => exercise.name);
    const goalsText = await getUserGoals(user.id);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [
          { role: 'system', content: buildSystemPrompt(exerciseNames, goalsText) },
          { role: 'user', content: prompt }
        ],
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `OpenAI request failed: ${errorText}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) {
      return NextResponse.json(
        { error: 'No content returned from model' },
        { status: 502 }
      );
    }

    const jsonText = extractJson(content);
    let workoutPlan: any;
    try {
      workoutPlan = JSON.parse(jsonText);
    } catch (error) {
      return NextResponse.json(
        { error: 'Model did not return valid JSON' },
        { status: 502 }
      );
    }

    if (!workoutPlan?.name || !Array.isArray(workoutPlan.exercises)) {
      return NextResponse.json(
        { error: 'Generated plan is missing required fields' },
        { status: 502 }
      );
    }

    return NextResponse.json({ workoutPlan });
  } catch (error: any) {
    console.error('Error generating routine:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate routine' },
      { status: 500 }
    );
  }
}
