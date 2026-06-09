import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Activity, FileSpreadsheet, ShieldCheck, PieChart } from 'lucide-react';
import { motion } from 'framer-motion';

const FinanceLayout: React.FC = () => {
  const navItems = [
    { path: 'sync', label: 'Sync Monitor', icon: Activity },
    { path: 'purchase', label: 'Purchase Register', icon: FileSpreadsheet },
    { path: 'audit', label: 'Valuation & Audit', icon: ShieldCheck },
    { path: 'analytics', label: 'Finance Analytics', icon: PieChart },
  ];

  return (
    <div className="flex h-full bg-slate-950 text-slate-200 font-sans overflow-hidden">
      {/* Finance Sub-Sidebar */}
      <aside className="w-64 bg-slate-900/50 border-r border-slate-800 flex flex-col p-6 space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="text-amber-500" size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500/80">Compliance Hub</span>
          </div>
          <h2 className="text-xl font-black tracking-tighter uppercase italic text-slate-100">Accountant</h2>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative
                  ${isActive 
                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'}
                `}
              >
                <Icon size={18} />
                <span className="text-sm font-bold tracking-tight">{item.label}</span>
                
                {/* Active Indicator */}
                {({ isActive }: { isActive: boolean }) => isActive && (
                  <motion.div 
                    layoutId="finance-nav-active"
                    className="absolute left-0 w-1 h-6 bg-amber-500 rounded-r-full"
                  />
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-slate-800">
          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800/50">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Grid Standard</div>
            <div className="text-xs font-bold text-slate-300">TanStack Table v8</div>
          </div>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 overflow-auto relative bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
        <Outlet />
      </main>
    </div>
  );
};

export default FinanceLayout;
