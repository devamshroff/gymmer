'use client';

import { useEffect, useState } from 'react';
import {
  getInstallCapability,
  PWA_INSTALL_DISMISS_KEY,
  shouldShowIosInstallHint,
} from '@/lib/pwa/install';
import {
  activateWaitingServiceWorker,
  PWA_UPDATE_ACTIVATED_EVENT,
  PWA_UPDATE_AVAILABLE_EVENT,
} from '@/lib/pwa/register-service-worker';
import type { PwaUpdateAvailableDetail } from '@/lib/pwa/register-service-worker';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

function readDismissed(): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(PWA_INSTALL_DISMISS_KEY) === '1';
}

export default function PwaStatusBanner() {
  const [isOnline, setIsOnline] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  const [iosInstallHint, setIosInstallHint] = useState(false);
  const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [updateRegistration, setUpdateRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [updateDismissed, setUpdateDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsOnline(window.navigator.onLine);
    setDismissed(readDismissed());
    setIosInstallHint(shouldShowIosInstallHint(getInstallCapability(window.navigator.userAgent)));

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPromptEvent(event as BeforeInstallPromptEvent);
    };
    const handleInstalled = () => {
      setInstallPromptEvent(null);
      setIosInstallHint(false);
    };
    const handleUpdateAvailable = (
      event: Event
    ) => {
      const { detail } = event as CustomEvent<PwaUpdateAvailableDetail>;
      setUpdateRegistration(detail.registration);
      setUpdateDismissed(false);
    };
    const handleUpdateActivated = () => {
      setUpdateRegistration(null);
      setUpdateDismissed(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);
    window.addEventListener(PWA_UPDATE_AVAILABLE_EVENT, handleUpdateAvailable);
    window.addEventListener(PWA_UPDATE_ACTIVATED_EVENT, handleUpdateActivated);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
      window.removeEventListener(PWA_UPDATE_AVAILABLE_EVENT, handleUpdateAvailable);
      window.removeEventListener(PWA_UPDATE_ACTIVATED_EVENT, handleUpdateActivated);
    };
  }, []);

  const shouldShowUpdate = updateRegistration !== null && !updateDismissed;
  const shouldShowInstall = !dismissed && (iosInstallHint || installPromptEvent !== null);

  if (isOnline && !shouldShowInstall && !shouldShowUpdate) {
    return null;
  }

  async function handleInstall() {
    if (!installPromptEvent) return;
    await installPromptEvent.prompt();
    const choice = await installPromptEvent.userChoice;
    if (choice.outcome === 'accepted') {
      setInstallPromptEvent(null);
      setDismissed(true);
      return;
    }
    setInstallPromptEvent(null);
  }

  function handleDismissInstall() {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(PWA_INSTALL_DISMISS_KEY, '1');
    }
    setDismissed(true);
  }

  function handleReloadUpdate() {
    if (!updateRegistration) {
      window.location.reload();
      return;
    }

    const activated = activateWaitingServiceWorker(updateRegistration);
    if (!activated) {
      window.location.reload();
    }
  }

  return (
    <div className="sticky top-0 z-50 border-b border-emerald-500/20 bg-zinc-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3 text-sm text-zinc-100 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          {shouldShowUpdate ? (
            <p className="font-medium text-sky-200">
              A new version of Temple is ready. Reload to update the app shell.
            </p>
          ) : null}
          {!isOnline ? (
            <p className="font-medium text-amber-300">
              You&apos;re offline. Temple&apos;s cached shell is available, but live data and edits still need a connection.
            </p>
          ) : null}
          {shouldShowInstall ? (
            iosInstallHint ? (
              <p className="font-medium text-emerald-200">
                On iPhone Safari, tap Share, then Add to Home Screen to install Temple.
              </p>
            ) : (
              <p className="font-medium text-emerald-200">
                Install Temple for faster launch and a full-screen app experience.
              </p>
            )
          ) : null}
        </div>

        {shouldShowUpdate || shouldShowInstall ? (
          <div className="flex items-center gap-3">
            {shouldShowUpdate ? (
              <>
                <button
                  type="button"
                  onClick={handleReloadUpdate}
                  className="inline-flex items-center justify-center rounded-full bg-sky-400 px-4 py-2 font-semibold text-zinc-950 transition hover:bg-sky-300"
                >
                  Reload
                </button>
                <button
                  type="button"
                  onClick={() => setUpdateDismissed(true)}
                  className="inline-flex items-center justify-center rounded-full border border-zinc-700 px-4 py-2 font-semibold text-zinc-200 transition hover:border-zinc-500 hover:text-white"
                >
                  Later
                </button>
              </>
            ) : null}
            {installPromptEvent ? (
              <button
                type="button"
                onClick={() => void handleInstall()}
                className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-4 py-2 font-semibold text-zinc-950 transition hover:bg-emerald-400"
              >
                Install
              </button>
            ) : null}
            {shouldShowInstall ? (
              <button
                type="button"
                onClick={handleDismissInstall}
                className="inline-flex items-center justify-center rounded-full border border-zinc-700 px-4 py-2 font-semibold text-zinc-200 transition hover:border-zinc-500 hover:text-white"
              >
                Dismiss
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
