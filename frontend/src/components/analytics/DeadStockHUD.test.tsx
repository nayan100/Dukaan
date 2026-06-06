import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DeadStockHUD from './DeadStockHUD';
import React from 'react';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('DeadStockHUD Component', () => {
  it('renders the dead stock rebalancer and stagnant items', () => {
    render(<DeadStockHUD />);
    
    expect(screen.getByText('Dead Stock Rebalancer')).toBeInTheDocument();
    expect(screen.getByText('Real Juice 1L')).toBeInTheDocument();
    // Use getAllByText for multiple buttons
    expect(screen.getAllByText('Quick Transfer')[0]).toBeInTheDocument();
  });
});
