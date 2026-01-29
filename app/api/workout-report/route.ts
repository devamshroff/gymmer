import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { getRecentExerciseLogs, getUserGoals, updateRoutineNotes } from '@/lib/database';
import type { WorkoutSessionData } from '@/lib/workout-session';

const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

function summarizeLogs(logs: Array<any>) {
  return logs.map((log) => {
    const sets: Array<{ weight: number; reps: number }> = [];
    for (let i = 1; i <= 4; i += 1) {
      const weight = log[`set${i}_weight`];
      const reps = log[`set${i}_reps`];
      if (weight !== null && reps !== null) {
        sets.push({ weight, reps });
      }
    }
    return {
      completedAt: log.completed_at || log.created_at,
      matchedRole: log.matched_role,
      warmup: log.warmup_weight !== null && log.warmup_reps !== null
        ? { weight: log.warmup_weight, reps: log.warmup_reps }
        : null,
      sets,
    };
  });
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
    const sessionData = body?.sessionData as WorkoutSessionData | undefined;
    const routineId = typeof body?.routineId === 'number' ? body.routineId : null;

    if (!sessionData) {
      return NextResponse.json({ error: 'sessionData is required' }, { status: 400 });
    }

    const goalsText = await getUserGoals(user.id);

    const exerciseNames = new Set<string>();
    for (const exercise of sessionData.exercises) {
      exerciseNames.add(exercise.name);
      if (exercise.b2bPartner?.name) {
        exerciseNames.add(exercise.b2bPartner.name);
      }
    }

    const history: Record<string, Array<any>> = {};
    for (const name of exerciseNames) {
      const logs = await getRecentExerciseLogs(name, user.id, 3);
      history[name] = summarizeLogs(logs);
    }

    const payload = {
      goals: goalsText || '',
      workoutName: sessionData.workoutName,
      sessionExercises: sessionData.exercises,
      history,
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [
          {
            role: 'system',
            content: [
              'You are a gym trainer helping users make consistent, incremental progress.',
              'Write a post-workout report.',
              'Return a short summary sentence plus 3-6 bullet points.',
              'Call out wins, consistency, and 1-2 actionable next targets.',
              'Keep it concise and encouraging. No markdown headings.'
            ].join(' ')
          },
          {
            role: 'user',
            content: JSON.stringify(payload)
          }
        ],
        temperature: 0.4,
        max_tokens: 300,
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
    const reportText = data.choices?.[0]?.message?.content?.trim();
    if (!reportText) {
      return NextResponse.json(
        { error: 'No content returned from model' },
        { status: 502 }
      );
    }

    if (routineId) {
      await updateRoutineNotes(routineId, reportText, user.id);
    }

    return NextResponse.json({ report: reportText });
  } catch (error: any) {
    console.error('Error generating workout report:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate report' },
      { status: 500 }
    );
  }
}
