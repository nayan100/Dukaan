import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';

interface Budget {
  id: string; // branch_id + month
  branch_id: string;
  month: string; // e.g., '2026-06'
  allocated: number;
  spent: number;
}

interface Supplier {
  id: string; // supplier_name or id
  name: string;
  tax_id?: string;
}

interface AuditLogEntry {
  id: string; // uuid
  timestamp: number;
  action: string;
  user: string;
  details: any;
  tenant: string;
}

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
  budgets: {
    key: string;
    value: Budget;
  };
  suppliers: {
    key: string;
    value: Supplier;
  };
  audit_log: {
    key: string;
    value: AuditLogEntry;
  };
}

let dbPromise: Promise<IDBPDatabase<DukaanDB>>;

export const initDB = () => {
  if (dbPromise) return; // Prevent multiple initializations
  dbPromise = openDB<DukaanDB>('dukaan-offline-db', 5, {
    upgrade(db, oldVersion) {
      if (oldVersion < 1) {
        db.createObjectStore('catalog', { keyPath: 'id' });
        db.createObjectStore('invoices', { keyPath: 'invoice_id' });
      }
      if (oldVersion < 3) {
        if (!db.objectStoreNames.contains('budgets')) {
            db.createObjectStore('budgets', { keyPath: 'id' });
        }
      }
      if (oldVersion < 4) {
        if (!db.objectStoreNames.contains('suppliers')) {
            db.createObjectStore('suppliers', { keyPath: 'id' });
        }
      }
      if (oldVersion < 5) {
        if (!db.objectStoreNames.contains('audit_log')) {
            db.createObjectStore('audit_log', { keyPath: 'id' });
        }
      }
    },
  });
};

export const logAction = async (action: string, user: string, tenant: string, details: any) => {
  const db = await dbPromise;
  const entry: AuditLogEntry = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    action,
    user,
    tenant,
    details
  };
  await db.put('audit_log', entry);
};

export const getSupplier = async (id: string) => {
  const db = await dbPromise;
  return db.get('suppliers', id);
};

export const updateSupplier = async (supplier: Supplier) => {
  const db = await dbPromise;
  await db.put('suppliers', supplier);
};

export const getBudget = async (branchId: string, month: string) => {
  const db = await dbPromise;
  return db.get('budgets', `${branchId}-${month}`);
};

export const updateBudget = async (budget: Budget) => {
  const db = await dbPromise;
  await db.put('budgets', budget);
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

export const getAllInvoices = async () => {
  const db = await dbPromise;
  return db.getAll('invoices');
};

export const markInvoiceSynced = async (invoiceId: string) => {
  const db = await dbPromise;
  const inv = await db.get('invoices', invoiceId);
  if (inv) {
    inv.synced = true;
    await db.put('invoices', inv);
  }
};
