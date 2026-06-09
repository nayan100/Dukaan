import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import POSHUD from './components/pos/POSHUD';
import IRDSyncDashboard from './components/analytics/IRDSyncDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import HQLayout from './components/hq/HQLayout';
import ChainOwnerRoute from './components/auth/ChainOwnerRoute';
import { useAuth } from './context/AuthContext';

import BranchLayout from './components/branch/BranchLayout';
import FinanceLayout from './components/layout/FinanceLayout';
import Annex14Grid from './components/Procurement/Annex14Grid';
import FinanceAuditHUD from './components/analytics/FinanceAuditHUD';

const IndexRedirect = () => {
  const { user } = useAuth();
  
  if (!user) return null; // AppLayout handles login if no user

  switch (user.role) {
    case 'Admin': return <Navigate to="/admin" replace />;
    case 'Chain Owner': return <Navigate to="/hq" replace />;
    case 'Branch Owner': return <Navigate to="/branch/inbox" replace />;
    case 'POS': return <Navigate to="/pos" replace />;
    case 'Accountant': return <Navigate to="/finance" replace />;
    default: return <Navigate to="/pos" replace />;
  }
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<IndexRedirect />} />
          <Route path="pos" element={<POSHUD />} />
          <Route path="hq/*" element={<ChainOwnerRoute><HQLayout /></ChainOwnerRoute>} />
          <Route path="branch/*" element={<BranchLayout />} />
          <Route path="finance/*" element={<FinanceLayout />}>
            <Route index element={<Navigate to="sync" replace />} />
            <Route path="sync" element={<IRDSyncDashboard />} />
            <Route path="purchase" element={<Annex14Grid />} />
            <Route path="audit" element={<FinanceAuditHUD />} />
            <Route path="analytics" element={<div className="p-10 text-slate-400 font-bold uppercase tracking-widest">Finance Analytics (Coming Soon)</div>} />
          </Route>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="*" element={<IndexRedirect />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
