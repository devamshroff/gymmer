import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { disablePushSubscription, upsertPushSubscription } from '@/lib/database';

type PushSubscriptionPayload = {
  endpoint?: unknown;
  keys?: {
    p256dh?: unknown;
    auth?: unknown;
  };
};

function normalizeTimezone(value: unknown): string {
  if (typeof value !== 'string' || value.trim().length === 0) return 'UTC';
  const timezone = value.trim();
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: timezone }).format(new Date());
    return timezone;
  } catch {
    return 'UTC';
  }
}

export async function POST(request: NextRequest) {
  const authResult = await requireAuth(request);
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const body = await request.json();
    const subscription = body?.subscription as PushSubscriptionPayload | undefined;
    const endpoint = typeof subscription?.endpoint === 'string' ? subscription.endpoint : '';
    const p256dh = typeof subscription?.keys?.p256dh === 'string' ? subscription.keys.p256dh : '';
    const auth = typeof subscription?.keys?.auth === 'string' ? subscription.keys.auth : '';

    if (!endpoint || !p256dh || !auth) {
      return NextResponse.json(
        { error: 'Invalid push subscription' },
        { status: 400 }
      );
    }

    await upsertPushSubscription({
      userId: user.id,
      endpoint,
      p256dh,
      auth,
      timezone: normalizeTimezone(body?.timezone),
      userAgent: request.headers.get('user-agent'),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving push subscription:', error);
    return NextResponse.json(
      { error: 'Failed to save push subscription' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const authResult = await requireAuth(request);
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const body = await request.json().catch(() => ({}));
    const endpoint = typeof body?.endpoint === 'string' ? body.endpoint : '';
    if (!endpoint) {
      return NextResponse.json(
        { error: 'Endpoint is required' },
        { status: 400 }
      );
    }

    await disablePushSubscription(user.id, endpoint);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error disabling push subscription:', error);
    return NextResponse.json(
      { error: 'Failed to disable push subscription' },
      { status: 500 }
    );
  }
}
