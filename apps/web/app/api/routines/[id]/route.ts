// app/api/routines/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getRoutineById, getRoutineExercises, deleteRoutine, updateRoutineName, setRoutinePublic } from '@/lib/database';
import { requireAuth } from '@/lib/auth-utils';

export async function GET(
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

    const routine = await getRoutineById(routineId, user.id);

    if (!routine) {
      return NextResponse.json(
        { error: 'Routine not found' },
        { status: 404 }
      );
    }

    const exercises = await getRoutineExercises(routineId);

    return NextResponse.json({
      routine,
      exercises
    });
  } catch (error) {
    console.error('Error fetching routine:', error);
    return NextResponse.json(
      { error: 'Failed to fetch routine' },
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

    const body = await request.json();
    const { name, isPublic } = body;

    // Verify routine ownership
    const routine = await getRoutineById(routineId, user.id);
    if (!routine) {
      return NextResponse.json(
        { error: 'Routine not found' },
        { status: 404 }
      );
    }

    // Update name if provided
    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim() === '') {
        return NextResponse.json(
          { error: 'Name cannot be empty' },
          { status: 400 }
        );
      }
      await updateRoutineName(routineId, name.trim(), user.id);
    }

    // Update privacy if provided
    if (isPublic !== undefined) {
      await setRoutinePublic(routineId, user.id, isPublic);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating routine:', error);
    return NextResponse.json(
      { error: 'Failed to update routine' },
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

    if (isNaN(routineId)) {
      return NextResponse.json(
        { error: 'Invalid routine ID' },
        { status: 400 }
      );
    }

    await deleteRoutine(routineId, user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting routine:', error);
    return NextResponse.json(
      { error: 'Failed to delete routine' },
      { status: 500 }
    );
  }
}
