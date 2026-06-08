import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Info, ArrowRight } from 'lucide-react';

const BRANCH_LOCATIONS = [
  { id: 'B1', name: 'KTM Main', x: '65%', y: '45%', health: 'good', deadStockValue: 12000 },
  { id: 'B2', name: 'Pokhara', x: '45%', y: '40%', health: 'stable', deadStockValue: 45000 },
  { id: 'B3', name: 'Lalitpur', x: '68%', y: '48%', health: 'warning', deadStockValue: 85000 },
  { id: 'B4', name: 'Butwal', x: '35%', y: '65%', health: 'good', deadStockValue: 8000 },
];

const DeadStockMap: React.FC = () => {
  const [selectedBranch, setSelectedBranch] = useState<any>(null);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden min-h-[500px]">
        <div className="flex justify-between items-center mb-8 relative z-10">
          <div>
            <h3 className="text-xl font-black uppercase tracking-tight text-slate-200">Dead Stock Rebalancer</h3>
            <p className="text-slate-500 text-xs font-bold mt-1">Geographic Health Distribution</p>
          </div>
          <div className="flex gap-4">
             {['good', 'stable', 'warning'].map(h => (
               <div key={h} className="flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full ${h === 'good' ? 'bg-emerald-500' : h === 'stable' ? 'bg-blue-500' : 'bg-rose-500'}`} />
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{h}</span>
               </div>
             ))}
          </div>
        </div>

        <div className="relative bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden aspect-video flex items-center justify-center">
          {/* Stylized Map Background */}
          <svg viewBox="0 0 400 300" className="w-full h-full opacity-10">
            <path 
              d="M50,150 L100,120 L200,100 L300,120 L350,180 L320,250 L200,280 L80,250 Z" 
              fill="none" 
              stroke="#64748b" 
              strokeWidth="2" 
            />
          </svg>

          {BRANCH_LOCATIONS.map((branch) => (
            <motion.div
              key={branch.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.2, zIndex: 10 }}
              className="absolute cursor-pointer"
              style={{ left: branch.x, top: branch.y }}
              onClick={() => setSelectedBranch(branch)}
            >
              <div className="relative">
                <MapPin 
                  className={`${
                    branch.health === 'good' ? 'text-emerald-500' : 
                    branch.health === 'stable' ? 'text-blue-500' : 'text-rose-500'
                  } drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]`} 
                  size={32} 
                  fill="currentColor"
                  fillOpacity={0.2}
                />
                {branch.health === 'warning' && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                  </span>
                )}
              </div>
            </motion.div>
          ))}

          {selectedBranch && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-6 left-6 right-6 bg-slate-900/95 backdrop-blur-xl border border-slate-700 p-6 rounded-2xl shadow-2xl flex justify-between items-center"
            >
              <div className="flex items-center gap-6">
                <div className={`p-4 rounded-xl ${selectedBranch.health === 'good' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                  <Info size={24} />
                </div>
                <div>
                  <h4 className="font-black text-slate-100 uppercase tracking-tight text-lg">{selectedBranch.name}</h4>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                    Stagnant Stock Value: <span className="text-slate-100 font-black italic">रु {selectedBranch.deadStockValue.toLocaleString()}</span>
                  </p>
                </div>
              </div>
              <button 
                className="px-6 py-3 bg-slate-100 text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-400 transition-all flex items-center gap-2"
                onClick={() => setSelectedBranch(null)}
              >
                Analyze Stocks <ArrowRight size={16} />
              </button>
            </motion.div>
          )}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl">
        <h3 className="text-xl font-black uppercase tracking-tight text-slate-200 mb-8">Stock Health Table</h3>
        <div className="space-y-4">
          {BRANCH_LOCATIONS.map(branch => (
            <div key={branch.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex justify-between items-center hover:border-slate-600 transition-colors">
              <div>
                <div className="text-sm font-black text-slate-100">{branch.name}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">ID: {branch.id}</div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-black italic ${branch.health === 'warning' ? 'text-rose-400' : 'text-emerald-400'}`}>
                  रु {branch.deadStockValue.toLocaleString()}
                </div>
                <div className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full inline-block mt-1 ${
                  branch.health === 'good' ? 'bg-emerald-500/10 text-emerald-400' : 
                  branch.health === 'stable' ? 'bg-blue-500/10 text-blue-400' : 'bg-rose-500/10 text-rose-400'
                }`}>
                  {branch.health}
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full mt-8 py-4 border border-dashed border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-300 hover:border-slate-500 transition-all">
          Generate Optimization Report
        </button>
      </div>
    </div>
  );
};

export default DeadStockMap;
