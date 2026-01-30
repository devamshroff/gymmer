// app/api/exercises/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAllExercises, searchExercises, createExercise, getUserGoals } from '@/lib/database';
import { requireAuth } from '@/lib/auth-utils';
import { generateExerciseInsights } from '@/lib/form-tips';
import { EXERCISE_MUSCLE_TAGS, EXERCISE_TYPE_TAGS, normalizeTypeList } from '@/lib/muscle-tags';

export async function GET(request: NextRequest) {
  const authResult = await requireAuth();
  if ('error' in authResult) return authResult.error;

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
  const authResult = await requireAuth();
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const body = await request.json();
    const { name, videoUrl, tips, equipment, difficulty } = body;
    const exerciseTypesInput = normalizeTypeList(body.exerciseTypes ?? body.exerciseType, EXERCISE_TYPE_TAGS);

    if (!name) {
      return NextResponse.json(
        { error: 'Exercise name is required' },
        { status: 400 }
      );
    }

    const normalizedTips = typeof tips === 'string' ? tips.trim() : '';
    const promptMuscles = normalizeTypeList(exerciseTypesInput, EXERCISE_MUSCLE_TAGS);
    const goalsText = await getUserGoals(user.id);
    const insights = await generateExerciseInsights({
      kind: 'exercise',
      name,
      muscleGroups: promptMuscles.length ? promptMuscles : undefined,
      equipment: typeof equipment === 'string' ? equipment : undefined,
      difficulty: typeof difficulty === 'string' ? difficulty : undefined,
      goalsText,
    });
    const fallbackTips = normalizedTips || insights?.tips || null;
    const inferredBodyweight = typeof insights?.isBodyweight === 'boolean'
      ? insights.isBodyweight
      : false;
    const inferredExerciseTypes = normalizeTypeList(insights?.exerciseTypes, EXERCISE_TYPE_TAGS);
    const exerciseTypes = exerciseTypesInput.length ? exerciseTypesInput : inferredExerciseTypes;
    const muscleGroups = normalizeTypeList(exerciseTypes, EXERCISE_MUSCLE_TAGS);
    const resolvedMuscleGroups = muscleGroups.length ? muscleGroups : ['unknown'];

    const exerciseId = await createExercise({
      name,
      videoUrl,
      tips: fallbackTips || undefined,
      muscleGroups: resolvedMuscleGroups,
      exerciseTypes: exerciseTypes.length ? exerciseTypes : undefined,
      equipment,
      isBodyweight: inferredBodyweight,
      difficulty
    });

    return NextResponse.json(
      { id: exerciseId, success: true, is_bodyweight: inferredBodyweight ? 1 : 0 },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating exercise:', error);
    return NextResponse.json(
      { error: 'Failed to create exercise' },
      { status: 500 }
    );
  }
}
