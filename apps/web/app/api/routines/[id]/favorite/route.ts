// app/api/routines/[id]/favorite/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { addFavorite, removeFavorite, isFavorited, getRoutineById } from '@/lib/database';

// GET - check if routine is favorited
export async function GET(
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
    const favorited = await isFavorited(user.id, routineId);
    return NextResponse.json({ favorited });
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return NextResponse.json(
      { error: 'Failed to check favorite status' },
      { status: 500 }
    );
  }
}

// POST - add routine to favorites
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
    // Check if routine exists and is public
    const routine = await getRoutineById(routineId);
    if (!routine) {
      return NextResponse.json(
        { error: 'Routine not found' },
        { status: 404 }
      );
    }

    // Can't favorite own routine
    if (routine.user_id === user.id) {
      return NextResponse.json(
        { error: 'Cannot favorite your own routine' },
        { status: 400 }
      );
    }

    // Check if routine is public
    if (!routine.is_public) {
      return NextResponse.json(
        { error: 'Cannot favorite a private routine' },
        { status: 403 }
      );
    }

    await addFavorite(user.id, routineId);
    return NextResponse.json({ success: true, favorited: true });
  } catch (error) {
    console.error('Error adding favorite:', error);
    return NextResponse.json(
      { error: 'Failed to add favorite' },
      { status: 500 }
    );
  }
}

// DELETE - remove routine from favorites
export async function DELETE(
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
    await removeFavorite(user.id, routineId);
    return NextResponse.json({ success: true, favorited: false });
  } catch (error) {
    console.error('Error removing favorite:', error);
    return NextResponse.json(
      { error: 'Failed to remove favorite' },
      { status: 500 }
    );
  }
}
