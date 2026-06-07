import { render, screen } from '@testing-library/react';
import POListView from './POListView';
import { describe, it, expect } from 'vitest';
import React from 'react';

const mockPOs = [
  {
    id: 'PO-001',
    supplier: 'Nepal Trading',
    amount: 5000,
    status: 'Draft',
    budgetViolation: false,
    date: '2026-06-08'
  },
  {
    id: 'PO-002',
    supplier: 'Global Imports',
    amount: 15000,
    status: 'Pending Approval',
    budgetViolation: true,
    date: '2026-06-07'
  }
];

describe('POListView', () => {
  it('renders a list of purchase orders', () => {
    render(<POListView pos={mockPOs} />);
    
    expect(screen.getByText('PO-001')).toBeInTheDocument();
    expect(screen.getByText('Nepal Trading')).toBeInTheDocument();
    expect(screen.getByText('PO-002')).toBeInTheDocument();
    expect(screen.getByText('Global Imports')).toBeInTheDocument();
  });

  it('displays "Budget Violation" badge when applicable', () => {
    render(<POListView pos={mockPOs} />);
    
    expect(screen.getByText(/Budget Violation/i)).toBeInTheDocument();
    // PO-001 should NOT have it
    const po1Card = screen.getByText('PO-001').closest('div');
    expect(po1Card).not.toHaveTextContent(/Budget Violation/i);
  });

  it('shows status badges with correct text', () => {
    render(<POListView pos={mockPOs} />);
    
    expect(screen.getByText('Draft')).toBeInTheDocument();
    expect(screen.getByText('Pending Approval')).toBeInTheDocument();
  });
});
