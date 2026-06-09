import React from 'react';
import { 
  AlertTriangle, ShieldAlert, BarChart3, 
  History as HistoryIcon, Hash, Search, Filter, ArrowUpRight,
  Flag, CheckCircle2, MessageSquare, Radar as RadarIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer 
} from 'recharts';
import Button from '../ui/Button';
import { useFinanceStore } from '../../store/financeStore';

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
  { id: 'PV-001', item: 'Real Juice 1L', branch: 'Butwal', expected: 250, actual: 230, variance: -20, version: 'v1.4.2', timestamp: '2026-06-06 10:15' },
  { id: 'PV-002', item: 'Amul Butter 500g', branch: 'Pokhara', expected: 600, actual: 580, variance: -20, version: 'v1.4.2', timestamp: '2026-06-06 11:30' },
  { id: 'PV-003', item: 'Dairy Milk Silk', branch: 'Lalitpur', expected: 180, actual: 180, variance: 0, version: 'v1.4.1', timestamp: '2026-06-06 09:45' },
];

const radarData = [
  { subject: 'Inventory', budget: 120, actual: 110, fullMark: 150 },
  { subject: 'Procurement', budget: 98, actual: 130, fullMark: 150 },
  { subject: 'Payroll', budget: 86, actual: 130, fullMark: 150 },
  { subject: 'Operations', budget: 99, actual: 100, fullMark: 150 },
  { subject: 'VAT/Tax', budget: 85, actual: 90, fullMark: 150 },
  { subject: 'Marketing', budget: 65, actual: 85, fullMark: 150 },
];

const FinanceAuditHUD: React.FC = () => {
  const { toggleFlag, flags } = useFinanceStore();

  return (
    <div className="min-h-full bg-slate-950 p-10 text-slate-200 font-sans selection:bg-amber-500/30">
      <header className="flex justify-between items-end border-b border-slate-900 pb-10 mb-10">
        <div>
            <div className="flex items-center gap-3 mb-2">
                <ShieldAlert className="text-amber-500" size={24} />
                <span className="text-xs font-black uppercase tracking-[0.3em] text-amber-500/80">Fiscal Oversight Layer</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic text-slate-100">Accountant Audit Hub</h1>
            <p className="text-slate-500 font-medium mt-2">Price variance reporting and fraud detection (Discount Velocity)</p>
        </div>
        
        <div className="flex gap-4">
          <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-6 py-3 rounded-xl font-bold backdrop-blur-md">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            <span className="text-sm uppercase tracking-wider text-slate-300">Review Required: 12 Entries</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-4 gap-10">
        {/* Sidebar Analytics */}
        <div className="col-span-1 space-y-6">
            {/* Financial Health Radar */}
            <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-8">
                    <RadarIcon className="text-amber-500" size={20} />
                    <h2 className="text-lg font-black tracking-tight uppercase text-slate-200">Financial Health Radar</h2>
                </div>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                            <PolarGrid stroke="#1e293b" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                            <Radar
                                name="Budget"
                                dataKey="budget"
                                stroke="#10b981"
                                fill="#10b981"
                                fillOpacity={0.3}
                            />
                            <Radar
                                name="Actual"
                                dataKey="actual"
                                stroke="#f59e0b"
                                fill="#f59e0b"
                                fillOpacity={0.4}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-6 flex justify-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                        <span className="text-[10px] font-black text-slate-500 uppercase">Budget</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-amber-500 rounded-full" />
                        <span className="text-[10px] font-black text-slate-500 uppercase">Actual</span>
                    </div>
                </div>
            </div>

            {/* Discount Velocity */}
            <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-8">
                    <BarChart3 className="text-rose-500" />
                    <h2 className="text-lg font-black tracking-tight uppercase text-slate-200">Discount Velocity</h2>
                </div>
                
                <div className="space-y-8">
                    <div className="group">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-xs font-bold text-slate-500 uppercase">Lalitpur Branch</span>
                            <span className="text-sm font-black text-rose-500">22.4%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                            <motion.div initial={{ width: 0 }} animate={{ width: '22.4%' }} className="h-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]" />
                        </div>
                    </div>
                    <div className="group">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-xs font-bold text-slate-500 uppercase">Pokhara Branch</span>
                            <span className="text-sm font-black text-amber-500">8.1%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                            <motion.div initial={{ width: 0 }} animate={{ width: '8.1%' }} className="h-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
                        </div>
                    </div>
                </div>

                <div className="mt-10 p-4 border border-rose-500/20 bg-rose-500/5 rounded-xl">
                    <div className="flex items-center gap-2 text-rose-500 mb-2">
                        <AlertTriangle size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Fraud Risk Flag</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed uppercase font-bold">
                        Cashier 'Rajesh' exceeds 20% max-discount threshold. Immediate audit recommended.
                    </p>
                </div>
            </div>
        </div>

        {/* Price Variance Grid */}
        <div className="col-span-3 space-y-8">
            <div className="bg-slate-900/30 border border-slate-800 rounded-2xl backdrop-blur-xl overflow-hidden">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/20">
                    <h3 className="text-xl font-black uppercase tracking-tight italic text-slate-200">Price Variance Report</h3>
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
                        <tr className="bg-slate-950 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                            <th className="p-6">Item / Branch</th>
                            <th className="p-6">Expected</th>
                            <th className="p-6">Actual</th>
                            <th className="p-6">Variance</th>
                            <th className="p-6">Compliance</th>
                            <th className="p-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {mockVariances.map(row => {
                            const isFlagged = flags[row.id]?.includes('suspicious_price');

                            return (
                                <motion.tr key={row.id} className="hover:bg-amber-500/5 transition-colors group h-[80px]">
                                    <td className="p-6">
                                        <div className="font-bold text-sm text-slate-200">{row.item}</div>
                                        <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{row.branch}</div>
                                    </td>
                                    <td className="p-6 font-mono text-sm text-slate-400">रु {row.expected}</td>
                                    <td className="p-6 font-mono text-sm text-slate-100">रु {row.actual}</td>
                                    <td className={`p-6 font-black text-sm ${row.variance < 0 ? 'text-rose-500' : row.variance > 0 ? 'text-emerald-500' : 'text-slate-600'}`}>
                                        {row.variance === 0 ? '-' : `रु ${row.variance}`}
                                    </td>
                                    <td className="p-6">
                                        {isFlagged ? (
                                            <div className="flex items-center gap-1 text-rose-500 bg-rose-500/10 px-2 py-1 rounded-full text-[10px] font-black uppercase w-fit">
                                                <Flag size={10} fill="currentColor" /> Flagged for Review
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full text-[10px] font-black uppercase w-fit">
                                                <CheckCircle2 size={10} /> Verified
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => toggleFlag(row.id, 'suspicious_price')}
                                                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                                    isFlagged ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                                }`}
                                            >
                                                {isFlagged ? 'Unflag' : 'Reconcile'}
                                            </button>
                                            <button className="p-1.5 rounded-lg bg-slate-800 text-slate-500 hover:text-amber-500 hover:bg-slate-700 transition-all opacity-0 group-hover:opacity-100">
                                                <MessageSquare size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceAuditHUD;
