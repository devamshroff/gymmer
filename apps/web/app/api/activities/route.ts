import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { createActivityLog, deleteActivityLog, listActivityLogs } from '@/lib/database';

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
    const durationMinutes = Number(body?.durationMinutes);
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

    if (
      !Number.isFinite(durationMinutes) ||
      durationMinutes < 1 ||
      durationMinutes > MAX_DURATION_MINUTES
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
      durationMinutes: Math.round(durationMinutes),
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
