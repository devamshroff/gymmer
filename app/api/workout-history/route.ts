// app/api/workout-history/route.ts
import { NextResponse } from 'next/server';
import { getLastWorkoutDate } from '@/lib/database';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const workoutName = searchParams.get('name');

    if (!workoutName) {
      return NextResponse.json(
        { error: 'Workout name is required' },
        { status: 400 }
      );
    }

    const lastDate = await getLastWorkoutDate(workoutName);

    return NextResponse.json({ lastDate });
  } catch (error) {
    console.error('Error fetching workout history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workout history' },
      { status: 500 }
    );
  }
}
