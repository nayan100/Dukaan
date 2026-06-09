import React, { useState } from 'react';
import { 
  ArrowRight, Search, Building2, 
  ShoppingCart, Package, Trash2, CheckCircle,
  SendHorizontal, Truck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInventoryStore } from '../../store/inventoryStore';

interface Item {
  id: string;
  name: string;
  price: number;
}

interface TransferItem extends Item {
  qty: number;
}

const BranchLogistics: React.FC = () => {
  const [mode, setMode] = useState<'request' | 'dispatch'>('request');
  const availableItems = useInventoryStore((state) => state.inventory);
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
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
    setTimeout(() => {
        setIsSuccess(false);
        setTransferList([]);
    }, 3000);
  };

  const title = mode === 'request' ? 'New Transfer Request' : 'Process Stock Dispatch';
  const subTitle = mode === 'request' ? 'Initiate inter-branch inventory movement' : 'Move stock to Transit Warehouse';
  const submitLabel = isSubmitting ? 'Processing...' : (mode === 'request' ? 'Submit Request' : 'Confirm Dispatch');
  
  return (
    <div className="p-10 space-y-10 max-w-7xl mx-auto relative min-h-full">
      <AnimatePresence>
        {isSuccess && (
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md"
            >
                <div className="bg-slate-900 border border-emerald-500/30 p-12 rounded-[3rem] text-center shadow-2xl shadow-emerald-500/10">
                    <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/30">
                        <CheckCircle size={48} className="text-emerald-400" />
                    </div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-2">Protocol Dispatched</h2>
                    <p className="text-slate-400 font-medium">Inventory logically moved to Transit Warehouse.</p>
                    <div className="mt-8 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full inline-block">
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Status: In Transit</span>
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      <header className="flex justify-between items-end border-b border-slate-800 pb-8">
        <div>
            <div className="flex items-center gap-3 mb-2">
                <Truck className="text-emerald-400" size={24} />
                <span className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400">Logistics Hub</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic text-slate-100">{title}</h1>
            <p className="text-slate-400 font-medium mt-2">{subTitle}</p>
        </div>
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button 
                onClick={() => setMode('request')}
                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'request' ? 'bg-slate-800 text-emerald-400 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
                Request Mode
            </button>
            <button 
                onClick={() => setMode('dispatch')}
                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'dispatch' ? 'bg-slate-800 text-emerald-400 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
                Dispatch Mode
            </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl">
                <div className="flex flex-col md:flex-row gap-6 mb-8 items-center">
                    <div className="flex-1 w-full">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">
                            Source
                        </label>
                        <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl font-bold flex items-center gap-3 text-sm text-slate-200">
                            <Building2 size={18} className="text-emerald-400" />
                            Local Branch
                        </div>
                    </div>
                    <ArrowRight className="text-slate-700 hidden md:block" />
                    <div className="flex-1 w-full">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">
                            Target
                        </label>
                        {mode === 'request' ? (
                            <select 
                                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500/50 p-3 rounded-xl font-bold outline-none appearance-none text-sm text-slate-200"
                                value={targetBranch}
                                onChange={(e) => setTargetBranch(e.target.value)}
                            >
                                <option value="Pokhara">Pokhara Branch</option>
                                <option value="Lalitpur">Lalitpur Branch</option>
                                <option value="Butwal">Butwal Branch</option>
                                <option value="HQ">Central HQ</option>
                            </select>
                        ) : (
                            <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl font-bold flex items-center gap-3 text-sm text-slate-200">
                                <Package size={18} className="text-emerald-400" />
                                Transit Warehouse
                            </div>
                        )}
                    </div>
                </div>

                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search products..." 
                        className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500/50 rounded-xl py-3 pl-12 pr-4 text-sm font-semibold transition-all outline-none text-slate-200 placeholder:text-slate-700"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filteredItems.map(item => (
                    <button 
                        key={item.id}
                        className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col items-center gap-4 group relative overflow-hidden hover:border-emerald-500/30 transition-all shadow-lg active:scale-95"
                        onClick={() => addToTransfer(item)}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="text-xs font-black uppercase tracking-tight text-center text-slate-300 z-10">{item.name}</span>
                        <div className="bg-slate-950 px-3 py-1 rounded-full border border-slate-800 group-hover:border-emerald-500/30 transition-colors z-10">
                            <span className="text-[10px] font-black text-emerald-400">रु {item.price.toLocaleString()}</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>

        <aside className="bg-slate-900 border border-slate-800 rounded-3xl flex flex-col shadow-2xl relative overflow-hidden h-fit sticky top-10">
            <div className="p-6 border-b border-slate-800 flex items-center gap-3 bg-slate-950/50">
                <ShoppingCart size={20} className="text-emerald-400" />
                <h2 className="text-lg font-black tracking-tight uppercase text-slate-100">
                    {mode === 'request' ? 'Request List' : 'Dispatch List'}
                </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[400px]">
                <AnimatePresence>
                    {transferList.map(item => (
                        <motion.div 
                            key={item.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex justify-between items-center group hover:border-emerald-500/30 transition-all"
                        >
                            <div>
                                <div className="text-xs font-black uppercase tracking-tight text-slate-200">{item.name}</div>
                                <div className="text-[10px] text-slate-500 font-black uppercase mt-1">Qty: {item.qty}</div>
                            </div>
                            <button 
                                onClick={() => removeFromTransfer(item.id)}
                                className="p-2 hover:bg-rose-500/10 text-rose-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <Trash2 size={16} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {transferList.length === 0 && (
                    <div className="py-20 flex flex-col items-center justify-center opacity-20 grayscale">
                        <Package size={80} strokeWidth={1} className="text-slate-400" />
                        <div className="mt-4 font-black uppercase tracking-[0.2em] text-[10px] text-center text-slate-400">List Empty</div>
                    </div>
                )}
            </div>

            <div className="p-6 border-t border-slate-800 bg-slate-950/50">
                <button 
                    disabled={transferList.length === 0 || isSubmitting}
                    onClick={handleSubmit}
                    className="w-full py-4 bg-emerald-500 text-slate-950 rounded-xl uppercase font-black tracking-widest text-xs hover:bg-emerald-400 transition-all disabled:opacity-20 disabled:grayscale shadow-xl shadow-emerald-500/20 active:scale-95"
                >
                    {submitLabel}
                </button>
            </div>
        </aside>
      </div>
    </div>
  );
};

export default BranchLogistics;
