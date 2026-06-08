import React, { useMemo, useEffect, useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar 
} from 'recharts';
import { useHQStore } from '../../store/useHQStore';
import { aggregateGlobalKPIs, getInventoryPerformance } from '../../lib/hqAnalytics';
import { DollarSign, ShoppingCart, TrendingUp, Package, Sparkles, LayoutDashboard, Map as MapIcon, CheckSquare, Zap } from 'lucide-react';
import { Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import ComparativeAnalytics from './ComparativeAnalytics';
import DeadStockMap from './DeadStockMap';
import AISuggestionsOverlay from './AISuggestionsOverlay';

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
    <div className="flex flex-col h-full bg-slate-950 text-white font-sans">
      {/* HQ Sub-Navbar */}
      <nav className="bg-slate-900/50 border-b border-slate-800 px-10 py-4 flex justify-between items-center backdrop-blur-xl sticky top-0 z-30">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 pr-8 border-r border-slate-800">
            <Zap className="text-emerald-400" size={20} />
            <span className="text-sm font-black uppercase tracking-[0.2em] italic">Strategy Hub</span>
          </div>
          <div className="flex gap-6">
            <HQNavLink to="/hq/scorecard" icon={LayoutDashboard} label="Scorecard" />
            <HQNavLink to="/hq/rebalancer" icon={MapIcon} label="Rebalancer" />
            <HQNavLink to="/hq/approvals" icon={CheckSquare} label="Approvals" />
            <HQNavLink to="/hq/wizards" icon={Sparkles} label="Growth" />
          </div>
        </div>
        <button 
          onClick={() => setShowAI(true)}
          className="flex items-center gap-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-500 hover:text-slate-950 transition-all shadow-xl shadow-amber-500/5"
        >
          <Sparkles size={14} /> AI Suggestions
        </button>
      </nav>

      <div className="flex-1 overflow-auto">
        <Routes>
          <Route index element={<Navigate to="scorecard" replace />} />
          <Route path="scorecard" element={<ScorecardView />} />
          <Route path="rebalancer" element={<div className="p-10"><DeadStockMap /></div>} />
          <Route path="approvals" element={<PlaceholderView title="Global Approval Center" description="Phase 3 Implementation" />} />
          <Route path="wizards" element={<PlaceholderView title="Growth Wizards Hub" description="Phase 4 Implementation" />} />
        </Routes>
      </div>

      <AISuggestionsOverlay isOpen={showAI} onClose={() => setShowAI(false)} />
    </div>
  );
};

const HQNavLink = ({ to, icon: Icon, label }: any) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => `
      flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
      ${isActive ? 'bg-slate-800 text-emerald-400 shadow-lg' : 'text-slate-500 hover:text-slate-300'}
    `}
  >
    <Icon size={14} />
    {label}
  </NavLink>
);

const ScorecardView = () => {
  const analytics = useHQStore(s => s.analytics);
  const kpis = useMemo(() => aggregateGlobalKPIs(analytics.branchPerformance), [analytics.branchPerformance]);
  const inventory = useMemo(() => getInventoryPerformance(analytics.branchPerformance), [analytics.branchPerformance]);

  return (
    <div className="p-10 space-y-10">
      <header>
        <h1 className="text-4xl font-black tracking-tighter uppercase italic">Executive Scorecard</h1>
        <p className="text-slate-400 font-medium mt-2">Real-time performance metrics across the retail network</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Total Revenue" value={`रु ${kpis.totalRevenue.toLocaleString()}`} icon={DollarSign} color="text-emerald-400" trend="+12.5%" />
        <KPICard title="Transaction Volume" value={kpis.totalTransactions.toLocaleString()} icon={ShoppingCart} color="text-blue-400" trend="+8.2%" />
        <KPICard title="Active Branches" value={analytics.branchPerformance.length.toString()} icon={TrendingUp} color="text-amber-400" trend="0" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

const PlaceholderView = ({ title, description }: any) => (
  <div className="h-full flex items-center justify-center p-10">
    <div className="text-center space-y-4 bg-slate-900/50 border border-slate-800 p-16 rounded-[3rem] max-w-lg w-full">
      <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mx-auto border border-slate-700 shadow-2xl">
        <Zap className="text-slate-600" size={40} />
      </div>
      <h2 className="text-3xl font-black uppercase tracking-tighter italic text-slate-100">{title}</h2>
      <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">{description}</p>
      <div className="pt-8">
         <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 w-1/3 animate-pulse" />
         </div>
      </div>
    </div>
  </div>
);

export default HQLayout;
