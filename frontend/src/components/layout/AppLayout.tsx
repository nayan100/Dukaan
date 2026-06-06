import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, ShoppingCart, Rocket, 
  Settings, LogOut, Menu, X, Bell, Package 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import PermissionGuard from '../auth/PermissionGuard';
import POSHUD from '../pos/POSHUD';
import KPIDashboard from '../analytics/KPIDashboard';
import OnboardingWizard from '../wizards/OnboardingWizard';
import TransferUI from '../logistics/TransferUI';
import LoginPage from '../auth/LoginPage';
import SyncWarning from './SyncWarning';

const AppLayout: React.FC = () => {
  const { user, login, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'pos' | 'dashboard' | 'wizard' | 'logistics'>('pos');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (!user) {
    return <LoginPage onLogin={login} />;
  }

  const navItems = [
    { id: 'pos', label: 'Point of Sale', icon: ShoppingCart, permission: 'access_pos' },
    { id: 'dashboard', label: 'Strategy Hub', icon: 'access_strategy_hub' }, // Fix: was using string
    { id: 'logistics', label: 'Logistics', icon: Package, permission: 'access_branch_dashboard' },
    { id: 'wizard', label: 'Growth Wizard', icon: Rocket, permission: 'access_growth_wizard' },
  ];

  // Manual fix for dashboard icon mapping since I noticed a small type error in my thought process
  const getIcon = (id: string) => {
    switch(id) {
        case 'pos': return ShoppingCart;
        case 'dashboard': return LayoutDashboard;
        case 'wizard': return Rocket;
        case 'logistics': return Package;
        default: return Package;
    }
  }

  return (
    <div className="flex h-screen bg-pos-black text-pos-white overflow-hidden font-sans">
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
            const Icon = getIcon(item.id);
            const isActive = activeTab === item.id;
            // For dashboard, we use access_strategy_hub permission
            const perm = item.id === 'dashboard' ? 'access_strategy_hub' : item.permission;

            return (
              <PermissionGuard key={item.id} permission={perm as string}>
                <button
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
              </PermissionGuard>
            );
          })}
        </nav>

        <div className="p-4 border-t border-pos-border space-y-2">
          <button className="w-full flex items-center gap-4 p-4 rounded-xl text-pos-muted hover:bg-pos-surface hover:text-pos-white transition-all group">
            <Settings size={22} className="group-hover:text-pos-white" />
            {isSidebarOpen && <span className="font-bold text-sm">Settings</span>}
          </button>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-4 p-4 rounded-xl text-pos-danger hover:bg-pos-danger/10 transition-all group"
          >
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

      <main className="flex-1 relative overflow-hidden flex flex-col">
        <SyncWarning />
        <header className="h-20 border-b border-pos-border bg-pos-surface/30 backdrop-blur-xl flex items-center justify-end px-10 gap-6 z-10">
            <button className="p-2 text-pos-muted hover:text-pos-white relative">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pos-danger rounded-full border-2 border-pos-black" />
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-pos-border">
                <div className="text-right">
                    <div className="text-xs font-black uppercase tracking-widest text-pos-primary">{user.role}</div>
                    <div className="text-sm font-bold">{user.username}</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pos-primary to-pos-secondary flex items-center justify-center font-black text-pos-black uppercase">
                    {user.username.substring(0, 2)}
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
                        <PermissionGuard permission="access_pos" fallback={<div className="p-20 text-center font-bold text-pos-danger uppercase tracking-tighter italic">Access Restricted to Active Cashiers Only</div>}>
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
                        </PermissionGuard>
                    )}
                    {activeTab === 'dashboard' && (
                        <PermissionGuard permission="access_strategy_hub" fallback={<div className="p-20 text-center font-bold text-pos-danger uppercase tracking-tighter italic">Access Restricted to Strategy Group</div>}>
                            <KPIDashboard />
                        </PermissionGuard>
                    )}
                    {activeTab === 'logistics' && (
                        <PermissionGuard permission="access_branch_dashboard" fallback={<div className="p-20 text-center font-bold text-pos-danger uppercase tracking-tighter italic">Access Restricted to Logistics Group</div>}>
                            <TransferUI availableItems={[
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
                        </PermissionGuard>
                    )}
                    {activeTab === 'wizard' && (
                        <PermissionGuard permission="access_growth_wizard" fallback={<div className="p-20 text-center font-bold text-pos-danger uppercase tracking-tighter italic">Access Restricted to Enterprise Group</div>}>
                            <OnboardingWizard />
                        </PermissionGuard>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
