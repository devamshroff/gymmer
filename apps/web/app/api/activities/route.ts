import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import {
  createActivityLog,
  deleteActivityLog,
  hasWorkoutSessionOnDay,
  listActivityLogs,
  listActivityLogsForDay,
  replaceTileActivityLogsForDay,
} from '@/lib/database';
import {
  activityLabelForSlug,
  isActivityPresetSlug,
  presetForActivityLabel,
} from '@/lib/activity-types';

const MAX_ACTIVITY_TYPE_LENGTH = 80;
const MAX_NOTES_LENGTH = 500;
const MAX_DURATION_MINUTES = 1440;

function normalizeActivityDate(value: unknown): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return new Date().toISOString();
  }

  const raw = value.trim();
  const date = /^\d{4}-\d{2}-\d{2}$/.test(raw)
    ? new Date(`${raw}T12:00:00.000Z`)
    : new Date(raw);

  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid activity date');
  }

  return date.toISOString();
}

function parseDayParam(value: string | null): string | null {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T12:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10) === value ? value : null;
}

function selectedSlugsFor(activities: { activity_type: string; source: string }[]): string[] {
  const slugs: string[] = [];
  for (const activity of activities) {
    if (activity.source !== 'tile') continue;
    const preset = presetForActivityLabel(activity.activity_type);
    if (preset && !slugs.includes(preset.slug)) slugs.push(preset.slug);
  }
  return slugs;
}

function parseLimit(value: string | null): number {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 50;
  return Math.max(1, Math.min(100, Math.trunc(numeric)));
}

export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request);
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  try {
    // `?date=` returns a single day plus the tile-picker state for it, which is
    // what the notification deep link needs to seed its selection.
    const day = parseDayParam(request.nextUrl.searchParams.get('date'));
    if (day) {
      const [activities, hasWorkoutSession] = await Promise.all([
        listActivityLogsForDay(user.id, day),
        hasWorkoutSessionOnDay(user.id, day),
      ]);
      return NextResponse.json({
        date: day,
        activities,
        selectedSlugs: selectedSlugsFor(activities),
        hasWorkoutSession,
      });
    }

    const limit = parseLimit(request.nextUrl.searchParams.get('limit'));
    const activities = await listActivityLogs(user.id, limit);
    return NextResponse.json({ activities });
  } catch (error) {
    console.error('Error loading activity logs:', error);
    return NextResponse.json(
      { error: 'Failed to load activity logs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authResult = await requireAuth(request);
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const body = await request.json();
    const activityType = typeof body?.activityType === 'string'
      ? body.activityType.trim()
      : '';
    const hasDuration = body?.durationMinutes !== undefined
      && body?.durationMinutes !== null
      && body?.durationMinutes !== '';
    const durationMinutes = hasDuration ? Number(body.durationMinutes) : null;
    const notes = typeof body?.notes === 'string' ? body.notes.trim() : '';

    if (!activityType) {
      return NextResponse.json(
        { error: 'Activity type is required' },
        { status: 400 }
      );
    }

    if (activityType.length > MAX_ACTIVITY_TYPE_LENGTH) {
      return NextResponse.json(
        { error: `Activity type must be ${MAX_ACTIVITY_TYPE_LENGTH} characters or less` },
        { status: 400 }
      );
    }

    // Duration is optional: tile-logged activities record what happened, not how
    // long. When supplied it still has to be a sane number of minutes.
    if (
      durationMinutes !== null &&
      (!Number.isFinite(durationMinutes) ||
        durationMinutes < 1 ||
        durationMinutes > MAX_DURATION_MINUTES)
    ) {
      return NextResponse.json(
        { error: `Duration must be between 1 and ${MAX_DURATION_MINUTES} minutes` },
        { status: 400 }
      );
    }

    if (notes.length > MAX_NOTES_LENGTH) {
      return NextResponse.json(
        { error: `Notes must be ${MAX_NOTES_LENGTH} characters or less` },
        { status: 400 }
      );
    }

    const activityDate = normalizeActivityDate(body?.activityDate);
    const activity = await createActivityLog({
      userId: user.id,
      activityType,
      durationMinutes: durationMinutes === null ? null : Math.round(durationMinutes),
      activityDate,
      notes: notes.length > 0 ? notes : null,
    });

    return NextResponse.json({ activity }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save activity';
    const status = message === 'Invalid activity date' ? 400 : 500;
    if (status === 500) {
      console.error('Error saving activity log:', error);
    }
    return NextResponse.json({ error: message }, { status });
  }
}

/**
 * Reconciles the daily tile picker's selection for one day.
 *
 * This is idempotent by design: tapping the nightly notification twice and
 * saving the same tiles produces the same rows rather than duplicates. Only
 * `source = 'tile'` rows are touched, so timed entries from the detailed form
 * survive untouched.
 */
export async function PUT(request: NextRequest) {
  const authResult = await requireAuth(request);
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const day = parseDayParam(request.nextUrl.searchParams.get('date'));
    if (!day) {
      return NextResponse.json(
        { error: 'A date in YYYY-MM-DD format is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const rawSlugs = Array.isArray(body?.slugs) ? body.slugs : null;
    if (!rawSlugs) {
      return NextResponse.json(
        { error: 'slugs must be an array' },
        { status: 400 }
      );
    }

    const details: Record<string, unknown> = typeof body?.details === 'object' && body.details !== null
      ? body.details
      : {};

    const seen = new Set<string>();
    const entries: Array<{ activityType: string; notes: string | null }> = [];

    for (const slug of rawSlugs) {
      if (!isActivityPresetSlug(slug)) {
        return NextResponse.json(
          { error: `Unknown activity: ${String(slug)}` },
          { status: 400 }
        );
      }
      if (seen.has(slug)) continue;
      seen.add(slug);

      const detail = details[slug];
      const notes = typeof detail === 'string' ? detail.trim() : '';
      if (notes.length > MAX_NOTES_LENGTH) {
        return NextResponse.json(
          { error: `Notes must be ${MAX_NOTES_LENGTH} characters or less` },
          { status: 400 }
        );
      }

      entries.push({
        activityType: activityLabelForSlug(slug) as string,
        notes: notes.length > 0 ? notes : null,
      });
    }

    const activities = await replaceTileActivityLogsForDay({
      userId: user.id,
      day,
      activityDate: normalizeActivityDate(day),
      entries,
    });

    return NextResponse.json({
      date: day,
      activities,
      selectedSlugs: selectedSlugsFor(activities),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save activities';
    const status = message === 'Invalid activity date' ? 400 : 500;
    if (status === 500) {
      console.error('Error reconciling tile activity logs:', error);
    }
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(request: NextRequest) {
  const authResult = await requireAuth(request);
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const activityId = Number(request.nextUrl.searchParams.get('id'));
    if (!Number.isInteger(activityId) || activityId < 1) {
      return NextResponse.json(
        { error: 'Activity id is required' },
        { status: 400 }
      );
    }

    const deleted = await deleteActivityLog(user.id, activityId);
    if (!deleted) {
      return NextResponse.json(
        { error: 'Activity not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting activity log:', error);
    return NextResponse.json(
      { error: 'Failed to delete activity log' },
      { status: 500 }
    );
  }
}
