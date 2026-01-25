// app/api/last-exercise/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getLastExerciseLog } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const workoutName = searchParams.get('workoutName');
    const exerciseName = searchParams.get('exerciseName');

    if (!workoutName || !exerciseName) {
      return NextResponse.json(
        { error: 'Workout name and exercise name are required' },
        { status: 400 }
      );
    }

    const lastLog = await getLastExerciseLog(workoutName, exerciseName);

    return NextResponse.json({ lastLog });
  } catch (error) {
    console.error('Error fetching last exercise log:', error);
    return NextResponse.json(
      { error: 'Failed to fetch last exercise log' },
      { status: 500 }
    );
  }
}
