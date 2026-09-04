/**
 * Canonical activity presets for the daily activity tile picker on /activities.
 *
 * Activity logs store a free-text `activity_type`, which fragments aggregation
 * ("Yoga" vs "yoga" vs "Yoga class"). The tile picker always writes the exact
 * `label` below so MCP exports, calendar rendering, and the 30-day summary group
 * cleanly. Free-text entries from the detailed form remain supported.
 */

export type ActivityPresetSlug =
  | 'rest'
  | 'ran'
  | 'ankle-rehab'
  | 'stretches'
  | 'yoga'
  | 'strength-training'
  | 'biking-class'
  | 'other-class';

export type ActivityPreset = {
  slug: ActivityPresetSlug;
  /** Canonical value written to `activity_logs.activity_type`. */
  label: string;
  /** Rendered on the tile. */
  icon: string;
  /**
   * Clearing this tile clears every other tile, and picking any other tile
   * clears this one. "Rest" and "I did something" are contradictory.
   */
  exclusive?: boolean;
  /**
   * The tile collects a short free-text detail (the class name) that is stored
   * in `notes` rather than fragmenting `activity_type`.
   */
  detailPrompt?: string;
  /**
   * Hidden on days that already have a completed Gymmer workout session, where
   * the tile would duplicate what the session already records.
   */
  hiddenWhenWorkoutLogged?: boolean;
};

export const ACTIVITY_PRESETS: readonly ActivityPreset[] = [
  { slug: 'rest', label: 'Rest', icon: '🛌', exclusive: true },
  { slug: 'ran', label: 'Ran', icon: '🏃' },
  { slug: 'ankle-rehab', label: 'Ankle rehab', icon: '🦶' },
  { slug: 'stretches', label: 'Stretches', icon: '🧘' },
  { slug: 'yoga', label: 'Yoga', icon: '🕉️' },
  {
    slug: 'strength-training',
    label: 'Strength training',
    icon: '🏋️',
    hiddenWhenWorkoutLogged: true,
  },
  { slug: 'biking-class', label: 'Biking class', icon: '🚴' },
  {
    slug: 'other-class',
    label: 'Other class',
    icon: '✨',
    detailPrompt: 'Which class?',
  },
] as const;

const PRESETS_BY_SLUG = new Map<string, ActivityPreset>(
  ACTIVITY_PRESETS.map((preset) => [preset.slug, preset])
);

const PRESETS_BY_LABEL = new Map<string, ActivityPreset>(
  ACTIVITY_PRESETS.map((preset) => [preset.label.toLowerCase(), preset])
);

export function getActivityPreset(slug: string): ActivityPreset | null {
  return PRESETS_BY_SLUG.get(slug) || null;
}

export function isActivityPresetSlug(value: unknown): value is ActivityPresetSlug {
  return typeof value === 'string' && PRESETS_BY_SLUG.has(value);
}

/** Canonical `activity_type` for a slug, or null when the slug is unknown. */
export function activityLabelForSlug(slug: string): string | null {
  return PRESETS_BY_SLUG.get(slug)?.label ?? null;
}

/**
 * Maps a stored `activity_type` back to its preset so the tile picker can seed
 * its selection from rows already logged for the day. Case-insensitive because
 * older free-text rows may not match the canonical casing.
 */
export function presetForActivityLabel(label: string): ActivityPreset | null {
  return PRESETS_BY_LABEL.get(label.trim().toLowerCase()) || null;
}

/**
 * Applies the mutual exclusion rule. `next` is the slug the user just tapped;
 * `selected` is the selection before the tap.
 */
export function toggleActivitySelection(
  selected: readonly string[],
  next: string
): ActivityPresetSlug[] {
  if (!isActivityPresetSlug(next)) return selected.filter(isActivityPresetSlug);

  const current = selected.filter(isActivityPresetSlug);
  if (current.includes(next)) {
    return current.filter((slug) => slug !== next);
  }

  const preset = PRESETS_BY_SLUG.get(next);
  if (preset?.exclusive) return [next];

  return [...current.filter((slug) => !PRESETS_BY_SLUG.get(slug)?.exclusive), next];
}

/**
 * Tiles to render for a given day. Presets marked `hiddenWhenWorkoutLogged` drop
 * out once the day already has a completed Gymmer workout session, unless the
 * user has already logged that tile for the day (so an existing selection never
 * silently disappears and becomes un-removable).
 */
export function visibleActivityPresets(options: {
  hasWorkoutSession: boolean;
  selected?: readonly string[];
}): ActivityPreset[] {
  const selected = new Set(options.selected ?? []);
  return ACTIVITY_PRESETS.filter((preset) => {
    if (!preset.hiddenWhenWorkoutLogged) return true;
    if (!options.hasWorkoutSession) return true;
    return selected.has(preset.slug);
  });
}
