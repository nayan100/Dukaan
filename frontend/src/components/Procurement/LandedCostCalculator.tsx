import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Scale, Ruler, DollarSign, Check, X, Info } from 'lucide-react';
import { distributeLandedCost } from '../../lib/LandedCostLogic';
import type { LandedCostItem } from '../../lib/LandedCostLogic';

interface LandedCostCalculatorProps {
  items: LandedCostItem[];
  onApplied: (updatedItems: LandedCostItem[]) => void;
  onCancel: () => void;
}

const LandedCostCalculator: React.FC<LandedCostCalculatorProps> = ({ items, onApplied, onCancel }) => {
  const [cost, setCost] = useState('');
  const [method, setMethod] = useState<'Value' | 'Weight'>('Value');

  const distributedItems = useMemo(() => {
    const totalCost = parseFloat(cost) || 0;
    return distributeLandedCost(items, totalCost, method);
  }, [items, cost, method]);

  return (
    <div className="bg-pos-surface border border-pos-border rounded-pos p-8 max-w-2xl w-full shadow-2xl">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <Scale className="text-pos-primary w-8 h-8" />
          <h2 className="text-pos-white text-2xl font-black uppercase tracking-tighter">Landed Cost Calculator</h2>
        </div>
        <button onClick={onCancel} className="text-pos-muted hover:text-pos-white transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
          <label className="block text-pos-muted text-xs font-black uppercase tracking-widest">Additional Cost (रु)</label>
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-pos-muted w-5 h-5" />
            <input
              type="number"
              placeholder="Enter additional cost"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="w-full bg-pos-black border border-pos-border rounded-xl px-12 py-4 text-pos-white font-mono text-2xl focus:border-pos-primary focus:ring-1 focus:ring-pos-primary outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-pos-muted text-xs font-black uppercase tracking-widest">Distribution Method</label>
          <div className="flex bg-pos-black border border-pos-border p-1 rounded-xl h-[68px]">
            <button
              onClick={() => setMethod('Value')}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg transition-all font-bold ${
                method === 'Value' ? 'bg-pos-primary text-pos-black' : 'text-pos-muted hover:text-pos-white'
              }`}
            >
              <DollarSign size={18} />
              By Value
            </button>
            <button
              onClick={() => setMethod('Weight')}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg transition-all font-bold ${
                method === 'Weight' ? 'bg-pos-primary text-pos-black' : 'text-pos-muted hover:text-pos-white'
              }`}
            >
              <Ruler size={18} />
              By Weight
            </button>
          </div>
        </div>
      </div>

      <div className="bg-pos-black/50 border border-pos-border rounded-2xl overflow-hidden mb-8">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-pos-border text-[10px] text-pos-muted uppercase font-black tracking-widest">
              <th className="px-6 py-4">Item</th>
              <th className="px-6 py-4 text-right">Base Amount</th>
              <th className="px-6 py-4 text-right">Landed Cost Share</th>
              <th className="px-6 py-4 text-right">Final Valuation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pos-border/30">
            {distributedItems.map((item) => (
              <tr key={item.id} className="hover:bg-pos-primary/5 transition-colors">
                <td className="px-6 py-4 font-bold text-pos-white">{item.name}</td>
                <td className="px-6 py-4 text-right text-pos-muted font-mono">रु {item.amount.toLocaleString()}</td>
                <td className="px-6 py-4 text-right text-pos-primary font-mono font-bold">रु {(item.landed_cost || 0).toLocaleString()}</td>
                <td className="px-6 py-4 text-right text-pos-white font-mono font-black">रु {(item.amount + (item.landed_cost || 0)).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onCancel}
          className="flex-1 px-8 py-4 border border-pos-border text-pos-white rounded-xl hover:bg-pos-border transition-colors font-bold"
        >
          Cancel
        </button>
        <button
          onClick={() => onApplied(distributedItems)}
          className="flex-1 px-8 py-4 bg-pos-primary text-pos-black rounded-xl hover:bg-pos-primary/90 transition-colors font-black uppercase tracking-widest flex items-center justify-center gap-2"
        >
          <Check size={20} />
          Apply Landed Costs
        </button>
      </div>

      <div className="mt-6 flex items-center gap-2 text-pos-muted text-[10px] uppercase font-black tracking-widest">
        <Info size={12} className="text-pos-primary" />
        Landed costs will affect stock valuation and margin analysis retroactively.
      </div>
    </div>
  );
};

export default LandedCostCalculator;
