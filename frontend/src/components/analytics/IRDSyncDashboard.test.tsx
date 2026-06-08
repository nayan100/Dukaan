import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import IRDSyncDashboard from './IRDSyncDashboard';

// Mock global fetch
const fetchMock = vi.fn();
vi.stubGlobal('fetch', fetchMock);

vi.mock('../../lib/db', () => ({
  getAllInvoices: vi.fn().mockResolvedValue([]),
  getUnsyncedInvoices: vi.fn(),
}));

vi.mock('../../store/syncStore', () => ({
  useSyncStore: (selector: any) => selector({
    unsyncedCount: 1,
    isSyncing: false,
  }),
}));

// Mock Annex13Preview to avoid deep dependencies
vi.mock('./Annex13Preview', () => ({
  default: () => <div data-testid="annex13-preview">Annex 13 Preview</div>,
}));

describe('IRDSyncDashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders sync counts from backend and local storage', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        message: {
          synced: 150,
          pending: 5,
          failed: 2
        }
      }),
    });
    
    render(<IRDSyncDashboard />);

    await waitFor(() => {
      expect(screen.getByText('150')).toBeDefined();
      expect(screen.getByText('5')).toBeDefined();
      expect(screen.getByText('2')).toBeDefined();
      expect(screen.getByText('1')).toBeDefined(); // Local count from store
    });

    expect(screen.getByText(/Synced/i)).toBeDefined();
    expect(screen.getByText(/Local Offline/i)).toBeDefined();
    expect(screen.getByText(/Pending/i)).toBeDefined();
    expect(screen.getByText(/Failed/i)).toBeDefined();
  });

  it('calls force sync API when button clicked', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ message: "Success" }),
    });

    render(<IRDSyncDashboard />);
    
    const forceSyncBtn = screen.getByText(/Force Sync/i);
    forceSyncBtn.click();

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/method/dukaan.compliance.retry_failed_ird_syncs',
      expect.objectContaining({ method: 'POST' })
    );
  });
});
