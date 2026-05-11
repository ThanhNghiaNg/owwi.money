import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const APP_VERSION = process.env.VERCEL_GIT_COMMIT_SHA ?? 'local';
const publicDir = path.join(process.cwd(), 'public');
const target = path.join(publicDir, 'sw.js');

mkdirSync(publicDir, { recursive: true });

const source = `const APP_VERSION = ${JSON.stringify(APP_VERSION)};
const ASSET_CACHE = 'assets-' + APP_VERSION;
const ACTIVE_CACHES = [ASSET_CACHE];

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
  if (!request.url.startsWith('http://') && !request.url.startsWith('https://')) {
    return false;
  }

  const destination = request.destination;
  return destination === 'script' || destination === 'style';
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const networkPromise = fetch(request)
    .then((response) => {
      if (response && response.ok && (request.url.startsWith('http://') || request.url.startsWith('https://'))) {
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

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  if (isAssetRequest(event.request)) {
    event.respondWith(staleWhileRevalidate(event.request, ASSET_CACHE));
  }
});
`;

writeFileSync(target, source, 'utf8');
console.log('[generate-service-worker] Generated public/sw.js for version', APP_VERSION);
