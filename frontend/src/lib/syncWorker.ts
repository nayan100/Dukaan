import { getUnsyncedInvoices, markInvoiceSynced } from './db';

let isSyncing = false;

export const triggerSync = async () => {
  if (isSyncing || !navigator.onLine) return;

  const unsynced = await getUnsyncedInvoices();
  if (unsynced.length === 0) return;

  isSyncing = true;
  console.log(`Starting sync for ${unsynced.length} invoices...`);

  for (const invoice of unsynced) {
    try {
      const response = await fetch('/api/method/dukaan.compliance.sync_to_ird', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoice_name: invoice.invoice_id,
        }),
      });

      if (response.ok) {
        await markInvoiceSynced(invoice.invoice_id);
        console.log(`Successfully synced ${invoice.invoice_id}`);
      } else {
        console.error(`Failed to sync ${invoice.invoice_id}: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error syncing ${invoice.invoice_id}:`, error);
    }
  }

  isSyncing = false;
};

export const startSyncWorker = (intervalMs = 30000) => {
  // 1. Listen for online event
  window.addEventListener('online', () => {
    console.log('Online detected, triggering sync...');
    triggerSync();
  });

  // 2. Periodic check
  setInterval(triggerSync, intervalMs);
};
