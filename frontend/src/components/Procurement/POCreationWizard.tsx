import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Save, ClipboardList } from 'lucide-react';
import { getBudget } from '../../lib/db';

interface POCreationWizardProps {
  onSave: (po: any) => void;
  onCancel: () => void;
}

const POCreationWizard: React.FC<POCreationWizardProps> = ({ onSave, onCancel }) => {
  const [supplier, setSupplier] = useState('');
  const [amount, setAmount] = useState('');
  const [showViolationModal, setShowViolationModal] = useState(false);
  const [violationReason, setViolationReason] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsValidating(true);

    const poAmount = parseFloat(amount);
    
    // Simulate branch_id and month for now
    // In a real app, these would come from AuthContext and current date
    const branchId = 'T1';
    const month = new Date().toISOString().slice(0, 7); // '2026-06'

    const budget = await getBudget(branchId, month);
    
    if (budget) {
      const remaining = budget.allocated - budget.spent;
      if (poAmount > remaining) {
        setShowViolationModal(true);
        setIsValidating(false);
        return;
      }
    }

    savePO(false);
  };

  const savePO = (isViolation: boolean) => {
    const po = {
      id: `PO-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      supplier,
      amount: parseFloat(amount),
      status: isViolation ? 'Pending Approval' : 'Draft',
      budgetViolation: isViolation,
      violationReason: isViolation ? violationReason : undefined,
      date: new Date().toISOString().split('T')[0]
    };
    onSave(po);
  };

  return (
    <div className="bg-pos-surface border border-pos-border rounded-pos p-6 max-w-lg w-full shadow-2xl relative">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <ClipboardList className="text-pos-primary w-6 h-6" />
          <h2 className="text-pos-white text-xl font-bold">Create Purchase Order</h2>
        </div>
        <button onClick={onCancel} className="text-pos-muted hover:text-pos-white transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-pos-muted text-xs font-bold uppercase mb-1">Supplier Name</label>
          <input
            type="text"
            required
            placeholder="Supplier Name"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            className="w-full bg-pos-black border border-pos-border rounded-md px-4 py-2 text-pos-white focus:border-pos-primary focus:ring-1 focus:ring-pos-primary outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-pos-muted text-xs font-bold uppercase mb-1">Total Amount (रु)</label>
          <input
            type="number"
            required
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-pos-black border border-pos-border rounded-md px-4 py-2 text-pos-white font-mono text-lg focus:border-pos-primary focus:ring-1 focus:ring-pos-primary outline-none transition-all"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isValidating}
            className="w-full bg-pos-primary text-pos-black font-bold py-3 rounded-md hover:bg-pos-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isValidating ? 'Validating Budget...' : (
              <>
                <Save className="w-5 h-5" />
                Create PO
              </>
            )}
          </button>
        </div>
      </form>

      {/* Violation Reason Modal */}
      <AnimatePresence>
        {showViolationModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-pos-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-pos-surface border border-pos-danger rounded-pos p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4 text-pos-danger">
                <AlertTriangle className="w-8 h-8" />
                <h3 className="text-xl font-bold">Budget Violation Detected</h3>
              </div>
              
              <p className="text-pos-muted text-sm mb-6">
                This purchase order exceeds the remaining budget for this month. To proceed, you must provide a justification for this override.
              </p>

              <textarea
                autoFocus
                required
                placeholder="Reason for violation"
                value={violationReason}
                onChange={(e) => setViolationReason(e.target.value)}
                className="w-full bg-pos-black border border-pos-border rounded-md px-4 py-2 text-pos-white text-sm h-32 mb-6 focus:border-pos-danger focus:ring-1 focus:ring-pos-danger outline-none transition-all"
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowViolationModal(false)}
                  className="flex-1 px-4 py-2 border border-pos-border text-pos-white rounded-md hover:bg-pos-border transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!violationReason.trim()}
                  onClick={() => savePO(true)}
                  className="flex-1 px-4 py-2 bg-pos-danger text-white rounded-md hover:bg-pos-danger/90 transition-colors disabled:opacity-50 font-bold"
                >
                  Confirm & Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default POCreationWizard;
