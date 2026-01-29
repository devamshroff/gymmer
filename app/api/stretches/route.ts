// app/api/stretches/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAllStretches, createStretch, getUserGoals } from '@/lib/database';
import { requireAuth } from '@/lib/auth-utils';
import { generateFormTips } from '@/lib/form-tips';

export async function GET(request: NextRequest) {
  const authResult = await requireAuth();
  if ('error' in authResult) return authResult.error;

  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') as 'pre_workout' | 'post_workout' | null;

    const stretches = await getAllStretches(type || undefined);
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
    const { name, duration, type, muscleGroups, tips, videoUrl } = body;

    if (!name || !duration || !type) {
      return NextResponse.json(
        { error: 'Name, duration, and type are required' },
        { status: 400 }
      );
    }

    const normalizedTips = typeof tips === 'string' ? tips.trim() : '';
    const goalsText = await getUserGoals(user.id);
    const fallbackTips = normalizedTips
      ? normalizedTips
      : await generateFormTips({
          kind: 'stretch',
          name,
          duration,
          stretchType: type,
          muscleGroups: Array.isArray(muscleGroups) ? muscleGroups : undefined,
          goalsText,
        });

    const stretchId = await createStretch({
      name,
      duration,
      type,
      muscleGroups,
      tips: fallbackTips || undefined,
      videoUrl
    });

    return NextResponse.json({ id: stretchId, success: true }, { status: 201 });
  } catch (error) {
    console.error('Error creating stretch:', error);
    return NextResponse.json(
      { error: 'Failed to create stretch' },
      { status: 500 }
    );
  }
}
