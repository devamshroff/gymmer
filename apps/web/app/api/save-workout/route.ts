// app/api/save-workout/route.ts
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { saveWorkoutSessionForUser } from '@/lib/workout-session-save';
import type { WorkoutSessionData } from '@/lib/workout-session';

export async function POST(request: Request) {
  const authResult = await requireAuth();
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const sessionData: WorkoutSessionData = await request.json();
    const saved = await saveWorkoutSessionForUser(user.id, sessionData);

    return NextResponse.json({
      success: true,
      sessionId: saved.sessionId,
      totalDurationMinutes: saved.totalDurationMinutes,
      totalStrain: saved.totalStrain,
    });
  } catch (error) {
    console.error('Error saving workout session:', error);
    return NextResponse.json(
      { error: 'Failed to save workout session' },
      { status: 500 }
    );
  }
}
