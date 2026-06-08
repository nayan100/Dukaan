import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SyncWarning from './SyncWarning';

// Mock useSyncStore
let mockUnsyncedCount = 0;
const mockSetUnsyncedCount = vi.fn();

vi.mock('../../store/syncStore', () => ({
  useSyncStore: (selector: any) => selector({
    unsyncedCount: mockUnsyncedCount,
    setUnsyncedCount: mockSetUnsyncedCount,
  }),
}));

vi.mock('../../lib/db', () => ({
  getUnsyncedInvoices: vi.fn().mockResolvedValue([]),
}));

describe('SyncWarning Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUnsyncedCount = 0;
  });

  it('renders nothing if no unsynced invoices', async () => {
    mockUnsyncedCount = 0;
    render(<SyncWarning />);
    expect(screen.queryByText(/Unsynced Invoices/i)).toBeNull();
  });

  it('renders warning if there are unsynced invoices', async () => {
    mockUnsyncedCount = 5;
    render(<SyncWarning />);
    
    const warning = await screen.findByText(/Attention: 5 Unsynced Invoices/i);
    expect(warning).toBeDefined();
  });
});
