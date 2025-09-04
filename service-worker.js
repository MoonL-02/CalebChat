// Simple Service Worker for CalebChat PWA
const CACHE_NAME = "calebchat-cache-v1";
const CORE_ASSETS = [
  "/CalebChat/",
  "/CalebChat/index.html",
  "/CalebChat/manifest.json",
  "/CalebChat/icons/icon-192.png",
  "/CalebChat/icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => key !== CACHE_NAME && caches.delete(key)))
    )
  );
  self.clients.claim();
});

// Cache-first for same-origin requests, fallback to network
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          // Optionally store in cache
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return res;
        }).catch(() => caches.match("/CalebChat/index.html"));
      })
    );
  }
});
