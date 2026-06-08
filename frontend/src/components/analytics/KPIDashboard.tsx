import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';
import { motion } from 'framer-motion';
import { 
  Users, AlertCircle, MapPin, 
  DollarSign, Activity, ArrowUpRight, ShieldCheck 
} from 'lucide-react';
import Button from '../ui/Button';
import BudgetWidget from '../ui/BudgetWidget';

const mockData = [
  { name: '09:00', sales: 4000, margin: 2400 },
  { name: '12:00', sales: 3000, margin: 1398 },
  { name: '15:00', sales: 5000, margin: 9800 },
  { name: '18:00', sales: 2780, margin: 3908 },
  { name: '21:00', sales: 1890, margin: 4800 },
];

const branchPerformance = [
  { name: 'KTM Main', revenue: 45000, cogs: 22000, expenses: 5000, health: 'Good' },
  { name: 'Pokhara', revenue: 32000, cogs: 18000, expenses: 4000, health: 'Stable' },
  { name: 'Lalitpur', revenue: 28000, cogs: 15000, expenses: 3000, health: 'Warning' },
  { name: 'Butwal', revenue: 21000, cogs: 12000, expenses: 2500, health: 'Good' },
];

const KPICard = ({ title, value, trend, icon: Icon }: any) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="bg-pos-surface/50 border border-pos-border p-6 rounded-2xl backdrop-blur-xl relative overflow-hidden group"
  >
    <div className="absolute top-0 right-0 w-24 h-24 bg-pos-primary/5 blur-3xl -mr-12 -mt-12 rounded-full group-hover:bg-pos-primary/10 transition-colors" />
    <div className="flex justify-between items-start mb-6">
      <div className="w-12 h-12 rounded-xl bg-pos-black flex items-center justify-center border border-pos-border group-hover:border-pos-primary/50 transition-colors shadow-inner">
        <Icon className="text-pos-primary" size={24} />
      </div>
      <div className="bg-pos-primary/10 text-pos-primary px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-black">
        <ArrowUpRight size={14} /> {trend}
      </div>
    </div>
    <div className="text-xs text-pos-muted uppercase font-black tracking-widest mb-1">{title}</div>
    <div className="text-2xl font-black tracking-tight">{value}</div>
  </motion.div>
);

