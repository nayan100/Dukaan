import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Database, Save, ArrowUpDown } from 'lucide-react';

interface Item {
  id: string;
  name: string;
  current_stock: number;
  price?: number;
}

interface OpeningStockGridProps {
  items: Item[];
  onSave: (stockEntries: any[]) => void;
}

const OpeningStockGrid: React.FC<OpeningStockGridProps> = ({ items, onSave }) => {
  const [stock, setStock] = useState<Record<string, string>>({});
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleStockChange = (id: string, value: string) => {
    setStock(prev => ({ ...prev, [id]: value }));
  };

  const totalValue = items.reduce((acc, item) => {
    const qty = parseFloat(stock[item.id] || '0');
    return acc + (qty * (item.price || 0));
  }, 0);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextItem = items[index + 1];
      if (nextItem) {
        inputRefs.current[nextItem.id]?.focus();
        inputRefs.current[nextItem.id]?.select();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevItem = items[index - 1];
      if (prevItem) {
        inputRefs.current[prevItem.id]?.focus();
        inputRefs.current[prevItem.id]?.select();
      }
    }
  };

  const handleSave = () => {
    const entries = items.map(item => ({
      item_id: item.id,
      opening_stock: parseFloat(stock[item.id] || '0')
    })).filter(e => e.opening_stock > 0);
    onSave(entries);
  };

  return (
    <div className="bg-pos-surface border border-pos-border rounded-pos overflow-hidden flex flex-col h-full shadow-2xl">
      <div className="p-6 border-b border-pos-border flex justify-between items-center bg-pos-surface/50">
        <div className="flex items-center gap-3">
          <Database className="text-pos-primary w-6 h-6" />
          <h2 className="text-pos-white text-xl font-bold uppercase tracking-tighter">Opening Stock Grid</h2>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-pos-muted text-[10px] font-black uppercase tracking-widest">Total Valuation</p>
            <p className="text-pos-primary text-2xl font-mono font-bold">रु {totalValue.toLocaleString()}</p>
          </div>
          <button
            onClick={handleSave}
            className="bg-pos-primary text-pos-black px-6 py-2 rounded-md font-bold hover:bg-pos-primary/90 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Stock
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-pos-black z-10">
            <tr className="border-b border-pos-border text-pos-muted text-xs uppercase font-black tracking-widest">
              <th className="px-6 py-4">Item Name</th>
              <th className="px-6 py-4">Current Stock</th>
              <th className="px-6 py-4 w-40 text-center">New Opening Stock</th>
              <th className="px-6 py-4 text-right">Unit Price</th>
              <th className="px-6 py-4 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pos-border/50">
            {items.map((item, index) => {
              const qty = parseFloat(stock[item.id] || '0');
              const subtotal = qty * (item.price || 0);

              return (
                <motion.tr 
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-pos-primary/5 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <p className="text-pos-white font-bold">{item.name}</p>
                    <p className="text-pos-muted text-[10px]">ID: {item.id}</p>
                  </td>
                  <td className="px-6 py-4 text-pos-muted font-mono">
                    {item.current_stock} units
                  </td>
                  <td className="px-6 py-4">
                    <input
                      ref={el => inputRefs.current[item.id] = el}
                      type="number"
                      placeholder="0"
                      value={stock[item.id] || ''}
                      onChange={(e) => handleStockChange(item.id, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className="w-full bg-pos-black border border-pos-border rounded px-3 py-2 text-pos-white font-mono text-center focus:border-pos-primary focus:ring-1 focus:ring-pos-primary outline-none transition-all group-hover:border-pos-primary/30"
                    />
                  </td>
                  <td className="px-6 py-4 text-right text-pos-muted font-mono">
                    रु {(item.price || 0).toLocaleString()}
                  </td>
                  <td className={`px-6 py-4 text-right font-mono font-bold ${subtotal > 0 ? 'text-pos-primary' : 'text-pos-muted'}`}>
                    रु {subtotal.toLocaleString()}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-pos-black/50 border-t border-pos-border flex items-center gap-4 text-pos-muted text-xs italic">
        <ArrowUpDown className="w-4 h-4" />
        Use Arrow Keys or Enter to navigate the grid rapidly.
      </div>
    </div>
  );
};

export default OpeningStockGrid;
