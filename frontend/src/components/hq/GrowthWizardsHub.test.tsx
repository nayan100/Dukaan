import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import GrowthWizardsHub from './GrowthWizardsHub';
import { useHQStore } from '../../store/useHQStore';
import React from 'react';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('GrowthWizardsHub', () => {
  it('renders the wizard hub and launches wizards', () => {
    render(<GrowthWizardsHub />);
    
    expect(screen.getByText('Growth Hub')).toBeInTheDocument();
    expect(screen.getByText('New Branch Protocol')).toBeInTheDocument();

    fireEvent.click(screen.getByText('New Branch Protocol'));
    expect(screen.getByText(/Step 1 of 3/i)).toBeInTheDocument();
  });
});
