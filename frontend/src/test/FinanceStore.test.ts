import { describe, it, expect, beforeEach } from 'vitest';
import { useFinanceStore } from '../store/financeStore';

describe('useFinanceStore', () => {
  beforeEach(() => {
    // Reset store before each test if possible, or just clear flags
    useFinanceStore.getState().clearFlags();
  });

  it('allows flagging an audit entry', () => {
    const entryId = 'INV-123';
    useFinanceStore.getState().toggleFlag(entryId, 'suspicious_price');
    
    expect(useFinanceStore.getState().flags[entryId]).toContain('suspicious_price');
  });

  it('allows unflagging an audit entry', () => {
    const entryId = 'INV-456';
    useFinanceStore.getState().toggleFlag(entryId, 'rounding_error');
    useFinanceStore.getState().toggleFlag(entryId, 'rounding_error'); // Toggle off
    
    expect(useFinanceStore.getState().flags[entryId]).not.toContain('rounding_error');
  });
});
