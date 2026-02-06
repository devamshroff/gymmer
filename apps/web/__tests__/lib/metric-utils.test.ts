import { describe, expect, it } from 'vitest';
import { EXERCISE_PRIMARY_METRICS } from '@/lib/constants';
import {
  formatMetricDisplay,
  parseMetricInput,
  resolveMetricUnit,
  resolvePrimaryMetric,
} from '@/lib/metric-utils';
import { HEIGHT_UNITS, WEIGHT_UNITS } from '@/lib/units';

describe('metric-utils', () => {
  it('resolves primary metrics with fallbacks', () => {
    expect(resolvePrimaryMetric('time')).toBe(EXERCISE_PRIMARY_METRICS.time);
    expect(resolvePrimaryMetric('unknown', true)).toBe(EXERCISE_PRIMARY_METRICS.repsOnly);
    expect(resolvePrimaryMetric('unknown', false)).toBe(EXERCISE_PRIMARY_METRICS.weight);
  });

  it('resolves metric units by primary metric', () => {
    expect(resolveMetricUnit(EXERCISE_PRIMARY_METRICS.weight, null, WEIGHT_UNITS.kg, HEIGHT_UNITS.cm))
      .toBe('kg');
    expect(resolveMetricUnit(EXERCISE_PRIMARY_METRICS.height, null, WEIGHT_UNITS.kg, HEIGHT_UNITS.cm))
      .toBe('cm');
    expect(resolveMetricUnit(EXERCISE_PRIMARY_METRICS.time, null, WEIGHT_UNITS.lbs, HEIGHT_UNITS.in))
      .toBe('sec');
    expect(resolveMetricUnit(EXERCISE_PRIMARY_METRICS.distance, 'km', WEIGHT_UNITS.lbs, HEIGHT_UNITS.in))
      .toBe('km');
  });

  it('formats metric displays with conversions', () => {
    expect(
      formatMetricDisplay(100, EXERCISE_PRIMARY_METRICS.weight, null, WEIGHT_UNITS.kg, HEIGHT_UNITS.in)
    ).toBe('45.4 kg');
    expect(
      formatMetricDisplay(10, EXERCISE_PRIMARY_METRICS.height, null, WEIGHT_UNITS.lbs, HEIGHT_UNITS.cm)
    ).toBe('25.4 cm');
    expect(
      formatMetricDisplay(90, EXERCISE_PRIMARY_METRICS.time, 'sec', WEIGHT_UNITS.lbs, HEIGHT_UNITS.in)
    ).toBe('90 sec');
  });

  it('parses metric input into storage units', () => {
    const stored = parseMetricInput('100', EXERCISE_PRIMARY_METRICS.weight, WEIGHT_UNITS.kg, HEIGHT_UNITS.cm);
    expect(stored).not.toBeNull();
    expect(stored as number).toBeCloseTo(220.462, 3);
  });

});
