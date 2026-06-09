import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Annex14Grid from './Annex14Grid';
import React from 'react';

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
});
