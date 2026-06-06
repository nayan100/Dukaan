import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, CheckCircle2, Clock, AlertCircle, RefreshCw, Zap, Laptop } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { getUnsyncedInvoices } from '../../lib/db';

interface SyncStats {
  synced: number;
  pending: number;
  failed: number;
  local: number;
}

const IRDSyncDashboard: React.FC = () => {
  const [stats, setStats] = useState<SyncStats>({ synced: 0, pending: 0, failed: 0, local: 0 });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    // 1. Fetch Local Stats First (Always works)
    let localCount = 0;
    try {
      const localInvoices = await getUnsyncedInvoices();
      localCount = localInvoices.length;
      console.log(`[Dashboard] Local sync queue: ${localCount}`);
      
      // UPDATE STATE IMMEDIATELY for local count
      setStats(prev => ({ ...prev, local: localCount }));
    } catch (e) {
      console.error('Failed to fetch local stats:', e);
    }

    setLoading(true);
    // 2. Fetch Backend Stats (Might fail offline or 404)
    try {
      const response = await fetch('/api/method/dukaan.compliance.get_sync_status');
      if (response.ok) {
        const data = await response.json();
        if (data.message) {
          setStats({
            ...data.message,
            local: localCount // Ensure we keep the latest local count
          });
        }
      } else {
        console.warn(`Backend responded with ${response.status}. Keeping local counts.`);
      }
    } catch (error) {
      console.warn('Backend unreachable. Using local data only.');
    } finally {
      setLoading(false);
    }
  };

  const handleForceSync = async () => {
    toast.promise(
      fetch('/api/method/dukaan.compliance.retry_failed_ird_syncs', { method: 'POST' }),
      {
        loading: 'Forcing sync...',
        success: () => {
          fetchStats();
          return 'Sync process triggered!';
        },
        error: 'Failed to trigger sync.'
      },
      {
        style: { background: '#0f172a', color: '#fff', border: '1px solid #1e293b' }
      }
    );
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000); // Refresh every 5 seconds for responsive monitoring
    return () => clearInterval(interval);
  }, []);

  const cards = [
    { label: 'Local Offline', value: stats.local, icon: Laptop, color: stats.local > 0 ? 'text-pos-warning' : 'text-pos-primary', bg: stats.local > 0 ? 'bg-pos-warning/20' : 'bg-pos-primary/10' },
    { label: 'Synced (Backend)', value: stats.synced, icon: CheckCircle2, color: 'text-pos-primary', bg: 'bg-pos-primary/10' },
    { label: 'Pending Transmit', value: stats.pending, icon: Clock, color: 'text-pos-warning', bg: 'bg-pos-warning/10' },
    { label: 'Failed Sync', value: stats.failed, icon: AlertCircle, color: 'text-pos-danger', bg: 'bg-pos-danger/10' },
  ];

  return (
    <div className="p-8 space-y-8 bg-pos-black min-h-full">
      <Toaster position="top-right" />
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black tracking-tight uppercase italic flex items-center gap-3">
            <Activity className="text-pos-primary" />
            IRD Sync Monitor
          </h2>
          <p className="text-sm text-pos-muted font-bold uppercase tracking-widest mt-1">Real-time status of CBMS transmission</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleForceSync}
            className="flex items-center gap-2 px-6 py-3 bg-pos-primary text-pos-black font-black uppercase text-xs rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-pos-primary/20"
          >
            <Zap size={16} fill="currentColor" />
            Force Sync
          </button>
          <button 
            onClick={fetchStats}
            className={`p-3 rounded-xl border border-pos-border hover:border-pos-primary transition-all ${loading ? 'animate-spin' : ''}`}
          >
            <RefreshCw size={20} className="text-pos-muted" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`p-6 rounded-2xl bg-pos-surface border border-pos-border relative overflow-hidden group`}
          >
            <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity`}>
              <card.icon size={80} />
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-xl ${card.bg}`}>
                <card.icon className={card.color} size={24} />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-pos-muted">{card.label}</span>
            </div>
            
            <div className="text-4xl font-black tracking-tighter">
              {loading ? '...' : card.value.toLocaleString()}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default IRDSyncDashboard;
