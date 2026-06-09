import React, { useMemo, useEffect, useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar 
} from 'recharts';
import { useHQStore } from '../../store/useHQStore';
import { aggregateGlobalKPIs, getInventoryPerformance } from '../../lib/hqAnalytics';
import { DollarSign, ShoppingCart, TrendingUp, Package, Sparkles, Zap } from 'lucide-react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ComparativeAnalytics from './ComparativeAnalytics';
import AISuggestionsOverlay from './AISuggestionsOverlay';
import BranchLeaderboard from './BranchLeaderboard';
import ExecutiveAISummary from './ExecutiveAISummary';

const MOCK_BRANCHES = [
  { 
    id: 'B1', 
    name: 'KTM Main', 
    revenue: 450000, 
    transactions: 1240, 
    inventory: [
      { item: 'Rice 5kg', stock: 45, sales: 120 }, 
      { item: 'Oil 1L', stock: 30, sales: 85 },
      { item: 'Wai Wai', stock: 500, sales: 1200 }
    ] 
  },
  { 
    id: 'B2', 
    name: 'Pokhara', 
    revenue: 320000, 
    transactions: 890, 
    inventory: [
      { item: 'Rice 5kg', stock: 20, sales: 90 }, 
      { item: 'Soap', stock: 15, sales: 45 }
    ] 
  },
  { 
    id: 'B3', 
    name: 'Lalitpur', 
    revenue: 280000, 
    transactions: 750, 
    inventory: [
      { item: 'Oil 1L', stock: 15, sales: 60 },
      { item: 'Wai Wai', stock: 200, sales: 450 }
    ] 
  },
];

const HQLayout: React.FC = () => {
  const [showAI, setShowAI] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    // Populate store with mock data
    useHQStore.setState({
      analytics: {
        globalRevenue: 1050000,
        branchPerformance: MOCK_BRANCHES
      }
    });
  }, []);

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white font-sans overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex-1 overflow-auto"
        >
            <Outlet context={{ onOpenAI: () => setShowAI(true) }} />
        </motion.div>
      </AnimatePresence>

      <AISuggestionsOverlay isOpen={showAI} onClose={() => setShowAI(false)} />
    </div>
  );
};

export const ScorecardView: React.FC<{ onOpenAI?: () => void }> = ({ onOpenAI }) => {
  const analytics = useHQStore(s => s.analytics);
  const kpis = useMemo(() => aggregateGlobalKPIs(analytics.branchPerformance), [analytics.branchPerformance]);
  const inventory = useMemo(() => getInventoryPerformance(analytics.branchPerformance), [analytics.branchPerformance]);

  return (
    <div className="p-10 space-y-10">
      <header className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-2">
              <Package className="text-emerald-400" size={24} />
              <span className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400/80">Chain Intelligence</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic text-slate-100">Executive Scorecard</h1>
          <p className="text-slate-400 font-medium mt-2">Real-time performance metrics across the retail network</p>
        </div>
        <button 
          onClick={onOpenAI}
          className="flex items-center gap-3 bg-amber-500 text-slate-950 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/10"
        >
          <Sparkles size={18} /> AI Suggestions Hub
        </button>
      </header>

      <ExecutiveAISummary />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Total Revenue" value={`रु ${kpis.totalRevenue.toLocaleString()}`} icon={DollarSign} color="text-emerald-400" trend="+12.5%" />
        <KPICard title="Transaction Volume" value={kpis.totalTransactions.toLocaleString()} icon={ShoppingCart} color="text-blue-400" trend="+8.2%" />
        <KPICard title="Active Branches" value={analytics.branchPerformance.length.toString()} icon={TrendingUp} color="text-amber-400" trend="0" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <BranchLeaderboard />
        
        <ChartCard title="Revenue Distribution">
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.branchPerformance}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `रु ${v/1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <ChartCard title="Inventory Performance">
           <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={inventory.best}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="item" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }} />
                <Bar dataKey="sales" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <ComparativeAnalytics />
    </div>
  );
};

const KPICard = ({ title, value, icon: Icon, color, trend }: any) => (
  <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl relative overflow-hidden group">
    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-800/20 blur-3xl -mr-16 -mt-16 rounded-full group-hover:bg-emerald-500/5 transition-colors" />
    <div className="flex justify-between items-start mb-6">
      <div className={`p-4 rounded-2xl bg-slate-950 border border-slate-800 ${color} shadow-inner`}>
        <Icon size={28} />
      </div>
      <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
        {trend}
      </div>
    </div>
    <div className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{title}</div>
    <div className="text-3xl font-black italic tracking-tighter text-slate-100">{value}</div>
  </div>
);

const ChartCard = ({ title, children }: any) => (
  <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-3xl relative">
    <h3 className="text-xl font-black uppercase tracking-tight text-slate-200 mb-8">{title}</h3>
    {children}
  </div>
);

export default HQLayout;
