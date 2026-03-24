export const PWA_INSTALL_DISMISS_KEY = 'gymmer_pwa_install_dismissed';

export type InstallCapability = {
  isIos: boolean;
  isSafari: boolean;
  isStandalone: boolean;
};

export function isIosUserAgent(userAgent: string): boolean {
  return /iPad|iPhone|iPod/.test(userAgent);
}

export function isSafariUserAgent(userAgent: string): boolean {
  return /Safari/i.test(userAgent)
    && !/CriOS|FxiOS|EdgiOS|OPiOS|OPT|DuckDuckGo/i.test(userAgent);
}

export function isStandaloneMode(): boolean {
  if (typeof window === 'undefined') return false;

  const navigatorWithStandalone = navigator as Navigator & { standalone?: boolean };
  return window.matchMedia('(display-mode: standalone)').matches || navigatorWithStandalone.standalone === true;
}

export function getInstallCapability(userAgent: string): InstallCapability {
  return {
    isIos: isIosUserAgent(userAgent),
    isSafari: isSafariUserAgent(userAgent),
    isStandalone: isStandaloneMode(),
  };
}

export function shouldShowIosInstallHint(capability: InstallCapability): boolean {
  return capability.isIos && capability.isSafari && !capability.isStandalone;
}
