/* LUMEN Writing Studio — service worker
   App shell + Google Fonts offline cache. Bump CACHE_VERSION when the shell changes. */
const CACHE_VERSION = 'lumen-shell-v1';
const FONT_CACHE = 'lumen-fonts-v1';
const SHELL = [
  './lumen.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon.svg'
];
const OFFLINE_URL = './lumen.html';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(SHELL))
      .catch(() => {})
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key !== CACHE_VERSION && key !== FONT_CACHE)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  /* Navigations: try the network, fall back to the cached app shell. */
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }

  /* Same-origin assets: serve fast, refresh in the background. */
  if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(request, CACHE_VERSION));
    return;
  }

  /* Google Fonts: cache forever once fetched. */
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(cacheFirst(request, FONT_CACHE));
  }
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE_VERSION);
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone()).catch(() => {});
    }
    return response;
  } catch (err) {
    const hit = await cache.match(request, { ignoreSearch: true });
    if (hit) return hit;
    const shell = await cache.match(OFFLINE_URL, { ignoreSearch: true });
    if (shell) return shell;
    return new Response(
      '<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1">' +
      '<body style="margin:0;background:#070707;color:#f2f2ef;font:15px system-ui;display:grid;place-items:center;height:100vh">' +
      '<div style="text-align:center;padding:24px"><h1 style="font-weight:500">LUMEN ออฟไลน์</h1>' +
      '<p style="color:#9a9a95">เปิดแอปครั้งแรกแล้วยังไม่ได้แคชไว้ กรุณาเชื่อมต่ออินเทอร์เน็ตหนึ่งครั้ง</p></div>',
      { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request, { ignoreSearch: true });
  const network = fetch(request)
    .then(response => {
      if (response && response.ok) cache.put(request, response.clone()).catch(() => {});
      return response;
    })
    .catch(() => null);
  return cached || network || Response.error();
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response && (response.ok || response.type === 'opaque')) {
      cache.put(request, response.clone()).catch(() => {});
    }
    return response;
  } catch (err) {
    return cached || Response.error();
  }
}

self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
