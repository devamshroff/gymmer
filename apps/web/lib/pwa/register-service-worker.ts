import { PWA_SERVICE_WORKER_PATH } from '@/lib/pwa/config';

export const PWA_UPDATE_AVAILABLE_EVENT = 'pwa-update-available';
export const PWA_UPDATE_ACTIVATED_EVENT = 'pwa-update-activated';

export type PwaUpdateAvailableDetail = {
  registration: ServiceWorkerRegistration;
};

export function shouldRegisterServiceWorker(): boolean {
  return typeof window !== 'undefined'
    && process.env.NODE_ENV === 'production'
    && 'serviceWorker' in navigator;
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!shouldRegisterServiceWorker()) {
    return null;
  }

  return navigator.serviceWorker.register(PWA_SERVICE_WORKER_PATH, { scope: '/' });
}

export function announceServiceWorkerUpdate(registration: ServiceWorkerRegistration): void {
  if (typeof window === 'undefined') return;

  window.dispatchEvent(new CustomEvent<PwaUpdateAvailableDetail>(PWA_UPDATE_AVAILABLE_EVENT, {
    detail: { registration },
  }));
}

export function announceServiceWorkerActivated(): void {
  if (typeof window === 'undefined') return;

  window.dispatchEvent(new CustomEvent(PWA_UPDATE_ACTIVATED_EVENT));
}

export function activateWaitingServiceWorker(registration: ServiceWorkerRegistration): boolean {
  const waitingWorker = registration.waiting;
  if (!waitingWorker) {
    return false;
  }

  waitingWorker.postMessage({ type: 'SKIP_WAITING' });
  return true;
}
