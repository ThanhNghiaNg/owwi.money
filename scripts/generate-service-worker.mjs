import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const APP_VERSION = process.env.VERCEL_GIT_COMMIT_SHA ?? 'local';
const publicDir = path.join(process.cwd(), 'public');
const target = path.join(publicDir, 'sw.js');

mkdirSync(publicDir, { recursive: true });

const source = `const APP_VERSION = ${JSON.stringify(APP_VERSION)};
const ASSET_CACHE = 'assets-' + APP_VERSION;
const TYPE_CACHE = 'types-' + APP_VERSION;
const STATS_CACHE = 'transaction-statistics-' + APP_VERSION;
const ACTIVE_CACHES = [ASSET_CACHE, TYPE_CACHE, STATS_CACHE];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(Promise.resolve());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames
        .filter((cacheName) => !ACTIVE_CACHES.includes(cacheName))
        .map((cacheName) => caches.delete(cacheName))
    );
    await self.clients.claim();
  })());
});

function isAssetRequest(request) {
  const destination = request.destination;
  return destination === 'script' || destination === 'style';
}

function isTypeRequest(url) {
  return url.pathname === '/user/type/all';
}

function isStatisticRequest(url) {
  return url.pathname.startsWith('/v2/transactions/statistic/');
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const networkPromise = fetch(request)
    .then((response) => {
      if (response && response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  if (cached) {
    return cached;
  }

  const networkResponse = await networkPromise;
  return networkResponse || Response.error();
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);

  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    const cached = await cache.match(request);
    return cached || Response.error();
  }
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);

  if (isAssetRequest(event.request)) {
    event.respondWith(staleWhileRevalidate(event.request, ASSET_CACHE));
    return;
  }

  if (isTypeRequest(url)) {
    event.respondWith(staleWhileRevalidate(event.request, TYPE_CACHE));
    return;
  }

  if (isStatisticRequest(url)) {
    event.respondWith(networkFirst(event.request, STATS_CACHE));
    return;
  }
});
`;

writeFileSync(target, source, 'utf8');
console.log('[generate-service-worker] Generated public/sw.js for version', APP_VERSION);
