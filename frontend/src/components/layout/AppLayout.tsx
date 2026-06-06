import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, ShoppingCart, Rocket, 
  Settings, LogOut, Menu, X, Bell 
} from 'lucide-react';
import POSHUD from '../pos/POSHUD';
import KPIDashboard from '../analytics/KPIDashboard';
import OnboardingWizard from '../wizards/OnboardingWizard';

const AppLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pos' | 'dashboard' | 'wizard'>('pos');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { id: 'pos', label: 'Point of Sale', icon: ShoppingCart },
    { id: 'dashboard', label: 'Strategy Hub', icon: LayoutDashboard },
    { id: 'wizard', label: 'Growth Wizard', icon: Rocket },
  ];

  return (
    <div className="flex h-screen bg-pos-black text-pos-white overflow-hidden font-sans">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="bg-pos-surface border-r border-pos-border flex flex-col relative z-20"
      >
        <div className="p-6 flex items-center gap-4 border-b border-pos-border mb-6">
          <div className="w-10 h-10 bg-pos-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-pos-primary/20">
            <span className="font-black text-pos-black text-xl italic">D</span>
          </div>
          {isSidebarOpen && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-black text-xl tracking-tighter uppercase italic"
            >
              Dukaan
            </motion.span>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all relative group ${
                  isActive 
                    ? 'bg-pos-primary/10 text-pos-primary' 
                    : 'text-pos-muted hover:bg-pos-surface hover:text-pos-white'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="active-nav"
                    className="absolute inset-0 bg-pos-primary/5 border border-pos-primary/20 rounded-xl"
                  />
                )}
                <Icon size={22} className={isActive ? 'text-pos-primary' : 'group-hover:text-pos-white transition-colors'} />
                {isSidebarOpen && (
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-bold text-sm tracking-tight relative z-10"
                  >
                    {item.label}
                  </motion.span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-pos-border space-y-2">
          <button className="w-full flex items-center gap-4 p-4 rounded-xl text-pos-muted hover:bg-pos-surface hover:text-pos-white transition-all group">
            <Settings size={22} className="group-hover:text-pos-white" />
            {isSidebarOpen && <span className="font-bold text-sm">Settings</span>}
          </button>
          <button className="w-full flex items-center gap-4 p-4 rounded-xl text-pos-danger hover:bg-pos-danger/10 transition-all group">
            <LogOut size={22} />
            {isSidebarOpen && <span className="font-bold text-sm">Log Out</span>}
          </button>
        </div>

        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-4 top-24 w-8 h-8 bg-pos-surface border border-pos-border rounded-full flex items-center justify-center text-pos-muted hover:text-pos-white shadow-xl hover:scale-110 transition-all z-30"
        >
          {isSidebarOpen ? <X size={14} /> : <Menu size={14} />}
        </button>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {/* Top Header */}
        <header className="h-20 border-b border-pos-border bg-pos-surface/30 backdrop-blur-xl flex items-center justify-end px-10 gap-6 z-10">
            <button className="p-2 text-pos-muted hover:text-pos-white relative">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pos-danger rounded-full border-2 border-pos-black" />
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-pos-border">
                <div className="text-right">
                    <div className="text-xs font-black uppercase tracking-widest text-pos-primary">Premium Admin</div>
                    <div className="text-sm font-bold">Rajesh Hamal</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pos-primary to-pos-secondary flex items-center justify-center font-black text-pos-black">
                    RH
                </div>
            </div>
        </header>

        <div className="flex-1 relative">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="absolute inset-0 overflow-auto"
                >
                    {activeTab === 'pos' && (
                        <POSHUD availableItems={[
                            { id: '1', name: 'Wai Wai Noodles', price: 20 },
                            { id: '2', name: 'Real Juice 1L', price: 250 },
                            { id: '3', name: 'Amul Butter 500g', price: 600 },
                            { id: '4', name: 'Dairy Milk Silk', price: 180 },
                            { id: '5', name: 'Coca Cola 2.25L', price: 270 },
                            { id: '6', name: 'Lays Chips', price: 50 },
                            { id: '7', name: 'Current Noodles', price: 50 },
                            { id: '8', name: 'Aashirvaad Atta 5kg', price: 550 },
                            { id: '9', name: 'Fortune Oil 1L', price: 240 },
                        ]} />
                    )}
                    {activeTab === 'dashboard' && <KPIDashboard />}
                    {activeTab === 'wizard' && <OnboardingWizard />}
                </motion.div>
            </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
