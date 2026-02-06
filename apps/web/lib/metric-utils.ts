import { EXERCISE_PRIMARY_METRICS } from '@/lib/constants';
import type { ExercisePrimaryMetric } from '@/lib/constants';
import {
  convertHeightFromStorage,
  convertHeightToStorage,
  convertWeightFromStorage,
  convertWeightToStorage,
  formatDisplayNumber,
  formatWeightDisplay,
} from '@/lib/units';
import type { HeightUnit, WeightUnit } from '@/lib/units';

type MetricUnit = string | null | undefined;

export function isPrimaryMetric(value: unknown): value is ExercisePrimaryMetric {
  return Object.values(EXERCISE_PRIMARY_METRICS).includes(value as ExercisePrimaryMetric);
}

export function resolvePrimaryMetric(
  primaryMetric: unknown,
  isBodyweight?: boolean
): ExercisePrimaryMetric {
  if (isPrimaryMetric(primaryMetric)) return primaryMetric;
  if (isBodyweight) return EXERCISE_PRIMARY_METRICS.repsOnly;
  return EXERCISE_PRIMARY_METRICS.weight;
}

export function resolveMetricUnit(
  primaryMetric: ExercisePrimaryMetric,
  metricUnit: MetricUnit,
  weightUnit: WeightUnit,
  heightUnit: HeightUnit
): string | null {
  switch (primaryMetric) {
    case EXERCISE_PRIMARY_METRICS.weight:
      return weightUnit;
    case EXERCISE_PRIMARY_METRICS.height:
      return heightUnit;
    case EXERCISE_PRIMARY_METRICS.time:
      return metricUnit || 'sec';
    case EXERCISE_PRIMARY_METRICS.distance:
      return metricUnit || 'm';
    default:
      return null;
  }
}

export function getDefaultMetricUnit(primaryMetric: ExercisePrimaryMetric): string | null {
  switch (primaryMetric) {
    case EXERCISE_PRIMARY_METRICS.weight:
      return 'lbs';
    case EXERCISE_PRIMARY_METRICS.height:
      return 'in';
    case EXERCISE_PRIMARY_METRICS.time:
      return 'sec';
    case EXERCISE_PRIMARY_METRICS.distance:
      return 'm';
    default:
      return null;
  }
}

export function assertPrimaryMetric(value: unknown): asserts value is ExercisePrimaryMetric {
  if (!isPrimaryMetric(value)) {
    throw new Error('primaryMetric is required');
  }
}

export function getMetricLabel(
  primaryMetric: ExercisePrimaryMetric,
  metricUnit: MetricUnit,
  weightUnit: WeightUnit,
  heightUnit: HeightUnit,
  isMachine?: boolean
): string {
  const resolvedUnit = resolveMetricUnit(primaryMetric, metricUnit, weightUnit, heightUnit);
  switch (primaryMetric) {
    case EXERCISE_PRIMARY_METRICS.weight:
      return isMachine ? `Added Weight (${resolvedUnit})` : `Weight (${resolvedUnit})`;
    case EXERCISE_PRIMARY_METRICS.height:
      return `Height (${resolvedUnit})`;
    case EXERCISE_PRIMARY_METRICS.time:
      return `Time (${resolvedUnit})`;
    case EXERCISE_PRIMARY_METRICS.distance:
      return `Distance (${resolvedUnit})`;
    case EXERCISE_PRIMARY_METRICS.repsOnly:
      return 'Reps';
    default:
      return 'Value';
  }
}

export function convertMetricFromStorage(
  value: number,
  primaryMetric: ExercisePrimaryMetric,
  weightUnit: WeightUnit,
  heightUnit: HeightUnit
): number {
  if (!Number.isFinite(value)) return 0;
  if (primaryMetric === EXERCISE_PRIMARY_METRICS.weight) {
    return convertWeightFromStorage(value, weightUnit);
  }
  if (primaryMetric === EXERCISE_PRIMARY_METRICS.height) {
    return convertHeightFromStorage(value, heightUnit);
  }
  return value;
}

export function convertMetricToStorage(
  value: number,
  primaryMetric: ExercisePrimaryMetric,
  weightUnit: WeightUnit,
  heightUnit: HeightUnit
): number {
  if (!Number.isFinite(value)) return 0;
  if (primaryMetric === EXERCISE_PRIMARY_METRICS.weight) {
    return convertWeightToStorage(value, weightUnit);
  }
  if (primaryMetric === EXERCISE_PRIMARY_METRICS.height) {
    return convertHeightToStorage(value, heightUnit);
  }
  return value;
}

export function formatMetricDisplay(
  value: number,
  primaryMetric: ExercisePrimaryMetric,
  metricUnit: MetricUnit,
  weightUnit: WeightUnit,
  heightUnit: HeightUnit,
  isMachine?: boolean
): string {
  if (primaryMetric === EXERCISE_PRIMARY_METRICS.weight) {
    return formatWeightDisplay(value, weightUnit, isMachine);
  }
  const resolvedUnit = resolveMetricUnit(primaryMetric, metricUnit, weightUnit, heightUnit);
  const displayValue = convertMetricFromStorage(value, primaryMetric, weightUnit, heightUnit);
  return resolvedUnit ? `${formatDisplayNumber(displayValue)} ${resolvedUnit}` : formatDisplayNumber(displayValue);
}

export function formatMetricInputValue(
  value: number,
  primaryMetric: ExercisePrimaryMetric,
  weightUnit: WeightUnit,
  heightUnit: HeightUnit,
  allowBlank = false
): string {
  if (allowBlank && value === 0) return '';
  const displayValue = convertMetricFromStorage(value, primaryMetric, weightUnit, heightUnit);
  return formatDisplayNumber(displayValue);
}

export function parseMetricInput(
  value: string,
  primaryMetric: ExercisePrimaryMetric,
  weightUnit: WeightUnit,
  heightUnit: HeightUnit
): number | null {
  if (value === '') return 0;
  const num = parseFloat(value);
  if (!Number.isFinite(num)) return null;
  return convertMetricToStorage(num, primaryMetric, weightUnit, heightUnit);
}

export function isRepsOnlyMetric(primaryMetric: ExercisePrimaryMetric): boolean {
  return primaryMetric === EXERCISE_PRIMARY_METRICS.repsOnly;
}

export function isWeightMetric(primaryMetric: ExercisePrimaryMetric): boolean {
  return primaryMetric === EXERCISE_PRIMARY_METRICS.weight;
}
