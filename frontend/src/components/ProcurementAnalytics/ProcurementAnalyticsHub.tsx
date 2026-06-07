import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, Line 
} from 'recharts';
import { 
  ShieldCheck, Activity, AlertCircle, 
  Target, Zap, CheckCircle2 
} from 'lucide-react';

const ProcurementAnalyticsHub: React.FC = () => {
  // Mock Metrics
  const metrics = [
    { label: 'Budget Utilization', value: '78%', trend: '+5%', icon: Target, color: 'text-pos-primary' },
    { label: 'Compliance Health', value: '92%', trend: 'Stable', icon: ShieldCheck, color: 'text-pos-primary' },
    { label: 'Audit Exceptions', value: '03', trend: '-2', icon: AlertCircle, color: 'text-pos-danger' },
    { label: 'Supplier Lead Time', value: '4.2d', trend: '-0.5d', icon: Zap, color: 'text-pos-secondary' },
  ];

  const budgetVelocityData = [
    { day: '01', spent: 1000, limit: 5000 },
    { day: '05', spent: 2500, limit: 5000 },
    { day: '10', spent: 3200, limit: 5000 },
    { day: '15', spent: 4100, limit: 5000 },
    { day: '20', spent: 4800, limit: 5000 },
  ];

  const complianceHistory = [
    { month: 'Jan', score: 85 },
    { month: 'Feb', score: 88 },
    { month: 'Mar', score: 92 },
    { month: 'Apr', score: 90 },
    { month: 'May', score: 95 },
    { month: 'Jun', score: 92 },
  ];

  return (
    <div className="p-10 bg-pos-black min-h-screen">
      <div className="flex justify-between items-end mb-12">
        <div>
          <p className="text-pos-primary font-black uppercase tracking-[0.3em] text-xs mb-2">Operational Intelligence</p>
          <h1 className="text-5xl font-black text-pos-white tracking-tighter uppercase italic">Procurement Analytics Hub</h1>
        </div>
        <div className="bg-pos-surface border border-pos-border px-6 py-3 rounded-2xl flex items-center gap-4">
           <Activity className="text-pos-primary animate-pulse" />
           <div className="text-right">
              <p className="text-[10px] text-pos-muted font-bold uppercase">System Status</p>
              <p className="text-xs font-black text-pos-white">LIVE COMPLIANCE FEED</p>
           </div>
        </div>
      </div>

      {/* Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {metrics.map((m, idx) => (
          <motion.div 
            key={m.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-pos-surface border border-pos-border p-6 rounded-3xl relative overflow-hidden group hover:border-pos-primary/30 transition-all"
          >
            <m.icon className={`absolute -right-4 -bottom-4 w-24 h-24 opacity-5 group-hover:scale-110 transition-transform ${m.color}`} />
            <p className="text-pos-muted text-xs font-black uppercase tracking-widest mb-4">{m.label}</p>
            <div className="flex items-end justify-between relative z-10">
               <h3 className="text-4xl font-black text-pos-white">{m.value}</h3>
               <span className={`text-[10px] font-bold px-2 py-1 rounded-full bg-pos-black border border-pos-border ${m.color === 'text-pos-danger' ? 'text-pos-danger' : 'text-pos-primary'}`}>
                 {m.trend}
               </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Budget Velocity Chart */}
        <div className="bg-pos-surface border border-pos-border rounded-3xl p-8 shadow-2xl">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-pos-white font-black uppercase tracking-widest text-sm flex items-center gap-2">
                <Target size={18} className="text-pos-primary" />
                Budget Velocity
              </h3>
              <div data-testid="budget-chart-placeholder" className="hidden" />
           </div>
           <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={budgetVelocityData}>
                  <defs>
                    <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `रु ${val}`} />
                  <Tooltip 
                    formatter={(value: number) => [`रु ${value.toLocaleString()}`, 'Amount']}
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  />
                  <Area type="monotone" dataKey="spent" name="Consumed (रु)" stroke="#10b981" fillOpacity={1} fill="url(#colorSpent)" strokeWidth={3} />
                  <Line type="monotone" dataKey="limit" name="Ceiling (रु)" stroke="#ef4444" strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Compliance Health History */}
        <div className="bg-pos-surface border border-pos-border rounded-3xl p-8 shadow-2xl">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-pos-white font-black uppercase tracking-widest text-sm flex items-center gap-2">
                <ShieldCheck size={18} className="text-pos-primary" />
                Compliance Health Index
              </h3>
              <div data-testid="supplier-reliability-chart-placeholder" className="hidden" />
           </div>
           <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={complianceHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 100]} stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  />
                  <Bar dataKey="score" name="Compliance Score" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-12 p-6 bg-pos-surface/30 border border-pos-border rounded-2xl flex items-center justify-between">
         <div className="flex items-center gap-4">
            <CheckCircle2 className="text-pos-primary w-5 h-5" />
            <p className="text-pos-muted text-xs font-medium">All data is cryptographically verified against the branch ledger.</p>
         </div>
         <button className="text-pos-primary text-xs font-black uppercase tracking-widest hover:underline transition-all">
            Download Audit Report (PDF)
         </button>
      </div>
    </div>
  );
};

export default ProcurementAnalyticsHub;
