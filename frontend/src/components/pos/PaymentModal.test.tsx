import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PaymentModal from './PaymentModal';

describe('PaymentModal Component', () => {
  it('validates that total payments match the order total', () => {
    const onComplete = vi.fn();
    render(<PaymentModal total={1000} onComplete={onComplete} onClose={vi.fn()} />);
    
    // Inputs use "0.00" as placeholder now
    const inputs = screen.getAllByPlaceholderText('0.00');
    fireEvent.change(inputs[0], { target: { value: '500' } }); // Cash
    fireEvent.change(inputs[1], { target: { value: '500' } }); // Digital
    
    const finishButton = screen.getByText('Finalize Transaction');
    fireEvent.click(finishButton);
    
    expect(onComplete).toHaveBeenCalled();
  });

  it('prevents completion if payments are insufficient', () => {
    const onComplete = vi.fn();
    window.alert = vi.fn();
    render(<PaymentModal total={1000} onComplete={onComplete} onClose={vi.fn()} />);
    
    const inputs = screen.getAllByPlaceholderText('0.00');
    fireEvent.change(inputs[0], { target: { value: '400' } });
    
    const finishButton = screen.getByText('Finalize Transaction');
    expect(finishButton).toBeDisabled();
    
    // Manual call to handleComplete logic test
    fireEvent.click(finishButton);
    expect(onComplete).not.toHaveBeenCalled();
  });
});
