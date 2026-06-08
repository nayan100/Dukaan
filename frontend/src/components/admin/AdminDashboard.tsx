import React, { useState, useEffect } from 'react';
import TenantManagement from './TenantManagement';
import MonitoringHub from './MonitoringHub';
import OnboardingWizard from './OnboardingWizard';

interface Tenant {
  name: string;
  company_name: string;
  plan_tier: string;
  status: 'Pending' | 'Active' | 'Suspended' | 'Trial' | 'Deleted';
  site_url?: string;
  db_name?: string;
  default_warehouse?: string;
  max_branches: number;
  max_pos_accounts: number;
  current_branches: number;
  current_pos_accounts: number;
}

const INITIAL_TENANTS: Tenant[] = [
  {
    name: 'EVEREST',
    company_name: 'Everest Groceries',
    plan_tier: 'Enterprise',
    status: 'Active',
    site_url: 'everest.dukaan.io',
    db_name: 'tenant_everest',
    default_warehouse: 'KTM Main',
    max_branches: 10,
    max_pos_accounts: 50,
    current_branches: 3,
    current_pos_accounts: 15
  },
  {
    name: 'ANNAPURNA',
    company_name: 'Annapurna Apparel',
    plan_tier: 'Business',
    status: 'Active',
    site_url: 'annapurna.dukaan.io',
    db_name: 'tenant_annapurna',
    default_warehouse: 'Lalitpur Hub',
    max_branches: 5,
    max_pos_accounts: 20,
    current_branches: 2,
    current_pos_accounts: 8
  }
];

interface ProvisioningJob {
  id: string;
  company_name: string;
  plan_tier: string;
  status: 'Pending' | 'Provisioning' | 'Completed' | 'Failed';
  started_at: string;
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tenants' | 'provisioning' | 'monitoring'>('overview');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [tenants, setTenants] = useState<Tenant[]>(INITIAL_TENANTS);
  const [provisioningQueue, setProvisioningQueue] = useState<ProvisioningJob[]>([
    { id: 'PRV-2026-001', company_name: 'Everest Groceries', plan_tier: 'Enterprise', status: 'Completed', started_at: '2026-06-08 10:24' },
    { id: 'PRV-2026-002', company_name: 'Annapurna Apparel', plan_tier: 'Business', status: 'Completed', started_at: '2026-06-08 11:45' }
  ]);
  const [selectedJob, setSelectedJob] = useState<ProvisioningJob | null>(null);

