// app/api/workout-history/route.ts
import { NextResponse } from 'next/server';
import { getLastWorkoutDate } from '@/lib/database';
import { requireAuth } from '@/lib/auth-utils';

export async function GET(request: Request) {
  const authResult = await requireAuth();
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const { searchParams } = new URL(request.url);
    const workoutName = searchParams.get('name');

    if (!workoutName) {
      return NextResponse.json(
        { error: 'Workout name is required' },
        { status: 400 }
      );
    }

    const lastDate = await getLastWorkoutDate(workoutName, user.id);

    return NextResponse.json({ lastDate });
  } catch (error) {
    console.error('Error fetching workout history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workout history' },
      { status: 500 }
    );
  }
}
