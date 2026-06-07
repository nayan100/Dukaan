import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClipboardList, Package, Truck, 
  BarChart3, Plus 
} from 'lucide-react';
import POListView from '../Procurement/POListView';
import POCreationWizard from '../Procurement/POCreationWizard';
import OpeningStockGrid from '../Procurement/OpeningStockGrid';
import PurchaseReceiptGenerator from '../Procurement/PurchaseReceiptGenerator';
import Annex14Preview from '../Procurement/Annex14Preview';
import ProcurementAnalyticsHub from '../ProcurementAnalytics/ProcurementAnalyticsHub';

const ProcurementSuite: React.FC = () => {
  const [view, setView] = useState<'overview' | 'pos' | 'receipts' | 'stock' | 'analytics'>('overview');
  const [showWizard, setShowWizard] = useState(false);

  // Mock Data
  const mockPOs = [
    { id: 'PO-001', supplier: 'Nepal Trading', amount: 5000, status: 'Draft', budgetViolation: false, date: '2026-06-08' },
    { id: 'PO-002', supplier: 'Global Imports', amount: 15000, status: 'Pending Approval', budgetViolation: true, date: '2026-06-07' },
  ];

  const mockItems = [
    { id: '1', name: 'Wai Wai Noodles', current_stock: 10, price: 20 },
    { id: '2', name: 'Real Juice 1L', current_stock: 5, price: 250 },
  ];

  const subNav = [
    { id: 'overview', label: 'PO Tracker', icon: ClipboardList },
    { id: 'receipts', label: 'Receipt Entry', icon: Truck },
    { id: 'stock', label: 'Stock Initialization', icon: Package },
    { id: 'analytics', label: 'Procurement Intelligence', icon: BarChart3 },
  ];

  return (
    <div className="flex flex-col h-full bg-pos-black">
      {/* Sub-Header */}
      <div className="bg-pos-surface border-b border-pos-border px-8 py-4 flex justify-between items-center">
        <div className="flex gap-4">
          {subNav.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                view === item.id 
                  ? 'bg-pos-primary/10 text-pos-primary border border-pos-primary/20' 
                  : 'text-pos-muted hover:text-pos-white'
              }`}
            >
              <item.icon size={16} />
              {item.label}
            </button>
          ))}
        </div>
        
        {view === 'overview' && (
          <button 
            onClick={() => setShowWizard(true)}
            className="bg-pos-primary text-pos-black px-4 py-2 rounded-lg font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-pos-primary/90 transition-all"
          >
            <Plus size={16} />
            New Purchase Order
          </button>
        )}
      </div>

      <div className="flex-1 overflow-auto p-8">
        <AnimatePresence mode="wait">
          {view === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="mb-8">
                <h2 className="text-pos-white text-3xl font-black uppercase tracking-tighter italic">Purchase Order Tracker</h2>
                <p className="text-pos-muted text-sm font-medium">Manage and monitor your procurement pipeline across branches.</p>
              </div>
              <POListView pos={mockPOs} />
            </motion.div>
          )}

          {view === 'receipts' && (
            <motion.div key="receipts" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
               <div className="mb-8">
                <h2 className="text-pos-white text-3xl font-black uppercase tracking-tighter italic">Compliance-First Receipts</h2>
                <p className="text-pos-muted text-sm font-medium">Verify supplier PAN/VAT compliance before receipt generation.</p>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                 <PurchaseReceiptGenerator po={mockPOs[0]} onGenerate={() => {}} onCancel={() => setView('overview')} />
                 <Annex14Preview entries={[]} />
              </div>
            </motion.div>
          )}

          {view === 'stock' && (
            <motion.div key="stock" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="h-full">
               <OpeningStockGrid items={mockItems} onSave={() => {}} />
            </motion.div>
          )}

          {view === 'analytics' && (
             <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="h-full -m-8">
                <ProcurementAnalyticsHub />
             </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Overlays */}
      <AnimatePresence>
        {showWizard && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-pos-black/80 backdrop-blur-md p-4">
            <POCreationWizard onSave={() => setShowWizard(false)} onCancel={() => setShowWizard(false)} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProcurementSuite;
