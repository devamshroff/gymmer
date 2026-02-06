export const MUSCLE_GROUP_TAGS = [
  'lower body compound',
  'upper body compound',
  'full body compound',
  'chest',
  'back',
  'shoulders',
  'biceps',
  'triceps',
  'forearms',
  'core',
  'lower back',
  'glutes',
  'quads',
  'hamstrings',
  'calves',
  'hip flexors',
  'adductors',
  'abductors',
  'unknown',
] as const;

export const STRETCH_MUSCLE_TAGS = [...MUSCLE_GROUP_TAGS] as const;

export const MUSCLE_GROUP_ORDER = [...MUSCLE_GROUP_TAGS];
export const STRETCH_MUSCLE_ORDER = [...STRETCH_MUSCLE_TAGS];

export function normalizeTypeList(
  value: unknown,
  allowed?: readonly string[],
  maxItems = 2
): string[] {
  const entries = Array.isArray(value)
    ? value
    : typeof value === 'string'
      ? [value]
      : [];
  if (entries.length === 0) return [];
  const cleaned = entries
    .map((item) => (typeof item === 'string' ? item.trim().toLowerCase() : ''))
    .filter(Boolean);
  const filtered = allowed ? cleaned.filter((tag) => allowed.includes(tag)) : cleaned;
  const unique: string[] = [];
  for (const tag of filtered) {
    if (!unique.includes(tag)) {
      unique.push(tag);
    }
    if (unique.length >= maxItems) break;
  }
  return unique;
}

export function parseTagJson(
  value: string | null | undefined,
  allowed?: readonly string[],
  maxItems = 2
): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return normalizeTypeList(parsed, allowed, maxItems);
  } catch {
    return [];
  }
}

export function formatTypeLabel(value: string): string {
  return value
    .split(' ')
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : word))
    .join(' ');
}
