import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Save, ClipboardList, Plus, Trash2 } from 'lucide-react';
import { getBudget } from '../../lib/db';

interface POItem {
  id: string;
  item_code: string;
  qty: number;
  rate: number;
}

interface POCreationWizardProps {
  onSave: (po: any) => void;
  onCancel: () => void;
}

const MOCK_CATALOG = [
  { item_code: 'G-COFFEE-01', name: 'Organic Coffee', rate: 450 },
  { item_code: 'G-TEA-02', name: 'Green Tea', rate: 200 },
  { item_code: 'G-MILK-03', name: 'Fresh Milk', rate: 100 },
  { item_code: 'G-RICE-04', name: 'Basmati Rice', rate: 1500 },
];

const POCreationWizard: React.FC<POCreationWizardProps> = ({ onSave, onCancel }) => {
  const [supplier, setSupplier] = useState('');
  const [items, setItems] = useState<POItem[]>([]);
  const [showViolationModal, setShowViolationModal] = useState(false);
  const [violationReason, setViolationReason] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const totalAmount = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.qty * item.rate), 0);
  }, [items]);

const addItem = () => {
    const newItem: POItem = {
      id: Math.random().toString(36).substring(2, 9),
      item_code: MOCK_CATALOG[0].item_code,
      qty: 1,
      rate: MOCK_CATALOG[0].rate
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const updateItem = (id: string, field: keyof POItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'item_code') {
          const catalogItem = MOCK_CATALOG.find(c => c.item_code === value);
          if (catalogItem) updated.rate = catalogItem.rate;
        }
        return updated;
      }
      return item;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setIsValidating(true);

    const branchId = 'T1';
    const month = new Date().toISOString().slice(0, 7);

    let budget = await getBudget(branchId, month);
    
    // Showcase Fallback: If no budget is found, simulate a 50k budget for testing
    if (!budget) {
      budget = {
        id: `${branchId}-${month}`,
        branch_id: branchId,
        month: month,
        allocated: 50000,
        spent: 12000
      };
    }
    
    const remaining = budget.allocated - budget.spent;
    if (totalAmount > remaining) {
      setShowViolationModal(true);
      setIsValidating(false);
      return;
    }

    savePO(false);
  };

  const savePO = (isViolation: boolean) => {
    const po = {
      id: `PO-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      supplier,
      amount: totalAmount,
      items: items.map(i => ({ item_code: i.item_code, qty: i.qty, rate: i.rate })),
      status: isViolation ? 'Pending Approval' : 'Draft',
      budgetViolation: isViolation,
      violationReason: isViolation ? violationReason : undefined,
      date: new Date().toISOString().split('T')[0]
    };
    onSave(po);
  };

  return (
    <div className="bg-pos-surface border border-pos-border rounded-pos p-8 max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <ClipboardList className="text-pos-primary w-6 h-6" />
          <h2 className="text-pos-white text-xl font-bold uppercase tracking-tight">Create Purchase Order</h2>
        </div>
        <button onClick={onCancel} className="text-pos-muted hover:text-pos-white transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 overflow-auto flex-1 pr-2 custom-scrollbar">
        <div>
          <label className="block text-pos-muted text-[10px] font-black uppercase tracking-widest mb-2">Supplier Entity</label>
          <input
            type="text"
            required
            placeholder="Select or Enter Supplier"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            className="w-full bg-pos-black border border-pos-border rounded-xl px-4 py-3 text-sm text-pos-white focus:border-pos-primary focus:ring-1 focus:ring-pos-primary outline-none transition-all"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="block text-pos-muted text-[10px] font-black uppercase tracking-widest">Order Items</label>
            <button 
                type="button"
                onClick={addItem}
                className="flex items-center gap-2 text-pos-primary text-[10px] font-black uppercase tracking-widest hover:bg-pos-primary/10 px-3 py-1.5 rounded-lg transition-all"
            >
                <Plus size={14} /> Add Item
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-3 items-end bg-pos-black/30 p-4 rounded-xl border border-pos-border">
                <div className="col-span-5">
                  <label className="block text-[8px] font-black text-pos-muted uppercase tracking-widest mb-1">Product</label>
                  <select
                    value={item.item_code}
                    onChange={(e) => updateItem(item.id, 'item_code', e.target.value)}
                    className="w-full bg-pos-black border border-pos-border rounded-lg px-3 py-2 text-xs text-pos-white outline-none focus:border-pos-primary"
                  >
                    {MOCK_CATALOG.map(c => (
                      <option key={c.item_code} value={c.item_code}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-[8px] font-black text-pos-muted uppercase tracking-widest mb-1">Qty</label>
                  <input
                    type="number"
                    min="1"
                    value={item.qty}
                    onChange={(e) => updateItem(item.id, 'qty', parseInt(e.target.value) || 0)}
                    className="w-full bg-pos-black border border-pos-border rounded-lg px-3 py-2 text-xs text-pos-white outline-none focus:border-pos-primary"
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-[8px] font-black text-pos-muted uppercase tracking-widest mb-1">Rate</label>
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                    className="w-full bg-pos-black border border-pos-border rounded-lg px-3 py-2 text-xs text-pos-white outline-none focus:border-pos-primary"
                  />
                </div>
                <div className="col-span-2 flex justify-end pb-1">
                  <button 
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-pos-danger hover:bg-pos-danger/10 p-2 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            {items.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-pos-border rounded-2xl text-pos-muted text-xs font-bold">
                    No items added to this purchase order.
                </div>
            )}
          </div>
        </div>
      </form>

      <div className="mt-8 pt-6 border-t border-pos-border flex items-center justify-between">
        <div>
            <div className="text-[10px] font-black text-pos-muted uppercase tracking-widest mb-1">Total Grand Amount</div>
            <div className="text-2xl font-black text-pos-white italic">रु {totalAmount.toLocaleString()}</div>
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-pos-border text-pos-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-pos-surface transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isValidating || items.length === 0 || !supplier}
            onClick={handleSubmit}
            className="bg-pos-primary text-pos-black font-black px-8 py-3 rounded-xl uppercase text-xs tracking-widest hover:bg-pos-primary/90 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isValidating ? 'Validating...' : (
              <>
                <Save size={18} />
                Create PO
              </>
            )}
          </button>
        </div>
      </div>

      {/* Violation Reason Modal */}
      <AnimatePresence>
        {showViolationModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-pos-black/90 backdrop-blur-xl p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-pos-surface border border-pos-danger/30 rounded-[2rem] p-10 max-w-md w-full shadow-2xl shadow-pos-danger/10"
            >
              <div className="flex items-center gap-4 mb-6 text-pos-danger">
                <div className="w-12 h-12 bg-pos-danger/10 rounded-xl flex items-center justify-center border border-pos-danger/20">
                    <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tighter">Budget Violation</h3>
              </div>
              
              <p className="text-pos-muted text-sm font-medium mb-8 leading-relaxed">
                This purchase order (<span className="text-white">रु {totalAmount.toLocaleString()}</span>) exceeds the monthly ceiling. A mandatory justification is required for the audit trail.
              </p>

              <textarea
                autoFocus
                required
                placeholder="Justification for budget override..."
                value={violationReason}
                onChange={(e) => setViolationReason(e.target.value)}
                className="w-full bg-pos-black border border-pos-border rounded-2xl px-5 py-4 text-pos-white text-sm h-32 mb-8 focus:border-pos-danger focus:ring-1 focus:ring-pos-danger outline-none transition-all resize-none"
              />

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowViolationModal(false)}
                  className="flex-1 px-4 py-4 border border-pos-border text-pos-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-pos-surface transition-all"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!violationReason.trim()}
                  onClick={() => savePO(true)}
                  className="flex-1 px-4 py-4 bg-pos-danger text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-pos-danger/90 transition-all disabled:opacity-50 shadow-lg shadow-pos-danger/20"
                >
                  Override & Save
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
