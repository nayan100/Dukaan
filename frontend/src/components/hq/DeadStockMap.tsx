import React, { useState } from 'react';
import { MapPin, Info, TrendingUp, DollarSign, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BRANCH_LOCATIONS = [
  { id: 'B1', name: 'KTM Main', x: '65%', y: '45%', status: 'good', deadStock: 12000, revenue: 450000 },
  { id: 'B2', name: 'Pokhara', x: '45%', y: '40%', status: 'stable', deadStock: 45000, revenue: 320000 },
  { id: 'B3', name: 'Lalitpur', x: '68%', y: '48%', status: 'warning', deadStock: 85000, revenue: 280000 },
  { id: 'B4', name: 'Butwal', x: '35%', y: '65%', status: 'good', deadStock: 8000, revenue: 150000 },
];

const DeadStockMap: React.FC = () => {
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [view, setView] = useState<'stock' | 'revenue'>('stock');

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Interactive Map */}
      <div className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden min-h-[500px]">
        <div className="flex justify-between items-center mb-8 relative z-10">
          <div>
            <h3 className="text-xl font-black uppercase tracking-tight text-slate-200">{view === 'stock' ? 'Dead Stock Rebalancer' : 'Revenue Distribution Heatmap'}</h3>
            <p className="text-slate-500 text-xs font-bold mt-1">Geographic {view === 'stock' ? 'Health' : 'Intensity'} Distribution</p>
          </div>
          
          <div className="flex gap-4 items-center">
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 mr-4">
                <button 
                    onClick={() => setView('stock')}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${view === 'stock' ? 'bg-slate-800 text-amber-500' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Stock
                </button>
                <button 
                    onClick={() => setView('revenue')}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${view === 'revenue' ? 'bg-slate-800 text-emerald-500' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Revenue
                </button>
            </div>

            <div className="flex gap-4">
                {view === 'stock' ? (
                    <>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">good</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">stable</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-rose-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">warning</span>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-gradient-to-r from-slate-800 via-emerald-900 to-emerald-500 rounded-full border border-slate-800" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Scale: Low to High</span>
                    </div>
                )}
            </div>
          </div>
        </div>

        <div className="relative bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden aspect-video flex items-center justify-center group/map">
            {/* Map Placeholder SVG */}
            <svg viewBox="0 0 400 300" className="w-full h-full opacity-10">
                <path 
                    d="M50,150 L100,120 L200,100 L300,120 L350,180 L320,250 L200,280 L80,250 Z" 
                    fill="none" 
                    stroke="#64748b" 
                    strokeWidth="2" 
                />
            </svg>

            {/* Revenue Heatmap Blobs (Visible in Revenue view) */}
            <AnimatePresence>
                {view === 'revenue' && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 pointer-events-none"
                    >
                        {BRANCH_LOCATIONS.map(loc => {
                            const intensity = (loc.revenue / 450000) * 0.4;
                            return (
                                <motion.div 
                                    key={`heat-${loc.id}`}
                                    className="absolute rounded-full bg-emerald-500 blur-[60px]"
                                    style={{ 
                                        left: loc.x, 
                                        top: loc.y, 
                                        width: '150px', 
                                        height: '150px', 
                                        transform: 'translate(-50%, -50%)',
                                        opacity: intensity
                                    }}
                                    animate={{ 
                                        scale: [1, 1.1, 1],
                                        opacity: [intensity, intensity + 0.1, intensity]
                                    }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                />
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Interactive Pins */}
            {BRANCH_LOCATIONS.map((loc) => (
                <motion.div
                    key={loc.id}
                    className="absolute cursor-pointer"
                    style={{ left: loc.x, top: loc.y }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.2, zIndex: 30 }}
                    onClick={() => setSelectedBranch(loc.id === selectedBranch ? null : loc.id)}
                >
                    <div className="relative">
                        <MapPin 
                            size={32} 
                            className={`${
                                view === 'stock' 
                                    ? (loc.status === 'good' ? 'text-emerald-500' : loc.status === 'warning' ? 'text-rose-500' : 'text-blue-500')
                                    : 'text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                            } drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]`}
                            fill="currentColor"
                            fillOpacity={0.2}
                        />
                        {loc.status === 'warning' && view === 'stock' && (
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                            </span>
                        )}
                    </div>

                    {/* Popover */}
                    <AnimatePresence>
                        {selectedBranch === loc.id && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                animate={{ opacity: 1, y: -45, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                className="absolute bottom-full left-1/2 -translate-x-1/2 w-48 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-2xl z-50"
                            >
                                <h4 className="font-black text-xs uppercase tracking-tight text-white mb-2">{loc.name}</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase">Stock</span>
                                        <span className="text-[10px] font-black text-rose-400">रु {loc.deadStock.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase">Revenue</span>
                                        <span className="text-[10px] font-black text-emerald-400">रु {loc.revenue.toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 border-r border-b border-slate-800 rotate-45 -mt-1" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            ))}
        </div>

        {/* View Legend Overlay */}
        <div className="absolute bottom-8 right-8 bg-slate-950/80 border border-slate-800 p-4 rounded-2xl backdrop-blur-md z-10">
            <div className="flex items-center gap-3">
                <Layers className="text-slate-500" size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Overlay Active: {view.toUpperCase()}</span>
            </div>
        </div>
      </div>

      {/* Side Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="text-amber-500" size={20} />
            <h3 className="text-xl font-black uppercase tracking-tight text-slate-200">Network Intelligence</h3>
        </div>
        
        <div className="space-y-4">
          {BRANCH_LOCATIONS.map((loc) => (
            <div 
                key={loc.id} 
                onClick={() => setSelectedBranch(loc.id)}
                className={`p-4 bg-slate-950 border transition-all cursor-pointer rounded-2xl flex justify-between items-center hover:bg-slate-800 ${selectedBranch === loc.id ? 'border-amber-500/50 shadow-lg shadow-amber-500/5' : 'border-slate-800'}`}
            >
              <div>
                <div className="text-sm font-black text-slate-100">{loc.name}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">ID: {loc.id}</div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-black italic ${view === 'stock' ? 'text-amber-400' : 'text-emerald-400'}`}>
                  रु {(view === 'stock' ? loc.deadStock : loc.revenue).toLocaleString()}
                </div>
                <div className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full inline-block mt-1 ${
                    loc.status === 'good' ? 'bg-emerald-500/10 text-emerald-400' : loc.status === 'stable' ? 'bg-blue-500/10 text-blue-400' : 'bg-rose-500/10 text-rose-400'
                }`}>
                  {loc.status}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="w-full mt-8 py-4 border border-dashed border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-300 hover:border-slate-500 transition-all flex items-center justify-center gap-2">
            <Info size={14} /> Generate Optimization Report
        </button>
      </div>
    </div>
  );
};

export default DeadStockMap;
