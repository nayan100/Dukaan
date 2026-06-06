import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import POSHUD from './POSHUD';

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
    expect(screen.getByTestId('cart-total')).toHaveTextContent('NPR 100');
  });

  it('increments quantity when the same item is clicked again', () => {
    render(<POSHUD availableItems={mockItems} />);
    const appleButton = screen.getByText('Apple');
    fireEvent.click(appleButton);
    fireEvent.click(appleButton);
    
    const quantity = screen.getByTestId('cart-item-1-qty');
    expect(quantity).toHaveTextContent('2');
    expect(screen.getByTestId('cart-total')).toHaveTextContent('NPR 200');
  });

  it('calculates the total correctly for multiple items', () => {
    render(<POSHUD availableItems={mockItems} />);
    fireEvent.click(screen.getByText('Apple'));
    fireEvent.click(screen.getByText('Banana'));
    
    expect(screen.getByTestId('cart-total')).toHaveTextContent('NPR 150');
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
    expect(screen.getByTestId('cart-total')).toHaveTextContent('NPR 0');
    
    dateSpy.mockRestore();
  });

  it('prevents voiding an item after the 60s window', () => {
    const now = Date.now();
    const dateSpy = vi.spyOn(Date, 'now').mockReturnValue(now);
    window.alert = vi.fn(); // Mock alert
    
    render(<POSHUD availableItems={mockItems} />);
    fireEvent.click(screen.getByText('Apple'));
    
    // After 60s
    dateSpy.mockReturnValue(now + 61000); 
    fireEvent.click(screen.getByTestId('void-item-1'));
    
    expect(screen.getByTestId('cart-item-1')).toBeInTheDocument();
    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Manager approval required'));
    
    dateSpy.mockRestore();
  });
});