  const handleReviewSetup = (formData: any) => {
    const newJob: ProvisioningJob = {
      id: `PRV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      company_name: formData.company_name,
      plan_tier: formData.plan_tier,
      status: 'Provisioning',
      started_at: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setProvisioningQueue(prev => [newJob, ...prev]);
    setActiveTab('provisioning');
    setShowOnboarding(false);
    
    // Simulate provisioning process
    setTimeout(() => {
        setProvisioningQueue(prev => prev.map(job => 
            job.id === newJob.id ? { ...job, status: 'Completed' } : job
        ));
        const newTenant: Tenant = {
          name: `T-${Math.floor(Math.random() * 1000)}`,
          company_name: formData.company_name,
          plan_tier: formData.plan_tier,
          status: 'Active',
          site_url: `${formData.company_name.toLowerCase().replace(/\s+/g, '-')}.dukaan.io`,
          db_name: `tenant_${formData.company_name.toLowerCase().replace(/\s+/g, '_')}`,
          default_warehouse: `${formData.company_name} - Local`,
          max_branches: formData.plan_tier === 'Enterprise' ? 10 : 5,
          max_pos_accounts: formData.plan_tier === 'Enterprise' ? 50 : 20,
          current_branches: 0,
          current_pos_accounts: 0
        };
        setTenants(prev => [...prev, newTenant]);
    }, 5000);
  };

  const handleOnboardingComplete = (newTenant: any) => {
    // This is no longer used directly as we handle it via handleReviewSetup simulation
    setShowOnboarding(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex">
      {/* Sidebar */}
      <nav className="w-64 border-r border-slate-800 p-6 flex flex-col gap-4">
        <h1 className="text-xl font-bold text-white tracking-tight">SaaS Admin</h1>
        <div className="flex-1 mt-6">
          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => { setActiveTab('overview'); setShowOnboarding(false); }}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors font-medium ${activeTab === 'overview' ? 'bg-slate-900 text-slate-200' : 'text-slate-400 hover:bg-slate-900/50'}`}
              >
                Overview
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setActiveTab('tenants'); setShowOnboarding(false); }}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors font-medium ${activeTab === 'tenants' && !showOnboarding ? 'bg-slate-900 text-slate-200' : 'text-slate-400 hover:bg-slate-900/50'}`}
              >
                Tenants
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setActiveTab('provisioning'); setShowOnboarding(false); }}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors font-medium ${activeTab === 'provisioning' ? 'bg-slate-900 text-slate-200' : 'text-slate-400 hover:bg-slate-900/50'}`}
              >
                Provisioning
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setActiveTab('monitoring'); setShowOnboarding(false); }}
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
                <p className="text-4xl font-light mt-2">2</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Total Usage</h3>
                <p className="text-4xl font-light mt-2">14 GB</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Pending Provisioning</h3>
                <p className="text-4xl font-light mt-2 text-amber-500">0</p>
              </div>
            </div>
          </>
        )}

        {activeTab === 'tenants' && (
          <div className="space-y-6">
            {showOnboarding ? (
              <OnboardingWizard 
                onComplete={handleReviewSetup} 
                onCancel={() => setShowOnboarding(false)} 
              />
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-white">Tenant Management</h3>
                  <button 
                    onClick={() => setShowOnboarding(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    + New Tenant
                  </button>
                </div>
                <TenantManagement showHeader={false} tenants={tenants} setTenants={setTenants} />
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'provisioning' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Provisioning Queue</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/50 text-slate-500 uppercase font-medium">
                    <tr>
                      <th className="px-6 py-4">Job ID</th>
                      <th className="px-6 py-4">Tenant</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Started At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {provisioningQueue.map(job => (
                      <tr 
                        key={job.id} 
                        onClick={() => setSelectedJob(job)}
                        className={`cursor-pointer transition-colors ${selectedJob?.id === job.id ? 'bg-slate-800/50' : 'hover:bg-slate-800/30'}`}
                      >
                        <td className="px-6 py-4 font-mono">{job.id}</td>
                        <td className="px-6 py-4">
                          <div className="font-semibold">{job.company_name}</div>
                          <div className="text-slate-500 text-[10px]">{job.plan_tier}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${
                            job.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' :
                            job.status === 'Provisioning' ? 'bg-blue-500/10 text-blue-500' :
                            'bg-slate-500/10 text-slate-500'
                          }`}>
                            {job.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">{job.started_at}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Job Details Sidebar */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                {selectedJob ? (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-white">{selectedJob.company_name}</h4>
                      <div className="text-sm text-slate-400 font-mono mt-1">{selectedJob.id}</div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-slate-800">
                        <span className="text-slate-500 text-sm">Status</span>
                        <span className={`text-sm font-medium ${
                            selectedJob.status === 'Completed' ? 'text-emerald-500' :
                            selectedJob.status === 'Provisioning' ? 'text-blue-500 animate-pulse' :
                            'text-slate-500'
                        }`}>{selectedJob.status}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-slate-800">
                        <span className="text-slate-500 text-sm">Plan Tier</span>
                        <span className="text-white text-sm">{selectedJob.plan_tier}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-slate-800">
                        <span className="text-slate-500 text-sm">Started At</span>
                        <span className="text-white text-sm">{selectedJob.started_at}</span>
                      </div>
                    </div>
                    
                    {selectedJob.status === 'Provisioning' && (
                      <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                        <div className="flex items-center gap-3 text-blue-400 text-sm font-medium">
                          <div className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
                          Allocating Resources...
                        </div>
                        <p className="text-xs text-blue-400/60 mt-2">Setting up isolated database schema and default warehouse configurations.</p>
                      </div>
                    )}
                    
                    {selectedJob.status === 'Completed' && (
                      <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-lg">
                        <div className="flex items-center gap-2 text-emerald-500 text-sm font-medium mb-1">
                          ✓ Environment Ready
                        </div>
                        <p className="text-xs text-emerald-500/60">Tenant has been added to the Active Tenants list.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                    Select a job to view details
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'monitoring' && <MonitoringHub />}
      </main>
    </div>
  );
};

export default AdminDashboard;
