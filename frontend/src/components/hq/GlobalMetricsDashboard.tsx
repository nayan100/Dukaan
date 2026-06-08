import React, { useMemo, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar 
} from 'recharts';
import { useHQStore } from '../../store/useHQStore';
import { aggregateGlobalKPIs, getInventoryPerformance } from '../../lib/hqAnalytics';
import { DollarSign, ShoppingCart, TrendingUp, Package } from 'lucide-react';

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

const GlobalMetricsDashboard: React.FC = () => {
  const { analytics, hqState = useHQStore.getState() } = { analytics: useHQStore(s => s.analytics), hqState: null };
  // Accessing actions directly for simulation
  
  useEffect(() => {
    // Simulate initial data load into store
    useHQStore.setState({
      analytics: {
        globalRevenue: 1050000,
        branchPerformance: MOCK_BRANCHES
      }
    });
  }, []);

  const kpis = useMemo(() => aggregateGlobalKPIs(analytics.branchPerformance), [analytics.branchPerformance]);
  const inventory = useMemo(() => getInventoryPerformance(analytics.branchPerformance), [analytics.branchPerformance]);

  return (
    <div className="space-y-10 p-10 bg-slate-950 text-white min-h-screen font-sans">
      <header>
        <div className="flex items-center gap-3 mb-2">
            <Package className="text-emerald-400" size={24} />
            <span className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400/80">Chain Intelligence</span>
        </div>
        <h1 className="text-4xl font-black tracking-tighter uppercase italic">Executive Scorecard</h1>
        <p className="text-slate-400 font-medium mt-2">Real-time performance metrics across the retail network</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Total Revenue" value={`रु ${kpis.totalRevenue.toLocaleString()}`} icon={DollarSign} color="text-emerald-400" trend="+12.5%" />
        <KPICard title="Transaction Volume" value={kpis.totalTransactions.toLocaleString()} icon={ShoppingCart} color="text-blue-400" trend="+8.2%" />
        <KPICard title="Active Branches" value={analytics.branchPerformance.length.toString()} icon={TrendingUp} color="text-amber-400" trend="0" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard title="Revenue Distribution (by Branch)">
          <div className="h-[400px]">
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
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `रु ${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Top Performing Inventory">
           <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={inventory.best}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="item" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  cursor={{ fill: '#1e293b', opacity: 0.4 }}
                />
                <Bar dataKey="sales" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
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
    <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-black uppercase tracking-tight text-slate-200">{title}</h3>
        <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-slate-700" />
            <div className="w-2 h-2 rounded-full bg-slate-700" />
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
        </div>
    </div>
    {children}
  </div>
);

export default GlobalMetricsDashboard;
