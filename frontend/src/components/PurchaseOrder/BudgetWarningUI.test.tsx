import { render, screen } from '@testing-library/react';
import BudgetWarningUI from './BudgetWarningUI';

describe('BudgetWarningUI', () => {
  it('renders a soft warning message when budget is exceeded', () => {
    render(<BudgetWarningUI isBudgetExceeded={true} />);
    
    const warningMessage = screen.getByText(/Warning: Budget exceeded for this Purchase Order./i);
    expect(warningMessage).toBeInTheDocument();
  });

  it('does not render a warning message when budget is not exceeded', () => {
    render(<BudgetWarningUI isBudgetExceeded={false} />);
    
    const warningMessage = screen.queryByText(/Warning: Budget exceeded for this Purchase Order./i);
    expect(warningMessage).not.toBeInTheDocument();
  });
});