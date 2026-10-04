export const PWA_INSTALL_DISMISS_KEY = 'gymmer_pwa_install_dismissed';

// Dismissing the install banner snoozes it rather than hiding it forever, so a
// single stray tap does not permanently remove the only install prompt iOS has.
export const PWA_INSTALL_SNOOZE_MS = 14 * 24 * 60 * 60 * 1000;

export type InstallCapability = {
  isIos: boolean;
  isSafari: boolean;
  isInAppBrowser: boolean;
  isStandalone: boolean;
};

/**
 * Which Add to Home Screen instructions an iOS visitor needs:
 * - `safari`: Share, then Add to Home Screen.
 * - `browser`: Chrome/Edge/Firefox on iOS 16.4+ can also add to the home screen
 *   from their own share menu.
 * - `in-app`: in-app browsers (Instagram, Facebook, etc.) cannot install at all,
 *   so the visitor has to open the page in Safari first.
 */
export type IosInstallHint = 'safari' | 'browser' | 'in-app';

const IN_APP_BROWSER_PATTERN = /FBAN|FBAV|FB_IAB|Instagram|Line\/|Snapchat|TikTok|musical_ly|LinkedInApp|Twitter|WhatsApp/i;
const IOS_THIRD_PARTY_BROWSER_PATTERN = /CriOS|FxiOS|EdgiOS|OPiOS|OPT\/|DuckDuckGo/i;

export function isIosUserAgent(userAgent: string, maxTouchPoints = 0): boolean {
  if (/iPad|iPhone|iPod/.test(userAgent)) return true;
  // iPadOS 13+ reports a desktop Mac user agent; touch support gives it away.
  return /Macintosh/.test(userAgent) && maxTouchPoints > 1;
}

export function isSafariUserAgent(userAgent: string): boolean {
  return /Safari/i.test(userAgent)
    && !IOS_THIRD_PARTY_BROWSER_PATTERN.test(userAgent)
    && !IN_APP_BROWSER_PATTERN.test(userAgent);
}

export function isInAppBrowserUserAgent(userAgent: string): boolean {
  if (IN_APP_BROWSER_PATTERN.test(userAgent)) return true;
  // WKWebView-based in-app browsers usually drop the Safari token entirely.
  return !/Safari/i.test(userAgent) && !IOS_THIRD_PARTY_BROWSER_PATTERN.test(userAgent);
}

export function isStandaloneMode(): boolean {
  if (typeof window === 'undefined') return false;

  const navigatorWithStandalone = navigator as Navigator & { standalone?: boolean };
  return window.matchMedia('(display-mode: standalone)').matches || navigatorWithStandalone.standalone === true;
}

export function getInstallCapability(userAgent: string, maxTouchPoints = 0): InstallCapability {
  const isIos = isIosUserAgent(userAgent, maxTouchPoints);
  return {
    isIos,
    isSafari: isSafariUserAgent(userAgent),
    isInAppBrowser: isIos && isInAppBrowserUserAgent(userAgent),
    isStandalone: isStandaloneMode(),
  };
}

export function getIosInstallHint(capability: InstallCapability): IosInstallHint | null {
  if (!capability.isIos || capability.isStandalone) return null;
  if (capability.isInAppBrowser) return 'in-app';
  if (capability.isSafari) return 'safari';
  return 'browser';
}

/**
 * Legacy dismissals stored the literal '1' and were permanent; parsed as a
 * timestamp that is long expired, so those devices see the banner again.
 */
export function isInstallBannerSnoozed(storedValue: string | null, now = Date.now()): boolean {
  if (!storedValue) return false;
  const dismissedAt = Number(storedValue);
  if (!Number.isFinite(dismissedAt)) return false;
  return now - dismissedAt < PWA_INSTALL_SNOOZE_MS;
}
