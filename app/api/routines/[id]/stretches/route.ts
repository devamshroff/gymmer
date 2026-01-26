// app/api/routines/[id]/stretches/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { addStretchToRoutine, removeStretchFromRoutine } from '@/lib/database';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const routineId = parseInt(id);
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const stretchId = searchParams.get('stretchId');
    const type = searchParams.get('type');

    if (!stretchId || !type) {
      return NextResponse.json(
        { error: 'stretchId and type are required' },
        { status: 400 }
      );
    }

    await removeStretchFromRoutine(parseInt(id), parseInt(stretchId), type as 'pre' | 'post');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing stretch from routine:', error);
    return NextResponse.json(
      { error: 'Failed to remove stretch from routine' },
      { status: 500 }
    );
  }
}
