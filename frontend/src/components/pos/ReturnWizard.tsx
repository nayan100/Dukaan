import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, CheckCircle, Undo, AlertTriangle, Plus, Minus } from 'lucide-react';
import Button from '../ui/Button';
import { getAllInvoices, saveAuditLog, saveInvoiceOffline } from '../../lib/db';
import { useInventoryStore } from '../../store/inventoryStore';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface ReturnWizardProps {
  onClose: () => void;
}

const ReturnWizard: React.FC<ReturnWizardProps> = ({ onClose }) => {
  const { user, tenantId } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [invoiceId, setInvoiceId] = useState('');
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [previousReturns, setPreviousReturns] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Zustand Store
  const inventory = useInventoryStore(state => state.inventory);

  const handleSearch = async () => {
    setIsProcessing(true);
    try {
      const allInvoices = await getAllInvoices();
      const found = allInvoices.find(inv => inv.invoice_id === invoiceId && inv.tenant_id === tenantId);
      
      if (found) {
        // Find all previous returns for this invoice
        const returns = allInvoices.filter(inv => 
          inv.original_invoice_id === invoiceId && 
          inv.tenant_id === tenantId &&
          inv.total < 0
        );
        
        setPreviousReturns(returns);
        setInvoiceData(found);
        setStep(2);
      } else {
        toast.error('Invoice not found for this tenant.', {
            style: { background: '#0f172a', color: '#ef4444', border: '1px solid #1e293b' }
        });
      }
    } catch (e) {
      console.error(e);
      toast.error('Error querying database.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getAlreadyReturnedQty = (itemId: string) => {
    return previousReturns.reduce((sum, ret) => {
      const item = ret.items.find((i: any) => i.id === itemId);
      return sum + (item ? item.quantity : 0);
    }, 0);
  };

  const toggleItemSelection = (item: any) => {
    const alreadyReturned = getAlreadyReturnedQty(item.id);
    const remaining = item.quantity - alreadyReturned;
    
    if (remaining <= 0) return;

    setSelectedItems(prev => {
      const isSelected = prev.some(i => i.id === item.id);
      if (isSelected) {
        return prev.filter(i => i.id !== item.id);
      } else {
        return [...prev, { ...item, quantity: 1 }]; // Start with 1 for return
      }
    });
  };

  const updateItemQuantity = (itemId: string, newQty: number) => {
    const originalItem = invoiceData.items.find((i: any) => i.id === itemId);
    if (!originalItem) return;
    
    const alreadyReturned = getAlreadyReturnedQty(itemId);
    const maxReturnable = originalItem.quantity - alreadyReturned;

    if (newQty < 1 || newQty > maxReturnable) return;

    setSelectedItems(prev => prev.map(i => i.id === itemId ? { ...i, quantity: newQty } : i));
  };

  const handleProcessReturn = async () => {
    if (selectedItems.length === 0) return;
    setIsProcessing(true);

    try {
      // 1. Increment Inventory
      const { handleReturnComplete } = useInventoryStore.getState() as any;
      if (handleReturnComplete) {
         handleReturnComplete(selectedItems);
      }

      // 2. Save Return Transaction (Revenue Event)
      const returnTotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const returnInvoice = {
        invoice_id: `RET-${Date.now()}`,
        original_invoice_id: invoiceData.invoice_id,
        tenant_id: tenantId,
        items: selectedItems,
        total: -returnTotal, // Negative total identifies this as a return
        payment_details: { method: 'Refund', type: 'Return' },
        created_at: Date.now(),
      };
      await saveInvoiceOffline(returnInvoice);

      // 3. Audit Log
      await saveAuditLog(
        'ITEM_RETURN',
        user?.username || 'system',
        tenantId || 'default',
        JSON.stringify({
          invoice_id: invoiceData.invoice_id,
          returned_items: selectedItems.map(i => ({ id: i.id, name: i.name, qty: i.quantity }))
        })
      );

      toast.success('Items successfully returned to inventory.', {
        icon: <CheckCircle className="text-pos-primary" />,
        style: { background: '#0f172a', color: '#10b981', border: '1px solid #10b981' }
      });
      onClose();
    } catch (e) {
      console.error(e);
      toast.error('Failed to process return.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-pos-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-pos-surface border border-pos-border w-full max-w-2xl p-8 rounded-3xl shadow-2xl relative overflow-hidden"
      >
        <div className="flex justify-between items-center mb-8 border-b border-pos-border pb-6 relative z-10">
          <div>
            <h2 className="text-2xl font-black tracking-tight uppercase flex items-center gap-3">
               <Undo className="text-pos-secondary" />
               Multi-Branch Return
            </h2>
            <p className="text-pos-muted text-sm font-medium mt-1">Cross-reference and ingest returned inventory.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-pos-danger/10 hover:text-pos-danger rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <label className="text-[10px] font-black uppercase tracking-widest text-pos-muted mb-3 block">Enter Original Invoice ID</label>
              <div className="relative mb-8">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-pos-muted" />
                <input 
                  type="text" 
                  autoFocus
                  placeholder="e.g. INV-171787123"
                  className="w-full bg-pos-black/50 border border-pos-border focus:border-pos-secondary rounded-xl p-4 pl-12 text-lg font-bold text-pos-white transition-all outline-none"
                  value={invoiceId}
                  onChange={(e) => setInvoiceId(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && invoiceId && handleSearch()}
                />
              </div>

              <div className="bg-pos-warning/10 border border-pos-warning/30 p-4 rounded-xl flex items-start gap-4 mb-8">
                  <AlertTriangle className="text-pos-warning flex-shrink-0" size={20} />
                  <div>
                      <h4 className="text-xs font-black text-pos-warning uppercase tracking-widest mb-1">Visual Sovereignty Note</h4>
                      <p className="text-xs text-pos-warning/80 font-medium leading-relaxed">Ensure the physical item matches the original condition before processing. Fraud velocity tracking is active.</p>
                  </div>
              </div>

              <div className="flex justify-end gap-4">
                 <Button variant="outline" size="lg" onClick={onClose}>Cancel</Button>
                 <Button variant="secondary" size="lg" onClick={handleSearch} disabled={!invoiceId || isProcessing}>
                    {isProcessing ? 'Verifying...' : 'Verify Invoice'}
                 </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && invoiceData && (
            <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <div className="mb-6 flex justify-between items-center bg-pos-black/50 p-4 rounded-xl border border-pos-border">
                  <div>
                      <div className="text-[10px] uppercase font-black tracking-widest text-pos-muted mb-1">Invoice Record</div>
                      <div className="font-bold font-mono">{invoiceData.invoice_id}</div>
                  </div>
                  <div className="text-right">
                      <div className="text-[10px] uppercase font-black tracking-widest text-pos-muted mb-1">Total Value</div>
                      <div className="font-bold text-pos-primary">NPR {invoiceData.total.toLocaleString()}</div>
                  </div>
              </div>

              <label className="text-[10px] font-black uppercase tracking-widest text-pos-muted mb-3 block">Select Items to Return</label>
              <div className="space-y-3 mb-8 max-h-[30vh] overflow-y-auto custom-scrollbar pr-2">
                 {invoiceData.items.map((item: any) => {
                    const isSelected = selectedItems.some(i => i.id === item.id);
                    const selectedItem = selectedItems.find(i => i.id === item.id);
                    const alreadyReturned = getAlreadyReturnedQty(item.id);
                    const remaining = item.quantity - alreadyReturned;
                    const isFullyReturned = remaining <= 0;

                    return (
                        <div 
                           key={item.id}
                           className={`p-4 rounded-xl border flex justify-between items-center transition-all ${
                             isFullyReturned ? 'opacity-40 grayscale cursor-not-allowed bg-pos-black/20 border-pos-border' :
                             isSelected ? 'bg-pos-secondary/10 border-pos-secondary' : 'bg-pos-black/40 border-pos-border hover:border-pos-secondary/50 cursor-pointer'
                           }`}
                           onClick={() => !isFullyReturned && toggleItemSelection(item)}
                        >
                           <div className="flex items-center gap-4">
                               <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'bg-pos-secondary border-pos-secondary' : 'border-pos-muted'}`}>
                                  {isSelected && <CheckCircle size={14} className="text-pos-black" />}
                               </div>
                               <div>
                                  <div className="text-sm font-bold">{item.name}</div>
                                  <div className="flex items-center gap-2 mt-0.5">
                                      <span className="text-[10px] font-black uppercase text-pos-muted tracking-wider">Remaining: {remaining} / {item.quantity}</span>
                                      {alreadyReturned > 0 && (
                                        <span className="text-[8px] font-black uppercase text-pos-danger bg-pos-danger/10 px-1.5 py-0.5 rounded">
                                          {alreadyReturned} Already Returned
                                        </span>
                                      )}
                                  </div>
                               </div>
                           </div>

                           <div className="flex items-center gap-6">
                               {isSelected && (
                                 <div className="flex items-center gap-3 bg-pos-black/60 p-1 rounded-lg border border-pos-secondary/30" onClick={(e) => e.stopPropagation()}>
                                    <button 
                                      onClick={() => updateItemQuantity(item.id, selectedItem.quantity - 1)}
                                      className="p-1 hover:text-pos-secondary transition-colors"
                                    >
                                      <Minus size={14} />
                                    </button>
                                    <span className="text-sm font-black w-4 text-center">{selectedItem.quantity}</span>
                                    <button 
                                      onClick={() => updateItemQuantity(item.id, selectedItem.quantity + 1)}
                                      className="p-1 hover:text-pos-secondary transition-colors"
                                    >
                                      <Plus size={14} />
                                    </button>
                                 </div>
                               )}
                               <div className="font-black text-right min-w-[80px]">
                                   NPR {(item.price * (isSelected ? selectedItem.quantity : remaining)).toLocaleString()}
                               </div>
                           </div>
                        </div>
                    )
                 })}
              </div>

              <div className="flex justify-between items-center">
                 <Button variant="outline" size="lg" onClick={() => setStep(1)}>Back to Search</Button>
                 <Button variant="secondary" size="lg" onClick={handleProcessReturn} disabled={selectedItems.length === 0 || isProcessing}>
                    {isProcessing ? 'Processing...' : `Accept ${selectedItems.length} Item(s)`}
                 </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ReturnWizard;