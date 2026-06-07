import { render, screen } from '@testing-library/react';
import ProcurementSuite from './ProcurementSuite';

describe('ProcurementSuite', () => {
  it('renders the Procurement Suite with PO Tracker, Receipt Entry, and Stock Initialization sections', () => {
    render(<ProcurementSuite />);
    
    // Check for sub-navigation items
    expect(screen.getByText(/PO Tracker/i)).toBeInTheDocument();
    expect(screen.getByText(/Receipt Entry/i)).toBeInTheDocument();
    expect(screen.getByText(/Stock Initialization/i)).toBeInTheDocument();
    expect(screen.getByText(/Procurement Intelligence/i)).toBeInTheDocument();
    
    // Check that it defaults to PO Tracker view
    expect(screen.getByText(/Purchase Order Tracker/i)).toBeInTheDocument();
  });
});
