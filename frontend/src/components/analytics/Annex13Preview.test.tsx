import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Annex13Preview from './Annex13Preview';
import React from 'react';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: new Proxy({}, {
    get: () => ({ children, ...props }: any) => <div {...props}>{children}</div>
  }),
}));

describe('Annex13Preview', () => {
  const mockEntries: any[] = [
    { invoice_id: 'INV-001', created_at: Date.now(), taxable_amount: 100, vat_amount: 13, total: 113, synced: true },
    { invoice_id: 'INV-002', created_at: Date.now(), taxable_amount: 200, vat_amount: 26, total: 226, synced: false },
  ];

  it('renders Compliance Seals for synced entries', () => {
    render(<Annex13Preview entries={mockEntries} />);
    
    expect(screen.getAllByText(/Compliance Seal/i).length).toBe(1);
    expect(screen.getByText(/Pending/i)).toBeInTheDocument();
  });
});
