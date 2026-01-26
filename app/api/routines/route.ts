// app/api/routines/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAllRoutines, createRoutine } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const routines = await getAllRoutines();
    return NextResponse.json({ routines });
  } catch (error) {
    console.error('Error fetching routines:', error);
    return NextResponse.json(
      { error: 'Failed to fetch routines' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  let routineName = '';

  try {
    const body = await request.json();
    const { name } = body;
    routineName = name;

    if (!name) {
      return NextResponse.json(
        { error: 'Routine name is required' },
        { status: 400 }
      );
    }

    const routineId = await createRoutine(name);

    return NextResponse.json({ id: routineId, success: true }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating routine:', error);

    // Check for UNIQUE constraint violation
    if (error.message && error.message.includes('UNIQUE constraint failed')) {
      return NextResponse.json(
        { error: `A routine named "${routineName}" already exists. Please choose a different name.` },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create routine' },
      { status: 500 }
    );
  }
}
