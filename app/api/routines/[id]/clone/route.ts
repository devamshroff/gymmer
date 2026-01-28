// app/api/routines/[id]/clone/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { cloneRoutine, getRoutineById } from '@/lib/database';

// POST - clone a routine for editing
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth();
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  const { id } = await params;
  const routineId = parseInt(id);

  if (isNaN(routineId)) {
    return NextResponse.json(
      { error: 'Invalid routine ID' },
      { status: 400 }
    );
  }

  try {
    // Check if routine exists
    const routine = await getRoutineById(routineId);
    if (!routine) {
      return NextResponse.json(
        { error: 'Routine not found' },
        { status: 404 }
      );
    }

    // Can't clone own routine (they can edit it directly)
    if (routine.user_id === user.id) {
      return NextResponse.json(
        { error: 'You can edit your own routine directly' },
        { status: 400 }
      );
    }

    // Check if routine is public (or allow favorited private routines?)
    if (!routine.is_public) {
      return NextResponse.json(
        { error: 'Cannot clone a private routine' },
        { status: 403 }
      );
    }

    // Get optional new name from body
    let newName: string | undefined;
    try {
      const body = await request.json();
      newName = body.name;
    } catch {
      // No body or invalid JSON, that's ok
    }

    const newRoutineId = await cloneRoutine(routineId, user.id, newName);

    return NextResponse.json({
      success: true,
      routineId: newRoutineId,
      message: 'Routine cloned successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error cloning routine:', error);
    return NextResponse.json(
      { error: 'Failed to clone routine' },
      { status: 500 }
    );
  }
}
