import React from 'react';
import { 
  History, AlertCircle, ArrowRightLeft, 
  TrendingDown, Package, MapPin, Search
} from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';

interface DeadStockItem {
  id: string;
  name: string;
  branch: string;
  qty: number;
  daysStagnant: number;
  value: number;
}

const mockDeadStock: DeadStockItem[] = [
  { id: '1', name: 'Real Juice 1L', branch: 'Pokhara', qty: 45, daysStagnant: 42, value: 11250 },
  { id: '2', name: 'Amul Butter 500g', branch: 'Butwal', qty: 12, daysStagnant: 35, value: 7200 },
  { id: '3', name: 'Fortune Oil 1L', branch: 'Lalitpur', qty: 80, daysStagnant: 51, value: 19200 },
];

const DeadStockHUD: React.FC = () => {
  return (
    <div className="min-h-screen bg-pos-black p-10 text-pos-white font-sans selection:bg-pos-primary/30">
      <header className="flex justify-between items-end border-b border-pos-border pb-10 mb-10">
        <div>
            <div className="flex items-center gap-3 mb-2">
                <TrendingDown className="text-pos-danger" size={24} />
                <span className="text-xs font-black uppercase tracking-[0.3em] text-pos-danger">Capital Efficiency Protocol</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic">Dead Stock Rebalancer</h1>
            <p className="text-pos-muted font-medium mt-2">Identify and move stagnant inventory (&gt;30 days)</p>
        </div>
        
        <div className="flex gap-4">
          <div className="flex items-center gap-3 bg-pos-surface/50 border border-pos-border px-6 py-3 rounded-xl font-bold backdrop-blur-md">
            <Package size={18} className="text-pos-secondary" />
            <span className="text-sm uppercase tracking-wider">Stagnant Value: NPR 37,650</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-10">
        <div className="col-span-2 space-y-6">
            {mockDeadStock.map((item) => (
                <motion.div 
                    key={item.id}
                    whileHover={{ x: 4 }}
                    className="bg-pos-surface/30 border border-pos-border p-6 rounded-2xl backdrop-blur-xl flex justify-between items-center group hover:border-pos-danger/30 transition-all"
                >
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-pos-black border border-pos-border flex items-center justify-center relative">
                            <Package size={32} className="text-pos-muted group-hover:text-pos-danger transition-colors" />
                            <div className="absolute -top-2 -right-2 bg-pos-danger text-pos-white text-[10px] font-black px-2 py-0.5 rounded-full">
                                {item.daysStagnant}D
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-black tracking-tight">{item.name}</h3>
                            <div className="flex items-center gap-4 mt-1">
                                <div className="flex items-center gap-1.5 text-xs text-pos-muted font-bold uppercase">
                                    <MapPin size={12} /> {item.branch}
                                </div>
                                <div className="text-xs text-pos-muted font-bold uppercase tracking-tighter">
                                    Qty: <span className="text-pos-white">{item.qty}</span>
                                </div>
                                <div className="text-xs text-pos-muted font-bold uppercase tracking-tighter">
                                    Value: <span className="text-pos-primary">NPR {item.value.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="text-right mr-4">
                            <div className="text-[10px] font-black uppercase text-pos-muted mb-1">Recommended Action</div>
                            <div className="text-xs font-bold text-pos-secondary italic">Transfer to KTM Main (High Demand)</div>
                        </div>
                        <Button variant="primary" size="lg" className="h-14 px-8 gap-3 group/btn">
                            <ArrowRightLeft size={18} />
                            <span className="uppercase font-black tracking-tighter">Quick Transfer</span>
                        </Button>
                    </div>
                </motion.div>
            ))}
        </div>

        <aside className="space-y-6">
            <div className="bg-pos-surface/50 border border-pos-border p-8 rounded-2xl backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-8">
                    <HistoryIcon className="text-pos-primary" />
                    <h2 className="text-lg font-black tracking-tight uppercase">Recent Optimizations</h2>
                </div>
                
                <div className="space-y-6">
                    <div className="border-l-2 border-pos-primary pl-4 py-1">
                        <div className="text-xs font-black uppercase text-pos-primary mb-1">Completed</div>
                        <p className="text-sm font-bold leading-tight">Moved 20x 'Dairy Milk' from Butwal to KTM Main.</p>
                        <span className="text-[10px] text-pos-muted mt-2 block font-medium uppercase">Saving: NPR 3,600 in waste</span>
                    </div>
                    <div className="border-l-2 border-pos-border pl-4 py-1 opacity-50">
                        <div className="text-xs font-black uppercase text-pos-muted mb-1">2 Days Ago</div>
                        <p className="text-sm font-bold leading-tight">Rebalanced 'Lays Chips' across 3 nodes.</p>
                    </div>
                </div>
            </div>

            <div className="bg-pos-danger/5 border border-pos-danger/20 p-8 rounded-2xl backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-4">
                    <AlertCircle className="text-pos-danger" />
                    <h2 className="text-lg font-black tracking-tight uppercase text-pos-danger">Risk Warning</h2>
                </div>
                <p className="text-xs font-medium text-pos-muted leading-relaxed uppercase tracking-wide">
                    Stagnant inventory reduces liquidity. The system identifies NPR 12,400 at risk of expiry within 14 days.
                </p>
                <Button variant="danger" className="w-full mt-6 h-12 text-xs uppercase font-black tracking-widest">
                    Run Waste Audit
                </Button>
            </div>
        </aside>
      </div>
    </div>
  );
};

export default DeadStockHUD;
dStockHUD;
