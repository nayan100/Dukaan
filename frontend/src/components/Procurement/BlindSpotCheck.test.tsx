import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BlindSpotCheck from './BlindSpotCheck';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';

const mockItems = [
  { item_id: '1', name: 'Wai Wai Noodles', expected_qty: 50 },
  { item_id: '2', name: 'Real Juice 1L', expected_qty: 10 }
];

describe('BlindSpotCheck', () => {
  it('renders correctly', () => {
    render(<BlindSpotCheck items={mockItems} onVerified={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByText(/Blind Spot-Check/i)).toBeInTheDocument();
    expect(screen.getByText('Wai Wai Noodles')).toBeInTheDocument();
  });

  it('allows matching verification', async () => {
    const onVerified = vi.fn();
    render(<BlindSpotCheck items={mockItems} onVerified={onVerified} onCancel={vi.fn()} />);
    
    const inputs = screen.getAllByPlaceholderText('0');
    fireEvent.change(inputs[0], { target: { value: '50' } });
    fireEvent.change(inputs[1], { target: { value: '10' } });
    
    fireEvent.click(screen.getByText(/Complete Verification/i));
    
    expect(onVerified).toHaveBeenCalledWith(expect.objectContaining({
      isMatch: true
    }));
  });

  it('triggers lockdown on mismatch', async () => {
    render(<BlindSpotCheck items={mockItems} onVerified={vi.fn()} onCancel={vi.fn()} />);
    
    const inputs = screen.getAllByPlaceholderText('0');
    fireEvent.change(inputs[0], { target: { value: '45' } }); // Mismatch!
    fireEvent.change(inputs[1], { target: { value: '10' } });
    
    fireEvent.click(screen.getByText(/Complete Verification/i));
    
    expect(screen.getByText(/Mismatched Quantity Detected/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Correction Note/i)).toBeInTheDocument();
  });
});
