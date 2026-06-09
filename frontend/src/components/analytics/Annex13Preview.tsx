import React from 'react';
import { motion } from 'framer-motion';
import { FileSpreadsheet, CheckCircle2, Clock, ShieldCheck, Award, AlertCircle } from 'lucide-react';

interface Annex13Entry {
  invoice_id: string;
  created_at: number;
  customer_name?: string;
  taxable_amount: number;
  vat_amount: number;
  total: number;
  synced: boolean;
}

interface Annex13PreviewProps {
  entries: Annex13Entry[];
}

const Annex13Preview: React.FC<Annex13PreviewProps> = ({ entries }) => {
  return (
    <div className="bg-pos-surface border border-pos-border rounded-pos overflow-hidden flex flex-col h-full shadow-2xl">
      <div className="p-6 border-b border-pos-border bg-pos-surface/50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <FileSpreadsheet className="text-pos-secondary w-6 h-6" />
          <h2 className="text-pos-white text-xl font-bold tracking-tighter uppercase">Annex 13: Sales Register</h2>
        </div>
        <div className="bg-pos-black px-4 py-2 rounded-lg border border-pos-border flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-pos-muted">Protocol:</span>
            <span className="text-xs font-bold text-pos-white">Compliance Standard v2.1</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto max-h-[500px]">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-pos-black z-10 text-[10px] text-pos-muted uppercase font-black tracking-widest">
            <tr className="border-b border-pos-border">
              <th className="px-6 py-4">Transaction Date</th>
              <th className="px-6 py-4">Invoice #</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4 text-right">Taxable (NPR)</th>
              <th className="px-6 py-4 text-right">VAT (13%)</th>
              <th className="px-6 py-4 text-right">Total</th>
              <th className="px-6 py-4 text-center">IRD Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pos-border/50 text-sm">
            {entries.length === 0 ? (
                <tr>
                    <td colSpan={7} className="px-6 py-20 text-center text-pos-muted italic uppercase font-bold tracking-widest opacity-30">
                        No sales recorded for this period
                    </td>
                </tr>
            ) : (
                entries.map((entry, idx) => (
                    <motion.tr 
                      key={entry.invoice_id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-pos-secondary/5 transition-colors group"
                    >
                      <td className="px-6 py-4 text-pos-muted font-mono whitespace-nowrap">
                        {new Date(entry.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-pos-white font-bold font-mono">
                        {entry.invoice_id}
                      </td>
                      <td className="px-6 py-4 text-pos-white font-medium">
                        {entry.customer_name || 'Counter Sale'}
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-pos-white">
                        {entry.taxable_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-pos-white">
                        {entry.vat_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-pos-secondary">
                        NPR {entry.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {entry.synced ? (
                          <div className="flex flex-col items-center gap-1 group relative">
                            <motion.div 
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="p-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                            >
                                <Award size={14} className="text-emerald-500" />
                            </motion.div>
                            <span className="text-[8px] font-black uppercase tracking-tighter text-emerald-500/80">Compliance Seal</span>
                            
                            {/* Hover Detail */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 p-2 bg-slate-900 border border-slate-800 rounded-lg text-[9px] font-bold text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30 shadow-2xl">
                                IRD Verified: {new Date(entry.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-1 opacity-50 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all">
                            <AlertCircle size={14} className="text-amber-500" />
                            <span className="text-[8px] font-black uppercase tracking-tighter text-amber-500 italic text-center">Pending<br/>Transmission</span>
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  ))
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-pos-black text-pos-muted text-[10px] font-bold uppercase tracking-widest flex justify-between items-center border-t border-pos-border">
        <p>Government Certified Reporting Module</p>
        <div className="flex gap-6">
          <p>Count: {entries.length}</p>
          <p className="text-pos-secondary font-black">Grand Total: NPR {entries.reduce((a, b) => a + b.total, 0).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Annex13Preview;
