// app/api/exercises/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAllExercises, searchExercises, createExercise } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    const exercises = query
      ? await searchExercises(query)
      : await getAllExercises();

    return NextResponse.json({ exercises });
  } catch (error) {
    console.error('Error fetching exercises:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exercises' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, videoUrl, tips, muscleGroups, equipment, difficulty } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Exercise name is required' },
        { status: 400 }
      );
    }

    const exerciseId = await createExercise({
      name,
      videoUrl,
      tips,
      muscleGroups,
      equipment,
      difficulty
    });

    return NextResponse.json({ id: exerciseId, success: true }, { status: 201 });
  } catch (error) {
    console.error('Error creating exercise:', error);
    return NextResponse.json(
      { error: 'Failed to create exercise' },
      { status: 500 }
    );
  }
}
