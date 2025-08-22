// Jovie Service Worker for advanced caching
const CACHE_NAME = 'jovie-v1';
const STATIC_CACHE = ['/', '/manifest.json', '/offline.html', '/favicon.ico'];

// API routes that should be cached
const API_CACHE_PATTERNS = [/\/api\/profiles\/.+/];

// Cache durations in seconds
const CACHE_DURATIONS = {
  static: 86400 * 7, // 7 days
  api: 300, // 5 minutes
  profiles: 3600, // 1 hour
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_CACHE);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});

// Helper to determine if a request should be cached
function shouldCache(url) {
  const parsedUrl = new URL(url);

  // Don't cache auth-related requests
  if (
    parsedUrl.pathname.includes('/sign-in') ||
    parsedUrl.pathname.includes('/sign-up') ||
    parsedUrl.pathname.includes('/api/auth')
  ) {
    return false;
  }

  // Cache API requests that match our patterns
  if (API_CACHE_PATTERNS.some((pattern) => pattern.test(parsedUrl.pathname))) {
    return true;
  }

  // Cache static assets
  if (
    parsedUrl.pathname.match(
      /\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ttf|ico)$/
    )
  ) {
    return true;
  }

  // Cache profile pages
  if (parsedUrl.pathname.match(/^\/[a-zA-Z0-9_-]+\/?$/)) {
    return true;
  }

  return false;
}

// Helper to get cache duration based on request
function getCacheDuration(request) {
  const url = new URL(request.url);

  // Profile API requests
  if (url.pathname.match(/\/api\/profiles\/.+/)) {
    return CACHE_DURATIONS.profiles;
  }

  // Other API requests
  if (url.pathname.startsWith('/api/')) {
    return CACHE_DURATIONS.api;
  }

  // Static assets
  if (
    url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ttf|ico)$/)
  ) {
    return CACHE_DURATIONS.static;
  }

  // Default
  return CACHE_DURATIONS.api;
}

// Fetch event - serve from cache, update in background
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip cross-origin requests
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;

  // Skip if we shouldn't cache this request
  if (!shouldCache(event.request.url)) return;

  // Handle the request with appropriate caching strategy
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        // Check if we have a cached response
        if (cachedResponse) {
          // Check if the cached response is still valid
          const cachedDate = new Date(
            cachedResponse.headers.get('sw-cache-date') || 0
          );
          const cacheDuration = getCacheDuration(event.request) * 1000; // Convert to ms
          const now = Date.now();

          // If the cached response is still valid, use it
          if (now - cachedDate.getTime() < cacheDuration) {
            // Update the cache in the background (stale-while-revalidate)
            fetch(event.request)
              .then((fetchResponse) => {
                if (fetchResponse.ok) {
                  // Clone the response and add cache date header
                  const responseToCache = fetchResponse.clone();
                  const headers = new Headers(responseToCache.headers);
                  headers.append('sw-cache-date', new Date().toISOString());

                  // Create a new response with the added header
                  return responseToCache.blob().then((body) => {
                    return new Response(body, {
                      status: responseToCache.status,
                      statusText: responseToCache.statusText,
                      headers,
                    });
                  });
                }
                return fetchResponse;
              })
              .then((newResponse) => {
                cache.put(event.request, newResponse);
              })
              .catch(() => {
                // Ignore background fetch errors
              });

            return cachedResponse;
          }
        }

        // If no valid cached response, fetch from network
        return fetch(event.request)
          .then((fetchResponse) => {
            if (!fetchResponse || !fetchResponse.ok) {
              throw new Error('Network response was not ok');
            }

            // Clone the response and add cache date header
            const responseToCache = fetchResponse.clone();
            const headers = new Headers(responseToCache.headers);
            headers.append('sw-cache-date', new Date().toISOString());

            // Create a new response with the added header
            return responseToCache.blob().then((body) => {
              const newResponse = new Response(body, {
                status: responseToCache.status,
                statusText: responseToCache.statusText,
                headers,
              });

              // Cache the new response
              cache.put(event.request, newResponse.clone());

              return fetchResponse;
            });
          })
          .catch((error) => {
            console.error('Fetch failed:', error);

            // For navigation requests, return the offline page
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }

            // For other requests, return the cached response if available
            return (
              cachedResponse || new Response('Network error', { status: 408 })
            );
          });
      });
    })
  );
});

// Listen for cache invalidation messages
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'INVALIDATE_CACHE') {
    const { path } = event.data;

    if (path) {
      // Invalidate specific path
      caches.open(CACHE_NAME).then((cache) => {
        cache.keys().then((requests) => {
          requests.forEach((request) => {
            if (request.url.includes(path)) {
              cache.delete(request);
            }
          });
        });
      });
    } else {
      // Invalidate all cache
      caches.open(CACHE_NAME).then((cache) => {
        cache.keys().then((requests) => {
          requests.forEach((request) => {
            if (!STATIC_CACHE.includes(request.url)) {
              cache.delete(request);
            }
          });
        });
      });
    }
  }
});
