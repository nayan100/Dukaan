import React, { useState } from 'react';
import { 
  ArrowRight, Search, Building2, 
  ShoppingCart, Package, Trash2, CheckCircle,
  SendHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';

interface Item {
  id: string;
  name: string;
  price: number;
}

interface TransferItem extends Item {
  qty: number;
}

interface TransferUIProps {
  mode?: 'request' | 'dispatch';
  availableItems: Item[];
  onSubmit?: (request: any) => void;
}

const TransferUI: React.FC<TransferUIProps> = ({ mode = 'request', availableItems, onSubmit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [targetBranch, setTargetBranch] = useState('Pokhara');
  const [transferList, setTransferList] = useState<TransferItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const filteredItems = availableItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToTransfer = (item: Item) => {
    if (isSuccess) return;
    setTransferList(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromTransfer = (itemId: string) => {
    setTransferList(prev => prev.filter(i => i.id !== itemId));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (onSubmit) {
      onSubmit({
        target_branch: targetBranch,
        items: transferList
      });
    }
    
    setIsSubmitting(false);
    setIsSuccess(true);
    
    // Auto-reset after 3 seconds
    setTimeout(() => {
        setIsSuccess(false);
        setTransferList([]);
    }, 3000);
  };

  const title = mode === 'request' ? 'New Transfer Request' : 'Process Stock Dispatch';
  const subTitle = mode === 'request' ? 'Initiate inter-branch inventory movement' : 'Move stock to Transit Warehouse';
  const submitLabel = isSubmitting ? 'Processing...' : (mode === 'request' ? 'Submit Request' : 'Confirm Dispatch');
  const Icon = mode === 'request' ? Package : SendHorizontal;

  return (
    <div className="min-h-screen bg-pos-black p-8 text-pos-white font-sans selection:bg-pos-primary/30 relative">
      <AnimatePresence>
        {isSuccess && (
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-0 z-50 flex items-center justify-center bg-pos-black/60 backdrop-blur-md"
            >
                <div className="bg-pos-surface border border-pos-primary/30 p-12 rounded-[3rem] text-center shadow-2xl shadow-pos-primary/10">
                    <div className="w-24 h-24 bg-pos-primary/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-pos-primary/30">
                        <CheckCircle size={48} className="text-pos-primary" />
                    </div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-2">Protocol Dispatched</h2>
                    <p className="text-pos-muted font-medium">Inventory logically moved to Transit Warehouse.</p>
                    <div className="mt-8 bg-pos-primary/10 border border-pos-primary/20 px-4 py-2 rounded-full inline-block">
                        <span className="text-[10px] font-black uppercase tracking-widest text-pos-primary">Status: In Transit</span>
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      <header className="flex justify-between items-end border-b border-pos-border pb-8 mb-10">
        <div>
            <div className="flex items-center gap-3 mb-2">
                <Icon className="text-pos-secondary" size={24} />
                <span className="text-xs font-black uppercase tracking-[0.3em] text-pos-secondary">
                    {mode === 'request' ? 'Logistics Protocol' : 'Operational Dispatch'}
                </span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic">{title}</h1>
            <p className="text-pos-muted font-medium mt-2">{subTitle}</p>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-10">
        {/* Selection Pane */}
        <div className="col-span-2 space-y-8">
            <div className="bg-pos-surface/30 border border-pos-border p-6 rounded-2xl backdrop-blur-xl">
                <div className="flex gap-6 mb-8">
                    <div className="flex-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-pos-muted mb-2 block">
                            {mode === 'request' ? 'Source Branch (Self)' : 'Source Warehouse'}
                        </label>
                        <div className="bg-pos-black border border-pos-border p-3 rounded-xl font-bold flex items-center gap-3 text-sm">
                            <Building2 size={18} className="text-pos-primary" />
                            {mode === 'request' ? 'KTM Main' : 'KTM Main - Local'}
                        </div>
                    </div>
                    <ArrowRight className="mt-8 text-pos-muted" />
                    <div className="flex-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-pos-muted mb-2 block">
                            {mode === 'request' ? 'Target Branch' : 'Target Warehouse'}
                        </label>
                        {mode === 'request' ? (
                            <select 
                                className="w-full bg-pos-black border border-pos-border focus:border-pos-primary p-3 rounded-xl font-bold outline-none appearance-none text-sm"
                                value={targetBranch}
                                onChange={(e) => setTargetBranch(e.target.value)}
                            >
                                <option value="Pokhara">Pokhara Branch</option>
                                <option value="Lalitpur">Lalitpur Branch</option>
                                <option value="Butwal">Butwal Branch</option>
                            </select>
                        ) : (
                            <div className="bg-pos-black border border-pos-border p-3 rounded-xl font-bold flex items-center gap-3 text-sm">
                                <Package size={18} className="text-pos-secondary" />
                                KTM Main - Transit
                            </div>
                        )}
                    </div>
                </div>

                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-pos-muted group-focus-within:text-pos-primary transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search products..." 
                        className="w-full bg-pos-black border border-pos-border focus:border-pos-primary rounded-xl py-3 pl-12 pr-4 text-sm font-semibold transition-all outline-none placeholder:text-pos-muted/50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {filteredItems.map(item => (
                    <Button 
                        key={item.id}
                        variant="muted"
                        className="h-32 flex-col gap-2 group relative overflow-hidden"
                        onClick={() => addToTransfer(item)}
                        data-testid={`add-item-${item.id}`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-pos-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="text-xs font-bold text-center px-2 z-10">{item.name}</span>
                        <div className="bg-pos-black/40 px-3 py-1 rounded-full border border-pos-border group-hover:border-pos-primary/30 transition-colors z-10">
                            <span className="text-[10px] font-black text-pos-primary">NPR {item.price}</span>
                        </div>
                    </Button>
                ))}
            </div>
        </div>

        {/* Transfer List */}
        <aside className="bg-pos-surface/50 border border-pos-border rounded-2xl flex flex-col backdrop-blur-xl relative">
            <div className="p-6 border-b border-pos-border flex items-center gap-3">
                <ShoppingCart size={20} className="text-pos-primary" />
                <h2 className="text-lg font-black tracking-tight uppercase">
                    {mode === 'request' ? 'Request List' : 'Dispatch List'}
                </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <AnimatePresence>
                    {transferList.map(item => (
                        <motion.div 
                            key={item.id}
                            data-testid={`transfer-item-${item.id}`}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-pos-black border border-pos-border p-4 rounded-xl flex justify-between items-center group hover:border-pos-primary/30 transition-all"
                        >
                            <div>
                                <div className="text-xs font-bold leading-tight">{item.name}</div>
                                <div className="text-[10px] text-pos-muted font-black uppercase mt-1">Qty: {item.qty}</div>
                            </div>
                            <button 
                                onClick={() => removeFromTransfer(item.id)}
                                className="p-2 hover:bg-pos-danger/10 text-pos-danger rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <Trash2 size={16} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {transferList.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center opacity-10 py-20 grayscale">
                        <Package size={80} strokeWidth={1} />
                        <div className="mt-4 font-black uppercase tracking-[0.2em] text-[10px] text-center">Protocol Empty</div>
                    </div>
                )}
            </div>

            <div className="p-6 border-t border-pos-border bg-pos-black/20 rounded-b-2xl">
                <Button 
                    variant="primary" 
                    size="xl" 
                    className="w-full h-16 uppercase font-black tracking-tighter shadow-2xl shadow-pos-primary/10"
                    disabled={transferList.length === 0}
                    onClick={handleSubmit}
                >
                    {submitLabel}
                </Button>
            </div>
        </aside>
      </div>
    </div>
  );
};

export default TransferUI;
