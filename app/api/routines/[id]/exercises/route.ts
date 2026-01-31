// app/api/routines/[id]/exercises/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { addExerciseToRoutine, removeExerciseFromRoutine, getRoutineExercises, reorderRoutineExercises, getRoutineById } from '@/lib/database';
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

    if (isNaN(routineId)) {
      return NextResponse.json(
        { error: 'Invalid routine ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { exerciseId1, exerciseId2 } = body;

    if (!exerciseId1) {
      return NextResponse.json(
        { error: 'Exercise ID is required' },
        { status: 400 }
      );
    }

    // Get current exercises to determine order_index
    const currentExercises = await getRoutineExercises(routineId);
    const orderIndex = currentExercises.length;

    const exerciseConfigId = await addExerciseToRoutine({
      routineId,
      exerciseId1,
      exerciseId2: exerciseId2 ?? null,
      orderIndex
    });

    return NextResponse.json({ id: exerciseConfigId, success: true }, { status: 201 });
  } catch (error) {
    console.error('Error adding exercise to routine:', error);
    return NextResponse.json(
      { error: 'Failed to add exercise to routine' },
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
    const { order } = body;

    if (!order || !Array.isArray(order)) {
      return NextResponse.json(
        { error: 'Order array is required' },
        { status: 400 }
      );
    }

    await reorderRoutineExercises(routineId, order);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reordering exercises:', error);
    return NextResponse.json(
      { error: 'Failed to reorder exercises' },
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
    const exerciseConfigId = searchParams.get('exerciseConfigId');

    if (!exerciseConfigId) {
      return NextResponse.json(
        { error: 'Exercise config ID is required' },
        { status: 400 }
      );
    }

    await removeExerciseFromRoutine(parseInt(exerciseConfigId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing exercise from routine:', error);
    return NextResponse.json(
      { error: 'Failed to remove exercise from routine' },
      { status: 500 }
    );
  }
}
