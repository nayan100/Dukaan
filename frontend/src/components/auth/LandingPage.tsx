import React from 'react';
import { 
  ShieldCheck, User, Users, Building2, 
  ShoppingCart, Activity, ArrowRight 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface LandingPageProps {
  onLogin: (user: any) => void;
  onManualLogin: () => void;
}

const PERSONAS = [
  {
    role: 'Admin',
    label: 'SaaS Admin',
    description: 'Platform management, tenant provisioning, and global visibility.',
    icon: ShieldCheck,
    color: 'text-pos-primary',
    bgColor: 'bg-pos-primary/10',
    credentials: { tenant: 'PLATFORM', username: 'admin_nayan', role: 'Admin' }
  },
  {
    role: 'Chain Owner',
    label: 'Chain Owner',
    description: 'Strategy Hub, branch performance, and expansion management.',
    icon: Building2,
    color: 'text-pos-secondary',
    bgColor: 'bg-pos-secondary/10',
    credentials: { tenant: 'EVEREST', username: 'everest_owner', role: 'Chain Owner' }
  },
  {
    role: 'Branch Owner',
    label: 'Branch Manager',
    description: 'Logistics, local procurement, and branch-level oversight.',
    icon: Users,
    color: 'text-pos-primary',
    bgColor: 'bg-pos-primary/10',
    credentials: { tenant: 'EVEREST', username: 'ktm_manager', role: 'Branch Owner' }
  },
  {
    role: 'POS',
    label: 'Cashier',
    description: 'High-speed POS interface, offline-first sales, and daily operations.',
    icon: ShoppingCart,
    color: 'text-pos-primary',
    bgColor: 'bg-pos-primary/10',
    credentials: { tenant: 'EVEREST', username: 'cashier_01', role: 'POS' }
  },
  {
    role: 'Accountant',
    label: 'Accountant',
    description: 'Compliance monitoring, IRD sync logs, and VAT auditing.',
    icon: Activity,
    color: 'text-pos-secondary',
    bgColor: 'bg-pos-secondary/10',
    credentials: { tenant: 'EVEREST', username: 'everest_audit', role: 'Accountant' }
  }
];

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onManualLogin }) => {
  return (
    <div className="min-h-screen bg-pos-black flex items-center justify-center p-10 selection:bg-pos-primary/30 overflow-auto">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-pos-primary/10 border border-pos-primary/20 px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 bg-pos-primary rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-pos-primary">Showcase Mode Active</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic text-pos-white mb-4">Select Your Persona</h1>
          <p className="text-pos-muted text-lg font-medium max-w-2xl mx-auto">
            Experience the "Item Odyssey" lifecycle through the eyes of different stakeholders in the Dukaan ecosystem.
          </p>
        </div>

        {/* Persona Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {PERSONAS.map((persona, index) => {
            const Icon = persona.icon;
            return (
              <motion.button
                key={persona.role}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onLogin(persona.credentials)}
                className="group relative bg-pos-surface border border-pos-border p-8 rounded-[2rem] text-left hover:border-pos-primary/50 transition-all hover:shadow-2xl hover:shadow-pos-primary/10"
              >
                <div className={`w-14 h-14 ${persona.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className={persona.color} size={28} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tighter text-pos-white mb-2">{persona.label}</h3>
                <p className="text-pos-muted text-xs leading-relaxed mb-8">{persona.description}</p>
                <div className="flex items-center gap-2 text-pos-primary font-bold text-xs uppercase tracking-widest">
                  One-Click Entry <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Manual Login */}
        <div className="mt-16 text-center">
            <button 
                onClick={onManualLogin}
                className="text-pos-muted hover:text-pos-white text-xs font-black uppercase tracking-[0.2em] transition-colors"
            >
                Or enter manual credentials
            </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
