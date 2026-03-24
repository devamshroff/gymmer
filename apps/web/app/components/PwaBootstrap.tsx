'use client';

import { useEffect } from 'react';
import {
  announceServiceWorkerActivated,
  announceServiceWorkerUpdate,
  registerServiceWorker,
} from '@/lib/pwa/register-service-worker';

export default function PwaBootstrap() {
  useEffect(() => {
    let hasReloadedForUpdate = false;

    function watchInstallingWorker(
      worker: ServiceWorker,
      registration: ServiceWorkerRegistration
    ): void {
      worker.addEventListener('statechange', () => {
        if (worker.state === 'installed' && navigator.serviceWorker.controller) {
          announceServiceWorkerUpdate(registration);
        }
      });
    }

    const handleControllerChange = () => {
      if (hasReloadedForUpdate) return;
      hasReloadedForUpdate = true;
      announceServiceWorkerActivated();
      window.location.reload();
    };

    navigator.serviceWorker?.addEventListener('controllerchange', handleControllerChange);

    void registerServiceWorker()
      .then((registration) => {
        if (!registration) return;

        if (registration.waiting) {
          announceServiceWorkerUpdate(registration);
        }

        if (registration.installing) {
          watchInstallingWorker(registration.installing, registration);
        }

        registration.addEventListener('updatefound', () => {
          if (!registration.installing) return;
          watchInstallingWorker(registration.installing, registration);
        });
      })
      .catch((error) => {
        console.error('Failed to register service worker:', error);
      });

    return () => {
      navigator.serviceWorker?.removeEventListener('controllerchange', handleControllerChange);
    };
  }, []);

  return null;
}
