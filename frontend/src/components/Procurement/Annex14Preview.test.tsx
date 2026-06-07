import { render, screen } from '@testing-library/react';
import Annex14Preview from './Annex14Preview';
import { describe, it, expect } from 'vitest';
import React from 'react';

const mockData = [
  {
    date: '2026-06-08',
    invoice_no: 'INV-001',
    supplier_name: 'Nepal Trading',
    supplier_pan: '123456789',
    taxable_amount: 1000,
    vat_amount: 130,
    total_amount: 1130.01 // Slight rounding error
  },
  {
    date: '2026-06-08',
    invoice_no: 'INV-002',
    supplier_name: 'Global Imports',
    supplier_pan: '987654321',
    taxable_amount: 2000,
    vat_amount: 260,
    total_amount: 2260 // Correct
  }
];

describe('Annex 14 Preview', () => {
  it('renders correctly', () => {
    render(<Annex14Preview entries={mockData} />);
    expect(screen.getByText(/Annex 14: Purchase Register/i)).toBeInTheDocument();
  });

  it('detects and flags rounding errors', () => {
    render(<Annex14Preview entries={mockData} />);
    
    // INV-001 should have a rounding error flag
    const inv1Row = screen.getByText('INV-001').closest('tr');
    expect(inv1Row).toHaveTextContent(/Rounding Error/i);
    
    // INV-002 should NOT have it
    const inv2Row = screen.getByText('INV-002').closest('tr');
    expect(inv2Row).not.toHaveTextContent(/Rounding Error/i);
  });
});
