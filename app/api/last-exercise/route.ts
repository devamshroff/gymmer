// app/api/last-exercise/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getLastExerciseLog } from '@/lib/database';
import { requireAuth } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  const authResult = await requireAuth();
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const searchParams = request.nextUrl.searchParams;
    const exerciseName = searchParams.get('exerciseName');

    if (!exerciseName) {
      return NextResponse.json(
        { error: 'Exercise name is required' },
        { status: 400 }
      );
    }

    const lastLog = await getLastExerciseLog(exerciseName, user.id);

    return NextResponse.json({ lastLog });
  } catch (error) {
    console.error('Error fetching last exercise log:', error);
    return NextResponse.json(
      { error: 'Failed to fetch last exercise log' },
      { status: 500 }
    );
  }
}
