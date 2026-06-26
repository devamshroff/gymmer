export const PWA_MANIFEST_PATH = '/manifest.webmanifest';
export const PWA_SERVICE_WORKER_PATH = '/sw.js';
export const PWA_OFFLINE_ROUTE = '/offline';
export const PWA_THEME_COLOR = '#0a0a0a';
export const PWA_BACKGROUND_COLOR = '#0a0a0a';

export const PWA_RUNTIME_CACHED_ROUTES = [
  '/',
  '/login',
  '/workout',
  '/nutrition',
  '/routines',
  '/activities',
  '/what-is-gymmer',
  PWA_OFFLINE_ROUTE,
] as const;

export const PWA_ICON_SOURCES = [
  {
    src: '/icons/icon-192-v4.png',
    sizes: '192x192',
    type: 'image/png',
    purpose: 'any',
  },
  {
    src: '/icons/icon-512-v4.png',
    sizes: '512x512',
    type: 'image/png',
    purpose: 'any',
  },
  {
    src: '/icons/maskable-icon-512-v4.png',
    sizes: '512x512',
    type: 'image/png',
    purpose: 'maskable',
  },
] as const;

export function buildPwaManifest() {
  return {
    name: 'Temple',
    short_name: 'Temple',
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
        name: 'Gymmer',
        short_name: 'Gymmer',
        url: '/workout',
      },
      {
        name: 'Nommer',
        short_name: 'Nommer',
        url: '/nutrition',
      },
      {
        name: 'My Routines',
        short_name: 'Routines',
        url: '/routines',
      },
      {
        name: 'Log Activity',
        short_name: 'Activity',
        url: '/activities',
      },
      {
        name: 'Profile',
        short_name: 'Profile',
        url: '/profile',
      },
    ],
  } as const;
}
