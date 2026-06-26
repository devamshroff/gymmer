import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockSendNotification = vi.fn();
const mockSetVapidDetails = vi.fn();
const mockListEnabledPushSubscriptions = vi.fn();
const mockMarkCardioReminderSent = vi.fn();
const mockDisablePushSubscriptionByEndpoint = vi.fn();

vi.mock('web-push', () => ({
  default: {
    sendNotification: mockSendNotification,
    setVapidDetails: mockSetVapidDetails,
  },
}));

vi.mock('@/lib/database', () => ({
  listEnabledPushSubscriptions: mockListEnabledPushSubscriptions,
  markCardioReminderSent: mockMarkCardioReminderSent,
  disablePushSubscriptionByEndpoint: mockDisablePushSubscriptionByEndpoint,
}));

function buildRequest(secret = 'secret') {
  return new NextRequest('https://gymmer.test/api/notifications/cardio-reminder/send', {
    headers: {
      'x-cron-secret': secret,
    },
  });
}

function subscription(overrides: Record<string, unknown> = {}) {
  return {
    id: 1,
    user_id: 'user-1',
    endpoint: 'https://push.example/sub-1',
    p256dh: 'p256dh-key',
    auth: 'auth-key',
    timezone: 'UTC',
    enabled: 1,
    last_cardio_reminder_date: null,
    user_agent: null,
    created_at: '2026-05-26 00:00:00',
    updated_at: '2026-05-26 00:00:00',
    ...overrides,
  };
}

describe('cardio reminder send route', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-26T22:00:00.000Z'));
    process.env.CRON_SECRET = 'secret';
    process.env.WEB_PUSH_PUBLIC_KEY = 'public-key';
    process.env.WEB_PUSH_PRIVATE_KEY = 'private-key';
    process.env.WEB_PUSH_SUBJECT = 'mailto:test@gymmer.test';
    delete process.env.VAPID_PUBLIC_KEY;
    delete process.env.VAPID_PRIVATE_KEY;
    delete process.env.VAPID_SUBJECT;
    mockSendNotification.mockReset().mockResolvedValue(undefined);
    mockSetVapidDetails.mockReset();
    mockListEnabledPushSubscriptions.mockReset().mockResolvedValue([]);
    mockMarkCardioReminderSent.mockReset().mockResolvedValue(undefined);
    mockDisablePushSubscriptionByEndpoint.mockReset().mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.useRealTimers();
    delete process.env.CRON_SECRET;
    delete process.env.WEB_PUSH_PUBLIC_KEY;
    delete process.env.WEB_PUSH_PRIVATE_KEY;
    delete process.env.WEB_PUSH_SUBJECT;
    delete process.env.VAPID_PUBLIC_KEY;
    delete process.env.VAPID_PRIVATE_KEY;
    delete process.env.VAPID_SUBJECT;
  });

  it('rejects unauthorized requests', async () => {
    const { GET } = await import('@/app/api/notifications/cardio-reminder/send/route');

    const response = await GET(buildRequest('wrong-secret'));

    expect(response.status).toBe(401);
    expect(mockListEnabledPushSubscriptions).not.toHaveBeenCalled();
  });

  it('sends due reminders with a local-date activity link', async () => {
    mockListEnabledPushSubscriptions.mockResolvedValueOnce([
      subscription(),
    ]);
    const { GET } = await import('@/app/api/notifications/cardio-reminder/send/route');

    const response = await GET(buildRequest());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({ attempted: 1, sent: 1, skipped: 0 });
    expect(mockSendNotification).toHaveBeenCalledTimes(1);
    const payload = JSON.parse(mockSendNotification.mock.calls[0][1]);
    expect(payload.url).toBe('/activities?date=2026-05-26');
    expect(mockMarkCardioReminderSent).toHaveBeenCalledWith(1, '2026-05-26');
  });

  it('accepts Tether-style VAPID env names', async () => {
    delete process.env.WEB_PUSH_PUBLIC_KEY;
    delete process.env.WEB_PUSH_PRIVATE_KEY;
    delete process.env.WEB_PUSH_SUBJECT;
    process.env.VAPID_PUBLIC_KEY = 'tether-public-key';
    process.env.VAPID_PRIVATE_KEY = 'tether-private-key';
    process.env.VAPID_SUBJECT = 'mailto:tether@example.com';
    mockListEnabledPushSubscriptions.mockResolvedValueOnce([
      subscription(),
    ]);
    const { GET } = await import('@/app/api/notifications/cardio-reminder/send/route');

    const response = await GET(buildRequest());

    expect(response.status).toBe(200);
    expect(mockSetVapidDetails).toHaveBeenCalledWith(
      'mailto:tether@example.com',
      'tether-public-key',
      'tether-private-key'
    );
    expect(mockSendNotification).toHaveBeenCalledTimes(1);
  });

  it('skips subscriptions outside local 10 PM', async () => {
    vi.setSystemTime(new Date('2026-05-26T21:00:00.000Z'));
    mockListEnabledPushSubscriptions.mockResolvedValueOnce([
      subscription(),
    ]);
    const { GET } = await import('@/app/api/notifications/cardio-reminder/send/route');

    const response = await GET(buildRequest());
    const body = await response.json();

    expect(body).toMatchObject({ attempted: 0, sent: 0, skipped: 1 });
    expect(mockSendNotification).not.toHaveBeenCalled();
  });

  it('does not send twice for the same local reminder date', async () => {
    mockListEnabledPushSubscriptions.mockResolvedValueOnce([
      subscription({ last_cardio_reminder_date: '2026-05-26' }),
    ]);
    const { GET } = await import('@/app/api/notifications/cardio-reminder/send/route');

    const response = await GET(buildRequest());
    const body = await response.json();

    expect(body).toMatchObject({ attempted: 0, sent: 0, skipped: 1 });
    expect(mockSendNotification).not.toHaveBeenCalled();
  });

  it('disables expired push subscriptions', async () => {
    mockListEnabledPushSubscriptions.mockResolvedValueOnce([
      subscription({ endpoint: 'https://push.example/expired' }),
    ]);
    mockSendNotification.mockRejectedValueOnce({ statusCode: 410 });
    const { GET } = await import('@/app/api/notifications/cardio-reminder/send/route');

    const response = await GET(buildRequest());
    const body = await response.json();

    expect(body).toMatchObject({ attempted: 1, sent: 0, disabled: 1 });
    expect(mockDisablePushSubscriptionByEndpoint).toHaveBeenCalledWith('https://push.example/expired');
  });
});
