import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProcurementSuite from '../components/ProcurementSuite/ProcurementSuite';
import { AuthProvider } from '../context/AuthContext';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';

// Mock DB
vi.mock('../lib/db', () => ({
  initDB: vi.fn(),
  getBudget: vi.fn(),
  getSupplier: vi.fn(),
  logAction: vi.fn(),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    header: ({ children, ...props }: any) => <header {...props}>{children}</header>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

import { getBudget, getSupplier } from '../lib/db';

describe('Procurement E2E Dirty Data Stress Test', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // Mock user login
    sessionStorage.setItem('dukaan_auth', JSON.stringify({ 
        username: 'testuser', 
        role: 'Admin', 
        tenant: 'T1' 
    }));
  });

  it('handles invalid PAN entry in receipt generator', async () => {
    (getSupplier as any).mockResolvedValue({
      id: 'Dirty Supplier',
      name: 'Dirty Supplier',
      tax_id: 'ABC-123' // Invalid!
    });

    render(
      <AuthProvider>
        <ProcurementSuite />
      </AuthProvider>
    );

    // Go to Receipts
    fireEvent.click(screen.getByText(/Receipt Entry/i));

    // Wait for view switch
    await waitFor(() => {
      expect(screen.getByText(/Compliance-First Receipts/i)).toBeInTheDocument();
    });

    // Try to generate
    fireEvent.click(screen.getByText(/Verify Compliance & Generate/i));

    await waitFor(() => {
      expect(screen.getByText(/Compliance Error: Invalid Supplier PAN\/VAT/i)).toBeInTheDocument();
    });
  });

  it('blocks PO creation until violation reason is provided', async () => {
     (getBudget as any).mockResolvedValue({
      allocated: 1000,
      spent: 900
    });

    render(
      <AuthProvider>
        <ProcurementSuite />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText(/New Purchase Order/i));
    
    // Add item first to enable button
    fireEvent.click(screen.getByText(/Add Item/i));
    
    fireEvent.change(screen.getByPlaceholderText(/Select or Enter Supplier/i), { target: { value: 'Test' } });
    
    fireEvent.click(screen.getByText(/Create PO/i));

    await waitFor(() => {
      expect(screen.getByText(/Budget Violation/i)).toBeInTheDocument();
    });

    // Try to save without reason (button should be disabled)
    const saveBtn = screen.getByText(/Override & Save/i);
    expect(saveBtn).toBeDisabled();

    // Add reason
    fireEvent.change(screen.getByPlaceholderText(/Justification for budget override/i), { target: { value: 'Override' } });
    expect(saveBtn).toBeEnabled();
  });
});
