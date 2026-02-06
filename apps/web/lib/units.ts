export const WEIGHT_UNITS = {
  lbs: 'lbs',
  kg: 'kg',
} as const;

export type WeightUnit = typeof WEIGHT_UNITS[keyof typeof WEIGHT_UNITS];

export const HEIGHT_UNITS = {
  in: 'in',
  cm: 'cm',
} as const;

export type HeightUnit = typeof HEIGHT_UNITS[keyof typeof HEIGHT_UNITS];

export const DEFAULT_WEIGHT_UNIT: WeightUnit = WEIGHT_UNITS.lbs;
export const DEFAULT_HEIGHT_UNIT: HeightUnit = HEIGHT_UNITS.in;

const KG_PER_LB = 0.45359237;
const CM_PER_IN = 2.54;

export function isWeightUnit(value: unknown): value is WeightUnit {
  return value === WEIGHT_UNITS.lbs || value === WEIGHT_UNITS.kg;
}

export function isHeightUnit(value: unknown): value is HeightUnit {
  return value === HEIGHT_UNITS.in || value === HEIGHT_UNITS.cm;
}

export function normalizeWeightUnit(value: unknown): WeightUnit {
  return isWeightUnit(value) ? value : DEFAULT_WEIGHT_UNIT;
}

export function normalizeHeightUnit(value: unknown): HeightUnit {
  return isHeightUnit(value) ? value : DEFAULT_HEIGHT_UNIT;
}

export function convertWeightFromStorage(weight: number, unit: WeightUnit): number {
  if (!Number.isFinite(weight)) return 0;
  return unit === WEIGHT_UNITS.kg ? weight * KG_PER_LB : weight;
}

export function convertWeightToStorage(weight: number, unit: WeightUnit): number {
  if (!Number.isFinite(weight)) return 0;
  return unit === WEIGHT_UNITS.kg ? weight / KG_PER_LB : weight;
}

export function convertHeightFromStorage(height: number, unit: HeightUnit): number {
  if (!Number.isFinite(height)) return 0;
  return unit === HEIGHT_UNITS.cm ? height * CM_PER_IN : height;
}

export function convertHeightToStorage(height: number, unit: HeightUnit): number {
  if (!Number.isFinite(height)) return 0;
  return unit === HEIGHT_UNITS.cm ? height / CM_PER_IN : height;
}

export function formatDisplayNumber(value: number): string {
  if (!Number.isFinite(value)) return '0';
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? rounded.toString() : rounded.toFixed(1);
}

export function formatWeightValue(weight: number, unit: WeightUnit): string {
  return formatDisplayNumber(convertWeightFromStorage(weight, unit));
}

export function formatWeightDisplay(weight: number, unit: WeightUnit, isMachine?: boolean): string {
  if (isMachine) {
    if (weight <= 0) return 'Machine';
    return `+${formatWeightValue(weight, unit)} ${unit}`;
  }
  return `${formatWeightValue(weight, unit)} ${unit}`;
}
