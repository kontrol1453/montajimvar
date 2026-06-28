const CACHE_NAME = "montajimvar-v3";
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "/badge-icon.svg",
  "/apple-touch-icon.png",
  "/offline.html",
];

// Install: cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Push: receive and show notification
self.addEventListener("push", (event) => {
  let data;
  try {
    data = event.data?.json();
  } catch {
    data = { title: "Montajım Var", body: event.data?.text() || "" };
  }

  const options = {
    body: data.body || "",
    icon: data.icon || "/icon-192.png",
    badge: data.badge || "/badge-icon.svg",
    data: { url: data.url || "/" },
    vibrate: [200, 100, 200],
    tag: data.tag || "default",
    renotify: true,
    requireInteraction: data.requireInteraction !== false,
    silent: false,
  };

  event.waitUntil(self.registration.showNotification(data.title || "Montajım Var", options));
});

// Notification click: navigate to URL
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      const matchingClient = windowClients.find((c) => c.url.includes(self.location.origin));
      if (matchingClient) {
        return matchingClient.navigate(url).then(() => matchingClient.focus());
      }
      return clients.openWindow(url);
    })
  );
});

// Fetch: network-first with cache fallback for pages, cache-first for static
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // Skip non-GET
  if (request.method !== "GET") return;

  // API routes: network-only, no caching
  if (url.pathname.startsWith("/api/")) return;

  // Next.js static chunks: cache-first (never change once built)
  if (url.pathname.startsWith("/_next/static")) {
    event.respondWith(
      caches.match(request).then((cached) => {
        return cached || fetch(request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        });
      })
    );
    return;
  }

  // Navigation requests (pages): stale-while-revalidate
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          if (response.ok) {
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          const offline = await caches.match("/offline.html");
          if (offline) return offline;
          return new Response("Bağlantı hatası.", { status: 503 });
        })
    );
    return;
  }

  // Static assets and other requests: cache-first with network update
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request).then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      }).catch(() => cached);

      return cached || fetchPromise;
    })
  );
});