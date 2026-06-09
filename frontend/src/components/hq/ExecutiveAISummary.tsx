import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, TrendingUp, AlertCircle } from 'lucide-react';

const ExecutiveAISummary: React.FC = () => {
  return (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-500/10 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
          <Sparkles size={120} className="text-amber-500" />
      </div>

      <div className="relative z-10 space-y-6">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500 rounded-lg shadow-lg shadow-amber-500/20">
                <Sparkles size={18} className="text-slate-950" />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight text-slate-100 italic">Executive AI Summary</h3>
        </div>

        <div className="space-y-4">
            <p className="text-lg font-bold text-slate-200 leading-relaxed max-w-3xl">
                Global revenue is up <span className="text-emerald-400">12.5%</span> this week, primarily driven by strong FMCG performance in the <span className="text-amber-400">KTM Main</span> branch. 
                However, <span className="text-rose-400">Lalitpur</span> is experiencing a <span className="text-rose-400">4% dip</span> in transaction volume due to localized supply chain latency.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="flex items-start gap-3 p-4 bg-slate-950/50 rounded-2xl border border-slate-800 hover:border-emerald-500/30 transition-colors">
                    <TrendingUp className="text-emerald-500 shrink-0" size={18} />
                    <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Opportunity</div>
                        <p className="text-xs font-bold text-slate-300">Stock rebalancing from Pokhara to Lalitpur could recover रु 45k in lost weekly sales.</p>
                    </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-slate-950/50 rounded-2xl border border-slate-800 hover:border-rose-500/30 transition-colors">
                    <AlertCircle className="text-rose-500 shrink-0" size={18} />
                    <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Risk Alert</div>
                        <p className="text-xs font-bold text-slate-300">Price variance in 'Fresh Produce' exceeds 8% baseline. Audit recommended for Pokhara node.</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                            <div className="w-full h-full bg-slate-700 animate-pulse" />
                        </div>
                    ))}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Analyzed 1.2M Datapoints</span>
            </div>
            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-500 hover:text-amber-400 transition-colors group/btn">
                Full Strategy Report <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ExecutiveAISummary;
