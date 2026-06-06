import { render, screen } from '@testing-library/react';
import ProcurementSuite from './ProcurementSuite';

describe('ProcurementSuite', () => {
  it('renders the Procurement Suite with PO Tracker, Receipt Entry, and Supplier Portal sections', () => {
    render(<ProcurementSuite />);
    
    // Check for a main heading
    expect(screen.getByRole('heading', { name: /Procurement Management Suite/i })).toBeInTheDocument();
    
    // Check for key sections/components
    expect(screen.getByText(/PO Tracker/i)).toBeInTheDocument();
    expect(screen.getByText(/Receipt Entry/i)).toBeInTheDocument();
    expect(screen.getByText(/Supplier Portal/i)).toBeInTheDocument();
  });
});
