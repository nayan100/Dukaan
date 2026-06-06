import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import IRDSyncDashboard from './IRDSyncDashboard';
import React from 'react';

// Mock global fetch
global.fetch = vi.fn();

describe('IRDSyncDashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders sync counts from backend', async () => {
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

    render(<IRDSyncDashboard />);

    await waitFor(() => {
      expect(screen.getByText('150')).toBeDefined();
      expect(screen.getByText('5')).toBeDefined();
      expect(screen.getByText('2')).toBeDefined();
    });

    expect(screen.getByText(/Synced/i)).toBeDefined();
    expect(screen.getByText(/Pending/i)).toBeDefined();
    expect(screen.getByText(/Failed/i)).toBeDefined();
  });
});
