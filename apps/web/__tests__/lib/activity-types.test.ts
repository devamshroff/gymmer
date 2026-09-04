import { describe, expect, it } from 'vitest';
import {
  ACTIVITY_PRESETS,
  activityLabelForSlug,
  getActivityPreset,
  isActivityPresetSlug,
  presetForActivityLabel,
  toggleActivitySelection,
  visibleActivityPresets,
} from '@/lib/activity-types';

describe('activity presets', () => {
  it('exposes every tile the daily picker offers', () => {
    expect(ACTIVITY_PRESETS.map((preset) => preset.slug)).toEqual([
      'rest',
      'ran',
      'ankle-rehab',
      'stretches',
      'yoga',
      'strength-training',
      'biking-class',
      'other-class',
    ]);
  });

  it('uses unique slugs and labels', () => {
    const slugs = new Set(ACTIVITY_PRESETS.map((preset) => preset.slug));
    const labels = new Set(ACTIVITY_PRESETS.map((preset) => preset.label.toLowerCase()));
    expect(slugs.size).toBe(ACTIVITY_PRESETS.length);
    expect(labels.size).toBe(ACTIVITY_PRESETS.length);
  });

  it('maps slugs to canonical stored labels', () => {
    expect(activityLabelForSlug('ankle-rehab')).toBe('Ankle rehab');
    expect(activityLabelForSlug('nope')).toBeNull();
  });

  it('maps stored labels back to presets case-insensitively', () => {
    expect(presetForActivityLabel('Yoga')?.slug).toBe('yoga');
    expect(presetForActivityLabel('  yoga ')?.slug).toBe('yoga');
    expect(presetForActivityLabel('Kayaking')).toBeNull();
  });

  it('validates slugs', () => {
    expect(isActivityPresetSlug('rest')).toBe(true);
    expect(isActivityPresetSlug('Rest')).toBe(false);
    expect(isActivityPresetSlug(42)).toBe(false);
  });

  it('marks only "other class" as needing a typed detail', () => {
    const withDetail = ACTIVITY_PRESETS.filter((preset) => preset.detailPrompt);
    expect(withDetail.map((preset) => preset.slug)).toEqual(['other-class']);
  });

  it('exposes rest as the only exclusive tile', () => {
    const exclusive = ACTIVITY_PRESETS.filter((preset) => preset.exclusive);
    expect(exclusive.map((preset) => preset.slug)).toEqual(['rest']);
    expect(getActivityPreset('rest')?.exclusive).toBe(true);
  });
});

describe('toggleActivitySelection', () => {
  it('adds and removes a tile', () => {
    expect(toggleActivitySelection([], 'ran')).toEqual(['ran']);
    expect(toggleActivitySelection(['ran'], 'ran')).toEqual([]);
  });

  it('keeps multiple non-exclusive tiles', () => {
    const selection = toggleActivitySelection(toggleActivitySelection([], 'ran'), 'yoga');
    expect(selection).toEqual(['ran', 'yoga']);
  });

  it('clears everything else when rest is picked', () => {
    expect(toggleActivitySelection(['ran', 'yoga'], 'rest')).toEqual(['rest']);
  });

  it('clears rest when another tile is picked', () => {
    expect(toggleActivitySelection(['rest'], 'ran')).toEqual(['ran']);
  });

  it('ignores unknown slugs', () => {
    expect(toggleActivitySelection(['ran'], 'skydiving')).toEqual(['ran']);
  });
});

describe('visibleActivityPresets', () => {
  it('shows every tile on a day with no workout session', () => {
    const visible = visibleActivityPresets({ hasWorkoutSession: false });
    expect(visible).toHaveLength(ACTIVITY_PRESETS.length);
  });

  it('hides strength training once a workout session exists for the day', () => {
    const visible = visibleActivityPresets({ hasWorkoutSession: true });
    expect(visible.map((preset) => preset.slug)).not.toContain('strength-training');
    // Everything else still shows.
    expect(visible).toHaveLength(ACTIVITY_PRESETS.length - 1);
  });

  it('keeps strength training visible when it is already selected', () => {
    // Otherwise an existing selection would vanish and become un-removable.
    const visible = visibleActivityPresets({
      hasWorkoutSession: true,
      selected: ['strength-training'],
    });
    expect(visible.map((preset) => preset.slug)).toContain('strength-training');
  });
});
