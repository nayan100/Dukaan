import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileCheck, ShieldAlert, X, Loader2, CheckCircle } from 'lucide-react';
import { getSupplier } from '../../lib/db';

interface PurchaseReceiptGeneratorProps {
  po: any;
  onGenerate: (receipt: any) => void;
  onCancel: () => void;
}

const PurchaseReceiptGenerator: React.FC<PurchaseReceiptGeneratorProps> = ({ po, onGenerate, onCancel }) => {
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleGenerate = async () => {
    setIsValidating(true);
    setError(null);

    // 1. Fetch Supplier Compliance Data
    const supplier = await getSupplier(po.supplier);

    if (!supplier || !supplier.tax_id) {
      setError('Compliance Error: Missing Supplier PAN/VAT details. Receipts cannot be generated for unverified suppliers.');
      setIsValidating(false);
      return;
    }

    // 2. Validate Tax ID (Exactly 9 digits, numeric)
    const taxIdRegex = /^\d{9}$/;
    if (!taxIdRegex.test(supplier.tax_id)) {
      setError(`Compliance Error: Invalid Supplier PAN/VAT (${supplier.tax_id}). Must be exactly 9 numeric digits.`);
      setIsValidating(false);
      return;
    }

    // 3. Success state
    setIsSuccess(true);
    setTimeout(() => {
      onGenerate({
        receipt_id: `PR-${po.id.split('-')[1]}`,
        po_id: po.id,
        supplier: po.supplier,
        supplier_pan: supplier.tax_id,
        items: po.items,
        total: po.amount,
        created_at: new Date().toISOString()
      });
    }, 1500);
  };

  return (
    <div className="bg-pos-surface border border-pos-border rounded-pos p-8 max-w-xl w-full shadow-2xl relative overflow-hidden">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <FileCheck className="text-pos-primary w-8 h-8" />
          <h2 className="text-pos-white text-2xl font-black uppercase tracking-tighter italic">Generate Purchase Receipt</h2>
        </div>
        <button onClick={onCancel} className="text-pos-muted hover:text-pos-white transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="bg-pos-black/50 border border-pos-border p-6 rounded-2xl mb-8">
        <div className="flex justify-between mb-4">
          <span className="text-pos-muted text-xs font-bold uppercase tracking-widest">Source Document</span>
          <span className="text-pos-white font-mono font-bold">{po.id}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="text-pos-muted text-xs font-bold uppercase tracking-widest">Supplier</span>
          <span className="text-pos-white font-bold">{po.supplier}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-pos-muted text-xs font-bold uppercase tracking-widest">Grand Total</span>
          <span className="text-pos-primary font-mono font-bold">रु {po.amount.toLocaleString()}</span>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-pos-danger/10 border border-pos-danger/30 p-4 rounded-xl mb-8 flex gap-3 overflow-hidden"
          >
            <ShieldAlert className="text-pos-danger w-5 h-5 flex-shrink-0" />
            <p className="text-pos-danger text-sm font-medium">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        disabled={isValidating || isSuccess}
        onClick={handleGenerate}
        className={`w-full py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all relative ${
          isSuccess 
            ? 'bg-pos-primary text-pos-black' 
            : 'bg-pos-primary text-pos-black hover:bg-pos-primary/90'
        } disabled:opacity-50`}
      >
        {isValidating ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            Performing Compliance Check...
          </>
        ) : isSuccess ? (
          <>
            <CheckCircle className="w-6 h-6" />
            Compliance Verified
          </>
        ) : (
          <>
            <FileCheck className="w-6 h-6" />
            Verify Compliance & Generate
          </>
        )}
      </button>

      <p className="text-pos-muted text-[10px] text-center mt-6 font-bold uppercase tracking-[0.2em] italic">
        Electronic Invoice Verification Protocol Active
      </p>
    </div>
  );
};

export default PurchaseReceiptGenerator;
