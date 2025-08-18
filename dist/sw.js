
// MASTERMIND SERVICE WORKER - Strategic Caching
const CACHE_NAME = 'mastermind-v1';
const urlsToCache = ['/', '/master.css', '/core.js', '/config.json'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
