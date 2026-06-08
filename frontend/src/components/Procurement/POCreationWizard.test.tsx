import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import POCreationWizard from './POCreationWizard';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';

// Mock DB helpers
vi.mock('../../lib/db', () => ({
  getBudget: vi.fn(),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

import { getBudget } from '../../lib/db';

describe('POCreationWizard', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders correctly', () => {
    render(<POCreationWizard onSave={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByText(/Create Purchase Order/i)).toBeInTheDocument();
  });

  it('shows violation reason modal when budget is exceeded', async () => {
    (getBudget as any).mockResolvedValue({
      id: 'T1-2026-06',
      branch_id: 'T1',
      month: '2026-06',
      allocated: 1000,
      spent: 800
    });

    render(<POCreationWizard onSave={vi.fn()} onCancel={vi.fn()} />);

    // Add an item first
    fireEvent.click(screen.getByText(/Add Item/i));

    // Fill out supplier
    const supplierInput = screen.getByPlaceholderText(/Select or Enter Supplier/i);
    fireEvent.change(supplierInput, { target: { value: 'Test Supplier' } });
    
    // Wait for button to be enabled
    const submitButton = screen.getByRole('button', { name: /Create PO/i });
    await waitFor(() => expect(submitButton).not.toBeDisabled());

    // Click "Submit"
    fireEvent.click(submitButton);

    // Wait for validation and modal
    await waitFor(() => {
      expect(screen.getByText(/Budget Violation/i)).toBeInTheDocument();
    }, { timeout: 3000 });

    expect(screen.getByPlaceholderText(/Justification for budget override/i)).toBeInTheDocument();
  });

  it('saves PO with violation reason if budget exceeded', async () => {
    (getBudget as any).mockResolvedValue({
      allocated: 1000,
      spent: 800
    });

    const onSave = vi.fn();
    render(<POCreationWizard onSave={onSave} onCancel={vi.fn()} />);

    fireEvent.click(screen.getByText(/Add Item/i));
    fireEvent.change(screen.getByPlaceholderText(/Select or Enter Supplier/i), { target: { value: 'Test Supplier' } });
    
    const submitButton = screen.getByRole('button', { name: /Create PO/i });
    await waitFor(() => expect(submitButton).not.toBeDisabled());
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Budget Violation/i)).toBeInTheDocument();
    }, { timeout: 3000 });

    fireEvent.change(screen.getByPlaceholderText(/Justification for budget override/i), { target: { value: 'Urgent restock' } });
    fireEvent.click(screen.getByText(/Override & Save/i));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(expect.objectContaining({
        supplier: 'Test Supplier',
        budgetViolation: true,
        violationReason: 'Urgent restock'
      }));
    });
  });
});
