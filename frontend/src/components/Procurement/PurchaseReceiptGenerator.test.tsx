import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PurchaseReceiptGenerator from './PurchaseReceiptGenerator';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';

// Mock DB
vi.mock('../../lib/db', () => ({
  getSupplier: vi.fn(),
}));

import { getSupplier } from '../../lib/db';

const mockPO = {
  id: 'PO-001',
  supplier: 'Nepal Trading',
  amount: 5000,
  items: [
    { id: '1', name: 'Wai Wai', qty: 100, price: 50 }
  ]
};

describe('PurchaseReceiptGenerator', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders correctly', () => {
    render(<PurchaseReceiptGenerator po={mockPO} onGenerate={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByText(/Generate Purchase Receipt/i)).toBeInTheDocument();
  });

  it('shows error if supplier PAN is missing/invalid', async () => {
    // Mock supplier with missing tax_id
    (getSupplier as any).mockResolvedValue({
      id: 'Nepal Trading',
      name: 'Nepal Trading',
      tax_id: ''
    });

    render(<PurchaseReceiptGenerator po={mockPO} onGenerate={vi.fn()} onCancel={vi.fn()} />);

    fireEvent.click(screen.getByText(/Verify Compliance & Generate/i));

    await waitFor(() => {
      expect(screen.getByText(/Compliance Error: Missing Supplier PAN/i)).toBeInTheDocument();
    });
  });

  it('allows generation if supplier is compliant', async () => {
    (getSupplier as any).mockResolvedValue({
      id: 'Nepal Trading',
      name: 'Nepal Trading',
      tax_id: '123456789'
    });

    const onGenerate = vi.fn();
    render(<PurchaseReceiptGenerator po={mockPO} onGenerate={onGenerate} onCancel={vi.fn()} />);

    fireEvent.click(screen.getByText(/Verify Compliance & Generate/i));

    await waitFor(() => {
      expect(onGenerate).toHaveBeenCalled();
    }, { timeout: 3000 });
  });
});
