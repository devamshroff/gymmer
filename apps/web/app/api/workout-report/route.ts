import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import {
  getRecentExerciseLogs,
  getUserGoals,
  getLatestWorkoutReportForWorkoutName,
  getWorkoutSessionReportById,
  getWorkoutSessionReportByKey,
  updateWorkoutSessionReport
} from '@/lib/database';
import type { WorkoutSessionData } from '@/lib/workout-session';
import { createClaudeText, getClaudeErrorStatus } from '@/lib/claude';

type PreWorkoutTarget = {
  name: string;
  targetWeight?: number | null;
  targetReps?: number | null;
  isBodyweight?: boolean;
  isMachine?: boolean;
};

type PreWorkoutTargetsPayload = {
  sessionMode?: string | null;
  source?: 'ai' | 'fallback' | null;
  encouragement?: string | null;
  goalSummary?: string | null;
  trendSummary?: string | null;
  targets?: PreWorkoutTarget[];
};

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

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'Missing ANTHROPIC_API_KEY' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const sessionData = body?.sessionData as WorkoutSessionData | undefined;
    if (!sessionData) {
      return NextResponse.json({ error: 'sessionData is required' }, { status: 400 });
    }
    const preWorkoutTargetsRaw = body?.preWorkoutTargets as PreWorkoutTargetsPayload | null | undefined;
    const preWorkoutTargets = preWorkoutTargetsRaw
      ? {
        ...preWorkoutTargetsRaw,
        targets: Array.isArray(preWorkoutTargetsRaw.targets) ? preWorkoutTargetsRaw.targets : [],
      }
      : null;

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
      preWorkoutTargets,
    };

    const { text: reportText } = await createClaudeText({
      system: [
        'You are a gym trainer helping users make consistent progress.',
        'Write a post-workout report.',
        'Use any provided preWorkoutTargets (targets + goalSummary + sessionMode) to compare performance and set next targets.',
        'If preWorkoutTargets are missing, rely on session data and history.',
        'Return a short summary sentence plus 3-6 bullet points.',
        'Call out wins, consistency, and 1-2 actionable next targets.',
        'Keep it concise and encouraging. No markdown headings. Emphasize recovery.'
      ].join(' '),
      messages: [
        {
          role: 'user',
          content: JSON.stringify(payload)
        }
      ],
      temperature: 0.4,
      maxTokens: 300,
    });

    await updateWorkoutSessionReport({
      userId: user.id,
      sessionId: typeof sessionData.sessionId === 'number' ? sessionData.sessionId : null,
      sessionKey: sessionData.startTime,
      report: reportText
    });

    return NextResponse.json({ report: reportText });
  } catch (error: any) {
    console.error('Error generating workout report:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate report' },
      { status: getClaudeErrorStatus(error) }
    );
  }
}

export async function GET(request: NextRequest) {
  const authResult = await requireAuth();
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  const searchParams = request.nextUrl.searchParams;
  const sessionIdRaw = searchParams.get('sessionId');
  const sessionKey = searchParams.get('sessionKey');
  const workoutName = searchParams.get('workoutName');
  const sessionId = sessionIdRaw ? Number(sessionIdRaw) : null;

  if (!sessionKey && !Number.isFinite(sessionId) && !workoutName) {
    return NextResponse.json(
      { error: 'sessionId, sessionKey, or workoutName is required' },
      { status: 400 }
    );
  }

  try {
    let report: string | null = null;
    if (Number.isFinite(sessionId)) {
      report = await getWorkoutSessionReportById(user.id, sessionId as number);
    }
    if (!report && sessionKey) {
      report = await getWorkoutSessionReportByKey(user.id, sessionKey);
    }
    if (!report && workoutName) {
      report = await getLatestWorkoutReportForWorkoutName(user.id, workoutName);
    }
    return NextResponse.json({ report: report || null });
  } catch (error: any) {
    console.error('Error fetching workout report:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch report' },
      { status: 500 }
    );
  }
}
