const SW_VERSION = '1.0.0';

self.addEventListener('install', (event) => {
  console.log(`Service Worker installing v${SW_VERSION}`);
  // Use standard skipWaiting
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-invoices') {
    event.waitUntil(syncInvoices());
  }
});

async function syncInvoices() {
  console.log('Background Sync: Syncing invoices...');
  // Simulation logic
}
