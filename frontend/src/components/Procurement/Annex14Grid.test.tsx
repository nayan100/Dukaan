import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Annex14Grid from './Annex14Grid';
import React from 'react';

// Mock TanStack Virtual
vi.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: vi.fn(({ count }: any) => ({
    getVirtualItems: () => Array.from({ length: 10 }, (_, i) => ({
      index: i,
      key: `row-${i}`,
      start: i * 72,
      end: (i + 1) * 72,
      size: 72,
    })),
    getTotalSize: () => count * 72,
  })),
}));

describe('Annex14Grid', () => {
  it('renders the Annex 14 table with correct headers', () => {
    render(<Annex14Grid />);
    
    expect(screen.getByText(/Date/i)).toBeInTheDocument();
    expect(screen.getByText(/Invoice #/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Supplier/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Taxable/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/VAT/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Total/i).length).toBeGreaterThan(0);
  });

  it('displays error indicator for rows with math discrepancies', () => {
    render(<Annex14Grid />);
    // Our mock data has rows with discrepancies marked as 'flagged'
    expect(screen.getAllByText(/Error/i).length).toBeGreaterThan(0);
  });
});
