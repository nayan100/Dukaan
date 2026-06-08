import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldAlert, Check, X } from 'lucide-react';

interface AISuggestionsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const MOCK_SUGGESTIONS = [
  { 
    id: 'S1', 
    item: 'Wai Wai Noodles', 
    from: 'Lalitpur', 
    to: 'KTM Main', 
    quantity: 250, 
    reason: 'High demand in KTM Main, excess stock in Lalitpur (Dead Stock avoidance)',
    confidence: 94
  },
  { 
    id: 'S2', 
    item: 'Soap', 
    from: 'Pokhara', 
    to: 'Butwal', 
    quantity: 40, 
    reason: 'Stock stagnation detected in Pokhara (> 30 days)',
    confidence: 88
  },
];

const AISuggestionsOverlay: React.FC<AISuggestionsOverlayProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl z-50 flex flex-col"
          >
            <div className="p-8 border-b border-slate-800 bg-slate-950/50">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="text-amber-400" size={24} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400">AI Intelligence Hub</span>
              </div>
              <h2 className="text-2xl font-black tracking-tighter uppercase italic text-slate-100">Strategic Suggestions</h2>
              <p className="text-xs text-slate-500 font-bold mt-2">Optimization maneuvers suggested by the Sovereign engine.</p>
            </div>

            <div className="flex-1 overflow-auto p-8 space-y-6">
              <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-start gap-4">
                <ShieldAlert className="text-amber-400 shrink-0" size={20} />
                <p className="text-[10px] font-bold text-amber-400/80 leading-relaxed uppercase tracking-wider">
                  Critical Guardrail: All AI-driven maneuvers require explicit human authorization before execution.
                </p>
              </div>

              {MOCK_SUGGESTIONS.map((s) => (
                <div key={s.id} className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all group">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Inter-Branch Transfer
                      </div>
                      <div className="text-amber-400 font-black italic text-xs">
                        {s.confidence}% Match
                      </div>
                    </div>
                    
                    <h4 className="text-lg font-black text-slate-100 mb-4">{s.item}</h4>
                    
                    <div className="flex items-center justify-between bg-slate-900/50 p-4 rounded-xl mb-4 border border-slate-800/50">
                      <div className="text-center flex-1">
                        <div className="text-[8px] font-black text-slate-500 uppercase mb-1">Source</div>
                        <div className="text-xs font-bold text-slate-200">{s.from}</div>
                      </div>
                      <ArrowRight size={16} className="text-slate-600" />
                      <div className="text-center flex-1">
                        <div className="text-[8px] font-black text-slate-500 uppercase mb-1">Destination</div>
                        <div className="text-xs font-bold text-slate-200">{s.to}</div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-6">
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Rationale</div>
                      <p className="text-xs text-slate-300 leading-relaxed font-medium bg-slate-900/30 p-3 rounded-lg border border-slate-800/30">
                        {s.reason}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button className="flex-1 bg-emerald-500 text-slate-950 h-10 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 transition-all flex items-center justify-center gap-2">
                        <Check size={14} /> Approve
                      </button>
                      <button className="px-4 bg-slate-800 text-slate-300 h-10 rounded-lg hover:bg-rose-500/20 hover:text-rose-400 transition-all flex items-center justify-center">
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-8 border-t border-slate-800 bg-slate-950/50">
              <button 
                onClick={onClose}
                className="w-full py-4 bg-slate-800 text-slate-300 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-700 transition-all"
              >
                Close Hub
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AISuggestionsOverlay;