const KPIDashboard: React.FC = () => {
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  const plData = selectedBranch 
    ? (branchPerformance.find(b => b.name === selectedBranch) || { revenue: 0, cogs: 0, expenses: 0 })
    : {
        revenue: branchPerformance.reduce((sum, b) => sum + b.revenue, 0),
        cogs: branchPerformance.reduce((sum, b) => sum + b.cogs, 0),
        expenses: branchPerformance.reduce((sum, b) => sum + b.expenses, 0),
      };

  const netProfit = (plData.revenue || 0) - (plData.cogs || 0) - (plData.expenses || 0);

  return (
    <div className="min-h-screen bg-pos-black p-10 text-pos-white space-y-10 font-sans selection:bg-pos-primary/30">
      <header className="flex justify-between items-end border-b border-pos-border pb-10">
        <div>
            <div className="flex items-center gap-3 mb-2">
                <ShieldCheck className="text-pos-primary" size={24} />
                <span className="text-xs font-black uppercase tracking-[0.3em] text-pos-primary">Sovereign Intelligence</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic">Chain Strategy Hub</h1>
            <p className="text-pos-muted font-medium mt-2">Real-time performance metrics across the retail network</p>
        </div>
        <div className="flex items-start gap-6">
          <div className="w-80">
            <BudgetWidget limit={120000} spent={98500} branchName="KTM Main" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 bg-pos-surface/50 border border-pos-border px-6 py-3 rounded-xl font-bold backdrop-blur-md">
                <div className="w-2 h-2 bg-pos-primary rounded-full animate-pulse" />
                <span className="text-sm uppercase tracking-wider">IRD Sync: 99.8%</span>
            </div>
            <div className="flex items-center gap-3 bg-pos-surface/50 border border-pos-border px-6 py-3 rounded-xl font-bold backdrop-blur-md">
                <Activity size={18} className="text-pos-primary" />
                <span className="text-sm uppercase tracking-wider">System Live</span>
            </div>
          </div>
        </div>
      </header>

      {/* Executive Scorecard & P&L */}
      <div className="grid grid-cols-4 gap-6">
        <KPICard title={selectedBranch ? `${selectedBranch} Revenue` : "Total Revenue"} value={`NPR रु ${(plData?.revenue || 0).toLocaleString()}`} trend="+12.4%" icon={DollarSign} />
        <KPICard title="COGS" value={`NPR रु ${(plData?.cogs || 0).toLocaleString()}`} trend="-2.1%" icon={Activity} />
        <KPICard title="Operating Expenses" value={`NPR रु ${(plData?.expenses || 0).toLocaleString()}`} trend="+1.5%" icon={AlertCircle} />
        <KPICard title="Net Profit" value={`NPR रु ${(netProfit || 0).toLocaleString()}`} trend="+8.4%" icon={Activity} />
      </div>

      <div className="grid grid-cols-3 gap-10">
        {/* Sales Trend */}
        <div className="col-span-2 bg-pos-surface/30 border border-pos-border p-8 rounded-2xl backdrop-blur-xl">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-black uppercase tracking-tight">Sales Velocity</h3>
            <div className="flex gap-2">
                {['1H', '6H', '24H', '7D'].map(p => (
                    <button key={p} className={`px-3 py-1 rounded-lg text-xs font-black transition-colors ${p === '24H' ? 'bg-pos-primary text-pos-black' : 'bg-pos-black/50 text-pos-muted hover:text-pos-white'}`}>
                        {p}
                    </button>
                ))}
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} fontWeight="bold" axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} fontWeight="bold" axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Branch Rankings */}
        <div className="bg-pos-surface/30 border border-pos-border p-8 rounded-2xl backdrop-blur-xl flex flex-col">
          <div className="flex justify-between items-center mb-8">
             <h3 className="text-xl font-black uppercase tracking-tight">Branch Health</h3>
             {selectedBranch && (
                 <button onClick={() => setSelectedBranch(null)} className="text-[10px] font-bold text-pos-primary uppercase hover:underline">Clear Filter</button>
             )}
          </div>
          <div className="space-y-4 flex-1 overflow-auto pr-2 custom-scrollbar">
            {branchPerformance.map((branch) => (
              <div 
                key={branch.name} 
                onClick={() => setSelectedBranch(branch.name)}
                className={`flex items-center justify-between p-4 border rounded-xl transition-all cursor-pointer group ${selectedBranch === branch.name ? 'border-pos-primary bg-pos-primary/10' : 'border-pos-border bg-pos-black/40 hover:border-pos-primary/30'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg bg-pos-black border border-pos-border flex items-center justify-center transition-colors ${selectedBranch === branch.name ? 'text-pos-primary' : 'group-hover:text-pos-primary'}`}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-sm">{branch.name}</div>
                    <div className="text-[10px] text-pos-muted font-black uppercase tracking-widest mt-0.5">NPR रु {branch.revenue.toLocaleString()}</div>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter ${
                  branch.health === 'Good' ? 'bg-pos-primary/10 text-pos-primary' : 
                  branch.health === 'Stable' ? 'bg-pos-secondary/10 text-pos-secondary' : 'bg-pos-danger/10 text-pos-danger'
                }`}>
                  {branch.health}
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4 h-12 rounded-xl text-xs uppercase font-black tracking-widest flex-shrink-0">
            View All Branches
          </Button>
        </div>
      </div>

      {/* Compliance Sentinel */}
      <div className="bg-pos-surface/30 border border-pos-border p-8 rounded-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2 bg-pos-danger/10 rounded-lg">
            <AlertCircle className="text-pos-danger" size={24} />
          </div>
          <h3 className="text-xl font-black uppercase tracking-tight">Compliance Sentinel</h3>
        </div>
        <div className="grid grid-cols-2 gap-12">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={branchPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} fontWeight="bold" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                />
                <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-5">
            <motion.div 
                whileHover={{ x: 4 }}
                className="p-5 border border-pos-secondary/20 bg-pos-secondary/5 rounded-xl flex gap-4"
            >
                <div className="w-1 bg-pos-secondary rounded-full" />
                <div>
                    <div className="font-black text-pos-secondary text-xs uppercase tracking-widest mb-1">Discount Velocity Alert</div>
                    <p className="text-sm font-medium leading-relaxed">Lalitpur Branch: Anomaly detected in 'Quick Discounts' frequency. (Manager: Ramesh K.)</p>
                </div>
            </motion.div>
            <motion.div 
                whileHover={{ x: 4 }}
                className="p-5 border border-pos-primary/20 bg-pos-primary/5 rounded-xl flex gap-4"
            >
                <div className="w-1 bg-pos-primary rounded-full" />
                <div>
                    <div className="font-black text-pos-primary text-xs uppercase tracking-widest mb-1">Regional Sync Latency</div>
                    <p className="text-sm font-medium leading-relaxed">Butwal node reporting 340ms latency. Within IRD v4 performance thresholds.</p>
                </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KPIDashboard;
