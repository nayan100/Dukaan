import React from 'react';
import { 
  AlertTriangle, ShieldAlert, BarChart3, 
  History, Hash, Search, Filter, ArrowUpRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';

interface PriceVariance {
  id: string;
  item: string;
  branch: string;
  expected: number;
  actual: number;
  variance: number;
  version: string;
  timestamp: string;
}

const mockVariances: PriceVariance[] = [
  { id: '1', item: 'Real Juice 1L', branch: 'Butwal', expected: 250, actual: 230, variance: -20, version: 'v1.4.2', timestamp: '2026-06-06 10:15' },
  { id: '2', item: 'Amul Butter 500g', branch: 'Pokhara', expected: 600, actual: 580, variance: -20, version: 'v1.4.2', timestamp: '2026-06-06 11:30' },
  { id: '3', item: 'Dairy Milk Silk', branch: 'Lalitpur', expected: 180, actual: 180, variance: 0, version: 'v1.4.1', timestamp: '2026-06-06 09:45' },
];

const FinanceAuditHUD: React.FC = () => {
  return (
    <div className="min-h-screen bg-pos-black p-10 text-pos-white font-sans selection:bg-pos-primary/30">
      <header className="flex justify-between items-end border-b border-pos-border pb-10 mb-10">
        <div>
            <div className="flex items-center gap-3 mb-2">
                <ShieldAlert className="text-pos-secondary" size={24} />
                <span className="text-xs font-black uppercase tracking-[0.3em] text-pos-secondary">Fiscal Oversight Protocol</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic">Accountant Audit Hub</h1>
            <p className="text-pos-muted font-medium mt-2">Price variance reporting and fraud detection (Discount Velocity)</p>
        </div>
        
        <div className="flex gap-4">
          <div className="flex items-center gap-3 bg-pos-surface/50 border border-pos-border px-6 py-3 rounded-xl font-bold backdrop-blur-md">
            <div className="w-2 h-2 bg-pos-secondary rounded-full animate-pulse" />
            <span className="text-sm uppercase tracking-wider">Review Required: 12 Entries</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-4 gap-10">
        {/* Fraud Dashboard (Discount Velocity) */}
        <div className="col-span-1 space-y-6">
            <div className="bg-pos-surface/50 border border-pos-border p-8 rounded-2xl backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-8">
                    <BarChart3 className="text-pos-danger" />
                    <h2 className="text-lg font-black tracking-tight uppercase">Discount Velocity</h2>
                </div>
                
                <div className="space-y-8">
                    <div className="group">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-xs font-bold text-pos-muted uppercase">Lalitpur Branch</span>
                            <span className="text-sm font-black text-pos-danger">22.4%</span>
                        </div>
                        <div className="h-2 w-full bg-pos-black rounded-full overflow-hidden border border-pos-border">
                            <motion.div initial={{ width: 0 }} animate={{ width: '22.4%' }} className="h-full bg-pos-danger" />
                        </div>
                    </div>
                    <div className="group">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-xs font-bold text-pos-muted uppercase">Pokhara Branch</span>
                            <span className="text-sm font-black text-pos-primary">8.1%</span>
                        </div>
                        <div className="h-2 w-full bg-pos-black rounded-full overflow-hidden border border-pos-border">
                            <motion.div initial={{ width: 0 }} animate={{ width: '8.1%' }} className="h-full bg-pos-primary" />
                        </div>
                    </div>
                </div>

                <div className="mt-10 p-4 border border-pos-danger/20 bg-pos-danger/5 rounded-xl">
                    <div className="flex items-center gap-2 text-pos-danger mb-2">
                        <AlertTriangle size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Fraud Risk Flag</span>
                    </div>
                    <p className="text-[10px] text-pos-muted leading-relaxed uppercase font-bold">
                        Cashier 'Rajesh' exceeds 20% max-discount threshold. Immediate audit recommended.
                    </p>
                </div>
            </div>
        </div>

        {/* Price Variance Grid */}
        <div className="col-span-3 space-y-8">
            <div className="bg-pos-surface/30 border border-pos-border rounded-2xl backdrop-blur-xl overflow-hidden">
                <div className="p-6 border-b border-pos-border flex justify-between items-center bg-pos-black/20">
                    <h3 className="text-xl font-black uppercase tracking-tight italic">Price Variance Report</h3>
                    <div className="flex gap-2">
                        <Button variant="muted" size="sm" className="gap-2 uppercase text-[10px] font-black">
                            <Filter size={14} /> Filter
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2 uppercase text-[10px] font-black">
                            <Hash size={14} /> Export CSV
                        </Button>
                    </div>
                </div>

                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-pos-black text-[10px] font-black text-pos-muted uppercase tracking-widest border-b border-pos-border">
                            <th className="p-6">Item / Branch</th>
                            <th className="p-6">Expected</th>
                            <th className="p-6">Actual</th>
                            <th className="p-6">Variance</th>
                            <th className="p-6">Version</th>
                            <th className="p-6">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-pos-border/50">
                        {mockVariances.map(row => (
                            <tr key={row.id} className="hover:bg-pos-primary/5 transition-colors group">
                                <td className="p-6">
                                    <div className="font-bold text-sm">{row.item}</div>
                                    <div className="text-[10px] text-pos-muted font-black uppercase">{row.branch}</div>
                                </td>
                                <td className="p-6 font-mono text-sm">NPR {row.expected}</td>
                                <td className="p-6 font-mono text-sm">NPR {row.actual}</td>
                                <td className={`p-6 font-black text-sm ${row.variance < 0 ? 'text-pos-danger' : 'text-pos-primary'}`}>
                                    {row.variance === 0 ? '-' : `NPR ${row.variance}`}
                                </td>
                                <td className="p-6">
                                    <span className="text-[10px] font-bold bg-pos-black px-2 py-1 border border-pos-border rounded uppercase text-pos-muted">
                                        {row.version}
                                    </span>
                                </td>
                                <td className="p-6 text-right">
                                    <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 uppercase text-[10px] font-black transition-all">
                                        Reconcile
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceAuditHUD;
