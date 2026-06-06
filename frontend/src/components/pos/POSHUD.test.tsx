import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import POSHUD from './POSHUD';

// Mock DB
vi.mock('../../lib/db', () => ({
  saveInvoiceOffline: vi.fn().mockResolvedValue(undefined),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

const mockItems = [
  { id: '1', name: 'Apple', price: 100 },
  { id: '2', name: 'Banana', price: 50 },
];

describe('POSHUD Component', () => {
  it('adds an item to the cart when clicked', () => {
    render(<POSHUD availableItems={mockItems} />);
    const appleButton = screen.getByText('Apple');
    fireEvent.click(appleButton);
    
    const cartItem = screen.getByTestId('cart-item-1');
    expect(cartItem).toBeInTheDocument();
    expect(screen.getByTestId('cart-total')).toHaveTextContent('100');
  });

  it('increments quantity when the same item is clicked again', () => {
    render(<POSHUD availableItems={mockItems} />);
    const appleButton = screen.getByText('Apple');
    fireEvent.click(appleButton);
    fireEvent.click(appleButton);
    
    const quantity = screen.getByTestId('cart-item-1-qty');
    expect(quantity).toHaveTextContent('2');
    expect(screen.getByTestId('cart-total')).toHaveTextContent('200');
  });

  it('calculates the total correctly for multiple items', () => {
    render(<POSHUD availableItems={mockItems} />);
    fireEvent.click(screen.getByText('Apple'));
    fireEvent.click(screen.getByText('Banana'));
    
    expect(screen.getByTestId('cart-total')).toHaveTextContent('150');
  });

  it('allows voiding an item within the 60s window', () => {
    const now = Date.now();
    const dateSpy = vi.spyOn(Date, 'now').mockReturnValue(now);
    
    render(<POSHUD availableItems={mockItems} />);
    fireEvent.click(screen.getByText('Apple'));
    
    expect(screen.getByTestId('cart-item-1')).toBeInTheDocument();
    
    // Still within 60s
    dateSpy.mockReturnValue(now + 30000); 
    fireEvent.click(screen.getByTestId('void-item-1'));
    
    expect(screen.queryByTestId('cart-item-1')).not.toBeInTheDocument();
    expect(screen.getByTestId('cart-total')).toHaveTextContent('0');
    
    dateSpy.mockRestore();
  });

  it('opens the payment modal when checkout is clicked', () => {
    render(<POSHUD availableItems={mockItems} />);
    fireEvent.click(screen.getByText('Apple'));
    fireEvent.click(screen.getByText('Checkout'));
    
    expect(screen.getByText('Complete Payment')).toBeInTheDocument();
  });

  it('completes the sale and clears the cart', async () => {
    render(<POSHUD availableItems={mockItems} />);
    
    // Add item
    fireEvent.click(screen.getByText('Apple'));
    
    // Open payment modal
    fireEvent.click(screen.getByText('Checkout'));
    
    // Enter payment
    const inputs = screen.getAllByPlaceholderText('0.00');
    fireEvent.change(inputs[0], { target: { value: '100' } });
    
    // Complete sale
    fireEvent.click(screen.getByText('Finalize Transaction'));
    
    await waitFor(() => {
      expect(screen.getByTestId('cart-total')).toHaveTextContent('0');
    });
  });

  it('filters items based on search term', () => {
    render(<POSHUD availableItems={mockItems} />);
    
    const searchInput = screen.getByPlaceholderText('Search products... (F1)');
    fireEvent.change(searchInput, { target: { value: 'Apple' } });
    
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.queryByText('Banana')).not.toBeInTheDocument();
  });
});
