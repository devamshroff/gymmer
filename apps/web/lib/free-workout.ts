import type { WorkoutPlan } from '@/lib/types';
import { EXERCISE_TYPES } from '@/lib/constants';

export const FREE_WORKOUT_SLUG = 'free-workout';
export const FREE_WORKOUT_NAME = 'Free Workout';

export type RoutineExerciseDraft = {
  exerciseId1: number | null;
  exerciseId2: number | null;
  name1: string;
  name2: string | null;
};

export type ResolvedRoutineExercise = {
  exerciseId1: number;
  exerciseId2: number | null;
};

export function buildFreeWorkoutPlan(): WorkoutPlan {
  return {
    name: FREE_WORKOUT_NAME,
    exercises: [],
    preWorkoutStretches: [],
    postWorkoutStretches: [],
  };
}

function normalizeName(value: string): string {
  return value.trim().toLowerCase();
}

export function extractRoutineExerciseDrafts(plan: WorkoutPlan): RoutineExerciseDraft[] {
  return plan.exercises.map((exercise) => {
    if (exercise.type === EXERCISE_TYPES.single) {
      return {
        exerciseId1: exercise.exerciseId ?? null,
        exerciseId2: null,
        name1: exercise.name,
        name2: null,
      };
    }

    const [ex1, ex2] = exercise.exercises;
    return {
      exerciseId1: ex1.exerciseId ?? null,
      exerciseId2: ex2.exerciseId ?? null,
      name1: ex1.name,
      name2: ex2.name,
    };
  });
}

export function resolveRoutineExerciseIds(
  drafts: RoutineExerciseDraft[],
  nameToId: Map<string, number>
): { resolved: ResolvedRoutineExercise[]; missing: string[] } {
  const missing: string[] = [];
  const resolved = drafts.map((draft) => {
    const name1Key = normalizeName(draft.name1);
    const name2Key = draft.name2 ? normalizeName(draft.name2) : null;
    const exerciseId1 = draft.exerciseId1 ?? nameToId.get(name1Key) ?? null;
    const exerciseId2 = name2Key ? (draft.exerciseId2 ?? nameToId.get(name2Key) ?? null) : null;

    if (!exerciseId1) {
      missing.push(draft.name1);
    }
    if (draft.name2 && !exerciseId2) {
      missing.push(draft.name2);
    }

    return {
      exerciseId1: exerciseId1 ?? 0,
      exerciseId2: exerciseId2 ?? null,
    };
  });

  return { resolved, missing: Array.from(new Set(missing)) };
}
