// app/api/routines/public/route.ts
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { getPublicRoutines } from '@/lib/database';

// GET public routines (excludes current user's routines)
export async function GET() {
  const authResult = await requireAuth();
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const routines = await getPublicRoutines(user.id);

    return NextResponse.json({ routines });
  } catch (error) {
    console.error('Error fetching public routines:', error);
    return NextResponse.json(
      { error: 'Failed to fetch public routines' },
      { status: 500 }
    );
  }
}
