const staticCacheName = "static-v1.0.0";
const dynamicCacheName = "dynamic-v1.0.0";
const assets = [
  "/test-pwa/test-pwa",
  "/test-pwa/app.js",
  "/test-pwa/manifest.json",
  "/test-pwa/images/icons/favicon-16x16-dunplab-manifest-57109.png",
  "/test-pwa/images/icons/apple-icon-144x144-dunplab-manifest-57109.png",
  "/test-pwa/images/icons/android-icon-192x192-dunplab-manifest-57109.png",
  "/test-pwa/images/test.png",
  "/test-pwa/index.html",
  "/test-pwa/test1.html",
  "/test-pwa/test2.html",
  "/test-pwa/fallback.html",
];

// cache size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

// install event
self.addEventListener("install", (evt) => {
  // console.log("service worker installed");
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      // console.log("caching shell assets");
      cache.addAll(assets);
    })
  );
});

// activate event
self.addEventListener("activate", (evt) => {
  // console.log("service worker activated");
  evt.waitUntil(
    caches.keys().then((keys) => {
      // console.log(keys);
      return Promise.all(
        keys
          .filter((key) => key !== staticCacheName && key !== dynamicCacheName)
          .map((key) => caches.delete(key))
      );
    })
  );
});

// fetch event
self.addEventListener("fetch", (evt) => {
  // console.log("fetch event", evt);
  evt.respondWith(
    (async () => {
      try {
        // Try to get the response from a cache.
        const cachedResponse = await caches.match(evt.request);
        // Return it if we found one.
        if (cachedResponse) return cachedResponse;
        // If we didn't find a match in the cache, use the network.
        return fetch(evt.request).then((fetchRes) => {
          return caches.open(dynamicCacheName).then((cache) => {
            cache.put(evt.request.url, fetchRes.clone());
            limitCacheSize(dynamicCacheName, 15);
            return fetchRes;
          });
        });
      } catch (err) {
        return caches.match("/test-pwa/fallback.html");
      }
    })()
  );
});
