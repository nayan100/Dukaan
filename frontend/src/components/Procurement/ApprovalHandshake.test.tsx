import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ApprovalHandshake from './ApprovalHandshake';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';

describe('ApprovalHandshake', () => {
  it('renders correctly', () => {
    render(<ApprovalHandshake poId="PO-002" onApprove={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByText(/Manager Approval Required/i)).toBeInTheDocument();
    expect(screen.getByText('PO-002')).toBeInTheDocument();
  });

  it('validates PIN correctly', async () => {
    const onApprove = vi.fn();
    render(<ApprovalHandshake poId="PO-002" onApprove={onApprove} onCancel={vi.fn()} />);

    // Enter correct PIN (let's assume 1234 for test)
    fireEvent.click(screen.getByText('1'));
    fireEvent.click(screen.getByText('2'));
    fireEvent.click(screen.getByText('3'));
    fireEvent.click(screen.getByText('4'));

    await waitFor(() => {
      expect(onApprove).toHaveBeenCalled();
    }, { timeout: 2000 });
  });

  it('shows error on wrong PIN', async () => {
    render(<ApprovalHandshake poId="PO-002" onApprove={vi.fn()} onCancel={vi.fn()} />);

    // Enter wrong PIN
    fireEvent.click(screen.getByText('1'));
    fireEvent.click(screen.getByText('1'));
    fireEvent.click(screen.getByText('1'));
    fireEvent.click(screen.getByText('1'));

    await waitFor(() => {
      expect(screen.getByText(/Invalid Manager PIN/i)).toBeInTheDocument();
    });
  });
});
