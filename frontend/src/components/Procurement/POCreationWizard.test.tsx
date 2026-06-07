import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import POCreationWizard from './POCreationWizard';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';

// Mock DB helpers
vi.mock('../../lib/db', () => ({
  getBudget: vi.fn(),
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
    // Mock budget: 1000 total, 800 spent. Remaining: 200.
    (getBudget as any).mockResolvedValue({
      id: 'T1-2026-06',
      branch_id: 'T1',
      month: '2026-06',
      allocated: 1000,
      spent: 800
    });

    render(<POCreationWizard onSave={vi.fn()} onCancel={vi.fn()} />);

    // Fill out form
    fireEvent.change(screen.getByPlaceholderText(/Supplier Name/i), { target: { value: 'Test Supplier' } });
    fireEvent.change(screen.getByPlaceholderText(/Amount/i), { target: { value: '500' } });

    // Click "Submit"
    fireEvent.click(screen.getByText(/Create PO/i));

    // Wait for validation
    await waitFor(() => {
      expect(screen.getByText(/Budget Violation Detected/i)).toBeInTheDocument();
    });

    expect(screen.getByPlaceholderText(/Reason for violation/i)).toBeInTheDocument();
  });

  it('saves PO with violation reason if budget exceeded', async () => {
    (getBudget as any).mockResolvedValue({
      allocated: 1000,
      spent: 800
    });

    const onSave = vi.fn();
    render(<POCreationWizard onSave={onSave} onCancel={vi.fn()} />);

    fireEvent.change(screen.getByPlaceholderText(/Supplier Name/i), { target: { value: 'Test Supplier' } });
    fireEvent.change(screen.getByPlaceholderText(/Amount/i), { target: { value: '500' } });
    fireEvent.click(screen.getByText(/Create PO/i));

    await waitFor(() => {
      expect(screen.getByText(/Budget Violation Detected/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/Reason for violation/i), { target: { value: 'Urgent restock' } });
    fireEvent.click(screen.getByText(/Confirm & Save/i));

    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({
      supplier: 'Test Supplier',
      amount: 500,
      budgetViolation: true,
      violationReason: 'Urgent restock'
    }));
  });
});
