import React, { useState } from 'react';
import { Building2, Rocket, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import BaseHQWizard from '../wizards/BaseHQWizard';
import { useHQStore } from '../../store/useHQStore';

const GrowthWizardsHub: React.FC = () => {
  const [activeWizard, setActiveWizard] = useState<string | null>(null);
  const setWizardState = useHQStore(s => s.setWizardState);

  const startWizard = (id: string) => {
    setActiveWizard(id);
    setWizardState(id, 0);
  };

  const BRANCH_STEPS = [
    { 
        id: 1, 
        title: 'Branch Identity', 
        component: <StepWrapper title="Basic Setup" description="Enter the branch name, location, and regional tax ID." /> 
    },
    { 
        id: 2, 
        title: 'Managerial Core', 
        component: <StepWrapper title="Access Control" description="Assign branch managers and set initial permission sets." /> 
    },
    { 
        id: 3, 
        title: 'Sovereign Quotas', 
        component: <StepWrapper title="Resource Limits" description="Set transaction limits, user seat quotas, and storage tiers." /> 
    },
  ];

  const EXPANSION_STEPS = [
    { 
        id: 1, 
        title: 'Market Analysis', 
        component: <StepWrapper title="Strategic Scan" description="AI-driven analysis of target region demand and competitor density." /> 
    },
    { 
        id: 2, 
        title: 'Resource Allocation', 
        component: <StepWrapper title="Initial Investment" description="Budget provisioning and logistics planning for the new territory." /> 
    },
  ];

  return (
    <div className="p-10 space-y-10 bg-slate-950 min-h-screen text-white">
      <header>
        <h1 className="text-4xl font-black tracking-tighter uppercase italic">Growth Hub</h1>
        <p className="text-slate-400 font-medium mt-2">Strategic protocols for scaling your retail empire.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <WizardCard 
          title="New Branch Protocol" 
          description="Provision a new retail entity with full compliance and managerial guardrails."
          icon={Building2}
          color="emerald"
          onClick={() => startWizard('branch')}
        />
        <WizardCard 
          title="Market Expansion" 
          description="Strategic AI-augmented plan for entering new regional territories."
          icon={Rocket}
          color="blue"
          onClick={() => startWizard('expansion')}
        />
        <WizardCard 
          title="Sovereign Hardening" 
          description="Upgrade security protocols and IRD sync redundancy for existing branches."
          icon={ShieldCheck}
          color="amber"
          onClick={() => {}}
        />
      </div>

      {activeWizard === 'branch' && (
        <BaseHQWizard 
          wizardId="branch"
          steps={BRANCH_STEPS}
          onClose={() => setActiveWizard(null)}
          onComplete={(data) => {
            console.log('Branch Onboarding Complete', data);
            setActiveWizard(null);
          }}
        />
      )}

      {activeWizard === 'expansion' && (
        <BaseHQWizard 
          wizardId="expansion"
          steps={EXPANSION_STEPS}
          onClose={() => setActiveWizard(null)}
          onComplete={(data) => {
            console.log('Expansion Protocol Finalized', data);
            setActiveWizard(null);
          }}
        />
      )}
    </div>
  );
};

const WizardCard = ({ title, description, icon: Icon, color, onClick }: any) => {
  const colorClasses: Record<string, string> = {
    emerald: 'bg-emerald-500 text-emerald-400 border-emerald-500/20',
    blue: 'bg-blue-500 text-blue-400 border-blue-500/20',
    amber: 'bg-amber-500 text-amber-400 border-amber-500/20',
  };

  return (
    <button 
      onClick={onClick}
      className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] text-left hover:border-slate-600 transition-all group relative overflow-hidden"
    >
      <div className={`absolute top-0 right-0 w-32 h-32 ${colorClasses[color].split(' ')[0]}/5 blur-3xl -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-transform duration-700`} />
      <div className={`w-16 h-16 ${colorClasses[color].split(' ')[0]}/10 rounded-2xl flex items-center justify-center mb-8 border ${colorClasses[color].split(' ')[2]} group-hover:scale-110 transition-transform`}>
        <Icon className={colorClasses[color].split(' ')[1]} size={32} />
      </div>
      <h3 className="text-2xl font-black uppercase tracking-tight text-slate-100 mb-4">{title}</h3>
      <p className="text-slate-500 text-sm font-bold leading-relaxed mb-8">{description}</p>
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-emerald-400 transition-colors">
        Launch Protocol <Zap size={14} className="animate-pulse" />
      </div>
    </button>
  );
};

const StepWrapper = ({ title, description }: any) => (
  <div className="space-y-8 flex flex-col items-center justify-center h-full text-center max-w-md mx-auto">
     <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center border border-slate-700 shadow-2xl">
        <Sparkles className="text-emerald-400" size={32} />
     </div>
     <div>
        <h4 className="text-2xl font-black uppercase tracking-tight text-slate-200">{title}</h4>
        <p className="text-slate-500 font-medium mt-4">{description}</p>
     </div>
     <div className="w-full space-y-4 pt-8">
        <input 
          type="text" 
          placeholder="Enter configuration data..." 
          className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-xs font-bold focus:border-emerald-500 transition-all outline-none text-white"
        />
     </div>
  </div>
);

export default GrowthWizardsHub;
