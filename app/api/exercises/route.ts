// app/api/exercises/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAllExercises, searchExercises, createExercise, getUserGoals } from '@/lib/database';
import { requireAuth } from '@/lib/auth-utils';
import { generateExerciseInsights } from '@/lib/form-tips';
import { MUSCLE_GROUP_TAGS, normalizeTypeList } from '@/lib/muscle-tags';
import { assertPrimaryMetric, getDefaultMetricUnit, resolvePrimaryMetric } from '@/lib/metric-utils';

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
    const { name, videoUrl, tips, equipment, difficulty, isMachine } = body;
    const primaryMetricInput = body?.primaryMetric;
    const metricUnitInput = body?.metricUnit;
    const muscleGroupsInput = normalizeTypeList(
      body.muscleGroups ?? body.muscleGroup ?? body.exerciseTypes ?? body.exerciseType,
      MUSCLE_GROUP_TAGS
    );

    if (!name) {
      return NextResponse.json(
        { error: 'Exercise name is required' },
        { status: 400 }
      );
    }

    const normalizedTips = typeof tips === 'string' ? tips.trim() : '';
    const promptMuscles = normalizeTypeList(muscleGroupsInput, MUSCLE_GROUP_TAGS);
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
    const resolvedDifficulty = typeof difficulty === 'string' && difficulty.trim()
      ? difficulty.trim()
      : insights?.difficulty || 'Intermediate';
    const inferredMuscleGroups = normalizeTypeList(insights?.muscleGroups, MUSCLE_GROUP_TAGS);
    const muscleGroups = muscleGroupsInput.length ? muscleGroupsInput : inferredMuscleGroups;
    const resolvedMuscleGroups = muscleGroups.length ? muscleGroups : ['unknown'];

    try {
      assertPrimaryMetric(primaryMetricInput);
    } catch {
      return NextResponse.json(
        { error: 'primaryMetric is required' },
        { status: 400 }
      );
    }

    const resolvedPrimaryMetric = resolvePrimaryMetric(primaryMetricInput, inferredBodyweight);
    const fallbackMetricUnit = getDefaultMetricUnit(resolvedPrimaryMetric);
    const resolvedMetricUnit = typeof metricUnitInput === 'string' && metricUnitInput.trim()
      ? metricUnitInput.trim()
      : fallbackMetricUnit;

    const exerciseId = await createExercise({
      name,
      videoUrl,
      tips: fallbackTips || undefined,
      muscleGroups: resolvedMuscleGroups,
      equipment,
      isBodyweight: inferredBodyweight,
      isMachine: typeof isMachine === 'boolean' ? isMachine : undefined,
      difficulty: resolvedDifficulty,
      primaryMetric: resolvedPrimaryMetric,
      metricUnit: resolvedMetricUnit
    });

    return NextResponse.json(
      {
        id: exerciseId,
        success: true,
        is_bodyweight: inferredBodyweight ? 1 : 0,
        primary_metric: resolvedPrimaryMetric,
        metric_unit: resolvedMetricUnit
      },
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
