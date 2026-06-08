import React from 'react';
import { useHQStore } from '../../store/useHQStore';
import { Building2, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const ComparativeAnalytics: React.FC = () => {
  const { analytics } = useHQStore();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
      <div className="p-8 border-b border-slate-800 flex justify-between items-center">
        <h3 className="text-xl font-black uppercase tracking-tight text-slate-200">Branch Performance Matrix</h3>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 bg-slate-950 px-3 py-1 rounded-full">
          Real-time Comparison
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-950/50">
              <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Branch</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Revenue</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Transactions</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Avg Ticket</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Efficiency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {analytics.branchPerformance.map((branch) => {
              const avgTicket = branch.revenue / (branch.transactions || 1);
              const efficiency = branch.revenue > 300000 ? 'high' : branch.revenue > 200000 ? 'mid' : 'low';
              
              return (
                <tr key={branch.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 group-hover:border-emerald-500/30 transition-colors">
                        <Building2 size={16} className="text-slate-400 group-hover:text-emerald-400 transition-colors" />
                      </div>
                      <span className="font-bold text-slate-200">{branch.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="font-black italic text-emerald-400">रु {branch.revenue.toLocaleString()}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="font-bold text-slate-300">{branch.transactions.toLocaleString()}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="font-bold text-slate-300">रु {avgTicket.toFixed(0)}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       {efficiency === 'high' ? (
                         <TrendingUp size={16} className="text-emerald-400" />
                       ) : efficiency === 'mid' ? (
                         <Minus size={16} className="text-amber-400" />
                       ) : (
                         <TrendingDown size={16} className="text-rose-400" />
                       )}
                       <span className={`text-[10px] font-black uppercase tracking-widest ${
                         efficiency === 'high' ? 'text-emerald-400' : efficiency === 'mid' ? 'text-amber-400' : 'text-rose-400'
                       }`}>
                         {efficiency}
                       </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparativeAnalytics;
