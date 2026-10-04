import {
  getInstallCapability,
  getIosInstallHint,
  isInstallBannerSnoozed,
  isIosUserAgent,
  isSafariUserAgent,
  PWA_INSTALL_SNOOZE_MS,
} from '@/lib/pwa/install';

const IPHONE_SAFARI = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
const IPHONE_CHROME = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/131.0.0.0 Mobile/15E148 Safari/604.1';
const IPHONE_INSTAGRAM = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 350.0.0.0 (iPhone15,2; iOS 18_0; en_US)';
const IPHONE_WEBVIEW = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148';
const IPADOS_SAFARI = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15';

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

    expect(getIosInstallHint(capability)).toBe('safari');

    window.matchMedia = vi.fn().mockReturnValue({ matches: true }) as typeof window.matchMedia;
    const standaloneCapability = getInstallCapability(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'
    );

    expect(getIosInstallHint(standaloneCapability)).toBeNull();
  });

  describe('iOS hint per browser', () => {
    beforeEach(() => {
      window.matchMedia = vi.fn().mockReturnValue({ matches: false }) as typeof window.matchMedia;
    });

    it('gives Chrome/Edge/Firefox on iOS share-menu instructions', () => {
      expect(getIosInstallHint(getInstallCapability(IPHONE_CHROME))).toBe('browser');
    });

    it('tells in-app browser visitors to open the page in Safari', () => {
      expect(getIosInstallHint(getInstallCapability(IPHONE_INSTAGRAM))).toBe('in-app');
      expect(getIosInstallHint(getInstallCapability(IPHONE_WEBVIEW))).toBe('in-app');
    });

    it('detects iPadOS, which reports a Mac user agent, by touch support', () => {
      expect(isIosUserAgent(IPADOS_SAFARI, 0)).toBe(false);
      expect(isIosUserAgent(IPADOS_SAFARI, 5)).toBe(true);
      expect(getIosInstallHint(getInstallCapability(IPADOS_SAFARI, 5))).toBe('safari');
    });

    it('shows no hint on desktop', () => {
      expect(getIosInstallHint(getInstallCapability(IPADOS_SAFARI, 0))).toBeNull();
      expect(getIosInstallHint(getInstallCapability(IPHONE_SAFARI.replace('iPhone; CPU iPhone OS 18_0 like Mac OS X', 'Windows NT 10.0')))).toBeNull();
    });
  });

  describe('isInstallBannerSnoozed', () => {
    const now = 1_800_000_000_000;

    it('is not snoozed when never dismissed', () => {
      expect(isInstallBannerSnoozed(null, now)).toBe(false);
    });

    it('snoozes for the snooze window after dismissal, then shows again', () => {
      expect(isInstallBannerSnoozed(String(now - 1000), now)).toBe(true);
      expect(isInstallBannerSnoozed(String(now - PWA_INSTALL_SNOOZE_MS - 1), now)).toBe(false);
    });

    it('treats the legacy permanent dismissal flag as expired', () => {
      expect(isInstallBannerSnoozed('1', now)).toBe(false);
    });

    it('ignores garbage values', () => {
      expect(isInstallBannerSnoozed('yes', now)).toBe(false);
    });
  });
});
