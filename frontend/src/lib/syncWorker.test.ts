import { describe, it, expect, vi, beforeEach } from 'vitest';
import { startSyncWorker, triggerSync } from './syncWorker';
import * as db from './db';

vi.mock('./db', () => ({
  getUnsyncedInvoices: vi.fn(),
  markInvoiceSynced: vi.fn(),
}));

// Mock global fetch
global.fetch = vi.fn();

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
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ status: 'Success' }),
    });

    await triggerSync();

    expect(db.getUnsyncedInvoices).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(db.markInvoiceSynced).toHaveBeenCalledWith('INV-001');
    expect(db.markInvoiceSynced).toHaveBeenCalledWith('INV-002');
  });

  it('does not sync if offline', async () => {
    Object.defineProperty(navigator, 'onLine', {
      value: false,
      configurable: true,
    });

    await triggerSync();

    expect(db.getUnsyncedInvoices).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
