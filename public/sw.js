// Service Worker for Prabhu Ram Ji Trust PWA
const CACHE_NAME = 'prt-pwa-v4-hd';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/logo.svg',
  '/site.webmanifest',
  '/manifest.json',
  '/pwa-1024x1024.png',
  '/pwa-maskable-1024x1024.png',
  '/pwa-512x512.png',
  '/pwa-192x192.png',
  '/pwa-maskable-512x512.png',
  '/pwa-maskable-192x192.png',
  '/apple-touch-icon.png',
  '/logo.png',
  '/favicon.ico',
  '/favicon-48x48.png',
  '/favicon-96x96.png'
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

  // Stale-while-revalidate or Network-first strategy
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
