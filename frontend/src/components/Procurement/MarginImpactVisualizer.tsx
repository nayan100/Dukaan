import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingDown, Info } from 'lucide-react';

interface MarginImpactData {
  name: string;
  before_margin: number;
  after_margin: number;
}

interface MarginImpactVisualizerProps {
  data: MarginImpactData[];
}

const MarginImpactVisualizer: React.FC<MarginImpactVisualizerProps> = ({ data }) => {
  const chartData = data.map(item => ({
    ...item,
    impact: item.after_margin - item.before_margin
  }));

  return (
    <div className="bg-pos-surface border border-pos-border rounded-pos p-8 shadow-2xl h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <TrendingDown className="text-pos-danger w-8 h-8" />
          <h2 className="text-pos-white text-2xl font-black uppercase tracking-tighter">Retroactive Margin Impact</h2>
        </div>
        <div className="bg-pos-danger/10 border border-pos-danger/20 px-4 py-2 rounded-lg flex items-center gap-2">
           <Info className="text-pos-danger w-4 h-4" />
           <span className="text-pos-danger text-xs font-bold uppercase tracking-widest">Landed Cost Variance</span>
        </div>
      </div>

      <div className="flex-1 min-h-[300px] mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} unit="%" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
              itemStyle={{ fontWeight: 'bold' }}
            />
            <Legend verticalAlign="top" align="right" iconType="circle" />
            <Bar dataKey="before_margin" name="Original Margin" fill="#64748b" radius={[4, 4, 0, 0]} />
            <Bar dataKey="after_margin" name="Landed Margin" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((item) => {
          const drop = item.before_margin - item.after_margin;
          return (
            <motion.div 
              key={item.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-pos-black border border-pos-border p-4 rounded-xl flex items-center justify-between group hover:border-pos-danger/30 transition-all"
            >
              <div>
                <p className="text-pos-white font-bold">{item.name}</p>
                <div className="flex items-center gap-2 mt-1">
                   <span className="text-[10px] text-pos-muted font-black uppercase tracking-widest">{item.before_margin}%</span>
                   <TrendingDown size={12} className="text-pos-danger" />
                   <span className="text-[10px] text-pos-primary font-black uppercase tracking-widest">{item.after_margin}%</span>
                </div>
              </div>
              <div className="text-right">
                 <p className="text-pos-danger font-mono font-black text-xl leading-none">-{drop.toFixed(1)}%</p>
                 <p className="text-[10px] text-pos-muted font-bold uppercase mt-1">Margin Erosion</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default MarginImpactVisualizer;
