import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, FileSpreadsheet, ShieldCheck, PieChart } from 'lucide-react';

const FinanceLayout: React.FC = () => {
  const location = useLocation();
  
  const tabs = [
    { path: 'sync', label: 'Sync Monitor', icon: Activity },
    { path: 'purchase', label: 'Purchase Register', icon: FileSpreadsheet },
    { path: 'audit', label: 'Audit Hub', icon: ShieldCheck },
    { path: 'analytics', label: 'Analytics', icon: PieChart },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Horizontal Tab Navigation (Accountant Dashboard Style) */}
      <header className="bg-slate-900/50 border-b border-slate-800 px-10 pt-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="text-amber-500" size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500/80">Compliance Command</span>
            </div>
            <h1 className="text-3xl font-black tracking-tighter uppercase italic text-slate-100">Financial Governance</h1>
          </div>
          <div className="flex items-center gap-4 bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">All Branches Consolidated</span>
          </div>
        </div>

        <nav className="flex gap-8">
          {tabs.map((tab) => {
            const isActive = location.pathname.includes(tab.path);
            const Icon = tab.icon;

            return (
              <NavLink
                key={tab.path}
                to={tab.path}
                className={`flex items-center gap-2 pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${
                  isActive ? 'text-amber-500' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Icon size={14} />
                {tab.label}
                {isActive && (
                  <motion.div 
                    layoutId="finance-tab-active"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500 rounded-t-full shadow-[0_-4px_12px_rgba(245,158,11,0.3)]"
                  />
                )}
              </NavLink>
            );
          })}
        </nav>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto relative">
        <Outlet />
      </div>
    </div>
  );
};

export default FinanceLayout;
