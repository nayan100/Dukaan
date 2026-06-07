import React, { useState } from 'react';

interface Tenant {
  name: string;
  company_name: string;
  plan_tier: string;
  status: 'Pending' | 'Active' | 'Suspended' | 'Trial' | 'Deleted';
  site_url?: string;
  db_name?: string;
  default_warehouse?: string;
}

const MOCK_TENANTS: Tenant[] = [
  {
    name: 'T-001',
    company_name: 'Metro Retail',
    plan_tier: 'Enterprise',
    status: 'Active',
    site_url: 'metro.dukaan.io',
    db_name: 'tenant_metro',
    default_warehouse: 'Metro - Main'
  },
  {
    name: 'T-002',
    company_name: 'City Mart',
    plan_tier: 'Professional',
    status: 'Suspended',
    site_url: 'citymart.dukaan.io',
    db_name: 'tenant_citymart',
    default_warehouse: 'City Mart - Central'
  },
  {
    name: 'T-003',
    company_name: 'Organic Foods',
    plan_tier: 'Basic',
    status: 'Trial',
    site_url: 'organic.dukaan.io',
    db_name: 'tenant_organic',
    default_warehouse: 'Organic - Stock'
  }
];

interface TenantManagementProps {
  showHeader?: boolean;
}

const TenantManagement: React.FC<TenantManagementProps> = ({ showHeader = true }) => {
  const [tenants, setTenants] = useState<Tenant[]>(MOCK_TENANTS);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  const handleStatusChange = (tenantName: string, newStatus: Tenant['status']) => {
    setTenants(prev => prev.map(t => 
      t.name === tenantName ? { ...t, status: newStatus } : t
    ));
    if (selectedTenant?.name === tenantName) {
      setSelectedTenant(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  return (
    <div className="space-y-6">
      {showHeader && (
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-white">Tenant Management</h3>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
            + New Tenant
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* List View */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50">
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Company</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {tenants.map((tenant) => (
                <tr 
                  key={tenant.name}
                  className={`hover:bg-slate-800/50 cursor-pointer transition-colors ${selectedTenant?.name === tenant.name ? 'bg-slate-800/50' : ''}`}
                  onClick={() => setSelectedTenant(tenant)}
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-200">{tenant.company_name}</div>
                    <div className="text-xs text-slate-500">{tenant.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-300">{tenant.plan_tier}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${tenant.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 
                        tenant.status === 'Suspended' ? 'bg-rose-500/10 text-rose-500' : 
                        tenant.status === 'Trial' ? 'bg-amber-500/10 text-amber-500' : 
                        'bg-slate-500/10 text-slate-500'}`}>
                      {tenant.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      value={tenant.status}
                      onChange={(e) => handleStatusChange(tenant.name, e.target.value as Tenant['status'])}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-slate-950 border border-slate-700 text-slate-300 text-xs rounded p-1"
                    >
                      <option value="Active">Active</option>
                      <option value="Suspended">Suspended</option>
                      <option value="Trial">Trial</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detail View */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          {selectedTenant ? (
            <div className="space-y-6">
              <h4 className="text-lg font-medium text-white border-b border-slate-800 pb-2">Tenant Details</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase">Company Name</label>
                  <p className="text-slate-200 mt-1">{selectedTenant.company_name}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase">Site URL</label>
                  <p className="text-slate-200 mt-1">{selectedTenant.site_url}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase">Database Name</label>
                  <p className="text-slate-200 mt-1 font-mono text-xs">{selectedTenant.db_name}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase">Default Warehouse</label>
                  <p className="text-slate-200 mt-1">{selectedTenant.default_warehouse}</p>
                </div>
                <div className="pt-4">
                  <button 
                    onClick={() => handleStatusChange(selectedTenant.name, selectedTenant.status === 'Active' ? 'Suspended' : 'Active')}
                    className={`w-full py-2 rounded-lg font-medium transition-colors ${selectedTenant.status === 'Active' ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
                  >
                    {selectedTenant.status === 'Active' ? 'Suspend Tenant' : 'Activate Tenant'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center">
                ?
              </div>
              <p className="text-sm">Select a tenant to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TenantManagement;
