import React from 'react';
import { Wallet, Info, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface BudgetWidgetProps {
  limit: number;
  spent: number;
  branchName: string;
}

const BudgetWidget: React.FC<BudgetWidgetProps> = ({ limit, spent, branchName }) => {
  const percentage = Math.min(100, (spent / limit) * 100);
  const remaining = Math.max(0, limit - spent);
  
  const isCritical = percentage >= 90;
  const isWarning = percentage >= 75 && !isCritical;

  return (
    <div className="bg-pos-surface/30 border border-pos-border p-6 rounded-2xl backdrop-blur-xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-pos-primary/5 blur-3xl -mr-16 -mt-16 rounded-full group-hover:bg-pos-primary/10 transition-colors" />
      
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl bg-pos-black border ${isCritical ? 'border-pos-danger' : isWarning ? 'border-pos-secondary' : 'border-pos-primary'}`}>
                <Wallet className={isCritical ? 'text-pos-danger' : isWarning ? 'text-pos-secondary' : 'text-pos-primary'} size={20} />
            </div>
            <div>
                <h3 className="text-sm font-black uppercase tracking-tight">Monthly Fiscal Limit</h3>
                <p className="text-[10px] text-pos-muted font-bold uppercase tracking-widest">{branchName} Scoped</p>
            </div>
        </div>
        {isCritical && (
            <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="bg-pos-danger/10 text-pos-danger px-3 py-1 rounded-lg border border-pos-danger/30 flex items-center gap-1.5 text-[10px] font-black uppercase"
            >
                <AlertCircle size={12} /> Critical Threshold
            </motion.div>
        )}
      </div>

      <div className="space-y-4 relative z-10">
        <div className="flex justify-between items-end">
            <div>
                <div className="text-[10px] font-black text-pos-muted uppercase tracking-widest mb-1 text-left">Current Expenditure</div>
                <div className="text-2xl font-black tracking-tight">NPR {spent.toLocaleString()}</div>
            </div>
            <div className="text-right">
                <div className="text-[10px] font-black text-pos-muted uppercase tracking-widest mb-1">Utilization</div>
                <div className={`text-sm font-black ${isCritical ? 'text-pos-danger' : isWarning ? 'text-pos-secondary' : 'text-pos-primary'}`}>
                    {percentage.toFixed(1)}%
                </div>
            </div>
        </div>

        {/* Progress Bar */}
        <div className="h-3 w-full bg-pos-black rounded-full border border-pos-border p-0.5 overflow-hidden">
            <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full rounded-full ${
                    isCritical ? 'bg-pos-danger shadow-[0_0_12px_rgba(239,68,68,0.4)]' : 
                    isWarning ? 'bg-pos-secondary shadow-[0_0_12px_rgba(245,158,11,0.4)]' : 
                    'bg-pos-primary shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                }`}
            />
        </div>

        <div className="pt-4 border-t border-pos-border/50 flex justify-between items-center">
            <div className="flex items-center gap-2 text-pos-muted">
                <Info size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Remaining NPR {remaining.toLocaleString()}</span>
            </div>
            <span className="text-[10px] font-black text-pos-muted uppercase tracking-tighter italic">Cap: NPR {limit.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default BudgetWidget;
