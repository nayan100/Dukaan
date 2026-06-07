import React, { useState } from 'react';
import TenantManagement from './TenantManagement';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tenants' | 'provisioning' | 'monitoring'>('overview');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex">
      {/* Sidebar */}
      <nav className="w-64 border-r border-slate-800 p-6 flex flex-col gap-4">
        <h1 className="text-xl font-bold text-white tracking-tight">SaaS Admin</h1>
        <div className="flex-1 mt-6">
          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => setActiveTab('overview')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors font-medium ${activeTab === 'overview' ? 'bg-slate-900 text-slate-200' : 'text-slate-400 hover:bg-slate-900/50'}`}
              >
                Overview
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('tenants')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors font-medium ${activeTab === 'tenants' ? 'bg-slate-900 text-slate-200' : 'text-slate-400 hover:bg-slate-900/50'}`}
              >
                Tenants
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('provisioning')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors font-medium ${activeTab === 'provisioning' ? 'bg-slate-900 text-slate-200' : 'text-slate-400 hover:bg-slate-900/50'}`}
              >
                Provisioning
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('monitoring')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors font-medium ${activeTab === 'monitoring' ? 'bg-slate-900 text-slate-200' : 'text-slate-400 hover:bg-slate-900/50'}`}
              >
                Monitoring
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-auto">
        {activeTab === 'overview' && (
          <>
            <header className="mb-8">
              <h2 className="text-3xl font-semibold tracking-tight">Dashboard Overview</h2>
              <p className="text-slate-400 mt-2">Manage your tenants, monitor usage, and provision new environments.</p>
            </header>

            {/* Dashboard Widgets Shell */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Active Tenants</h3>
                <p className="text-4xl font-light mt-2">12</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Total Usage</h3>
                <p className="text-4xl font-light mt-2">845 GB</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Pending Provisioning</h3>
                <p className="text-4xl font-light mt-2 text-amber-500">3</p>
              </div>
            </div>
          </>
        )}

        {activeTab === 'tenants' && <TenantManagement />}
        
        {activeTab === 'provisioning' && (
          <div className="h-96 flex items-center justify-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
            Provisioning module coming soon...
          </div>
        )}

        {activeTab === 'monitoring' && (
          <div className="h-96 flex items-center justify-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
            Monitoring module coming soon...
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
