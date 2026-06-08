import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ApprovalCenter from './ApprovalCenter';
import { useHQStore } from '../../store/useHQStore';
import React from 'react';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('ApprovalCenter', () => {
  beforeEach(() => {
    useHQStore.setState({ approvalQueue: [] });
  });

  it('renders the approval list with mock items', () => {
    render(<ApprovalCenter />);
    
    expect(screen.getByText('Global Approval Center')).toBeInTheDocument();
    expect(screen.getByText('Inventory Rebalance: KTM to Pokhara')).toBeInTheDocument();
  });

  it('removes an item when approved or rejected', () => {
    render(<ApprovalCenter />);
    
    // There should be 3 items initially (MOCK_APPROVALS)
    expect(screen.getAllByText(/Requested by/i).length).toBe(3);

    const approveButtons = screen.getAllByText('Approve');
    fireEvent.click(approveButtons[0]);
    
    expect(screen.getAllByText(/Requested by/i).length).toBe(2);
  });
});
