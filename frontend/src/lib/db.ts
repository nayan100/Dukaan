import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';

interface DukaanDB extends DBSchema {
  catalog: {
    key: string;
    value: {
      id: string;
      name: string;
      price: number;
      category?: string;
      last_updated: number;
    };
  };
  invoices: {
    key: string;
    value: {
      invoice_id: string;
      items: any[];
      total: number;
      payment_details: any;
      created_at: number;
      synced: boolean;
      is_offline: boolean;
      posting_date?: string;
      ird_sync_status?: 'Pending' | 'Synced' | 'Failed';
      ird_receipt_no?: string;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<DukaanDB>>;

export const initDB = () => {
  if (dbPromise) return; // Prevent multiple initializations
  dbPromise = openDB<DukaanDB>('dukaan-offline-db', 2, {
    upgrade(db, oldVersion) {
      if (oldVersion < 1) {
        db.createObjectStore('catalog', { keyPath: 'id' });
        db.createObjectStore('invoices', { keyPath: 'invoice_id' });
      }
      // Future migrations can go here
    },
  });
};

export const saveInvoiceOffline = async (invoice: any) => {
  const db = await dbPromise;
  const invoiceData = {
    ...invoice,
    synced: false,
    is_offline: !navigator.onLine,
    ird_sync_status: 'Pending',
    created_at: Date.now(),
  };
  
  // 1. Save to IndexedDB (Primary)
  await db.put('invoices', invoiceData);
  
  // 2. Mirror to localStorage (Secondary Redundancy)
  try {
    localStorage.setItem(`backup-invoice-${invoiceData.invoice_id}`, JSON.stringify(invoiceData));
  } catch (e) {
    console.warn('Failed to save invoice to localStorage redundancy', e);
  }
};

export const getUnsyncedInvoices = async () => {
  const db = await dbPromise;
  const allInvoices = await db.getAll('invoices');
  return allInvoices.filter(inv => !inv.synced);
};

export const markInvoiceSynced = async (invoiceId: string) => {
  const db = await dbPromise;
  const inv = await db.get('invoices', invoiceId);
  if (inv) {
    inv.synced = true;
    await db.put('invoices', inv);
  }
};
