import { render, screen } from '@testing-library/react';
import App from './App';
import { AuthProvider } from './context/AuthContext';

describe('App', () => {
  it('renders the Procurement Management Suite, Verify Spot Check UI, and Budget Warning UI', () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );
    
    // Check for ProcurementSuite content
    expect(screen.getByRole('heading', { name: /Procurement Management Suite/i })).toBeInTheDocument();
    expect(screen.getByText(/PO Tracker/i)).toBeInTheDocument();
    
    // Check for VerifySpotCheckUI content
    expect(screen.getByRole('button', { name: /Verify Spot Check/i })).toBeInTheDocument();
    
    // Check for BudgetWarningUI content (assume it's rendered with isBudgetExceeded=true for testing presence)
    expect(screen.getByText(/Warning: Budget exceeded for this Purchase Order./i)).toBeInTheDocument();
  });
});