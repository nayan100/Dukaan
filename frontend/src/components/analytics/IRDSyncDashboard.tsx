import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, CheckCircle2, Clock, AlertCircle, RefreshCw, Zap, Laptop, FileText } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { getAllInvoices } from '../../lib/db';
import Annex13Preview from './Annex13Preview';
import { useSyncStore } from '../../store/syncStore';

interface SyncStats {
  synced: number;
  pending: number;
  failed: number;
}

const IRDSyncDashboard: React.FC = () => {
  const [backendStats, setBackendStats] = useState<SyncStats>({ synced: 0, pending: 0, failed: 0 });
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Consume sync store
  const localUnsynced = useSyncStore((state) => state.unsyncedCount);
  const isSyncing = useSyncStore((state) => state.isSyncing);

  const fetchStats = async () => {
    // 1. Fetch Local Data (mainly for the audit trail grid)
    try {
      const all = await getAllInvoices();
      
      const mappedInvoices = all.map(inv => ({
        invoice_id: inv.invoice_id,
        created_at: inv.created_at,
        taxable_amount: inv.total / 1.13,
        vat_amount: inv.total - (inv.total / 1.13),
        total: inv.total,
        synced: inv.synced
      })).sort((a, b) => b.created_at - a.created_at);

      setInvoices(mappedInvoices);
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
          setBackendStats(data.message);
        }
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
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const cards = [
    { label: 'Local Offline', value: localUnsynced, icon: Laptop, color: localUnsynced > 0 ? 'text-pos-warning' : 'text-pos-primary', bg: localUnsynced > 0 ? 'bg-pos-warning/20' : 'bg-pos-primary/10' },
    { label: 'Synced (Backend)', value: backendStats.synced, icon: CheckCircle2, color: 'text-pos-primary', bg: 'bg-pos-primary/10' },
    { label: 'Pending Transmit', value: backendStats.pending, icon: Clock, color: 'text-pos-warning', bg: 'bg-pos-warning/10' },
    { label: 'Failed Sync', value: backendStats.failed, icon: AlertCircle, color: 'text-pos-danger', bg: 'bg-pos-danger/10' },
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
            className={`p-3 rounded-xl border border-pos-border hover:border-pos-primary transition-all ${loading || isSyncing ? 'animate-spin' : ''}`}
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
              {(loading && card.label !== 'Local Offline') ? '...' : card.value.toLocaleString()}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12">
          <div className="flex items-center gap-3 mb-6">
              <FileText className="text-pos-muted" size={20} />
              <h3 className="text-sm font-black uppercase tracking-[0.3em] text-pos-muted">Detailed Audit Trail (Sales Register)</h3>
          </div>
          <Annex13Preview entries={invoices} />
      </div>
    </div>
  );
};

export default IRDSyncDashboard;
