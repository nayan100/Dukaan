import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, AlertTriangle, TrendingUp, Box, ShieldCheck, Activity } from 'lucide-react';
import { useInventoryStore } from '../../store/inventoryStore';

const StatCard = ({ title, value, subtext, icon: Icon, alert = false }: any) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className={`bg-slate-900 border ${alert ? 'border-rose-500/50' : 'border-slate-800'} p-6 rounded-2xl relative overflow-hidden group shadow-xl`}
  >
    <div className={`absolute top-0 right-0 w-24 h-24 blur-3xl -mr-12 -mt-12 rounded-full transition-colors ${alert ? 'bg-rose-500/10 group-hover:bg-rose-500/20' : 'bg-emerald-500/5 group-hover:bg-emerald-500/10'}`} />
    <div className="flex justify-between items-start mb-6">
      <div className={`w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center border shadow-inner transition-colors ${alert ? 'border-rose-500/50 text-rose-400' : 'border-slate-800 group-hover:border-emerald-500/50 text-emerald-400'}`}>
        <Icon size={24} />
      </div>
    </div>
    <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">{title}</div>
    <div className={`text-3xl font-black tracking-tight ${alert ? 'text-rose-400' : 'text-slate-100'}`}>{value}</div>
    <div className="text-[10px] font-bold text-slate-500 mt-2">{subtext}</div>
  </motion.div>
);

const QuotaBurnDown = () => {
  const quotas = [
    { category: 'Electronics', used: 85, limit: 100, color: 'bg-rose-500' },
    { category: 'Groceries', used: 45, limit: 100, color: 'bg-emerald-500' },
    { category: 'Home Decor', used: 12, limit: 100, color: 'bg-blue-500' },
    { category: 'Health & Beauty', used: 68, limit: 100, color: 'bg-amber-500' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl h-full">
      <div className="flex items-center gap-3 mb-8">
        <ShieldCheck className="text-emerald-400" size={20} />
        <h3 className="text-xl font-black uppercase tracking-tighter text-slate-100">Local Quota Burn-Down</h3>
      </div>
      <div className="space-y-6">
        {quotas.map((q) => (
          <div key={q.category}>
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">{q.category}</span>
              <span className="text-xs font-black italic text-slate-200">{q.used}% Used</span>
            </div>
            <div className="h-3 w-full bg-slate-950 rounded-full border border-slate-800 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${q.used}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`h-full ${q.color} shadow-[0_0_15px_rgba(0,0,0,0.5)]`}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-8 text-center italic">
        Reset in 12 days • Sovereign Enforcement Active
      </p>
    </div>
  );
};

const BranchInventory: React.FC = () => {
  const inventory = useInventoryStore((state) => state.inventory);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockItems = inventory.filter(item => item.stock <= item.min_stock).length;
  const totalItems = inventory.length;
  const totalValue = inventory.reduce((acc, item) => acc + (item.stock * item.price), 0);

  return (
    <div className="p-10 space-y-10 max-w-7xl mx-auto">
      <header className="flex justify-between items-end border-b border-slate-800 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
              <Activity className="text-emerald-400" size={24} />
              <span className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400">Inventory Intelligence</span>
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-100 mb-2 italic">Branch Inventory</h1>
          <p className="text-slate-400 font-bold tracking-tight">Real-time stock levels and local resource governance.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard title="Total SKU Count" value={totalItems} subtext="Active items in catalog" icon={Box} />
            <StatCard title="Inventory Value" value={`रु ${totalValue.toLocaleString()}`} subtext="Total valuation of local stock" icon={TrendingUp} />
            <StatCard title="Low Stock Alerts" value={lowStockItems} subtext="Items below minimum threshold" icon={AlertTriangle} alert={lowStockItems > 0} />
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-center border-dashed border-2">
                <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">Additional Metric Hub</p>
            </div>
        </div>
        <div className="lg:col-span-1">
            <QuotaBurnDown />
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="flex justify-between items-center mb-8">
           <h3 className="text-xl font-black uppercase tracking-tighter text-slate-100">Current Active Inventory</h3>
           <div className="relative group w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
              <input 
                  type="text" 
                  placeholder="Search inventory..." 
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500/50 rounded-xl py-2 pl-12 pr-4 text-sm font-semibold transition-all outline-none text-slate-200 placeholder:text-slate-700"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-950 text-[10px] text-slate-500 uppercase font-black tracking-widest border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 rounded-tl-xl">Item Code</th>
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4 text-right">Unit Price</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right rounded-tr-xl">Current Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredInventory.map((item) => {
                const isLowStock = item.stock <= item.min_stock;
                return (
                  <motion.tr 
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-emerald-500/5 transition-colors group"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{item.code}</td>
                    <td className="px-6 py-4 font-bold text-slate-200">{item.name}</td>
                    <td className="px-6 py-4 text-right font-mono text-slate-300">रु {item.price.toLocaleString()}</td>
                    <td className="px-6 py-4 text-center">
                      {isLowStock ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]">
                          <AlertTriangle size={10} /> Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Optimal
                        </span>
                      )}
                    </td>
                    <td className={`px-6 py-4 text-right font-black tracking-tight text-lg ${isLowStock ? 'text-rose-400' : 'text-slate-100'}`}>
                      {item.stock}
                    </td>
                  </motion.tr>
                );
              })}
              {filteredInventory.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-600 font-bold uppercase tracking-widest text-xs">
                    No items found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BranchInventory;
