export const PWA_MANIFEST_PATH = '/manifest.webmanifest';
export const PWA_SERVICE_WORKER_PATH = '/sw.js';
export const PWA_OFFLINE_ROUTE = '/offline';
export const PWA_THEME_COLOR = '#0a0a0a';
export const PWA_BACKGROUND_COLOR = '#0a0a0a';

export const PWA_RUNTIME_CACHED_ROUTES = [
  '/',
  '/login',
  '/routines',
  '/what-is-gymmer',
  PWA_OFFLINE_ROUTE,
] as const;

export const PWA_ICON_SOURCES = [
  {
    src: '/icons/icon-192.png',
    sizes: '192x192',
    type: 'image/png',
    purpose: 'any',
  },
  {
    src: '/icons/icon-512.png',
    sizes: '512x512',
    type: 'image/png',
    purpose: 'any',
  },
  {
    src: '/icons/maskable-icon-512.png',
    sizes: '512x512',
    type: 'image/png',
    purpose: 'maskable',
  },
] as const;

export function buildPwaManifest() {
  return {
    name: 'GYMMER',
    short_name: 'GYMMER',
    description: 'flow and progress',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: PWA_BACKGROUND_COLOR,
    theme_color: PWA_THEME_COLOR,
    icons: [...PWA_ICON_SOURCES],
    shortcuts: [
      {
        name: 'My Routines',
        short_name: 'Routines',
        url: '/routines',
      },
      {
        name: 'Profile',
        short_name: 'Profile',
        url: '/profile',
      },
    ],
  } as const;
}
