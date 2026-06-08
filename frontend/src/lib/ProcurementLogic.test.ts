import { describe, it, expect, vi, beforeEach } from 'vitest';
import { convertPOToReceipt } from './ProcurementLogic';
import { saveAuditLog } from './db';

vi.mock('./db', () => ({
  saveAuditLog: vi.fn(),
}));

const mockPO = {
  id: 'PO-001',
  supplier: 'Nepal Trading',
  amount: 5000,
  items: [{ id: '1', qty: 100 }],
  tenant: 'T1',
  user: 'testuser'
};

describe('ProcurementLogic', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('converts PO to Receipt correctly', async () => {
    const receipt = await convertPOToReceipt(mockPO);
    
    expect(receipt.po_id).toBe('PO-001');
    expect(receipt.id).toContain('PR-');
    expect(receipt.status).toBe('Received');
  });

  it('logs the conversion action for audit', async () => {
    await convertPOToReceipt(mockPO);
    
    expect(saveAuditLog).toHaveBeenCalledWith(
      'PO_TO_RECEIPT_CONVERSION',
      'testuser',
      'T1',
      expect.objectContaining({ po_id: 'PO-001' })
    );
  });
});
