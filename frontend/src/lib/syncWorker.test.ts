import { describe, it, expect, vi, beforeEach } from 'vitest';
import { triggerSync } from './syncWorker';
import * as db from './db';

vi.mock('./db', () => ({
  getUnsyncedInvoices: vi.fn(),
  markInvoiceSynced: vi.fn(),
}));

// Mock global fetch
const fetchMock = vi.fn();
vi.stubGlobal('fetch', fetchMock);

// Mock useSyncStore
const mockSetUnsyncedCount = vi.fn();
const mockSetSyncing = vi.fn();
vi.mock('../store/syncStore', () => ({
  useSyncStore: {
    getState: () => ({
      setUnsyncedCount: mockSetUnsyncedCount,
      setSyncing: mockSetSyncing,
    }),
  },
}));

describe('Background Sync Worker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Simulate being online
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      configurable: true,
    });
  });

  it('syncs unsynced invoices when triggered', async () => {
    const mockInvoices = [
      { invoice_id: 'INV-001', total: 100 },
      { invoice_id: 'INV-002', total: 200 },
    ];
    (db.getUnsyncedInvoices as any).mockResolvedValue(mockInvoices);
    fetchMock.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ status: 'Success' }),
    });

    await triggerSync();

    expect(db.getUnsyncedInvoices).toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(db.markInvoiceSynced).toHaveBeenCalledWith('INV-001');
    expect(db.markInvoiceSynced).toHaveBeenCalledWith('INV-002');
    expect(mockSetSyncing).toHaveBeenCalledWith(true);
    expect(mockSetSyncing).toHaveBeenCalledWith(false);
  });

  it('does not sync if offline', async () => {
    Object.defineProperty(navigator, 'onLine', {
      value: false,
      configurable: true,
    });

    await triggerSync();

    expect(db.getUnsyncedInvoices).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
