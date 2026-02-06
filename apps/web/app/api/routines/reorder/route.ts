// app/api/routines/reorder/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { reorderUserRoutines } from '@/lib/database';

export async function PUT(request: NextRequest) {
  const authResult = await requireAuth();
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  let body: { order?: number[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }

  const order = body.order;
  if (!Array.isArray(order) || order.some((id) => !Number.isFinite(id))) {
    return NextResponse.json(
      { error: 'Order must be an array of routine IDs' },
      { status: 400 }
    );
  }

  try {
    await reorderUserRoutines(user.id, order);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reordering routines:', error);
    return NextResponse.json(
      { error: 'Failed to reorder routines' },
      { status: 500 }
    );
  }
}
