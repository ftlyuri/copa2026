// Service Worker — Copa 2026
// Mude o número da versão a cada novo deploy para forçar atualização
const CACHE_VERSION = 'copa2026-v1';
const CACHE_NAME = `${CACHE_VERSION}`;

// Instala e limpa caches antigas
self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Network-first: sempre tenta buscar versão nova da rede
// Só usa cache se estiver offline
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Salva cópia no cache
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
