import React, { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { getUnsyncedInvoices } from '../../lib/db';
import { motion, AnimatePresence } from 'framer-motion';

const SyncWarning: React.FC = () => {
  const [unsyncedCount, setUnsyncedCount] = useState(0);

  useEffect(() => {
    const checkSync = async () => {
      const unsynced = await getUnsyncedInvoices();
      setUnsyncedCount(unsynced.length);
    };

    checkSync();
    const interval = setInterval(checkSync, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, []);

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
