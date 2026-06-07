import { logAction } from './db';

/**
 * Immutable PO-to-Receipt Conversion Logic
 * 
 * Ensures every conversion is tracked in the Global Audit Trail.
 */
export const convertPOToReceipt = async (po: any) => {
  const receipt = {
    id: `PR-${po.id.split('-')[1]}-${Math.floor(Math.random() * 1000)}`,
    po_id: po.id,
    supplier: po.supplier,
    amount: po.amount,
    items: po.items,
    status: 'Received',
    created_at: new Date().toISOString()
  };

  // Immutable Audit Logging
  await logAction(
    'PO_TO_RECEIPT_CONVERSION',
    po.user || 'system',
    po.tenant || 'default',
    {
      po_id: po.id,
      receipt_id: receipt.id,
      amount: po.amount,
      timestamp: Date.now()
    }
  );

  return receipt;
};
