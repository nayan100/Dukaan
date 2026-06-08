import React, { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useSyncStore } from '../../store/syncStore';
import { motion, AnimatePresence } from 'framer-motion';
import { getUnsyncedInvoices } from '../../lib/db';

const SyncWarning: React.FC = () => {
  const unsyncedCount = useSyncStore((state) => state.unsyncedCount);
  const setUnsyncedCount = useSyncStore((state) => state.setUnsyncedCount);

  useEffect(() => {
    // Initial fetch on mount just to be sure
    const checkSync = async () => {
      const unsynced = await getUnsyncedInvoices();
      setUnsyncedCount(unsynced.length);
    };
    checkSync();
  }, [setUnsyncedCount]);

  return (
    <AnimatePresence>
      {unsyncedCount > 0 && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-pos-danger/20 border-b border-pos-danger/30 px-6 py-2 flex items-center justify-center gap-3 overflow-hidden"
        >
          <AlertTriangle size={16} className="text-pos-danger" />
          <span className="text-xs font-bold text-pos-danger uppercase tracking-widest">
            Attention: {unsyncedCount} Unsynced Invoices. Do not logout or clear cache!
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SyncWarning;
