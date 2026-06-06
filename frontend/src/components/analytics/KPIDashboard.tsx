import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';
import { 
  TrendingUp, Users, AlertCircle, CheckCircle, MapPin, 
  DollarSign, Activity, FileText 
} from 'lucide-react';

const mockData = [
  { name: '09:00', sales: 4000, margin: 2400 },
  { name: '12:00', sales: 3000, margin: 1398 },
  { name: '15:00', sales: 2000, margin: 9800 },
  { name: '18:00', sales: 2780, margin: 3908 },
  { name: '21:00', sales: 1890, margin: 4800 },
];

const branchPerformance = [
  { name: 'KTM Main', revenue: 45000, health: 'Good' },
  { name: 'Pokhara', revenue: 32000, health: 'Stable' },
  { name: 'Lalitpur', revenue: 28000, health: 'Warning' },
  { name: 'Butwal', revenue: 21000, health: 'Good' },
];

const KPICard = ({ title, value, trend, icon: Icon, color }: any) => (
  <div className="bg-pos-surface border-2 border-pos-primary p-6 rounded-lg">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded bg-pos-black border border-${color || 'pos-primary'}`}>
        <Icon className={color ? `text-${color}` : 'text-pos-primary'} size={24} />
      </div>
      <div className="text-pos-primary flex items-center gap-1 text-sm font-bold">
        <TrendingUp size={16} /> {trend}
      </div>
    </div>
    <div className="text-sm opacity-60 uppercase font-bold tracking-wider mb-1">{title}</div>
    <div className="text-pos-2xl font-bold">{value}</div>
  </div>
);

const KPIDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-pos-black p-8 text-pos-white space-y-8">
      <div className="flex justify-between items-center border-b-4 border-pos-primary pb-6">
        <div>
          <h1 className="text-pos-2xl font-bold uppercase tracking-tighter">Chain Strategy Hub</h1>
          <p className="opacity-60">Global visibility across 4 branches</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-pos-surface border-2 border-pos-primary px-4 py-2 rounded font-bold">
            <Activity size={18} className="text-pos-primary" />
            IRD Sync: 99.8%
          </div>
          <div className="flex items-center gap-2 bg-pos-surface border-2 border-pos-primary px-4 py-2 rounded font-bold">
            <CheckCircle size={18} className="text-pos-primary" />
            System Live
          </div>
        </div>
      </div>

      {/* Executive Scorecard */}
      <div className="grid grid-cols-4 gap-6">
        <KPICard title="Total Revenue" value="NPR 1,25,000" trend="+12%" icon={DollarSign} />
        <KPICard title="Transactions" value="1,452" trend="+5%" icon={Users} />
        <KPICard title="Avg. Margin" value="22.5%" trend="+2%" icon={Activity} />
        <KPICard title="Compliance Risk" value="Low" trend="Stable" icon={FileText} color="pos-primary" />
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Sales Trend */}
        <div className="col-span-2 bg-pos-surface border-2 border-pos-primary p-6 rounded-lg">
          <h3 className="text-pos-xl font-bold mb-6 uppercase">Sales Velocity (Today)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#121212', border: '2px solid #00FF00' }}
                  itemStyle={{ color: '#00FF00' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#00FF00" fill="#00FF00" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Branch Rankings */}
        <div className="bg-pos-surface border-2 border-pos-primary p-6 rounded-lg">
          <h3 className="text-pos-xl font-bold mb-6 uppercase">Branch Health</h3>
          <div className="space-y-6">
            {branchPerformance.map((branch) => (
              <div key={branch.name} className="flex items-center justify-between p-3 border border-pos-primary rounded bg-pos-black">
                <div className="flex items-center gap-3">
                  <MapPin className="text-pos-primary" size={20} />
                  <div>
                    <div className="font-bold">{branch.name}</div>
                    <div className="text-xs opacity-60">Revenue: NPR {branch.revenue}</div>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                  branch.health === 'Good' ? 'bg-pos-primary text-pos-black' : 
                  branch.health === 'Stable' ? 'bg-pos-secondary text-pos-black' : 'bg-pos-danger text-pos-white'
                }`}>
                  {branch.health}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compliance & Anomaly Monitor */}
      <div className="bg-pos-surface border-2 border-pos-primary p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-6">
          <AlertCircle className="text-pos-secondary" />
          <h3 className="text-pos-xl font-bold uppercase">Compliance Sentinel</h3>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={branchPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#121212', border: '2px solid #00FF00' }}
                />
                <Bar dataKey="revenue" fill="#00FF00" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-pos-secondary bg-pos-black">
              <div className="font-bold text-pos-secondary">Warning: Discount Velocity Alert</div>
              <div className="text-sm">Lalitpur Branch: Cashier 'Rajesh' applied max discounts on 22% of sales in the last hour.</div>
            </div>
            <div className="p-4 border-l-4 border-pos-primary bg-pos-black">
              <div className="font-bold text-pos-primary">Info: IRD Sync Latency</div>
              <div className="text-sm">Global sync latency is within acceptable limits (avg 240ms).</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KPIDashboard;
