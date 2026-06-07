import { render, screen } from '@testing-library/react';
import ProcurementAnalyticsHub from './ProcurementAnalyticsHub';

describe('ProcurementAnalyticsHub', () => {
  it('renders the Procurement Analytics Hub with key metrics', () => {
    render(<ProcurementAnalyticsHub />);
    
    // Check for main heading
    expect(screen.getByRole('heading', { name: /Procurement Analytics Hub/i })).toBeInTheDocument();
    
    // Check for specific metrics/sections
    expect(screen.getAllByText(/Budget Utilization/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Compliance Health/i).length).toBeGreaterThan(0);
    
    // Check for high-level metrics
    expect(screen.getByText('78%')).toBeInTheDocument();
    expect(screen.getByText('92%')).toBeInTheDocument();
  });
});