import React, { useState } from 'react';
import { 
  ArrowRight, Check, Rocket, Database, 
  ShieldCheck, Building2, Sparkles 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';

interface Step {
  id: number;
  title: string;
  description: string;
  icon: any;
}

const steps: Step[] = [
  { 
    id: 1, 
    title: 'Entity Scan', 
    description: 'Analyzing legacy data structures and warehouse mappings for migration readiness.',
    icon: Database 
  },
  { 
    id: 2, 
    title: 'Chain Topology', 
    description: 'Establishing multi-branch hierarchy, naming series, and regional tax profiles.',
    icon: Building2 
  },
  { 
    id: 3, 
    title: 'Regulatory Shield', 
    description: 'Provisioning IRD CBMS security keys and validating regional compliance status.',
    icon: ShieldCheck 
  },
  { 
    id: 4, 
    title: 'Intelligence Activation', 
    description: 'Powering up the global strategy hub and the Edge-AI orchestration layer.',
    icon: Rocket 
  }
];

const OnboardingWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-pos-black flex items-center justify-center p-8">
        <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-pos-surface border-4 border-pos-primary/30 p-16 rounded-[2rem] text-center max-w-2xl shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-pos-primary/5 to-transparent z-0" />
          <div className="relative z-10">
            <div className="w-24 h-24 bg-pos-primary/20 rounded-full flex items-center justify-center mx-auto mb-10 border-2 border-pos-primary/50 shadow-xl shadow-pos-primary/20">
                <Check size={48} className="text-pos-primary" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic mb-6">Sovereign Chain Active</h1>
            <p className="text-xl text-pos-muted font-medium mb-12">
                The Dukaan orchestration layer is now managing your multi-branch network with full IRD compliance.
            </p>
            <Button variant="primary" size="xl" className="w-full h-20 text-lg uppercase font-black">
                Enter Strategy Hub
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pos-black p-10 text-pos-white flex flex-col items-center justify-center font-sans selection:bg-pos-primary/30">
      <div className="w-full max-w-5xl">
        <header className="mb-20 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
                <Sparkles className="text-pos-secondary animate-pulse" size={20} />
                <span className="text-xs font-black uppercase tracking-[0.4em] text-pos-secondary">Enterprise Scale Logic</span>
            </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic mb-4">Growth Protocol</h1>
          <p className="text-pos-muted text-lg font-medium">Step-by-step business transformation to multi-branch architecture</p>
        </header>

        {/* Stepper HUD */}
        <div className="flex justify-between mb-24 relative px-10">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-pos-surface -translate-y-1/2 z-0" />
          <div 
            className="absolute top-1/2 left-0 h-1 bg-pos-primary -translate-y-1/2 transition-all duration-1000 z-0" 
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
          
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = step.id <= currentStep;
            const isCurrent = step.id === currentStep;
            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center">
                <motion.div 
                    animate={isCurrent ? { scale: 1.1, boxShadow: '0 0 40px rgba(16, 185, 129, 0.2)' } : { scale: 1 }}
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${
                    isActive ? 'bg-pos-black border-pos-primary text-pos-primary' : 'bg-pos-surface border-pos-border text-pos-muted'
                    }`}
                >
                  <Icon size={28} />
                </motion.div>
                <div className={`mt-5 font-black text-[10px] uppercase tracking-widest ${isActive ? 'text-pos-primary' : 'text-pos-muted'}`}>
                  Protocol {step.id}
                </div>
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
            <motion.div 
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-pos-surface/50 border border-pos-border p-12 rounded-[2.5rem] shadow-2xl backdrop-blur-xl relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-pos-primary/5 blur-[100px] -mr-32 -mt-32 rounded-full" />
                
                <div className="flex gap-12 items-start relative z-10">
                    <div className="p-8 bg-pos-black rounded-3xl border border-pos-border shadow-inner flex-shrink-0">
                        {React.createElement(steps[currentStep - 1].icon, { size: 72, className: 'text-pos-primary' })}
                    </div>
                    <div className="flex-1 pt-2">
                        <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-4">{steps[currentStep - 1].title}</h2>
                        <p className="text-xl text-pos-muted font-medium leading-relaxed mb-12 max-w-2xl">
                            {steps[currentStep - 1].description}
                        </p>
                        
                        <div className="grid grid-cols-2 gap-6 mb-12">
                            <div className="flex items-center gap-4 bg-pos-black/40 p-4 rounded-xl border border-pos-border/50">
                                <div className="w-8 h-8 rounded-lg bg-pos-primary/10 flex items-center justify-center">
                                    <Check size={16} className="text-pos-primary" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wide opacity-70">Structural Integrity Validated</span>
                            </div>
                            <div className="flex items-center gap-4 bg-pos-black/40 p-4 rounded-xl border border-pos-border/50">
                                <div className="w-8 h-8 rounded-lg bg-pos-primary/10 flex items-center justify-center">
                                    <Check size={16} className="text-pos-primary" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wide opacity-70">Compliance Logic Sync Complete</span>
                            </div>
                        </div>

                        <Button 
                            variant="primary" 
                            size="xl" 
                            className="group flex items-center gap-6 h-20 px-10 text-lg uppercase font-black tracking-tight rounded-2xl relative overflow-hidden"
                            onClick={nextStep}
                        >
                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            <span className="relative z-10">{currentStep === steps.length ? 'Finalize Activation' : 'Proceed to Next Step'}</span>
                            <ArrowRight className="group-hover:translate-x-2 transition-transform relative z-10" />
                        </Button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>

        <footer className="mt-12 text-center">
          <p className="text-[10px] text-pos-muted font-black uppercase tracking-[0.5em] opacity-40">
            Sovereign Protocol v4.2 // Automated Compliance Validation 
          </p>
        </footer>
      </div>
    </div>
  );
};

export default OnboardingWizard;
