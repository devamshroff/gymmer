// app/api/stretches/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAllStretches, createStretch, getUserGoals } from '@/lib/database';
import { requireAuth } from '@/lib/auth-utils';
import { generateStretchInsights } from '@/lib/form-tips';
import { STRETCH_MUSCLE_TAGS, normalizeTypeList } from '@/lib/muscle-tags';

export async function GET(request: NextRequest) {
  const authResult = await requireAuth();
  if ('error' in authResult) return authResult.error;

  try {
    const stretches = await getAllStretches();
    return NextResponse.json({ stretches });
  } catch (error) {
    console.error('Error fetching stretches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stretches' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authResult = await requireAuth();
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const body = await request.json();
    const { name, tips, videoUrl, timerSeconds } = body;
    const muscleGroupsInput = normalizeTypeList(
      body.muscleGroups || body.stretchTypes,
      STRETCH_MUSCLE_TAGS
    );
    const nameValue = typeof name === 'string' ? name.trim() : '';

    if (!nameValue) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const normalizedTips = typeof tips === 'string' ? tips.trim() : '';
    const goalsText = await getUserGoals(user.id);
    const timerSecondsInput = Number.isFinite(Number(timerSeconds)) && Number(timerSeconds) > 0
      ? Math.round(Number(timerSeconds))
      : null;
    const insights = await generateStretchInsights({
      kind: 'stretch',
      name: nameValue,
      timerSeconds: timerSecondsInput ?? undefined,
      muscleGroups: muscleGroupsInput.length ? muscleGroupsInput : undefined,
      goalsText,
    });
    const resolvedTips = normalizedTips || insights?.tips || null;
    const timerSecondsValue = timerSecondsInput
      ? Math.round(timerSecondsInput)
      : insights?.timerSeconds ?? null;
    const inferredMuscleGroups = normalizeTypeList(insights?.muscleGroups, STRETCH_MUSCLE_TAGS);
    const muscleGroups = muscleGroupsInput.length ? muscleGroupsInput : inferredMuscleGroups;
    const resolvedMuscleGroups = muscleGroups.length ? muscleGroups : ['unknown'];

    if (!timerSecondsValue) {
      return NextResponse.json(
        { error: 'Unable to determine stretch time. Provide timerSeconds or try again.' },
        { status: 400 }
      );
    }

    const stretchId = await createStretch({
      name: nameValue,
      muscleGroups: resolvedMuscleGroups,
      timerSeconds: timerSecondsValue,
      tips: resolvedTips || undefined,
      videoUrl
    });

    return NextResponse.json(
      {
        id: stretchId,
        success: true,
        timer_seconds: timerSecondsValue,
        tips: resolvedTips
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating stretch:', error);
    return NextResponse.json(
      { error: 'Failed to create stretch' },
      { status: 500 }
    );
  }
}
