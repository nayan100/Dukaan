import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClipboardList, Truck, 
  BarChart3, Plus, ShoppingBag, ShieldAlert, CheckCircle2, Search
} from 'lucide-react';
import { useInventoryStore } from '../../store/inventoryStore';

const BranchProcurement: React.FC = () => {
  const [view, setView] = useState<'tracker' | 'receipts' | 'budget'>('tracker');
  const inventory = useInventoryStore((state) => state.inventory);

  const mockPOs = [
    { id: 'PO-992', supplier: 'Universal Distrib.', amount: 45000, status: 'Shipped', date: '2026-06-08', items: 12 },
    { id: 'PO-991', supplier: 'Local Wholesale', amount: 12000, status: 'Pending Receipt', date: '2026-06-07', items: 5 },
    { id: 'PO-985', supplier: 'Tech Supply Co', amount: 89000, status: 'Draft', date: '2026-06-05', items: 3 },
  ];

  return (
    <div className="p-10 space-y-10 max-w-7xl mx-auto min-h-full">
      <header className="flex justify-between items-end border-b border-slate-800 pb-8">
        <div>
            <div className="flex items-center gap-3 mb-2">
                <ShoppingBag className="text-emerald-400" size={24} />
                <span className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400">Procurement Center</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic text-slate-100">Branch Purchasing</h1>
            <p className="text-slate-400 font-medium mt-2">Manage local supply chain and vendor fulfillments.</p>
        </div>
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button 
                onClick={() => setView('tracker')}
                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${view === 'tracker' ? 'bg-slate-800 text-emerald-400 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
                PO Tracker
            </button>
            <button 
                onClick={() => setView('receipts')}
                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${view === 'receipts' ? 'bg-slate-800 text-emerald-400 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
                Receipt Entry
            </button>
            <button 
                onClick={() => setView('budget')}
                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${view === 'budget' ? 'bg-slate-800 text-emerald-400 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
                Budget Hub
            </button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {view === 'tracker' && (
          <motion.div 
            key="tracker"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <BudgetCard title="Monthly Allowance" value="रु 250,000" used={152000} color="emerald" />
                <BudgetCard title="Committed POs" value="रु 89,000" used={45000} color="blue" />
                <BudgetCard title="Available Credit" value="रु 53,000" used={100} color="amber" />
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
                    <h3 className="text-xl font-black uppercase tracking-tighter text-slate-100">Purchase Order Pipeline</h3>
                    <div className="flex gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                            <input type="text" placeholder="Filter POs..." className="bg-slate-950 border border-slate-800 rounded-lg py-1.5 pl-10 pr-4 text-xs font-bold outline-none focus:border-emerald-500/50 transition-all text-slate-200" />
                        </div>
                        <button className="bg-emerald-500 text-slate-950 px-4 py-1.5 rounded-lg font-black uppercase text-[10px] tracking-widest hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20">
                           <Plus size={14} className="inline mr-1 mb-0.5" /> New PO
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-950 text-[10px] text-slate-500 uppercase font-black tracking-widest border-b border-slate-800">
                            <tr>
                                <th className="px-8 py-4">PO Reference</th>
                                <th className="px-8 py-4">Supplier</th>
                                <th className="px-8 py-4 text-right">Total Amount</th>
                                <th className="px-8 py-4 text-center">Status</th>
                                <th className="px-8 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {mockPOs.map(po => (
                                <tr key={po.id} className="hover:bg-slate-800/50 transition-colors">
                                    <td className="px-8 py-4">
                                        <div className="font-black text-slate-100">{po.id}</div>
                                        <div className="text-[10px] text-slate-500 font-bold">{po.date}</div>
                                    </td>
                                    <td className="px-8 py-4 font-bold text-slate-300">{po.supplier}</td>
                                    <td className="px-8 py-4 text-right font-mono text-slate-100">रु {po.amount.toLocaleString()}</td>
                                    <td className="px-8 py-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                            po.status === 'Shipped' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                            po.status === 'Pending Receipt' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                            'bg-slate-800 text-slate-400 border-slate-700'
                                        }`}>
                                            {po.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <button className="text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300">View Details</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
          </motion.div>
        )}

        {view === 'receipts' && (
          <motion.div 
            key="receipts"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-8">
                <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                        <Truck size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black uppercase tracking-tighter text-slate-100 text-emerald-400">Compliance Receipt Entry</h3>
                        <p className="text-slate-500 text-xs font-bold">Validate vendor shipment against digital PO.</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Select Active PO</label>
                        <select className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-bold text-sm text-slate-200 outline-none focus:border-emerald-500/50">
                            <option>PO-991 - Local Wholesale (रु 12,000)</option>
                            <option>PO-992 - Universal Distrib. (रु 45,000)</option>
                        </select>
                    </div>

                    <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl border-dashed">
                        <div className="text-center py-10">
                            <ClipboardList className="mx-auto text-slate-700 mb-4" size={48} />
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Select a PO to begin validation</p>
                        </div>
                    </div>

                    <button className="w-full py-4 bg-slate-800 text-slate-500 rounded-xl uppercase font-black tracking-widest text-xs cursor-not-allowed">
                        Proceed to Compliance Check
                    </button>
                </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-3 mb-6">
                    <BarChart3 className="text-slate-500" size={18} />
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Compliance Preview</h4>
                </div>
                <div className="aspect-[3/4] border border-slate-900 rounded-2xl flex items-center justify-center text-slate-700 font-black uppercase tracking-[0.3em] text-[10px] text-center p-20 italic">
                   Wait for Validation Protocol
                </div>
            </div>
          </motion.div>
        )}

        {view === 'budget' && (
          <motion.div 
            key="budget"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center shadow-2xl"
          >
             <ShieldAlert className="mx-auto text-amber-500/20 mb-6" size={80} />
             <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-100 mb-4 italic">Sovereign Budget Governance</h2>
             <p className="max-w-xl mx-auto text-slate-400 font-medium mb-10 text-lg">
                The HQ Finance Controller has locked manual budget adjustments for this branch. Local procurement must remain within established credit limits.
             </p>
             <div className="inline-flex items-center gap-4 bg-slate-950 border border-slate-800 px-6 py-3 rounded-2xl">
                <CheckCircle2 className="text-emerald-500" size={20} />
                <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Limits Verified • Compliance Active</span>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const BudgetCard = ({ title, value, used, color }: any) => {
  const percentage = Math.min(100, (used / 250000) * 100);
  const colorMap = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    amber: 'bg-amber-500',
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{title}</div>
        <div className="text-2xl font-black tracking-tight text-slate-100 mb-4 italic">{value}</div>
        <div className="h-2 w-full bg-slate-950 rounded-full border border-slate-800 overflow-hidden">
            <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                className={`h-full ${colorMap[color as keyof typeof colorMap]}`}
            />
        </div>
    </div>
  );
};

export default BranchProcurement;
