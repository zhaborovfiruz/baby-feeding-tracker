// sw.js
const CACHE_NAME = 'baby-feed-tracker-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/utils.js',
  '/js/db.js',
  '/js/pages/login.js',
  '/js/pages/dashboard.js',
  '/js/pages/feeding.js',
  '/js/pages/calendar.js',
  '/js/pages/products.js',
  '/js/pages/reports.js',
  '/js/pages/child.js',
  '/js/app.js',
  '/data/products.js'
];

// Установка: предварительное кеширование
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Активация: удаление старых кешей
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

// Перехват запросов: кеш, потом сеть
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => {
        // Динамически кешируем новые запросы (например, шрифты Google)
        if (event.request.url.startsWith('https://fonts.googleapis.com')) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    }).catch(() => {
      // Офлайн-заглушка для HTML (можно вернуть index.html)
      if (event.request.mode === 'navigate') {
        return caches.match('/index.html');
      }
    })
  );
});