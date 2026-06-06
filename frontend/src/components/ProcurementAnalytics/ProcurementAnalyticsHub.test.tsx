import { render, screen } from '@testing-library/react';
import ProcurementAnalyticsHub from './ProcurementAnalyticsHub';

describe('ProcurementAnalyticsHub', () => {
  it('renders the Procurement Analytics Hub with key metrics', () => {
    render(<ProcurementAnalyticsHub />);
    
    // Check for main heading
    expect(screen.getByRole('heading', { name: /Procurement Analytics Hub/i })).toBeInTheDocument();
    
    // Check for specific metrics/sections
    expect(screen.getByText(/Budget Utilization:/i)).toBeInTheDocument();
    expect(screen.getByText(/Supplier Reliability:/i)).toBeInTheDocument();
    
    // Assuming some placeholder for chart or data display
    expect(screen.getByTestId('budget-chart-placeholder')).toBeInTheDocument();
    expect(screen.getByTestId('supplier-reliability-chart-placeholder')).toBeInTheDocument();
  });
});