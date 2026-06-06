import { render, screen, fireEvent } from '@testing-library/react';
import VerifySpotCheckUI from './VerifySpotCheckUI';

describe('VerifySpotCheckUI', () => {
  it('renders a button to trigger spot check verification', () => {
    render(<VerifySpotCheckUI />);
    
    const verifyButton = screen.getByRole('button', { name: /Verify Spot Check/i });
    expect(verifyButton).toBeInTheDocument();
  });

  it('calls onVerify function when the button is clicked', () => {
    const mockOnVerify = vi.fn();
    render(<VerifySpotCheckUI onVerify={mockOnVerify} />);
    
    const verifyButton = screen.getByRole('button', { name: /Verify Spot Check/i });
    fireEvent.click(verifyButton);
    
    expect(mockOnVerify).toHaveBeenCalledTimes(1);
  });
});