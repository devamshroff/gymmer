import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockSignOut = vi.fn();
const mockUnsubscribe = vi.fn();
const mockIsSupported = vi.fn();

vi.mock('next-auth/react', () => ({
  signOut: (...args: unknown[]) => mockSignOut(...args),
}));

vi.mock('@/lib/pwa/push-reminders', () => ({
  isCardioReminderSupported: () => mockIsSupported(),
  unsubscribeFromCardioReminder: () => mockUnsubscribe(),
}));

import { clearLocalUserState, signOutAndClearDevice } from '@/lib/sign-out';
import { PWA_INSTALL_DISMISS_KEY } from '@/lib/pwa/install';

beforeEach(() => {
  window.localStorage.clear();
  window.sessionStorage.clear();
  mockSignOut.mockReset().mockResolvedValue(undefined);
  mockUnsubscribe.mockReset().mockResolvedValue({ ok: true });
  mockIsSupported.mockReset().mockReturnValue(false);
});

function seedPreviousAccountState() {
  window.localStorage.setItem('current_workout_session', '{"workoutName":"Push Day"}');
  window.localStorage.setItem('active_routines_v1', '[]');
  window.localStorage.setItem('ai_routine_prompt', 'legs');
  window.localStorage.setItem(PWA_INSTALL_DISMISS_KEY, '1');
  window.sessionStorage.setItem('free_workout_setup', '{}');
}

describe('clearLocalUserState', () => {
  it('removes account-specific state but keeps device preferences', () => {
    seedPreviousAccountState();

    clearLocalUserState();

    expect(window.localStorage.getItem('current_workout_session')).toBeNull();
    expect(window.localStorage.getItem('active_routines_v1')).toBeNull();
    expect(window.localStorage.getItem('ai_routine_prompt')).toBeNull();
    expect(window.localStorage.getItem(PWA_INSTALL_DISMISS_KEY)).toBe('1');
    expect(window.sessionStorage.length).toBe(0);
  });
});

describe('signOutAndClearDevice', () => {
  it('turns off reminders, clears state, then signs out to the login page', async () => {
    seedPreviousAccountState();
    mockIsSupported.mockReturnValue(true);

    await signOutAndClearDevice();

    expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
    expect(window.localStorage.getItem('current_workout_session')).toBeNull();
    expect(mockSignOut).toHaveBeenCalledWith({ callbackUrl: '/login' });
  });

  it('still signs out when turning off reminders fails', async () => {
    mockIsSupported.mockReturnValue(true);
    mockUnsubscribe.mockResolvedValue({ ok: false, reason: 'offline' });
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    await signOutAndClearDevice();

    expect(mockSignOut).toHaveBeenCalledWith({ callbackUrl: '/login' });
    warn.mockRestore();
  });

  it('skips reminders when push is unsupported', async () => {
    await signOutAndClearDevice();

    expect(mockUnsubscribe).not.toHaveBeenCalled();
    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });
});
