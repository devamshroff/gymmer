// lib/sign-out.ts
// Client-side sign-out that leaves nothing of the previous account on the device.

import { signOut } from 'next-auth/react';
import { PWA_INSTALL_DISMISS_KEY } from './pwa/install';
import { isCardioReminderSupported, unsubscribeFromCardioReminder } from './pwa/push-reminders';

// Device preferences that are not tied to whoever is signed in.
const DEVICE_SCOPED_LOCAL_KEYS = new Set([PWA_INSTALL_DISMISS_KEY]);

/**
 * In-progress workouts, resume state, routine caches, and drafts live in
 * browser storage under many dynamic keys and are not partitioned by user.
 * Left behind, the next account on this browser could resume (and autosave
 * into its own history) the previous account's workout, so everything except
 * device-scoped preferences is cleared.
 */
export function clearLocalUserState(): void {
  try {
    const localKeys: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key && !DEVICE_SCOPED_LOCAL_KEYS.has(key)) localKeys.push(key);
    }
    localKeys.forEach((key) => window.localStorage.removeItem(key));
  } catch (error) {
    console.warn('Could not clear localStorage on sign-out:', error);
  }

  try {
    window.sessionStorage.clear();
  } catch (error) {
    console.warn('Could not clear sessionStorage on sign-out:', error);
  }
}

export async function signOutAndClearDevice(): Promise<void> {
  // Push subscriptions are stored against the signed-in user, so a device that
  // stays subscribed would keep sending this account's reminders after
  // someone else signs in. Best-effort: never block sign-out on it.
  if (isCardioReminderSupported()) {
    const result = await unsubscribeFromCardioReminder();
    if (!result.ok) {
      console.warn('Could not turn off reminders on sign-out:', result.reason);
    }
  }

  clearLocalUserState();
  await signOut({ callbackUrl: '/login' });
}
