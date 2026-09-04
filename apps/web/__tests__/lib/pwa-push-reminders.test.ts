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

    expect(result).toEqual({ ok: true, synced: true, hadServerSubscription: true });
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

  it('does not save anything when the browser has no subscription', async () => {
    stubPushSupport(null);
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ hasSubscription: false, hasEnabledSubscription: false }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await syncExistingCardioReminderSubscription();

    expect(result).toEqual({ ok: true, synced: false, hadServerSubscription: false });
    // It reads subscription state to report expiry, but never writes.
    expect(fetchMock).not.toHaveBeenCalledWith('/api/push/subscription', expect.objectContaining({
      method: 'POST',
    }));
  });

  it('reports an expired subscription when the server still has a record', async () => {
    stubPushSupport(null);
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ hasSubscription: true, hasEnabledSubscription: false }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await syncExistingCardioReminderSubscription();

    // The push service dropped this device's subscription. Surfacing that is
    // what stops nightly reminders from failing silently.
    expect(result).toEqual({ ok: true, synced: false, hadServerSubscription: true });
  });
});
