// Service Worker for Prabhu Ram Ji Trust PWA
const CACHE_NAME = 'prt-pwa-v7-crisp-icons';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/site.webmanifest',
  '/logo.png',
  '/logo.svg',
  '/logo-maskable.svg',
  '/pwa-1024x1024.png',
  '/pwa-512x512.png',
  '/pwa-192x192.png',
  '/pwa-maskable-1024x1024.png',
  '/pwa-maskable-512x512.png',
  '/pwa-maskable-192x192.png',
  '/apple-touch-icon.png',
  '/splash-screen.png',
  '/splash-1170x2532.png',
  '/favicon.ico',
  '/favicon.png',
  '/favicon-32x32.png',
  '/favicon-48x48.png',
  '/favicon-96x96.png',
  '/favicon-192x192.png',
  '/favicon-512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  // Use Network-First for HTML navigation requests so app updates load immediately
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => caches.match(request).then((res) => res || caches.match('/index.html')))
    );
    return;
  }

  // Network-First for manifest and icons so updated sharp icons reflect immediately
  const url = new URL(request.url);
  if (
    url.pathname.endsWith('.json') ||
    url.pathname.endsWith('.webmanifest') ||
    url.pathname.startsWith('/pwa-') ||
    url.pathname.startsWith('/splash-') ||
    url.pathname === '/apple-touch-icon.png' ||
    url.pathname === '/logo.png'
  ) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Stale-while-revalidate for other static assets
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        return cachedResponse;
      });

      return cachedResponse || fetchPromise;
    })
  );
});
