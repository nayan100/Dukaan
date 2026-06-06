import { describe, it, expect, vi } from 'vitest';
import { saveInvoiceOffline, initDB, getUnsyncedInvoices, markInvoiceSynced } from './db';

const mockPut = vi.fn();
const mockGet = vi.fn();
const mockGetAll = vi.fn();

vi.mock('idb', () => ({
  openDB: vi.fn().mockImplementation(() => Promise.resolve({
    put: mockPut,
    get: mockGet,
    getAll: mockGetAll,
  })),
}));

describe('IndexedDB Logic', () => {
  initDB();

  it('saves an invoice offline', async () => {
    const invoice = { invoice_id: '123', total: 1000 };
    await saveInvoiceOffline(invoice);
    expect(mockPut).toHaveBeenCalledWith('invoices', expect.objectContaining({
      invoice_id: '123',
      synced: false
    }));
  });

  it('gets unsynced invoices', async () => {
    mockGetAll.mockResolvedValue([
      { invoice_id: '1', synced: true },
      { invoice_id: '2', synced: false }
    ]);
    const unsynced = await getUnsyncedInvoices();
    expect(unsynced).toHaveLength(1);
    expect(unsynced[0].invoice_id).toBe('2');
  });

  it('marks invoice as synced', async () => {
    const inv = { invoice_id: '1', synced: false };
    mockGet.mockResolvedValue(inv);
    await markInvoiceSynced('1');
    expect(mockPut).toHaveBeenCalledWith('invoices', expect.objectContaining({
      invoice_id: '1',
      synced: true
    }));
  });

  it('saves an invoice offline with IRD compliance fields', async () => {
    const invoice = { invoice_id: '123', total: 1000, posting_date: '2026-06-06' };
    await saveInvoiceOffline(invoice);
    expect(mockPut).toHaveBeenCalledWith('invoices', expect.objectContaining({
      invoice_id: '123',
      posting_date: '2026-06-06',
      ird_sync_status: 'Pending'
    }));
  });

  it('mirrors invoice to localStorage for redundancy', async () => {
    const invoice = { invoice_id: 'localStorage-test', total: 500 };
    
    // Mock localStorage
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
    
    await saveInvoiceOffline(invoice);
    
    expect(setItemSpy).toHaveBeenCalledWith(
      expect.stringContaining('backup-invoice-localStorage-test'),
      expect.stringContaining('localStorage-test')
    );
    
    setItemSpy.mockRestore();
  });
});
