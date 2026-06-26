import { PWA_SERVICE_WORKER_PATH } from '@/lib/pwa/config';

export type CardioReminderSubscriptionResult =
  | { ok: true }
  | { ok: false; reason: string };

export type ExistingCardioReminderSyncResult =
  | { ok: true; synced: boolean }
  | { ok: false; reason: string };

function urlBase64ToArrayBuffer(value: string): ArrayBuffer {
  const padding = '='.repeat((4 - (value.length % 4)) % 4);
  const base64 = `${value}${padding}`.replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const output = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i += 1) {
    output[i] = rawData.charCodeAt(i);
  }
  return output.buffer.slice(0) as ArrayBuffer;
}

export function isCardioReminderSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'Notification' in window
    && 'serviceWorker' in navigator
    && 'PushManager' in window;
}

async function getReadyServiceWorker(): Promise<ServiceWorkerRegistration> {
  const existing = await navigator.serviceWorker.getRegistration('/');
  if (existing) return existing;

  await navigator.serviceWorker.register(PWA_SERVICE_WORKER_PATH, { scope: '/' });
  return navigator.serviceWorker.ready;
}

async function saveSubscriptionToServer(
  subscription: PushSubscription
): Promise<CardioReminderSubscriptionResult> {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const saveResponse = await fetch('/api/push/subscription', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      subscription: subscription.toJSON(),
      timezone,
    }),
  });

  if (!saveResponse.ok) {
    return { ok: false, reason: 'Could not save notification settings.' };
  }

  return { ok: true };
}

export async function syncExistingCardioReminderSubscription(): Promise<ExistingCardioReminderSyncResult> {
  try {
    if (!isCardioReminderSupported()) {
      return { ok: false, reason: 'This browser does not support push reminders.' };
    }

    const registration = await navigator.serviceWorker.getRegistration('/');
    const subscription = await registration?.pushManager.getSubscription();
    if (!subscription) return { ok: true, synced: false };

    const result = await saveSubscriptionToServer(subscription);
    if (!result.ok) return result;

    return { ok: true, synced: true };
  } catch (error) {
    console.error('Error syncing cardio reminder subscription:', error);
    return { ok: false, reason: 'Could not sync notification settings.' };
  }
}

export async function subscribeToCardioReminder(): Promise<CardioReminderSubscriptionResult> {
  try {
    if (!isCardioReminderSupported()) {
      return { ok: false, reason: 'This browser does not support push reminders.' };
    }

    const keyResponse = await fetch('/api/push/public-key');
    if (!keyResponse.ok) {
      return { ok: false, reason: 'Could not load notification settings.' };
    }

    const keyData = await keyResponse.json() as { configured?: boolean; publicKey?: string };
    if (!keyData.configured || !keyData.publicKey) {
      return { ok: false, reason: 'Notifications are not configured yet.' };
    }

    const permission = await window.Notification.requestPermission();
    if (permission !== 'granted') {
      return { ok: false, reason: 'Notifications are blocked for Temple.' };
    }

    const registration = await getReadyServiceWorker();
    const existingSubscription = await registration.pushManager.getSubscription();
    const subscription = existingSubscription || await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToArrayBuffer(keyData.publicKey),
    });

    return saveSubscriptionToServer(subscription);
  } catch (error) {
    console.error('Error subscribing to cardio reminder:', error);
    return { ok: false, reason: 'Could not enable reminders.' };
  }
}

export async function unsubscribeFromCardioReminder(): Promise<CardioReminderSubscriptionResult> {
  try {
    if (!isCardioReminderSupported()) {
      return { ok: false, reason: 'This browser does not support push reminders.' };
    }

    const registration = await navigator.serviceWorker.getRegistration('/');
    const subscription = await registration?.pushManager.getSubscription();
    if (!subscription) return { ok: true };

    const disableResponse = await fetch('/api/push/subscription', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endpoint: subscription.endpoint }),
    });
    if (!disableResponse.ok) {
      return { ok: false, reason: 'Could not turn off reminders.' };
    }

    const unsubscribed = await subscription.unsubscribe();
    if (!unsubscribed) {
      return { ok: false, reason: 'Could not remove the browser reminder.' };
    }

    return { ok: true };
  } catch (error) {
    console.error('Error unsubscribing from cardio reminder:', error);
    return { ok: false, reason: 'Could not turn off reminders.' };
  }
}
