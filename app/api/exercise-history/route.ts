import { NextRequest, NextResponse } from 'next/server';
import { getExerciseHistory } from '@/lib/database';
import { requireAuth } from '@/lib/auth-utils';

type HistoryRange = 'week' | 'month' | 'all';

function normalizeRange(value: string | null): HistoryRange {
  if (value === 'week' || value === 'month' || value === 'all') {
    return value;
  }
  return 'month';
}

export async function GET(request: NextRequest) {
  const authResult = await requireAuth();
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const searchParams = request.nextUrl.searchParams;
    const names = searchParams.getAll('name').map((name) => name.trim()).filter(Boolean);

    if (names.length === 0) {
      return NextResponse.json(
        { error: 'At least one exercise name is required' },
        { status: 400 }
      );
    }

    const range = normalizeRange(searchParams.get('range'));
    const entries = await Promise.all(
      names.map(async (name) => [name, await getExerciseHistory(user.id, name, range)] as const)
    );

    return NextResponse.json({ history: Object.fromEntries(entries) });
  } catch (error) {
    console.error('Error fetching exercise history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exercise history' },
      { status: 500 }
    );
  }
}
