// Service Worker for Tipkur Tipkha PWA
const CACHE_NAME = 'tipkur-pwa-v3';

// Core essential static files to precache
const STATIC_PRECACHE = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.ico',
  '/favicon.svg',
  '/theme-init.js',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/pwa-maskable-512x512.png',
  '/apple-touch-icon.png',
  '/Mawbynna.webp',
  '/jingkieng-jri.webp',
  '/Tynrai_Logo.webp',
  '/MegDev.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Fetch assets individually and sequentially with gentle delay
      // to prevent triggering 429 Too Many Requests rate limits on Cloudflare CDN.
      for (const url of STATIC_PRECACHE) {
        try {
          const response = await fetch(url);
          if (response && response.status >= 200 && response.status < 300) {
            await cache.put(url, response);
          } else {
            console.warn(`[SW] Precache non-OK status (${response ? response.status : 'unknown'}) for ${url}`);
          }
        } catch (err) {
          console.warn(`[SW] Precache fetch error for ${url}:`, err);
        }
        // Small 50ms pacing interval between fetches to prevent burst 429 errors
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isGoogleFont = url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com');

  if (!isSameOrigin && !isGoogleFont) return;

  // Skip API routes from static caching
  if (url.pathname.startsWith('/api/')) return;

  // HTML Navigation: Network first, falling back to cached /index.html
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cached) => cached || caches.match('/index.html'));
        })
    );
    return;
  }

  // Static Assets (Cache-First):
  // Check cache first; if present, return immediately without any network request.
  // This eliminates repeated requests and avoids 429 Too Many Requests on static files (ico, css, js, images, fonts).
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      // If not in cache, fetch from network and cache it
      return fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
        }
        return networkResponse;
      }).catch((err) => {
        // If fetch fails and it is an icon, try matching root favicon
        if (url.pathname.endsWith('.ico')) {
          return caches.match('/favicon.ico');
        }
        throw err;
      });
    })
  );
});
