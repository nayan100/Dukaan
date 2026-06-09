import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, TrendingUp, AlertCircle, CheckCircle2, ChevronRight, Zap, ArrowRight, Save } from 'lucide-react';
import Button from '../ui/Button';

const PricingWizard: React.FC = () => {
  const [step, setStep] = useState(1);
  const [percentage, setPercentage] = useState(5);
  const [category, setCategory] = useState('All Categories');

  const simulation = useMemo(() => {
    const currentMargin = 0.25; // 25% average
    const currentRevenue = 1050000;
    const priceIncrease = percentage / 100;
    
    // Elasticity model: for every 1% price increase, volume drops by 0.5%
    const volumeImpact = 1 - (percentage * 0.005);
    const newRevenue = currentRevenue * (1 + priceIncrease) * volumeImpact;
    const newMargin = ((currentRevenue * (currentMargin + priceIncrease)) * volumeImpact) / newRevenue;
    
    return {
        revenueDelta: newRevenue - currentRevenue,
        marginDelta: (newMargin - currentMargin) * 100,
        projectedRevenue: newRevenue
    };
  }, [percentage]);

  return (
    <div className="p-10 max-w-5xl mx-auto space-y-10">
      <header className="flex justify-between items-end border-b border-slate-900 pb-10">
        <div>
            <div className="flex items-center gap-3 mb-2">
                <Tag className="text-amber-500" size={24} />
                <span className="text-xs font-black uppercase tracking-[0.3em] text-amber-500/80">Pricing Orchestration</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic text-slate-100">Global Pricing Wizard</h1>
            <p className="text-slate-500 font-medium mt-2">Simulate and deploy price adjustments across the entire chain.</p>
        </div>
        
        <div className="flex gap-2">
            {[1, 2, 3].map(s => (
                <div key={s} className={`h-1.5 w-12 rounded-full transition-all ${s <= step ? 'bg-amber-500' : 'bg-slate-800'}`} />
            ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div 
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl space-y-6">
                            <h3 className="text-xl font-black uppercase tracking-tight text-slate-200 flex items-center gap-3">
                                <Zap className="text-amber-500" size={20} /> 01. Adjust Price Baseline
                            </h3>
                            
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Adjustment Percentage</label>
                                <div className="flex items-center gap-6">
                                    <input 
                                        type="range" 
                                        min="-20" 
                                        max="20" 
                                        value={percentage}
                                        onChange={(e) => setPercentage(parseInt(e.target.value))}
                                        className="flex-1 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                    />
                                    <div className="w-24 p-4 bg-slate-950 border border-slate-800 rounded-2xl text-center">
                                        <span className={`text-2xl font-black ${percentage >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                            {percentage > 0 ? '+' : ''}{percentage}%
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Apply To</label>
                                <div className="grid grid-cols-2 gap-4">
                                    {['All Categories', 'FMCG', 'Electronics', 'Fresh Produce'].map(cat => (
                                        <button 
                                            key={cat}
                                            onClick={() => setCategory(cat)}
                                            className={`p-4 rounded-xl border font-bold text-sm transition-all ${
                                                category === cat ? 'bg-amber-500/10 border-amber-500 text-amber-500' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                                            }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        <Button variant="primary" className="w-full py-6 uppercase font-black tracking-widest gap-2" onClick={() => setStep(2)}>
                            Model Simulation <ArrowRight size={18} />
                        </Button>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div 
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                         <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl space-y-6">
                            <h3 className="text-xl font-black uppercase tracking-tight text-slate-200 flex items-center gap-3">
                                <TrendingUp className="text-emerald-500" size={20} /> 02. Impact Simulation
                            </h3>
                            
                            <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl border-l-4 border-l-emerald-500">
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Projected Annual Revenue Increase</div>
                                <div className="text-3xl font-black text-emerald-500">रु {Math.abs(simulation.revenueDelta).toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl">
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Margin Delta</div>
                                    <div className="text-xl font-black text-amber-500">+{simulation.marginDelta.toFixed(2)}%</div>
                                </div>
                                <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl">
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Volume Variance</div>
                                    <div className="text-xl font-black text-rose-500">-{( (1 - (1 - (percentage * 0.005))) * 100).toFixed(1)}%</div>
                                </div>
                            </div>

                            <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl flex gap-3">
                                <AlertCircle className="text-amber-500 shrink-0" size={18} />
                                <p className="text-[11px] font-bold text-slate-400 leading-relaxed uppercase italic">
                                    Model assumes low price elasticity for {category}. Higher increases may result in customer churn.
                                </p>
                            </div>
                         </div>

                         <div className="flex gap-4">
                            <Button variant="outline" className="flex-1 py-6 uppercase font-black tracking-widest" onClick={() => setStep(1)}>Back</Button>
                            <Button variant="primary" className="flex-[2] py-6 uppercase font-black tracking-widest gap-2" onClick={() => setStep(3)}>
                                Final Review <ChevronRight size={18} />
                            </Button>
                         </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div 
                        key="step3"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-slate-900/50 border border-emerald-500/30 p-12 rounded-[3rem] text-center space-y-8 backdrop-blur-3xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
                        <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-500 mx-auto border border-emerald-500/20">
                            <CheckCircle2 size={40} />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-100 italic">Ready for Deployment</h3>
                            <p className="text-slate-400 font-bold mt-2">Adjusting {category} by {percentage}% global baseline.</p>
                        </div>
                        
                        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-left space-y-3">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                                <span>Network Propagation</span>
                                <span className="text-emerald-500">12 Branches</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1 }} className="h-full bg-emerald-500" />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Button variant="muted" className="flex-1 py-6 uppercase font-black tracking-widest" onClick={() => setStep(2)}>Cancel</Button>
                            <Button variant="primary" className="flex-[2] py-6 uppercase font-black tracking-widest gap-2 bg-emerald-600 hover:bg-emerald-500 border-none shadow-emerald-500/20 shadow-2xl">
                                <Save size={18} /> Commit Global Pricing
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        <div className="col-span-1 space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl space-y-6 relative overflow-hidden group">
                <div className="flex items-center gap-3 text-slate-200">
                    <TrendingUp size={20} className="text-amber-500" />
                    <h4 className="font-black uppercase tracking-tight">Market Insight</h4>
                </div>
                <div className="space-y-4">
                    <p className="text-xs font-bold text-slate-400 leading-relaxed uppercase">
                        Current market average for {category} has increased by 7.2% in Kathmandu Valley.
                    </p>
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                        <span className="text-[10px] font-black uppercase text-emerald-400">Competitive Analysis</span>
                        <p className="text-[11px] font-bold text-emerald-500/80 italic mt-1">Your prices are 4% below competitors.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PricingWizard;
