import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, CheckCircle2, Clock, AlertCircle, RefreshCw } from 'lucide-react';

interface SyncStats {
  synced: number;
  pending: number;
  failed: number;
}

const IRDSyncDashboard: React.FC = () => {
  const [stats, setStats] = useState<SyncStats>({ synced: 0, pending: 0, failed: 0 });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/method/dukaan.compliance.get_sync_status');
      const data = await response.json();
      if (data.message) {
        setStats(data.message);
      }
    } catch (error) {
      console.error('Failed to fetch sync stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const cards = [
    { label: 'Synced', value: stats.synced, icon: CheckCircle2, color: 'text-pos-primary', bg: 'bg-pos-primary/10' },
    { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-pos-warning', bg: 'bg-pos-warning/10' },
    { label: 'Failed', value: stats.failed, icon: AlertCircle, color: 'text-pos-danger', bg: 'bg-pos-danger/10' },
  ];

  return (
    <div className="p-8 space-y-8 bg-pos-black min-h-full">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black tracking-tight uppercase italic flex items-center gap-3">
            <Activity className="text-pos-primary" />
            IRD Sync Monitor
          </h2>
          <p className="text-sm text-pos-muted font-bold uppercase tracking-widest mt-1">Real-time status of CBMS transmission</p>
        </div>
        <button 
          onClick={fetchStats}
          className={`p-3 rounded-xl border border-pos-border hover:border-pos-primary transition-all ${loading ? 'animate-spin' : ''}`}
        >
          <RefreshCw size={20} className="text-pos-muted" />
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
