import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, ShoppingCart, Rocket, 
  Settings, LogOut, Menu, X, Bell, Package, Activity, ShieldCheck, ShieldAlert,
  Users, Building2, ClipboardList
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import PermissionGuard from '../auth/PermissionGuard';
import POSHUD from '../pos/POSHUD';
import KPIDashboard from '../analytics/KPIDashboard';
import OnboardingWizard from '../wizards/OnboardingWizard';
import TransferUI from '../logistics/TransferUI';
import LoginPage from '../auth/LoginPage';
import SyncWarning from './SyncWarning';
import IRDSyncDashboard from '../analytics/IRDSyncDashboard';
import AdminDashboard from '../admin/AdminDashboard';
import BranchManagement from '../management/BranchManagement';
import UserManagement from '../management/UserManagement';
import Button from '../ui/Button';
import { initDB } from '../../lib/db';
import { startSyncWorker } from '../../lib/syncWorker';

const AppLayout: React.FC = () => {
  const { user, login, logout, validateTenant, hasPermission } = useAuth();
  
  // Set default tab based on role
  const getDefaultTab = () => {
    if (user?.role === 'Admin') return 'admin';
    if (user?.role === 'Chain Owner') return 'dashboard';
    if (user?.role === 'Single Owner') return 'wizard';
    if (user?.role === 'Branch Owner') return 'logistics';
    if (user?.role === 'POS') return 'pos';
    if (user?.role === 'Accountant') return 'audit';
    return 'pos';
  };

  const [activeTab, setActiveTab] = useState(getDefaultTab());
  const [isSidebarOpen, setIsSidebarOpen] = useState(user?.role !== 'POS');
  const [isSuspended, setIsSuspended] = useState(false);

  // Locked POS Mode: If POS, keep sidebar closed and force tab
  useEffect(() => {
    if (user?.role === 'POS') {
      setIsSidebarOpen(false);
      setActiveTab('pos');
    }
  }, [user?.role]);

  // Initialize Sync Worker & Listeners
  useEffect(() => {
    startSyncWorker();

    const handleRevocation = (e: any) => {
        if (e.detail?.tenant_id === user?.tenant) {
          setIsSuspended(true);
        }
    };
    window.addEventListener('dukaan_session_revoked', handleRevocation);
    return () => window.removeEventListener('dukaan_session_revoked', handleRevocation);
  }, [user?.tenant]);

  if (!user) {
    return <LoginPage onLogin={login} />;
  }

  const navItems = [
    { id: 'admin', label: 'Admin Panel', icon: Settings, permission: 'view_tenants' },
    { id: 'dashboard', label: 'Strategy Hub', icon: LayoutDashboard, permission: 'access_strategy_hub' },
    { id: 'branches', label: 'Branch Management', icon: Building2, permission: 'manage_branches' },
    { id: 'wizard', label: 'Growth Wizard', icon: Rocket, permission: 'access_growth_wizard' },
    { id: 'audit', label: 'IRD Monitor', icon: Activity, permission: 'view_ird_monitor' },
    { id: 'logistics', label: 'Logistics', icon: Package, permission: 'access_logistics' },
    { id: 'users', label: 'User Management', icon: Users, permission: 'manage_pos_users' },
    { id: 'local_users', label: 'POS Staff', icon: Users, permission: 'manage_local_pos' },
    { id: 'pos', label: 'Point of Sale', icon: ShoppingCart, permission: 'access_pos' },
  ];

  const filteredNavItems = navItems.filter(item => hasPermission(item.permission));

  const getIcon = (id: string) => {
    const item = navItems.find(n => n.id === id);
    return item ? item.icon : Package;
  }

  return (
    <div className="flex h-screen bg-pos-black text-pos-white overflow-hidden font-sans">
      <AnimatePresence>
        {isSuspended && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] bg-pos-black/90 backdrop-blur-2xl flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-md w-full bg-pos-surface border border-pos-danger/30 p-8 rounded-3xl text-center shadow-2xl shadow-pos-danger/20"
            >
              <div className="w-20 h-20 bg-pos-danger/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-pos-danger/30">
                <ShieldAlert size={40} className="text-pos-danger" />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tighter text-white mb-2">Sovereignty Revoked</h2>
              <p className="text-pos-muted text-sm font-medium mb-8">
                Your tenant account (<span className="text-pos-danger">{user.tenant}</span>) has been suspended by the platform administrator. Access to all resources is currently restricted.
              </p>
              <Button 
                variant="danger" 
                size="xl" 
                className="w-full uppercase font-black tracking-widest"
                onClick={logout}
              >
                Log Out of Session
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  validateTenant();
                }}
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
          <button 
            onClick={logout}
            className="w-full flex items-center gap-4 p-4 rounded-xl text-pos-danger hover:bg-pos-danger/10 transition-all group"
          >
            <LogOut size={22} />
            {isSidebarOpen && <span className="font-bold text-sm">Log Out</span>}
          </button>
        </div>

        {user.role !== 'POS' && (
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute -right-4 top-24 w-8 h-8 bg-pos-surface border border-pos-border rounded-full flex items-center justify-center text-pos-muted hover:text-pos-white shadow-xl hover:scale-110 transition-all z-30"
          >
            {isSidebarOpen ? <X size={14} /> : <Menu size={14} />}
          </button>
        )}
      </motion.aside>

      <main className="flex-1 relative overflow-hidden flex flex-col">
        <SyncWarning />
        <header className="h-20 border-b border-pos-border bg-pos-surface/30 backdrop-blur-xl flex items-center justify-between px-10 z-10">
            <div className="flex items-center gap-4">
              {user.tenant && (
                <div className="flex items-center gap-2 bg-pos-primary/10 border border-pos-primary/20 px-3 py-1.5 rounded-lg">
                  <ShieldCheck size={16} className="text-pos-primary" />
                  <span className="text-xs font-black uppercase tracking-widest text-pos-primary">
                    Sovereign: {user.tenant}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 bg-pos-surface border border-pos-border px-3 py-1.5 rounded-lg">
                <span className="text-[10px] font-black uppercase tracking-tighter text-pos-muted">Role:</span>
                <span className="text-[10px] font-black uppercase tracking-tighter text-pos-white">{user.role}</span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <button className="p-2 text-pos-muted hover:text-pos-white relative">
                  <Bell size={20} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pos-danger rounded-full border-2 border-pos-black" />
              </button>
              <div className="flex items-center gap-3 pl-6 border-l border-pos-border">
                  <div className="text-right">
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-pos-muted mb-0.5">Authorized User</div>
                      <div className="text-sm font-bold text-pos-white leading-none">{user.username}</div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pos-primary to-pos-secondary flex items-center justify-center font-black text-pos-black uppercase shadow-lg shadow-pos-primary/20">
                      {user.username.substring(0, 2)}
                  </div>
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
                    {activeTab === 'branches' && (
                        <PermissionGuard permission="manage_branches" fallback={<div className="p-20 text-center font-bold text-pos-danger uppercase tracking-tighter italic">Access Restricted to Strategic Expansion Group</div>}>
                            <BranchManagement />
                        </PermissionGuard>
                    )}
                    {activeTab === 'logistics' && (
                        <PermissionGuard permission="access_logistics" fallback={<div className="p-20 text-center font-bold text-pos-danger uppercase tracking-tighter italic">Access Restricted to Logistics Group</div>}>
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
                    {activeTab === 'audit' && (
                        <PermissionGuard permission="view_ird_monitor" fallback={<div className="p-20 text-center font-bold text-pos-danger uppercase tracking-tighter italic">Access Restricted to Audit Group</div>}>
                            <IRDSyncDashboard />
                        </PermissionGuard>
                    )}
                    {activeTab === 'admin' && (
                        <PermissionGuard permission="view_tenants" fallback={<div className="p-20 text-center font-bold text-pos-danger uppercase tracking-tighter italic">Access Restricted to System Admins</div>}>
                            <AdminDashboard />
                        </PermissionGuard>
                    )}
                    {(activeTab === 'users' || activeTab === 'local_users') && (
                        <PermissionGuard permission={activeTab === 'users' ? 'manage_pos_users' : 'manage_local_pos'} fallback={<div className="p-20 text-center font-bold text-pos-danger uppercase tracking-tighter italic">Access Restricted to Personnel Management</div>}>
                            <UserManagement />
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
