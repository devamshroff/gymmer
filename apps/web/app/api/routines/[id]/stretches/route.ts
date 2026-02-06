// app/api/routines/[id]/stretches/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { addStretchToRoutine, removeStretchFromRoutine, reorderRoutineStretches, getRoutineById } from '@/lib/database';
import { requireAuth } from '@/lib/auth-utils';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth();
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const { id } = await params;
    const routineId = parseInt(id);

    // Verify user owns this routine
    const routine = await getRoutineById(routineId, user.id);
    if (!routine) {
      return NextResponse.json({ error: 'Routine not found' }, { status: 404 });
    }

    const body = await request.json();
    const { stretchId, type, orderIndex } = body;

    if (!stretchId || !type || orderIndex === undefined) {
      return NextResponse.json(
        { error: 'stretchId, type, and orderIndex are required' },
        { status: 400 }
      );
    }

    const insertId = await addStretchToRoutine(routineId, stretchId, type, orderIndex);

    return NextResponse.json({ id: insertId, success: true }, { status: 201 });
  } catch (error) {
    console.error('Error adding stretch to routine:', error);
    return NextResponse.json(
      { error: 'Failed to add stretch to routine' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth();
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const { id } = await params;
    const routineId = parseInt(id);

    if (isNaN(routineId)) {
      return NextResponse.json(
        { error: 'Invalid routine ID' },
        { status: 400 }
      );
    }

    // Verify user owns this routine
    const routine = await getRoutineById(routineId, user.id);
    if (!routine) {
      return NextResponse.json({ error: 'Routine not found' }, { status: 404 });
    }

    const body = await request.json();
    const { type, order } = body;

    if (!type || !order || !Array.isArray(order)) {
      return NextResponse.json(
        { error: 'Type and order array are required' },
        { status: 400 }
      );
    }

    await reorderRoutineStretches(routineId, type, order);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reordering stretches:', error);
    return NextResponse.json(
      { error: 'Failed to reorder stretches' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth();
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const { id } = await params;
    const routineId = parseInt(id);

    // Verify user owns this routine
    const routine = await getRoutineById(routineId, user.id);
    if (!routine) {
      return NextResponse.json({ error: 'Routine not found' }, { status: 404 });
    }

    const searchParams = request.nextUrl.searchParams;
    const stretchId = searchParams.get('stretchId');
    const type = searchParams.get('type');

    if (!stretchId || !type) {
      return NextResponse.json(
        { error: 'stretchId and type are required' },
        { status: 400 }
      );
    }

    await removeStretchFromRoutine(routineId, parseInt(stretchId), type as 'pre' | 'post');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing stretch from routine:', error);
    return NextResponse.json(
      { error: 'Failed to remove stretch from routine' },
      { status: 500 }
    );
  }
}
