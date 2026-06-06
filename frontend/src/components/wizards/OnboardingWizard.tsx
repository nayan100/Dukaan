import React, { useState } from 'react';
import { 
  ArrowRight, Check, Rocket, Database, 
  ShieldCheck, Globe, Building2 
} from 'lucide-react';
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
    title: 'Migration Ready', 
    description: 'Scanning default warehouse for migration to Branch 1.',
    icon: Database 
  },
  { 
    id: 2, 
    title: 'Branch Mapping', 
    description: 'Establishing naming series and regional tax profiles.',
    icon: Building2 
  },
  { 
    id: 3, 
    title: 'IRD Registration', 
    description: 'Securing CBMS keys and validating PAN/VAT details.',
    icon: ShieldCheck 
  },
  { 
    id: 4, 
    title: 'Launch Chain', 
    description: 'Activating global strategy dashboards and AI layer.',
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
        <div className="bg-pos-surface border-4 border-pos-primary p-12 rounded-lg text-center max-w-2xl">
          <div className="w-24 h-24 bg-pos-primary rounded-full flex items-center justify-center mx-auto mb-8">
            <Check size={48} className="text-pos-black" />
          </div>
          <h1 className="text-pos-2xl font-bold uppercase mb-4">Chain Activated!</h1>
          <p className="text-pos-xl opacity-80 mb-8">
            Congratulations. Dukaan has successfully transitioned your business to a multi-branch system.
          </p>
          <Button variant="primary" size="xl" className="w-full">
            Enter Strategy Hub
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pos-black p-8 text-pos-white flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="text-pos-2xl font-bold uppercase tracking-widest mb-2">Growth Wizard</h1>
          <p className="opacity-60">Single-to-Chain Transition Protocol</p>
        </div>

        {/* Stepper HUD */}
        <div className="flex justify-between mb-16 relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-pos-surface -translate-y-1/2 z-0" />
          <div 
            className="absolute top-1/2 left-0 h-1 bg-pos-primary -translate-y-1/2 transition-all duration-500 z-0" 
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
          
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = step.id <= currentStep;
            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 transition-colors duration-500 ${
                  isActive ? 'bg-pos-black border-pos-primary text-pos-primary' : 'bg-pos-surface border-transparent text-gray-600'
                }`}>
                  <Icon size={24} />
                </div>
                <div className={`mt-4 font-bold text-xs uppercase ${isActive ? 'text-pos-primary' : 'text-gray-600'}`}>
                  Step {step.id}
                </div>
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="bg-pos-surface border-4 border-pos-primary p-10 rounded-lg shadow-2xl transition-all duration-300">
          <div className="flex gap-8 items-start">
            <div className="p-6 bg-pos-black rounded-lg border-2 border-pos-primary">
              {React.createElement(steps[currentStep - 1].icon, { size: 64, className: 'text-pos-primary' })}
            </div>
            <div className="flex-1">
              <h2 className="text-pos-xl font-bold uppercase mb-2">{steps[currentStep - 1].title}</h2>
              <p className="text-lg opacity-80 leading-relaxed mb-8">
                {steps[currentStep - 1].description}
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-sm">
                  <Check size={16} className="text-pos-primary" />
                  <span>Validation check completed successfully.</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Check size={16} className="text-pos-primary" />
                  <span>Regional configuration identified.</span>
                </div>
              </div>

              <Button 
                variant="primary" 
                size="xl" 
                className="group flex items-center gap-4"
                onClick={nextStep}
              >
                <span>{currentStep === steps.length ? 'Finalize Activation' : 'Proceed to Next Step'}</span>
                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs opacity-40 uppercase tracking-widest">
            Protocol strictly follows IRD compliance guidelines v4.2
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
