import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PaymentModal from './PaymentModal';

describe('PaymentModal Component', () => {
  it('validates that total payments match the order total', () => {
    const onComplete = vi.fn();
    render(<PaymentModal total={1000} onComplete={onComplete} onClose={vi.fn()} />);
    
    // Add 500 cash
    const cashInput = screen.getByPlaceholderText('Cash Amount');
    fireEvent.change(cashInput, { target: { value: '500' } });
    
    // Add 500 QR
    const qrInput = screen.getByPlaceholderText('Digital Amount');
    fireEvent.change(qrInput, { target: { value: '500' } });
    
    const finishButton = screen.getByText('Complete Sale');
    fireEvent.click(finishButton);
    
    expect(onComplete).toHaveBeenCalled();
  });

  it('prevents completion if payments are insufficient', () => {
    const onComplete = vi.fn();
    window.alert = vi.fn();
    render(<PaymentModal total={1000} onComplete={onComplete} onClose={vi.fn()} />);
    
    fireEvent.change(screen.getByPlaceholderText('Cash Amount'), { target: { value: '400' } });
    
    fireEvent.click(screen.getByText('Complete Sale'));
    
    expect(onComplete).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Insufficient payment'));
  });
});
