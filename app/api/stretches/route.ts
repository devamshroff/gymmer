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
    const { name, duration, type, tips, videoUrl, timerSeconds, sideCount } = body;
    const muscleGroupsInput = normalizeTypeList(
      body.muscleGroups || body.stretchTypes,
      STRETCH_MUSCLE_TAGS
    );
    const nameValue = typeof name === 'string' ? name.trim() : '';
    const durationValue = typeof duration === 'string' ? duration.trim() : '';
    const durationSecondsRaw = durationValue ? Number.parseFloat(durationValue) : NaN;
    const stretchContext = typeof type === 'string' ? type : undefined;

    if (!nameValue) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const normalizedTips = typeof tips === 'string' ? tips.trim() : '';
    const goalsText = await getUserGoals(user.id);
    const insights = await generateStretchInsights({
      kind: 'stretch',
      name: nameValue,
      duration: durationValue || undefined,
      stretchType: stretchContext,
      muscleGroups: muscleGroupsInput.length ? muscleGroupsInput : undefined,
      goalsText,
    });
    const resolvedTips = normalizedTips || insights?.tips || null;
    const timerSecondsInput = Number.isFinite(Number(timerSeconds)) && Number(timerSeconds) > 0
      ? Number(timerSeconds)
      : Number.isFinite(durationSecondsRaw) && durationSecondsRaw > 0
        ? durationSecondsRaw
        : NaN;
    const timerSecondsValue = Number.isFinite(timerSecondsInput) && timerSecondsInput > 0
      ? Math.round(timerSecondsInput)
      : insights?.timerSeconds ?? null;
    const sideCountValue = Number(sideCount) === 1 || Number(sideCount) === 2
      ? Number(sideCount)
      : insights?.sideCount ?? 1;
    const inferredMuscleGroups = normalizeTypeList(insights?.muscleGroups, STRETCH_MUSCLE_TAGS);
    const muscleGroups = muscleGroupsInput.length ? muscleGroupsInput : inferredMuscleGroups;
    const resolvedMuscleGroups = muscleGroups.length ? muscleGroups : ['unknown'];

    if (!timerSecondsValue) {
      return NextResponse.json(
        { error: 'Unable to determine stretch time. Provide timerSeconds or try again.' },
        { status: 400 }
      );
    }

    const resolvedDuration = durationValue || `${timerSecondsValue} seconds`;
    const stretchId = await createStretch({
      name: nameValue,
      duration: resolvedDuration,
      muscleGroups: resolvedMuscleGroups,
      timerSeconds: timerSecondsValue,
      sideCount: sideCountValue,
      tips: resolvedTips || undefined,
      videoUrl
    });

    return NextResponse.json(
      {
        id: stretchId,
        success: true,
        duration: resolvedDuration,
        timer_seconds: timerSecondsValue,
        side_count: sideCountValue,
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
