import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BudgetWidget from './BudgetWidget';
import React from 'react';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('BudgetWidget Component', () => {
  it('renders correctly and calculates percentage', () => {
    render(<BudgetWidget limit={10000} spent={5000} branchName="Branch A" />);
    
    expect(screen.getByText('50.0%')).toBeInTheDocument();
    expect(screen.getByText('Remaining NPR 5,000')).toBeInTheDocument();
    expect(screen.getByText('Branch A Scoped')).toBeInTheDocument();
  });

  it('shows critical threshold when over 90%', () => {
    render(<BudgetWidget limit={10000} spent={9500} branchName="Branch A" />);
    
    expect(screen.getByText('Critical Threshold')).toBeInTheDocument();
    expect(screen.getByText('95.0%')).toBeInTheDocument();
  });
});
