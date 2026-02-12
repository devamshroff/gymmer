import type { SingleExercise } from '@/lib/types';
import type { LastSetSummary } from '@/lib/workout-bootstrap';
import { resolvePrimaryMetric, isWeightMetric } from '@/lib/metric-utils';

type SetIndex = 1 | 2 | 3 | 4;
type SetField = 'weight' | 'reps';
type SetKey = `set${SetIndex}_${SetField}`;

export function getLogSetValue(log: LastSetSummary, setNum: SetIndex, field: SetField): number | null {
  if (!log) return null;
  const key = `set${setNum}_${field}` as SetKey;
  return log[key] as number | null;
}

function normalizeDateString(value: string): string {
  if (/^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}/.test(value)) {
    return `${value.replace(' ', 'T')}Z`;
  }
  if (/^\\d{4}-\\d{2}-\\d{2}$/.test(value)) {
    return `${value}T00:00:00Z`;
  }
  return value;
}

export function formatLocalDate(value?: string | null): string {
  if (!value) return 'Unknown date';
  const date = new Date(normalizeDateString(value));
  if (Number.isNaN(date.getTime())) return 'Unknown date';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function resolveHasWarmup(exercise: SingleExercise): boolean {
  const primaryMetric = resolvePrimaryMetric(exercise.primaryMetric, exercise.isBodyweight);
  if (!isWeightMetric(primaryMetric)) {
    return false;
  }
  if (typeof exercise.hasWarmup === 'boolean') {
    return exercise.hasWarmup;
  }
  if (exercise.isBodyweight) {
    return false;
  }
  return true;
}
