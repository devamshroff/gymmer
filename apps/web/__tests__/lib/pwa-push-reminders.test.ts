import { syncExistingCardioReminderSubscription } from '@/lib/pwa/push-reminders';

function buildSubscription(): PushSubscription {
  return {
    endpoint: 'https://push.example/subscription-1',
    toJSON: () => ({
      endpoint: 'https://push.example/subscription-1',
      keys: {
        p256dh: 'p256dh-key',
        auth: 'auth-key',
      },
    }),
  } as PushSubscription;
}

describe('push reminder helpers', () => {
  const originalServiceWorker = Object.getOwnPropertyDescriptor(window.navigator, 'serviceWorker');

  afterEach(() => {
    vi.unstubAllGlobals();

    if (originalServiceWorker) {
      Object.defineProperty(window.navigator, 'serviceWorker', originalServiceWorker);
    } else {
      delete (window.navigator as Navigator & { serviceWorker?: unknown }).serviceWorker;
    }
  });

  function stubPushSupport(subscription: PushSubscription | null) {
    const getSubscription = vi.fn().mockResolvedValue(subscription);
    vi.stubGlobal('Notification', { requestPermission: vi.fn() });
    vi.stubGlobal('PushManager', class PushManager {});
    Object.defineProperty(window.navigator, 'serviceWorker', {
      configurable: true,
      value: {
        getRegistration: vi.fn().mockResolvedValue({
          pushManager: { getSubscription },
        }),
      },
    });
    return { getSubscription };
  }

  it('re-saves an existing browser subscription to the server', async () => {
    const subscription = buildSubscription();
    stubPushSupport(subscription);
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);

    const result = await syncExistingCardioReminderSubscription();

    expect(result).toEqual({ ok: true, synced: true });
    expect(fetchMock).toHaveBeenCalledWith('/api/push/subscription', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }));
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body).toMatchObject({
      subscription: {
        endpoint: 'https://push.example/subscription-1',
        keys: {
          p256dh: 'p256dh-key',
          auth: 'auth-key',
        },
      },
    });
    expect(typeof body.timezone).toBe('string');
    expect(body.timezone.length).toBeGreaterThan(0);
  });

  it('does not call the server when the browser has no subscription', async () => {
    stubPushSupport(null);
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const result = await syncExistingCardioReminderSubscription();

    expect(result).toEqual({ ok: true, synced: false });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
