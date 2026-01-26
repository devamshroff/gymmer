// app/api/routines/[id]/exercises/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { addExerciseToRoutine, removeExerciseFromRoutine, getRoutineExercises } from '@/lib/database';

export async function POST(
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

    const body = await request.json();
    const {
      exerciseId,
      exerciseType,
      sets,
      targetReps,
      targetWeight,
      warmupWeight,
      restTime,
      b2bPartnerId,
      b2bSets,
      b2bTargetReps,
      b2bTargetWeight,
      b2bWarmupWeight
    } = body;

    if (!exerciseId || !exerciseType) {
      return NextResponse.json(
        { error: 'Exercise ID and type are required' },
        { status: 400 }
      );
    }

    // Get current exercises to determine order_index
    const currentExercises = await getRoutineExercises(routineId);
    const orderIndex = currentExercises.length;

    const exerciseConfigId = await addExerciseToRoutine({
      routineId,
      exerciseId,
      orderIndex,
      exerciseType,
      sets,
      targetReps,
      targetWeight,
      warmupWeight,
      restTime,
      b2bPartnerId,
      b2bSets,
      b2bTargetReps,
      b2bTargetWeight,
      b2bWarmupWeight
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await params; // Consume params for consistency
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
