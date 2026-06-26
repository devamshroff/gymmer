import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { getAllExercises, getUserGoals } from '@/lib/database';
import { createClaudeText, getClaudeErrorStatus } from '@/lib/claude';

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
    'You are a gym trainer helping users make consistent progress.',
    'Generate a workout routine JSON.',
    'Output ONLY valid JSON with this exact shape:',
    '{',
    '  "name": string,',
    '  "description": string (optional),',
    '  "exercises": [',
    '    { "type": "single", "name": string, "videoUrl": string (optional), "tips": string (optional) },',
    '    { "type": "b2b", "exercises": [ { "name": string, "videoUrl": string (optional), "tips": string (optional) }, { ... } ] }',
    '  ],',
    '  "preWorkoutStretches": [ { "name": string, "timerSeconds": number, "videoUrl": string (optional), "tips": string (optional) } ],',
    '  "postWorkoutStretches": [ { "name": string, "timerSeconds": number, "videoUrl": string (optional), "tips": string (optional) } ],',
    '  "cardio": { "type": string, "duration": string, "intensity": string, "tips": string (optional) } (optional)',
    '}',
    'Keep names concise.',
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

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'Missing ANTHROPIC_API_KEY' },
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

    const { text: content } = await createClaudeText({
      system: buildSystemPrompt(exerciseNames, goalsText),
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
      maxTokens: 3000,
    });

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
      { status: getClaudeErrorStatus(error) }
    );
  }
}
