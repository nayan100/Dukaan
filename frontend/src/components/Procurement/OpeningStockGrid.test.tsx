import { render, screen, fireEvent } from '@testing-library/react';
import OpeningStockGrid from './OpeningStockGrid';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';

const mockItems = [
  { id: '1', name: 'Wai Wai Noodles', current_stock: 10 },
  { id: '2', name: 'Real Juice 1L', current_stock: 5 }
];

describe('OpeningStockGrid', () => {
  it('renders correctly', () => {
    render(<OpeningStockGrid items={mockItems} onSave={vi.fn()} />);
    expect(screen.getByText('Wai Wai Noodles')).toBeInTheDocument();
    expect(screen.getByText('Real Juice 1L')).toBeInTheDocument();
  });

  it('allows entering opening stock', () => {
    const onSave = vi.fn();
    render(<OpeningStockGrid items={mockItems} onSave={onSave} />);
    
    const inputs = screen.getAllByPlaceholderText('0');
    fireEvent.change(inputs[0], { target: { value: '50' } });
    
    fireEvent.click(screen.getByText(/Save Stock/i));
    
    expect(onSave).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({ item_id: '1', opening_stock: 50 })
    ]));
  });

  it('calculates total value correctly', () => {
    const itemsWithPrice = [
      { id: '1', name: 'Item A', current_stock: 0, price: 100 },
      { id: '2', name: 'Item B', current_stock: 0, price: 200 }
    ];
    render(<OpeningStockGrid items={itemsWithPrice} onSave={vi.fn()} />);
    
    const inputs = screen.getAllByPlaceholderText('0');
    fireEvent.change(inputs[0], { target: { value: '10' } }); // 10 * 100 = 1000
    fireEvent.change(inputs[1], { target: { value: '5' } });  // 5 * 200 = 1000
    
    expect(screen.getByText(/Total Valuation/i)).toBeInTheDocument();
    expect(screen.getByText(/2,000/)).toBeInTheDocument();
  });
});
