import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SyncWarning from './SyncWarning';
import * as db from '../../lib/db';
import React from 'react';

vi.mock('../../lib/db', () => ({
  getUnsyncedInvoices: vi.fn(),
}));

describe('SyncWarning Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing if no unsynced invoices', async () => {
    (db.getUnsyncedInvoices as any).mockResolvedValue([]);
    render(<SyncWarning />);
    expect(screen.queryByText(/Unsynced Invoices/i)).toBeNull();
  });

  it('renders warning if there are unsynced invoices', async () => {
    (db.getUnsyncedInvoices as any).mockResolvedValue([{ invoice_id: '1' }]);
    render(<SyncWarning />);
    
    // Wait for the async effect
    const warning = await screen.findByText(/Unsynced Invoices/i);
    expect(warning).toBeDefined();
  });
});
