import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Search, AlertTriangle, ArrowUpRight, TrendingUp, Box } from 'lucide-react';
import Button from '../ui/Button';
import { useInventoryStore } from '../../store/inventoryStore';

const StatCard = ({ title, value, subtext, icon: Icon, alert = false }: any) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className={`bg-pos-surface/50 border ${alert ? 'border-pos-danger/50' : 'border-pos-border'} p-6 rounded-2xl backdrop-blur-xl relative overflow-hidden group`}
  >
    <div className={`absolute top-0 right-0 w-24 h-24 blur-3xl -mr-12 -mt-12 rounded-full transition-colors ${alert ? 'bg-pos-danger/10 group-hover:bg-pos-danger/20' : 'bg-pos-primary/5 group-hover:bg-pos-primary/10'}`} />
    <div className="flex justify-between items-start mb-6">
      <div className={`w-12 h-12 rounded-xl bg-pos-black flex items-center justify-center border shadow-inner transition-colors ${alert ? 'border-pos-danger/50 text-pos-danger' : 'border-pos-border group-hover:border-pos-primary/50 text-pos-primary'}`}>
        <Icon size={24} />
      </div>
    </div>
    <div className="text-xs text-pos-muted uppercase font-black tracking-widest mb-1">{title}</div>
    <div className={`text-3xl font-black tracking-tight ${alert ? 'text-pos-danger' : 'text-pos-white'}`}>{value}</div>
    <div className="text-[10px] font-bold text-pos-muted mt-2">{subtext}</div>
  </motion.div>
);

const BranchDashboard: React.FC = () => {
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
    <div className="p-10 space-y-10 max-w-7xl mx-auto min-h-full">
      <header className="flex justify-between items-end border-b border-pos-border pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
              <Package className="text-pos-primary" size={24} />
              <span className="text-xs font-black uppercase tracking-[0.3em] text-pos-primary">Local Intelligence</span>
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tighter text-pos-white mb-2 italic">Branch Dashboard</h2>
          <p className="text-pos-muted font-bold tracking-tight">Active inventory and local operational metrics.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total SKU Count" value={totalItems} subtext="Active items in catalog" icon={Box} />
        <StatCard title="Inventory Value" value={`NPR ${totalValue.toLocaleString()}`} subtext="Total valuation of local stock" icon={TrendingUp} />
        <StatCard title="Low Stock Alerts" value={lowStockItems} subtext="Items below minimum threshold" icon={AlertTriangle} alert={lowStockItems > 0} />
      </div>

      <div className="bg-pos-surface border border-pos-border rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="flex justify-between items-center mb-8">
           <h3 className="text-xl font-black uppercase tracking-tighter text-pos-white">Current Active Inventory</h3>
           <div className="relative group w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-pos-muted group-focus-within:text-pos-primary transition-colors" size={18} />
              <input 
                  type="text" 
                  placeholder="Search inventory..." 
                  className="w-full bg-pos-black/50 border border-pos-border focus:border-pos-primary rounded-xl py-2 pl-12 pr-4 text-sm font-semibold transition-all outline-none placeholder:text-pos-muted/50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-pos-black/50 text-[10px] text-pos-muted uppercase font-black tracking-widest border-b border-pos-border">
              <tr>
                <th className="px-6 py-4 rounded-tl-xl">Item Code</th>
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4 text-right">Unit Price</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right rounded-tr-xl">Current Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pos-border/50">
              {filteredInventory.map((item) => {
                const isLowStock = item.stock <= item.min_stock;
                return (
                  <motion.tr 
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-pos-primary/5 transition-colors group"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-pos-muted">{item.code}</td>
                    <td className="px-6 py-4 font-bold text-pos-white">{item.name}</td>
                    <td className="px-6 py-4 text-right font-mono">NPR {item.price.toLocaleString()}</td>
                    <td className="px-6 py-4 text-center">
                      {isLowStock ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-pos-danger/10 text-pos-danger border border-pos-danger/20">
                          <AlertTriangle size={10} /> Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-pos-primary/10 text-pos-primary border border-pos-primary/20">
                          Optimal
                        </span>
                      )}
                    </td>
                    <td className={`px-6 py-4 text-right font-black tracking-tight text-lg ${isLowStock ? 'text-pos-danger' : 'text-pos-white'}`}>
                      {item.stock}
                    </td>
                  </motion.tr>
                );
              })}
              {filteredInventory.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-pos-muted font-bold uppercase tracking-widest text-xs">
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

export default BranchDashboard;
