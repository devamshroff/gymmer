// app/api/routines/[id]/cardio/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';

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
    const { type, duration, intensity, tips } = body;

    if (!type || !duration) {
      return NextResponse.json(
        { error: 'Type and duration are required' },
        { status: 400 }
      );
    }

    const db = getDatabase();

    // Delete existing cardio if any
    await db.execute({
      sql: 'DELETE FROM routine_cardio WHERE routine_id = ?',
      args: [routineId]
    });

    // Insert new cardio
    const result = await db.execute({
      sql: 'INSERT INTO routine_cardio (routine_id, cardio_type, duration, intensity, tips) VALUES (?, ?, ?, ?, ?)',
      args: [routineId, type, duration, intensity || null, tips || null]
    });

    return NextResponse.json({ id: Number(result.lastInsertRowid), success: true }, { status: 201 });
  } catch (error) {
    console.error('Error adding cardio to routine:', error);
    return NextResponse.json(
      { error: 'Failed to add cardio to routine' },
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

    const db = getDatabase();
    await db.execute({
      sql: 'DELETE FROM routine_cardio WHERE routine_id = ?',
      args: [routineId]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting cardio from routine:', error);
    return NextResponse.json(
      { error: 'Failed to delete cardio from routine' },
      { status: 500 }
    );
  }
}
