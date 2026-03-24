import {
  getInstallCapability,
  isIosUserAgent,
  isSafariUserAgent,
  shouldShowIosInstallHint,
} from '@/lib/pwa/install';

describe('PWA install helpers', () => {
  const originalMatchMedia = window.matchMedia;
  const originalStandalone = Object.getOwnPropertyDescriptor(window.navigator, 'standalone');

  afterEach(() => {
    window.matchMedia = originalMatchMedia;

    if (originalStandalone) {
      Object.defineProperty(window.navigator, 'standalone', originalStandalone);
    } else {
      delete (window.navigator as Navigator & { standalone?: boolean }).standalone;
    }
  });

  it('detects iPhone Safari correctly', () => {
    const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';

    expect(isIosUserAgent(userAgent)).toBe(true);
    expect(isSafariUserAgent(userAgent)).toBe(true);
  });

  it('does not treat Chrome on iOS as Safari', () => {
    const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/131.0.0.0 Mobile/15E148 Safari/604.1';

    expect(isIosUserAgent(userAgent)).toBe(true);
    expect(isSafariUserAgent(userAgent)).toBe(false);
  });

  it('shows the iOS install hint only when not already standalone', () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: false }) as typeof window.matchMedia;
    Object.defineProperty(window.navigator, 'standalone', {
      configurable: true,
      value: false,
    });

    const capability = getInstallCapability(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'
    );

    expect(shouldShowIosInstallHint(capability)).toBe(true);

    window.matchMedia = vi.fn().mockReturnValue({ matches: true }) as typeof window.matchMedia;
    const standaloneCapability = getInstallCapability(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'
    );

    expect(shouldShowIosInstallHint(standaloneCapability)).toBe(false);
  });
});
