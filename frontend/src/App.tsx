import React, { useState } from 'react';
import ProcurementSuite from './components/ProcurementSuite/ProcurementSuite';
import VerifySpotCheckUI from './components/OpeningStockEntry/VerifySpotCheckUI';
import BudgetWarningUI from './components/PurchaseOrder/BudgetWarningUI';
import AdminDashboard from './components/admin/AdminDashboard';

function App() {
  const [view, setView] = useState<'retail' | 'admin'>('retail');

  const handleVerifySpotCheck = () => {
    console.log('Verify Spot Check button clicked!');
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <nav className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex justify-between items-center">
        <div className="text-white font-bold">Dukaan SaaS</div>
        <div className="flex gap-4">
          <button 
            onClick={() => setView('retail')}
            className={`px-3 py-1 rounded text-sm transition-colors ${view === 'retail' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Retail Suite
          </button>
          <button 
            onClick={() => setView('admin')}
            className={`px-3 py-1 rounded text-sm transition-colors ${view === 'admin' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            SaaS Admin
          </button>
        </div>
      </nav>

      {view === 'retail' ? (
        <div className="p-8 space-y-8">
          <ProcurementSuite />
          <VerifySpotCheckUI onVerify={handleVerifySpotCheck} />
          <BudgetWarningUI isBudgetExceeded={true} />
        </div>
      ) : (
        <AdminDashboard />
      )}
    </div>
  );
}

export default App;
