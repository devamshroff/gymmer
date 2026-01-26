// app/api/routines/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getRoutineById, getRoutineExercises, deleteRoutine } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const routineId = parseInt(id);

    if (isNaN(routineId)) {
      return NextResponse.json(
        { error: 'Invalid routine ID' },
        { status: 400 }
      );
    }

    const routine = await getRoutineById(routineId);

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const routineId = parseInt(id);

    if (isNaN(routineId)) {
      return NextResponse.json(
        { error: 'Invalid routine ID' },
        { status: 400 }
      );
    }

    await deleteRoutine(routineId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting routine:', error);
    return NextResponse.json(
      { error: 'Failed to delete routine' },
      { status: 500 }
    );
  }
}
