import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const publicDir = path.join(root, 'public');
const swPath = path.join(publicDir, 'sw.js');

if (!existsSync(swPath)) {
  console.error('[verify-pwa-build] Missing public/sw.js after build. PWA service worker was not generated.');
  process.exit(1);
}

const publicFiles = readdirSync(publicDir);
const hasWorkbox = publicFiles.some((file) => /^workbox-.*\.js$/.test(file));

if (!hasWorkbox) {
  console.error('[verify-pwa-build] Missing workbox-*.js in public/ after build.');
  process.exit(1);
}

console.log('[verify-pwa-build] PWA artifacts found:', {
  sw: 'public/sw.js',
  workbox: publicFiles.filter((file) => /^workbox-.*\.js$/.test(file)),
});
