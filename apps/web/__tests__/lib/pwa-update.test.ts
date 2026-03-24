import {
  activateWaitingServiceWorker,
  announceServiceWorkerActivated,
  announceServiceWorkerUpdate,
  PWA_UPDATE_ACTIVATED_EVENT,
  PWA_UPDATE_AVAILABLE_EVENT,
} from '@/lib/pwa/register-service-worker';

describe('PWA update helpers', () => {
  it('posts skip waiting to the waiting service worker', () => {
    const postMessage = vi.fn();
    const registration = {
      waiting: { postMessage },
    } as unknown as ServiceWorkerRegistration;

    expect(activateWaitingServiceWorker(registration)).toBe(true);
    expect(postMessage).toHaveBeenCalledWith({ type: 'SKIP_WAITING' });
  });

  it('returns false when there is no waiting service worker', () => {
    const registration = {
      waiting: null,
    } as unknown as ServiceWorkerRegistration;

    expect(activateWaitingServiceWorker(registration)).toBe(false);
  });

  it('dispatches update lifecycle events on window', () => {
    const updateListener = vi.fn();
    const activatedListener = vi.fn();
    const registration = {} as ServiceWorkerRegistration;

    window.addEventListener(PWA_UPDATE_AVAILABLE_EVENT, updateListener);
    window.addEventListener(PWA_UPDATE_ACTIVATED_EVENT, activatedListener);

    announceServiceWorkerUpdate(registration);
    announceServiceWorkerActivated();

    expect(updateListener).toHaveBeenCalledTimes(1);
    expect(activatedListener).toHaveBeenCalledTimes(1);

    window.removeEventListener(PWA_UPDATE_AVAILABLE_EVENT, updateListener);
    window.removeEventListener(PWA_UPDATE_ACTIVATED_EVENT, activatedListener);
  });
});
