const CACHE_VERSION = 'gymmer-pwa-v5';
const SHELL_CACHE = `${CACHE_VERSION}-shell`;
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const OFFLINE_URL = '/offline';
const ACTIVITY_LOG_URL = '/activities';
const RUNTIME_ROUTES = new Set([
  '/',
  '/login',
  '/routines',
  ACTIVITY_LOG_URL,
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

self.addEventListener('push', (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = {};
  }

  const title = payload.title || 'What did you end up doing today?';
  const options = {
    body: payload.body || 'Tap to log what you did.',
    tag: payload.tag || 'cardio-activity-reminder',
    data: {
      url: payload.url || ACTIVITY_LOG_URL,
    },
    icon: '/icons/icon-192-v4.png',
    badge: '/icons/icon-192-v4.png',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Push services expire subscriptions on their own schedule (Apple does this
// routinely). Without re-subscribing here the subscription silently dies, the
// send route disables the row after a 410, and nightly reminders stop with no
// visible failure. Re-subscribe with the same key and push the new endpoint to
// the server.
self.addEventListener('pushsubscriptionchange', (event) => {
  event.waitUntil((async () => {
    try {
      const applicationServerKey = event.oldSubscription?.options?.applicationServerKey;
      if (!applicationServerKey) return;

      const subscription = await self.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });

      await fetch('/api/push/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
        }),
      });
    } catch (error) {
      console.error('Failed to renew push subscription:', error);
    }
  })());
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = new URL(event.notification.data?.url || ACTIVITY_LOG_URL, self.location.origin);

  event.waitUntil((async () => {
    const windowClients = await self.clients.matchAll({
      type: 'window',
      includeUncontrolled: true,
    });

    for (const client of windowClients) {
      const clientUrl = new URL(client.url);
      if (clientUrl.origin === targetUrl.origin) {
        if (clientUrl.href !== targetUrl.href && 'navigate' in client) {
          const navigatedClient = await client.navigate(targetUrl.href);
          return (navigatedClient || client).focus();
        }
        return client.focus();
      }
    }

    return self.clients.openWindow(targetUrl.href);
  })());
});
