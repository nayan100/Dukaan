import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TransferUI from './TransferUI';
import React from 'react';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

const mockItems = [
  { id: '1', name: 'Wai Wai Noodles', price: 20 },
  { id: '2', name: 'Real Juice 1L', price: 250 },
];

describe('TransferUI Component', () => {
  it('renders the transfer request interface', () => {
    render(<TransferUI availableItems={mockItems} />);
    
    expect(screen.getByText('New Transfer Request')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();
    expect(screen.getByText('Target Branch')).toBeInTheDocument();
  });

  it('adds an item to the transfer list when selected', () => {
    render(<TransferUI availableItems={mockItems} />);
    
    const addButton = screen.getByTestId('add-item-1');
    fireEvent.click(addButton);
    
    expect(screen.getByTestId('transfer-item-1')).toBeInTheDocument();
  });

  it('submits the transfer request', () => {
    const onSubmit = vi.fn();
    render(<TransferUI availableItems={mockItems} onSubmit={onSubmit} />);
    
    // Add item
    fireEvent.click(screen.getByTestId('add-item-1'));
    
    // Submit
    fireEvent.click(screen.getByText('Submit Request'));
    
    expect(onSubmit).toHaveBeenCalled();
  });

  it('filters items based on search term', () => {
    render(<TransferUI availableItems={mockItems} />);
    
    const searchInput = screen.getByPlaceholderText('Search products...');
    fireEvent.change(searchInput, { target: { value: 'Wai Wai' } });
    
    expect(screen.getByText('Wai Wai Noodles')).toBeInTheDocument();
    expect(screen.queryByText('Real Juice 1L')).not.toBeInTheDocument();
  });

  it('removes an item from the transfer list', () => {
    render(<TransferUI availableItems={mockItems} />);
    
    // Add item
    fireEvent.click(screen.getByTestId('add-item-1'));
    expect(screen.getByTestId('transfer-item-1')).toBeInTheDocument();
    
    // Remove item - button is only visible on hover in real UI, but in JSDOM we can click it
    // The button has Trash2 icon and variant="danger"
    // Since it's inside the transfer-item-1, we can find it there
    const removeButton = screen.getByTestId('transfer-item-1').querySelector('button');
    if (removeButton) fireEvent.click(removeButton);
    
    expect(screen.queryByTestId('transfer-item-1')).not.toBeInTheDocument();
  });
});
