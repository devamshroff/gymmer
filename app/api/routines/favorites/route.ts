// app/api/routines/favorites/route.ts
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { getFavoritedRoutines } from '@/lib/database';

// GET user's favorited routines
export async function GET() {
  const authResult = await requireAuth();
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const routines = await getFavoritedRoutines(user.id);
    return NextResponse.json({ routines });
  } catch (error) {
    console.error('Error fetching favorited routines:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorited routines' },
      { status: 500 }
    );
  }
}
