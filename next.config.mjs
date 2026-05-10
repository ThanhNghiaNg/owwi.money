import nextBundleAnalyzer from '@next/bundle-analyzer';
import pwa from 'next-pwa';

const APP_VERSION = process.env.VERCEL_GIT_COMMIT_SHA ?? 'local';

const withPWA = pwa({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  cacheId: `owwi-newui-${APP_VERSION}`,
  runtimeCaching: [
    {
      urlPattern: ({ request }) => request.destination === 'script' || request.destination === 'style',
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: `static-assets-${APP_VERSION}`,
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 7 * 24 * 60 * 60,
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      urlPattern: ({ url }) => url.pathname === '/user/type/all',
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: `types-${APP_VERSION}`,
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 24 * 60 * 60,
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      urlPattern: ({ url }) => url.pathname.startsWith('/v2/transactions/statistic/'),
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: `transaction-statistics-${APP_VERSION}`,
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 6 * 60 * 60,
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
  ],
});

const withBundleAnalyzer = nextBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_APP_VERSION: APP_VERSION,
  },
};

export default withBundleAnalyzer(withPWA(nextConfig));
