const CACHE_NAME = "riyan-portfolio-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // never cache the PHP API — admin changes, ratings, messages, and
  // maintenance status must always be fetched fresh
  if (request.method !== "GET" || url.pathname.startsWith("/server/")) {
    return;
  }

  // only handle requests to our own origin
  if (url.origin !== self.location.origin) {
    return;
  }

  // stale-while-revalidate: serve the cached copy instantly if we
  // have one (fast repeat loads / basic offline support), while
  // quietly fetching a fresh copy in the background for next time
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => cached);

      return cached || network;
    })
  );
});