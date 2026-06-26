import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';
import {
  disablePushSubscriptionByEndpoint,
  listEnabledPushSubscriptions,
  markCardioReminderSent,
} from '@/lib/database';
import { getWebPushConfig } from '@/lib/pwa/push-env';
import type { PushSubscriptionRecord } from '@/lib/types';

type LocalReminderTime = {
  date: string;
  hour: number;
};

function getCronSecret(): string {
  return process.env.CRON_SECRET || '';
}

function isAuthorized(request: NextRequest): boolean {
  const secret = getCronSecret();
  if (!secret) return process.env.NODE_ENV !== 'production';

  const authorization = request.headers.get('authorization');
  const cronHeader = request.headers.get('x-cron-secret');
  return authorization === `Bearer ${secret}` || cronHeader === secret;
}

function getLocalReminderTime(date: Date, timezone: string): LocalReminderTime | null {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hourCycle: 'h23',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
    }).formatToParts(date);
    const values = new Map(parts.map((part) => [part.type, part.value]));
    const year = values.get('year');
    const month = values.get('month');
    const day = values.get('day');
    const hour = Number(values.get('hour'));
    if (!year || !month || !day || !Number.isFinite(hour)) return null;
    return {
      date: `${year}-${month}-${day}`,
      hour,
    };
  } catch {
    return null;
  }
}

function isDueForCardioReminder(
  subscription: PushSubscriptionRecord,
  now: Date
): { due: boolean; localDate: string | null } {
  const local = getLocalReminderTime(now, subscription.timezone);
  if (!local) return { due: false, localDate: null };
  if (local.hour !== 22) return { due: false, localDate: local.date };
  if (subscription.last_cardio_reminder_date === local.date) {
    return { due: false, localDate: local.date };
  }
  return { due: true, localDate: local.date };
}

function configureWebPush(): boolean {
  const config = getWebPushConfig();
  if (!config.configured) return false;

  webpush.setVapidDetails(
    config.subject,
    config.publicKey,
    config.privateKey
  );
  return true;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!configureWebPush()) {
    return NextResponse.json(
      { error: 'Web Push is not configured' },
      { status: 500 }
    );
  }

  const now = new Date();
  const subscriptions = await listEnabledPushSubscriptions();
  let attempted = 0;
  let sent = 0;
  let disabled = 0;
  let skipped = 0;

  for (const subscription of subscriptions) {
    const due = isDueForCardioReminder(subscription, now);
    if (!due.due || !due.localDate) {
      skipped += 1;
      continue;
    }

    attempted += 1;
    try {
      const payload = JSON.stringify({
        title: 'Did you do any cardio today?',
        body: 'Log yoga, biking, running, soccer, or any other activity.',
        url: `/activities?date=${encodeURIComponent(due.localDate)}`,
        tag: 'cardio-activity-reminder',
      });

      await webpush.sendNotification({
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.p256dh,
          auth: subscription.auth,
        },
      }, payload);
      await markCardioReminderSent(subscription.id, due.localDate);
      sent += 1;
    } catch (error) {
      const statusCode = typeof (error as { statusCode?: unknown }).statusCode === 'number'
        ? (error as { statusCode: number }).statusCode
        : null;
      if (statusCode === 404 || statusCode === 410) {
        await disablePushSubscriptionByEndpoint(subscription.endpoint);
        disabled += 1;
        continue;
      }
      console.error('Failed to send cardio reminder push:', error);
    }
  }

  return NextResponse.json({
    success: true,
    attempted,
    sent,
    disabled,
    skipped,
  });
}

export const POST = GET;
