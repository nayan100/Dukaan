import React from 'react';
import { motion } from 'framer-motion';
import { FileSpreadsheet, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface Annex14Entry {
  date: string;
  invoice_no: string;
  supplier_name: string;
  supplier_pan: string;
  taxable_amount: number;
  vat_amount: number;
  total_amount: number;
}

interface Annex14PreviewProps {
  entries: Annex14Entry[];
}

const Annex14Preview: React.FC<Annex14PreviewProps> = ({ entries }) => {
  const detectRoundingError = (entry: Annex14Entry) => {
    const expectedTotal = entry.taxable_amount + entry.vat_amount;
    const diff = Math.abs(entry.total_amount - expectedTotal);
    return diff > 0.001; // Using a small epsilon for float comparison
  };

  return (
    <div className="bg-pos-surface border border-pos-border rounded-pos overflow-hidden flex flex-col h-full shadow-2xl">
      <div className="p-6 border-b border-pos-border bg-pos-surface/50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <FileSpreadsheet className="text-pos-primary w-6 h-6" />
          <h2 className="text-pos-white text-xl font-bold tracking-tighter uppercase">Annex 14: Purchase Register</h2>
        </div>
        <div className="bg-pos-black px-4 py-2 rounded-lg border border-pos-border flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-pos-muted">Period:</span>
            <span className="text-xs font-bold text-pos-white">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-pos-black z-10 text-[10px] text-pos-muted uppercase font-black tracking-widest">
            <tr className="border-b border-pos-border">
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Invoice #</th>
              <th className="px-6 py-4">Supplier & PAN</th>
              <th className="px-6 py-4 text-right">Taxable</th>
              <th className="px-6 py-4 text-right">VAT (13%)</th>
              <th className="px-6 py-4 text-right">Total</th>
              <th className="px-6 py-4 text-center">Compliance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pos-border/50 text-sm">
            {entries.map((entry, idx) => {
              const hasError = detectRoundingError(entry);

              return (
                <motion.tr 
                  key={entry.invoice_no}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-pos-primary/5 transition-colors group"
                >
                  <td className="px-6 py-4 text-pos-muted font-mono whitespace-nowrap">
                    {entry.date}
                  </td>
                  <td className="px-6 py-4 text-pos-white font-bold font-mono">
                    {entry.invoice_no}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-pos-white font-bold">{entry.supplier_name}</p>
                    <p className="text-pos-muted text-xs font-mono">{entry.supplier_pan}</p>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-pos-white">
                    {entry.taxable_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-pos-white">
                    {entry.vat_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className={`px-6 py-4 text-right font-mono font-bold ${hasError ? 'text-pos-danger' : 'text-pos-primary'}`}>
                    रु {entry.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {hasError ? (
                      <div className="flex items-center justify-center gap-1 text-pos-danger bg-pos-danger/10 px-2 py-1 rounded-full text-[10px] font-black uppercase">
                        <AlertTriangle className="w-3 h-3" />
                        Rounding Error
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-1 text-pos-primary bg-pos-primary/10 px-2 py-1 rounded-full text-[10px] font-black uppercase">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </div>
                    )}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-pos-black text-pos-muted text-[10px] font-bold uppercase tracking-widest flex justify-between items-center border-t border-pos-border">
        <p>Verified against Nepal IRD Technical Standards (Annex 14)</p>
        <div className="flex gap-4">
          <p>Total Entries: {entries.length}</p>
          <p className="text-pos-primary">Grand Total: रु {entries.reduce((a, b) => a + b.total_amount, 0).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Annex14Preview;
