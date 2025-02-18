const cacheName = 'weather-app-cache-v2';
const weatherAPIBase = 'https://api.openweathermap.org/data/2.5/weather';
const maxCities = 5;

// Install Service Worker & Cache App Shell
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/styles.css',
                '/app.js',
                '/manifest.json',
                '/icons/icon-192x192.png',
                '/icons/icon-512x512.png'
            ]);
        })
    );
});

// Activate & Clean Old Caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== cacheName) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});

// Fetch and Cache Weather Data
self.addEventListener('fetch', (event) => {
    if (event.request.url.includes(weatherAPIBase)) {
        event.respondWith(
            caches.open(cacheName).then(async (cache) => {
                try {
                    // Try fetching fresh data
                    const response = await fetch(event.request);
                    cache.put(event.request, response.clone());
                    return response;
                } catch (error) {
                    // Fallback to cached data
                    return cache.match(event.request);
                }
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                return cachedResponse || fetch(event.request);
            })
        );
    }
});
