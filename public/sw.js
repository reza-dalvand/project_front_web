// public/sw.js
// ═══════════════════════════════════════════════
//   زیبانو - Service Worker
//   کش آفلاین + Sync Queue + Cache Strategies
// ═══════════════════════════════════════════════

const CACHE_VERSION = 'v2';
const STATIC_CACHE = `zibano-static-${CACHE_VERSION}`;
const PAGE_CACHE = `zibano-pages-${CACHE_VERSION}`;
const IMAGE_CACHE = `zibano-images-${CACHE_VERSION}`;
const API_CACHE = `zibano-api-${CACHE_VERSION}`;
const SYNC_QUEUE_CACHE = `zibano-sync-queue-${CACHE_VERSION}`;

// فایل‌های ثابت برای کش اولیه
const STATIC_ASSETS = ['/', '/manifest.json'];

// دامنه‌هایی که تصاویرشون کش بشن
const IMAGE_DOMAINS = ['images.unsplash.com', 'picsum.photos', 'i.pravatar.cc'];

// ═══════════ Install ═══════════
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ═══════════ Activate ═══════════
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => {
              const validPrefixes = [
                `zibano-static-${CACHE_VERSION}`,
                `zibano-pages-${CACHE_VERSION}`,
                `zibano-images-${CACHE_VERSION}`,
                `zibano-api-${CACHE_VERSION}`,
                `zibano-sync-queue-${CACHE_VERSION}`,
              ];
              return !validPrefixes.some((prefix) => key.startsWith(prefix));
            })
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ═══════════ Fetch ═══════════
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // درخواست‌های غیر GET → Sync Queue
  if (request.method !== 'GET') {
    event.respondWith(handleMutatingRequest(request));
    return;
  }

  // صفحات HTML → Network-first
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, PAGE_CACHE));
    return;
  }

  // تصاویر → Cache-first
  if (isImageRequest(url)) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
    return;
  }

  // API calls → Network-first
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request, API_CACHE));
    return;
  }

  // Static assets → Cache-first
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // بقیه → Network-first
  event.respondWith(networkFirst(request, PAGE_CACHE));
});

// ═══════════ Strategies ═══════════

// Network-first
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response(
      JSON.stringify({
        success: false,
        error: { code: 'OFFLINE', message: 'شما آفلاین هستید' },
      }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Cache-first
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('', { status: 404 });
  }
}

// ═══════════ Sync Queue ═══════════
async function handleMutatingRequest(request) {
  try {
    return await fetch(request);
  } catch {
    await saveToSyncQueue(request);
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: 'QUEUED_OFFLINE',
          message: 'درخواست در صف ذخیره شد و پس از اتصال ارسال می‌شود',
        },
      }),
      { status: 202, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

async function saveToSyncQueue(request) {
  const cache = await caches.open(SYNC_QUEUE_CACHE);
  const cloned = request.clone();
  const body = request.method !== 'GET' ? await cloned.text() : '';
  const headers = Object.fromEntries(request.headers.entries());

  const item = JSON.stringify({
    url: request.url,
    method: request.method,
    body,
    headers,
    timestamp: Date.now(),
  });

  await cache.put(
    new Request(`/sync-queue/${Date.now()}-${Math.random().toString(36).slice(2)}`),
    new Response(item, { headers: { 'Content-Type': 'application/json' } })
  );
}

// ═══════════ Background Sync ═══════════
self.addEventListener('sync', (event) => {
  if (event.tag === 'zibano-sync-queue') {
    event.waitUntil(processSyncQueue());
  }
});

async function processSyncQueue() {
  const cache = await caches.open(SYNC_QUEUE_CACHE);
  const keys = await cache.keys();

  for (const key of keys) {
    try {
      const response = await cache.match(key);
      if (!response) continue;

      const data = await response.json();

      // درخواست‌های قدیمی‌تر از ۲۴ ساعت حذف بشن
      if (Date.now() - data.timestamp > 24 * 60 * 60 * 1000) {
        await cache.delete(key);
        continue;
      }

      await fetch(data.url, {
        method: data.method,
        headers: data.headers,
        body: data.body || undefined,
      });

      await cache.delete(key);
    } catch {
      // هنوز آفلاین → در صف بمونه
    }
  }
}

// ═══════════ Helpers ═══════════
function isImageRequest(url) {
  if (url.pathname.match(/\.(jpg|jpeg|png|gif|webp|avif|svg|ico)$/)) return true;
  return IMAGE_DOMAINS.some((d) => url.hostname.includes(d));
}

function isStaticAsset(url) {
  if (url.pathname.match(/\.(js|css|woff|woff2|ttf|eot)$/)) return true;
  if (url.pathname.startsWith('/_next/static/')) return true;
  return false;
}
