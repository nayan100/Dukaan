import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TransferUI from './TransferUI';

// Mock useInventoryStore
const mockInventory = [
  { id: '1', name: 'Wai Wai Noodles', price: 20, stock: 100, min_stock: 10, code: 'W1' },
  { id: '2', name: 'Real Juice 1L', price: 250, stock: 50, min_stock: 5, code: 'R2' },
];

vi.mock('../../store/inventoryStore', () => ({
  useInventoryStore: (selector: any) => selector({
    inventory: mockInventory,
  }),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('TransferUI Component', () => {
  it('renders the transfer request interface', () => {
    render(<TransferUI />);
    
    expect(screen.getByText('New Transfer Request')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();
    expect(screen.getByText('Target Branch')).toBeInTheDocument();
  });

  it('adds an item to the transfer list when selected', () => {
    render(<TransferUI />);
    
    const addButton = screen.getByTestId('add-item-1');
    fireEvent.click(addButton);
    
    expect(screen.getByTestId('transfer-item-1')).toBeInTheDocument();
  });

  it('submits the transfer request', async () => {
    const onSubmit = vi.fn();
    render(<TransferUI onSubmit={onSubmit} />);
    
    // Add item
    fireEvent.click(screen.getByTestId('add-item-1'));
    
    // Submit
    fireEvent.click(screen.getByText('Submit Request'));
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

  it('filters items based on search term', () => {
    render(<TransferUI />);
    
    const searchInput = screen.getByPlaceholderText('Search products...');
    fireEvent.change(searchInput, { target: { value: 'Wai Wai' } });
    
    expect(screen.getByText('Wai Wai Noodles')).toBeInTheDocument();
    expect(screen.queryByText('Real Juice 1L')).not.toBeInTheDocument();
  });

  it('removes an item from the transfer list', () => {
    render(<TransferUI />);
    
    // Add item
    fireEvent.click(screen.getByTestId('add-item-1'));
    expect(screen.getByTestId('transfer-item-1')).toBeInTheDocument();
    
    // Remove item
    const removeButton = screen.getByTestId('transfer-item-1').querySelector('button');
    if (removeButton) fireEvent.click(removeButton);
    
    expect(screen.queryByTestId('transfer-item-1')).not.toBeInTheDocument();
  });
});
