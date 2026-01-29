// app/api/exercises/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAllExercises, searchExercises, createExercise, getUserGoals } from '@/lib/database';
import { requireAuth } from '@/lib/auth-utils';
import { generateFormTips } from '@/lib/form-tips';

export async function GET(request: NextRequest) {
  const authResult = await requireAuth();
  if ('error' in authResult) return authResult.error;

  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    const exercises = query
      ? await searchExercises(query)
      : await getAllExercises();

    return NextResponse.json({ exercises });
  } catch (error) {
    console.error('Error fetching exercises:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exercises' },
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
    const { name, videoUrl, tips, muscleGroups, equipment, difficulty } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Exercise name is required' },
        { status: 400 }
      );
    }

    const normalizedTips = typeof tips === 'string' ? tips.trim() : '';
    const goalsText = await getUserGoals(user.id);
    const fallbackTips = normalizedTips
      ? normalizedTips
      : await generateFormTips({
          kind: 'exercise',
          name,
          muscleGroups: Array.isArray(muscleGroups) ? muscleGroups : undefined,
          equipment: typeof equipment === 'string' ? equipment : undefined,
          difficulty: typeof difficulty === 'string' ? difficulty : undefined,
          goalsText,
        });

    const exerciseId = await createExercise({
      name,
      videoUrl,
      tips: fallbackTips || undefined,
      muscleGroups,
      equipment,
      difficulty
    });

    return NextResponse.json({ id: exerciseId, success: true }, { status: 201 });
  } catch (error) {
    console.error('Error creating exercise:', error);
    return NextResponse.json(
      { error: 'Failed to create exercise' },
      { status: 500 }
    );
  }
}
