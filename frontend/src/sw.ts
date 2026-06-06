const SW_VERSION = '1.0.0';

self.addEventListener('install', (event: any) => {
  console.log(`Service Worker installing v${SW_VERSION}`);
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event: any) => {
  console.log('Service Worker activating');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('sync', (event: any) => {
  if (event.tag === 'sync-invoices') {
    event.waitUntil(syncInvoices());
  }
});

async function syncInvoices() {
  console.log('Background Sync: Syncing invoices...');
  // In a real app, this would fetch from IndexedDB and POST to Frappe
  // For this prototype, we log the intent
}
