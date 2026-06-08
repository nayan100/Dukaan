import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, ShoppingCart, Rocket, 
  Settings, LogOut, Menu, X, Bell, Package, Activity, ShieldCheck, ShieldAlert,
  Users, Building2, ClipboardList
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LoginPage from '../auth/LoginPage';
import LandingPage from '../auth/LandingPage';
import SyncWarning from './SyncWarning';
import Button from '../ui/Button';
import { startSyncWorker } from '../../lib/syncWorker';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';

const AppLayout: React.FC = () => {
  const { user, login, logout, validateTenant, hasPermission } = useAuth();
  const [showManualLogin, setShowManualLogin] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(user?.role !== 'POS');
  const [isSuspended, setIsSuspended] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Locked POS Mode: If POS, keep sidebar closed
  useEffect(() => {
    if (user?.role === 'POS') {
      setIsSidebarOpen(false);
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
    if (showManualLogin) {
      return <LoginPage onLogin={login} />;
    }
    return <LandingPage onLogin={login} onManualLogin={() => setShowManualLogin(true)} />;
  }

  const navItems = [
    { path: '/admin', label: 'Admin Panel', icon: Settings, permission: 'view_tenants' },
    { path: '/hq/scorecard', label: 'Scorecard', icon: LayoutDashboard, permission: 'access_strategy_hub' },
    { path: '/hq/rebalancer', label: 'Dead Stock', icon: Building2, permission: 'access_strategy_hub' },
    { path: '/hq/approvals', label: 'Approvals', icon: ClipboardList, permission: 'access_strategy_hub' },
    { path: '/hq/wizards', label: 'Growth Hub', icon: Rocket, permission: 'access_strategy_hub' },
    { path: '/branch', label: 'Local Intelligence', icon: Package, permission: 'access_logistics' },
    { path: '/finance', label: 'IRD Monitor', icon: Activity, permission: 'view_ird_monitor' },
    { path: '/pos', label: 'Point of Sale', icon: ShoppingCart, permission: 'access_pos' },
  ];

  const filteredNavItems = navItems.filter(item => hasPermission(item.permission));

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
                onClick={handleLogout}
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
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={validateTenant}
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
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-pos-border space-y-2">
          <button 
            onClick={handleLogout}
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
                    key={location.pathname}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="absolute inset-0 overflow-auto"
                >
                    <Outlet />
                </motion.div>
            </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
