import { buildPwaManifest, PWA_ICON_SOURCES } from '@/lib/pwa/config';
import { registerServiceWorker, shouldRegisterServiceWorker } from '@/lib/pwa/register-service-worker';

describe('PWA config', () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalServiceWorker = Object.getOwnPropertyDescriptor(window.navigator, 'serviceWorker');

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;

    if (originalServiceWorker) {
      Object.defineProperty(window.navigator, 'serviceWorker', originalServiceWorker);
    } else {
      delete (window.navigator as Navigator & { serviceWorker?: unknown }).serviceWorker;
    }
  });

  it('builds the expected manifest payload', () => {
    const manifest = buildPwaManifest();

    expect(manifest.name).toBe('Temple');
    expect(manifest.display).toBe('standalone');
    expect(manifest.start_url).toBe('/');
    expect(manifest.icons).toEqual(PWA_ICON_SOURCES);
    expect(manifest.shortcuts).toEqual(expect.arrayContaining([
      expect.objectContaining({ name: 'Gymmer', url: '/workout' }),
      expect.objectContaining({ name: 'Nommer', url: '/nutrition' }),
      expect.objectContaining({ name: 'Log Activity', url: '/activities' }),
    ]));
  });

  it('does not register a service worker outside production', async () => {
    process.env.NODE_ENV = 'test';

    expect(shouldRegisterServiceWorker()).toBe(false);
    await expect(registerServiceWorker()).resolves.toBeNull();
  });

  it('registers a service worker in production when supported', async () => {
    const register = vi.fn().mockResolvedValue({ scope: '/' });
    process.env.NODE_ENV = 'production';

    Object.defineProperty(window.navigator, 'serviceWorker', {
      configurable: true,
      value: { register },
    });

    expect(shouldRegisterServiceWorker()).toBe(true);
    await expect(registerServiceWorker()).resolves.toEqual({ scope: '/' });
    expect(register).toHaveBeenCalledWith('/sw.js', { scope: '/' });
  });
});
