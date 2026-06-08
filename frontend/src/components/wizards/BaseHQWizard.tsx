import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, ArrowLeft, X } from 'lucide-react';
import { useHQStore } from '../../store/useHQStore';

interface Step {
  id: number;
  title: string;
  component: React.ReactNode;
}

interface BaseHQWizardProps {
  wizardId: string;
  steps: Step[];
  onComplete: (data: any) => void;
  onClose: () => void;
}

const BaseHQWizard: React.FC<BaseHQWizardProps> = ({ wizardId, steps, onComplete, onClose }) => {
  const { wizardState, setWizardState, clearWizardState } = {
      wizardState: useHQStore(s => s.wizardState),
      setWizardState: useHQStore(s => s.setWizardState),
      clearWizardState: useHQStore(s => s.clearWizardState)
  };

  const currentStep = wizardState.activeWizard === wizardId ? wizardState.step : 0;
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setWizardState(wizardId, currentStep + 1);
    } else {
      onComplete(wizardState.data);
      clearWizardState();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setWizardState(wizardId, currentStep - 1);
    }
  };

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-50 flex items-center justify-center p-8">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col h-[700px]"
      >
        <header className="p-10 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-2">Step {currentStep + 1} of {steps.length}</div>
            <h2 className="text-3xl font-black uppercase tracking-tighter italic text-slate-100">{step.title}</h2>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-800 rounded-2xl hover:bg-rose-500/20 hover:text-rose-400 transition-all">
            <X size={24} />
          </button>
        </header>

        <div className="flex-1 overflow-auto p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="h-full"
            >
              {step.component}
            </motion.div>
          </AnimatePresence>
        </div>

        <footer className="p-10 border-t border-slate-800 flex justify-between items-center bg-slate-950/50">
          <button 
            onClick={handleBack}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-200 disabled:opacity-0 transition-all"
          >
            <ArrowLeft size={18} /> Back
          </button>
          
          <div className="flex gap-4">
             {steps.map((_, idx) => (
               <div key={idx} className={`w-2 h-2 rounded-full transition-all duration-500 ${idx === currentStep ? 'bg-emerald-500 w-8' : 'bg-slate-700'}`} />
             ))}
          </div>

          <button 
            onClick={handleNext}
            className="flex items-center gap-3 bg-emerald-500 text-slate-950 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20"
          >
            {currentStep === steps.length - 1 ? 'Finalize Protocol' : 'Continue'} 
            {currentStep === steps.length - 1 ? <Check size={18} /> : <ArrowRight size={18} />}
          </button>
        </footer>
      </motion.div>
    </div>
  );
};

export default BaseHQWizard;
