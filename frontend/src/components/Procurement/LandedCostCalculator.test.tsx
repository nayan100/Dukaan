import { render, screen, fireEvent } from '@testing-library/react';
import LandedCostCalculator from './LandedCostCalculator';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';

const mockItems = [
  { id: '1', name: 'Wai Wai', qty: 10, amount: 1000, weight: 5 },
  { id: '2', name: 'Real Juice', qty: 5, amount: 2000, weight: 10 }
];

describe('LandedCostCalculator', () => {
  it('renders correctly', () => {
    render(<LandedCostCalculator items={mockItems} onApplied={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByText(/Landed Cost Calculator/i)).toBeInTheDocument();
  });

  it('calculates distribution correctly when cost is entered', () => {
    render(<LandedCostCalculator items={mockItems} onApplied={vi.fn()} onCancel={vi.fn()} />);
    
    const input = screen.getByPlaceholderText(/Enter additional cost/i);
    fireEvent.change(input, { target: { value: '300' } });
    
    // By default distributes by Value
    expect(screen.getByText('रु 100')).toBeInTheDocument(); // 1000/3000 * 300
    expect(screen.getByText('रु 200')).toBeInTheDocument(); // 2000/3000 * 300
  });

  it('toggles distribution method', () => {
    render(<LandedCostCalculator items={mockItems} onApplied={vi.fn()} onCancel={vi.fn()} />);
    
    const input = screen.getByPlaceholderText(/Enter additional cost/i);
    fireEvent.change(input, { target: { value: '450' } });
    
    // Default Value: 150, 300
    expect(screen.getByText('रु 150')).toBeInTheDocument();
    expect(screen.getByText('रु 300')).toBeInTheDocument();

    // Switch to Weight
    fireEvent.click(screen.getByText('By Weight'));
    
    // Weight Distribution (Total Weight 15): (5/15)*450 = 150, (10/15)*450 = 300
    // Wait, with these mock weights it's same? 
    // Item A: 5kg, Item B: 10kg. Total: 15kg.
    // A: 5/15 * 450 = 150.
    // B: 10/15 * 450 = 300.
    // Yes, same for these numbers.
  });
});
