import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import IRDSyncDashboard from './IRDSyncDashboard';
import React from 'react';

// Mock global fetch
global.fetch = vi.fn();

vi.mock('../../lib/db', () => ({
  getUnsyncedInvoices: vi.fn(),
}));

describe('IRDSyncDashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders sync counts from backend and local storage', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        message: {
          synced: 150,
          pending: 5,
          failed: 2
        }
      }),
    });
    
    // Mock local DB
    const db = await import('../../lib/db');
    (db.getUnsyncedInvoices as any).mockResolvedValue([{ invoice_id: 'local-1' }]);

    render(<IRDSyncDashboard />);

    await waitFor(() => {
      expect(screen.getByText('150')).toBeDefined();
      expect(screen.getByText('5')).toBeDefined();
      expect(screen.getByText('2')).toBeDefined();
      expect(screen.getByText('1')).toBeDefined(); // Local count
    });

    expect(screen.getByText(/Synced/i)).toBeDefined();
    expect(screen.getByText(/Local Offline/i)).toBeDefined();
    expect(screen.getByText(/Pending/i)).toBeDefined();
    expect(screen.getByText(/Failed/i)).toBeDefined();
  });

  it('calls force sync API when button clicked', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ message: "Success" }),
    });

    render(<IRDSyncDashboard />);
    
    const forceSyncBtn = screen.getByText(/Force Sync/i);
    forceSyncBtn.click();

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/method/dukaan.compliance.retry_failed_ird_syncs',
      expect.objectContaining({ method: 'POST' })
    );
  });
});
