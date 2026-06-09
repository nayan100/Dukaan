import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FinanceAuditHUD from './FinanceAuditHUD';
import React from 'react';

// Mock recharts
vi.mock('recharts', async () => {
  const OriginalModule = await vi.importActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
    RadarChart: ({ children }: any) => <div>{children}</div>,
    PolarGrid: () => null,
    PolarAngleAxis: () => null,
    Radar: () => null,
  };
});

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: new Proxy({}, {
    get: () => ({ children, ...props }: any) => <div {...props}>{children}</div>
  }),
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('FinanceAuditHUD Component', () => {
  it('renders the audit hub and variance reports', () => {
    render(<FinanceAuditHUD />);
    
    expect(screen.getByText('Accountant Audit Hub')).toBeInTheDocument();
    expect(screen.getByText('Price Variance Report')).toBeInTheDocument();
    expect(screen.getByText('Discount Velocity')).toBeInTheDocument();
    expect(screen.getByText('Real Juice 1L')).toBeInTheDocument();
  });

  it('allows flagging a price variance for review', () => {
    render(<FinanceAuditHUD />);
    
    // Find the 'Reconcile' or 'Flag' buttons
    const reconcileButtons = screen.getAllByText(/Reconcile/i);
    fireEvent.click(reconcileButtons[0]);

    // Check if the state changed (visual indicator of flagging)
    expect(screen.getAllByText(/Flagged/i).length).toBeGreaterThan(0);
  });

  it('renders the Financial Health Radar chart', () => {
    render(<FinanceAuditHUD />);
    expect(screen.getByText(/Financial Health Radar/i)).toBeInTheDocument();
  });
});
