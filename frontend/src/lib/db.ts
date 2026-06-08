import { openDB } from 'idb';
import type { IDBPDatabase } from 'idb';

const DB_NAME = 'dukaan-offline-db';
const DB_VERSION = 5;

export interface Supplier {
  id: string;
  name: string;
  pan: string;
  vat_registered: boolean;
  compliance_status: 'Verified' | 'Pending' | 'Flagged';
}

export interface Budget {
  id: string; // branch-month
  branch: string;
  month: string;
  limit: number;
  spent: number;
}

export interface AuditLogEntry {
    timestamp: number;
    action: string;
    user: string;
    tenant: string;
    details: string;
}

interface DukaanDB {
  catalog: {
    key: string;
    value: {
      id: string;
      name: string;
      price: number;
      stock: number;
    };
  };
  invoices: {
    key: string;
    value: any;
  };
  suppliers: {
      key: string;
      value: Supplier;
  };
  budgets: {
      key: string;
      value: Budget;
  };
  audit_log: {
    key: string;
    value: AuditLogEntry;
  };
}

let dbPromise: Promise<IDBPDatabase<DukaanDB>> | null = null;

export const initDB = () => {
  if (dbPromise) return dbPromise; // Prevent multiple initializations
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
            db.createObjectStore('audit_log', { keyPath: 'timestamp' });
        }
      }
    },
  });
  return dbPromise;
};

export const getDB = async () => {
  if (!dbPromise) {
    await initDB();
  }
  return dbPromise!;
};

export const saveAuditLog = async (action: string, user: string, tenant: string, details: string) => {
  const db = await getDB();
  const entry: AuditLogEntry = {
    timestamp: Date.now(),
    action,
    user,
    tenant,
    details
  };
  await db.put('audit_log', entry);
};

export const getSupplier = async (id: string) => {
  const db = await getDB();
  return db.get('suppliers', id);
};

export const updateSupplier = async (supplier: Supplier) => {
  const db = await getDB();
  await db.put('suppliers', supplier);
};

export const getBudget = async (branchId: string, month: string) => {
  const db = await getDB();
  return db.get('budgets', `${branchId}-${month}`);
};

export const updateBudget = async (budget: Budget) => {
  const db = await getDB();
  await db.put('budgets', budget);
};

export const saveInvoiceOffline = async (invoice: any) => {
  const db = await getDB();
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
  const db = await getDB();
  const allInvoices = await db.getAll('invoices');
  return allInvoices.filter(inv => !inv.synced);
};

export const getAllInvoices = async () => {
  const db = await getDB();
  return db.getAll('invoices');
};

export const markInvoiceSynced = async (invoiceId: string) => {
  const db = await getDB();
  const inv = await db.get('invoices', invoiceId);
  if (inv) {
    inv.synced = true;
    await db.put('invoices', inv);
  }
};
