import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  History as HistoryIcon, Search, Filter, 
  ArrowUpRight, ArrowDownLeft, 
  Clock, Download, Calendar
} from 'lucide-react';
import { getAllInvoices } from '../../lib/db';

const SalesHistory: React.FC = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'sale' | 'return'>('all');

  useEffect(() => {
    const fetchInvoices = async () => {
      const all = await getAllInvoices();
      // Sort by date descending
      setInvoices(all.sort((a, b) => b.created_at - a.created_at));
    };
    fetchInvoices();
  }, []);

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.invoice_id.toLowerCase().includes(searchTerm.toLowerCase());
    const isReturn = inv.total < 0; // Simple logic for return
    const matchesFilter = filter === 'all' || 
                         (filter === 'sale' && !isReturn) || 
                         (filter === 'return' && isReturn);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-10 space-y-10 max-w-7xl mx-auto min-h-full">
      <header className="flex justify-between items-end border-b border-slate-800 pb-8">
        <div>
            <div className="flex items-center gap-3 mb-2">
                <HistoryIcon className="text-emerald-400" size={24} />
                <span className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400">Transaction Audit</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic text-slate-100">Sales & Return History</h1>
            <p className="text-slate-400 font-medium mt-2">Comprehensive log of local branch revenue events.</p>
        </div>
        <div className="flex gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:border-slate-700 transition-all">
                <Calendar size={14} /> Custom Range
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:border-slate-700 transition-all">
                <Download size={14} /> Export CSV
            </button>
        </div>
      </header>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
           <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 w-full md:w-auto">
                <button 
                    onClick={() => setFilter('all')}
                    className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'all' ? 'bg-slate-800 text-emerald-400 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    All Events
                </button>
                <button 
                    onClick={() => setFilter('sale')}
                    className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'sale' ? 'bg-slate-800 text-emerald-400 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Sales
                </button>
                <button 
                    onClick={() => setFilter('return')}
                    className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'return' ? 'bg-slate-800 text-emerald-400 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Returns
                </button>
           </div>

           <div className="relative group w-full md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
              <input 
                  type="text" 
                  placeholder="Search invoice ID..." 
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500/50 rounded-xl py-2.5 pl-12 pr-4 text-sm font-semibold transition-all outline-none text-slate-200 placeholder:text-slate-700"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-950 text-[10px] text-slate-500 uppercase font-black tracking-widest border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 rounded-tl-xl">Invoice Ref</th>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4 text-center">Type</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right rounded-tr-xl">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredInvoices.map((inv) => {
                const isReturn = inv.total < 0;
                return (
                  <motion.tr 
                    key={inv.invoice_id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-slate-800/50 transition-colors group"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-slate-300 font-bold">{inv.invoice_id}</td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-400">
                            <Clock size={12} />
                            <span className="text-xs font-bold">{new Date(inv.created_at).toLocaleString()}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {isReturn ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          <ArrowDownLeft size={10} /> Return
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <ArrowUpRight size={10} /> Sale
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Verified</span>
                    </td>
                    <td className={`px-6 py-4 text-right font-black tracking-tight text-lg ${isReturn ? 'text-rose-400' : 'text-slate-100'}`}>
                      रु {Math.abs(inv.total).toLocaleString()}
                    </td>
                  </motion.tr>
                );
              })}
              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-slate-600 font-bold uppercase tracking-widest text-xs italic">
                    No transactions found in this period.
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

export default SalesHistory;

