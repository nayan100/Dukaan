import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FinanceAuditHUD from './FinanceAuditHUD';
import React from 'react';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('FinanceAuditHUD Component', () => {
  it('renders the audit hub and variance reports', () => {
    render(<FinanceAuditHUD />);
    
    expect(screen.getByText('Accountant Audit Hub')).toBeInTheDocument();
    expect(screen.getByText('Price Variance Report')).toBeInTheDocument();
    expect(screen.getByText('Discount Velocity')).toBeInTheDocument();
    expect(screen.getByText('Real Juice 1L')).toBeInTheDocument();
  });
});
