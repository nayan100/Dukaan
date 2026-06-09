import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DeadStockMap from './DeadStockMap';
import React from 'react';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: new Proxy({}, {
    get: () => ({ children, ...props }: any) => <div {...props}>{children}</div>
  }),
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('DeadStockMap', () => {
  it('renders the Nepal Map and toggles to Revenue Heatmap', async () => {
    render(<DeadStockMap />);
    
    // Default view is stock
    expect(screen.getByText(/Dead Stock Rebalancer/i)).toBeInTheDocument();

    // Toggle to revenue
    const revenueBtn = screen.getByText(/Revenue/i);
    fireEvent.click(revenueBtn);

    await waitFor(() => {
        expect(screen.getByText(/Revenue Distribution Heatmap/i)).toBeInTheDocument();
    });
  });
});
