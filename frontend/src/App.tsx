import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import POSHUD from './components/pos/POSHUD';
import KPIDashboard from './components/analytics/KPIDashboard';
import BranchDashboard from './components/management/BranchDashboard';
import IRDSyncDashboard from './components/analytics/IRDSyncDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import GlobalMetricsDashboard from './components/hq/GlobalMetricsDashboard';
import ChainOwnerRoute from './components/auth/ChainOwnerRoute';
import { useAuth } from './context/AuthContext';

const IndexRedirect = () => {
  const { user } = useAuth();
  
  if (!user) return null; // AppLayout handles login if no user

  switch (user.role) {
    case 'Admin': return <Navigate to="/admin" replace />;
    case 'Chain Owner': return <Navigate to="/hq" replace />;
    case 'Branch Owner': return <Navigate to="/branch" replace />;
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
          <Route path="branch" element={<BranchDashboard />} />
          <Route path="finance" element={<IRDSyncDashboard />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="*" element={<IndexRedirect />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
