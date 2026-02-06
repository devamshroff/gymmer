import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { getUserGoals, upsertUserGoals } from '@/lib/database';

export async function GET() {
  const authResult = await requireAuth();
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const goalsText = await getUserGoals(user.id);
    return NextResponse.json({ goals: goalsText || '' });
  } catch (error) {
    console.error('Error fetching goals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch goals' },
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
    const goalsRaw = typeof body?.goals === 'string' ? body.goals : '';
    const goals = goalsRaw.trim();

    await upsertUserGoals(user.id, goals.length > 0 ? goals : null);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving goals:', error);
    return NextResponse.json(
      { error: 'Failed to save goals' },
      { status: 500 }
    );
  }
}
