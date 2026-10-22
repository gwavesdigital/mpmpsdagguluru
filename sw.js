// sw.js — Digital Manabadi Service Worker
const CACHE_NAME = 'dm-cache-v2';
const urlsToCache = [
  './',
  './index.html',
  './headmaster.html',
  './style.css',
  './manifest.json',
  './js/config.js',
  './js/ui.js',
  './js/auth.js',
  './js/app.js',
  './js/pages/headmaster.js'
];

// Install — cache files
self.addEventListener('install', event => {
  console.log('🔧 SW installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Caching files...');
        return cache.addAll(urlsToCache).catch(err => {
          console.warn('⚠️ Some files failed to cache (404?):', err);
        });
      })
      .then(() => self.skipWaiting())
  );
});

// Activate — clean old caches
self.addEventListener('activate', event => {
  console.log('🚀 SW activating...');
  event.waitUntil(
    caches.keys().then(names => {
      return Promise.all(
        names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch — cache-first for local files, network-first for Firebase
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Firebase / Google APIs → network only
  if (url.hostname.includes('firebase') ||
      url.hostname.includes('googleapis') ||
      url.hostname.includes('gstatic') ||
      url.hostname.includes('flaticon') ||
      url.hostname.includes('cdnjs')) {
    return; // browser default
  }

  // HTML → network-first (always get latest)
  if (event.request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, copy));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // CSS/JS → cache-first
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
