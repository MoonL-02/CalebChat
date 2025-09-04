// Service Worker for CalebChat PWA (full cache version)

const CACHE_NAME = "calebchat-cache-v2";
const ASSETS_TO_CACHE = [
  "/CalebChat/",
  "/CalebChat/icons/icon-192.png",
  "/CalebChat/icons/icon-512.png",
  "/CalebChat/index.html",
  "/CalebChat/manifest.json",
  "/CalebChat/service-worker.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return res;
      }).catch(() => caches.match("/CalebChat/index.html"));
    })
  );
});
