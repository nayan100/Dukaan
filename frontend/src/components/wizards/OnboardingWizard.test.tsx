import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import OnboardingWizard from './OnboardingWizard';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('OnboardingWizard Component', () => {
  it('renders the first step correctly', () => {
    render(<OnboardingWizard />);
    expect(screen.getByText('Growth Protocol')).toBeInTheDocument();
    expect(screen.getByText('Entity Scan')).toBeInTheDocument();
  });

  it('progresses to the next step when button is clicked', () => {
    render(<OnboardingWizard />);
    const nextButton = screen.getByText('Proceed to Next Step');
    fireEvent.click(nextButton);
    
    expect(screen.getByText('Chain Topology')).toBeInTheDocument();
  });

  it('shows completion state after all steps', () => {
    render(<OnboardingWizard />);
    
    // Complete 4 steps
    fireEvent.click(screen.getByText('Proceed to Next Step')); // To 2
    fireEvent.click(screen.getByText('Proceed to Next Step')); // To 3
    fireEvent.click(screen.getByText('Proceed to Next Step')); // To 4
    fireEvent.click(screen.getByText('Finalize Activation')); // Complete
    
    expect(screen.getByText('Sovereign Chain Active')).toBeInTheDocument();
  });
});
