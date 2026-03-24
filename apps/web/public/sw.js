const CACHE_VERSION = 'gymmer-pwa-v1';
const SHELL_CACHE = `${CACHE_VERSION}-shell`;
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const OFFLINE_URL = '/offline';
const RUNTIME_ROUTES = new Set([
  '/',
  '/login',
  '/routines',
  '/what-is-gymmer',
  OFFLINE_URL,
]);

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll([OFFLINE_URL]))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((key) => !key.startsWith(CACHE_VERSION))
        .map((key) => caches.delete(key))
    );
    await self.clients.claim();
  })());
});

function isSameOrigin(requestUrl) {
  return new URL(requestUrl).origin === self.location.origin;
}

function isStaticAsset(request) {
  if (!isSameOrigin(request.url)) return false;
  if (request.destination === 'style' || request.destination === 'script' || request.destination === 'font' || request.destination === 'image') {
    return true;
  }

  const pathname = new URL(request.url).pathname;
  return pathname.startsWith('/_next/static/')
    || pathname.startsWith('/icons/')
    || pathname === '/favicon.ico';
}

async function handleNavigation(request) {
  const pathname = new URL(request.url).pathname;

  try {
    const response = await fetch(request);
    if (response.ok && isSameOrigin(request.url) && RUNTIME_ROUTES.has(pathname)) {
      const cache = await caches.open(SHELL_CACHE);
      await cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const offlineResponse = await caches.match(OFFLINE_URL);
    if (offlineResponse) {
      return offlineResponse;
    }

    throw error;
  }
}

async function handleStaticAsset(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(STATIC_CACHE);
    await cache.put(request, response.clone());
  }
  return response;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(request));
    return;
  }

  if (isStaticAsset(request)) {
    event.respondWith(handleStaticAsset(request));
  }
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
