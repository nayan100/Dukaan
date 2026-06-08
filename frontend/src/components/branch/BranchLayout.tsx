import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ActionInbox from './ActionInbox';
import BranchInventory from './BranchInventory';
import BranchLogistics from './BranchLogistics';
import BranchProcurement from './BranchProcurement';

const BranchLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* View Content */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute inset-0 overflow-auto"
          >
            <Routes>
              <Route index element={<Navigate to="inbox" replace />} />
              <Route path="inbox" element={<ActionInbox />} />
              <Route path="inventory" element={<BranchInventory />} />
              <Route path="logistics" element={<BranchLogistics />} />
              <Route path="procurement" element={<BranchProcurement />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BranchLayout;
