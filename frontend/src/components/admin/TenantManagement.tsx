import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Building2, ShoppingCart, Info } from 'lucide-react';

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

const MOCK_TENANTS: Tenant[] = [
  {
    name: 'T-001',
    company_name: 'Metro Retail',
    plan_tier: 'Enterprise',
    status: 'Active',
    site_url: 'metro.dukaan.io',
    db_name: 'tenant_metro',
    default_warehouse: 'Metro - Main',
    max_branches: 10,
    max_pos_accounts: 50,
    current_branches: 4,
    current_pos_accounts: 22
  },
  {
    name: 'T-002',
    company_name: 'City Mart',
    plan_tier: 'Standard',
    status: 'Suspended',
    site_url: 'citymart.dukaan.io',
    db_name: 'tenant_citymart',
    default_warehouse: 'City Mart - Central',
    max_branches: 3,
    max_pos_accounts: 10,
    current_branches: 2,
    current_pos_accounts: 8
  },
  {
    name: 'T-003',
    company_name: 'Organic Foods',
    plan_tier: 'Basic',
    status: 'Trial',
    site_url: 'organic.dukaan.io',
    db_name: 'tenant_organic',
    default_warehouse: 'Organic - Stock',
    max_branches: 1,
    max_pos_accounts: 3,
    current_branches: 1,
    current_pos_accounts: 1
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

    if (newStatus === 'Suspended') {
      window.dispatchEvent(new CustomEvent('dukaan_session_revoked', { 
        detail: { tenant_id: tenantName } 
      }));
    }
  };

  const handleQuotaChange = (tenantName: string, field: 'max_branches' | 'max_pos_accounts', value: number) => {
    setTenants(prev => prev.map(t => 
      t.name === tenantName ? { ...t, [field]: value } : t
    ));
    if (selectedTenant?.name === tenantName) {
      setSelectedTenant(prev => prev ? { ...prev, [field]: value } : null);
    }
  };

  return (
    <div className="space-y-6">
      {showHeader && (
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-white">Tenant Management</h3>
          <button className="bg-pos-primary hover:bg-pos-primary/90 text-pos-black px-4 py-2 rounded-lg transition-colors font-bold uppercase text-xs tracking-widest">
            + New Tenant
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* List View */}
        <div className="lg:col-span-2 bg-pos-surface border border-pos-border rounded-2xl overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-pos-border bg-pos-surface/50">
                <th className="px-6 py-4 text-[10px] font-black text-pos-muted uppercase tracking-[0.2em]">Company / ID</th>
                <th className="px-6 py-4 text-[10px] font-black text-pos-muted uppercase tracking-[0.2em]">Sovereignty Quotas</th>
                <th className="px-6 py-4 text-[10px] font-black text-pos-muted uppercase tracking-[0.2em]">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-pos-muted uppercase tracking-[0.2em]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pos-border">
              {tenants.map((tenant) => (
                <tr 
                  key={tenant.name}
                  className={`hover:bg-pos-primary/5 cursor-pointer transition-all ${selectedTenant?.name === tenant.name ? 'bg-pos-primary/10 border-l-4 border-l-pos-primary' : 'border-l-4 border-l-transparent'}`}
                  onClick={() => setSelectedTenant(tenant)}
                >
                  <td className="px-6 py-5">
                    <div className="font-black text-pos-white tracking-tighter uppercase">{tenant.company_name}</div>
                    <div className="text-[10px] text-pos-muted font-bold">{tenant.name} · {tenant.plan_tier}</div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-pos-muted uppercase tracking-tighter mb-1">Branches</span>
                        <div className="flex items-center gap-2">
                           <Building2 size={12} className={tenant.current_branches >= tenant.max_branches ? 'text-pos-danger' : 'text-pos-primary'} />
                           <span className="text-xs font-bold text-pos-white">{tenant.current_branches}/{tenant.max_branches}</span>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-pos-muted uppercase tracking-tighter mb-1">POS Seats</span>
                        <div className="flex items-center gap-2">
                           <ShoppingCart size={12} className={tenant.current_pos_accounts >= tenant.max_pos_accounts ? 'text-pos-danger' : 'text-pos-primary'} />
                           <span className="text-xs font-bold text-pos-white">{tenant.current_pos_accounts}/{tenant.max_pos_accounts}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest
                      ${tenant.status === 'Active' ? 'bg-pos-primary/10 text-pos-primary border border-pos-primary/20' : 
                        tenant.status === 'Suspended' ? 'bg-pos-danger/10 text-pos-danger border border-pos-danger/20' : 
                        tenant.status === 'Trial' ? 'bg-pos-warning/10 text-pos-warning border border-pos-warning/20' : 
                        'bg-pos-muted/10 text-pos-muted border border-pos-muted/20'}`}>
                      {tenant.status === 'Active' ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
                      {tenant.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <select 
                      value={tenant.status}
                      onChange={(e) => handleStatusChange(tenant.name, e.target.value as Tenant['status'])}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-pos-black border border-pos-border text-pos-white text-[10px] font-bold uppercase rounded-lg p-2 focus:ring-1 focus:ring-pos-primary transition-all"
                    >
                      <option value="Active">Active</option>
                      <option value="Suspended">Suspended</option>
                      <option value="Trial">Trial</option>
                      <option value="Deleted">Delete</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detail View */}
        <div className="bg-pos-surface border border-pos-border rounded-2xl p-8 shadow-2xl relative overflow-hidden group">
          {selectedTenant ? (
            <div className="space-y-8 relative z-10">
              <div className="flex items-center justify-between border-b border-pos-border pb-4">
                <h4 className="text-xl font-black text-pos-white uppercase tracking-tighter">Sovereignty Control</h4>
                <div className="text-[10px] font-black text-pos-muted uppercase tracking-widest">{selectedTenant.name}</div>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-4">
                   <div className="flex justify-between items-end">
                      <label className="text-[10px] font-black text-pos-muted uppercase tracking-[0.2em]">Max Branch Quota</label>
                      <span className="text-xl font-black text-pos-primary tracking-tighter">{selectedTenant.max_branches}</span>
                   </div>
                   <input 
                      type="range" 
                      min="1" 
                      max="50" 
                      value={selectedTenant.max_branches}
                      onChange={(e) => handleQuotaChange(selectedTenant.name, 'max_branches', parseInt(e.target.value))}
                      className="w-full h-1.5 bg-pos-black rounded-lg appearance-none cursor-pointer accent-pos-primary"
                   />
                   <div className="flex justify-between text-[9px] font-bold text-pos-muted uppercase">
                      <span>1 Branch</span>
                      <span>50 Branches</span>
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="flex justify-between items-end">
                      <label className="text-[10px] font-black text-pos-muted uppercase tracking-[0.2em]">Max POS Seats</label>
                      <span className="text-xl font-black text-pos-secondary tracking-tighter">{selectedTenant.max_pos_accounts}</span>
                   </div>
                   <input 
                      type="range" 
                      min="1" 
                      max="200" 
                      value={selectedTenant.max_pos_accounts}
                      onChange={(e) => handleQuotaChange(selectedTenant.name, 'max_pos_accounts', parseInt(e.target.value))}
                      className="w-full h-1.5 bg-pos-black rounded-lg appearance-none cursor-pointer accent-pos-secondary"
                   />
                   <div className="flex justify-between text-[9px] font-bold text-pos-muted uppercase">
                      <span>1 Seat</span>
                      <span>200 Seats</span>
                   </div>
                </div>

                <div className="bg-pos-black/50 border border-pos-border rounded-xl p-4 space-y-3">
                   <div className="flex items-center gap-2 text-pos-primary">
                      <Info size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Quota Insights</span>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                         <div className="text-[9px] font-bold text-pos-muted uppercase">Branch Density</div>
                         <div className="text-xs font-black text-pos-white">{((selectedTenant.current_branches / selectedTenant.max_branches) * 100).toFixed(0)}% Utilized</div>
                      </div>
                      <div className="space-y-1">
                         <div className="text-[9px] font-bold text-pos-muted uppercase">License Seats</div>
                         <div className="text-xs font-black text-pos-white">{((selectedTenant.current_pos_accounts / selectedTenant.max_pos_accounts) * 100).toFixed(0)}% Occupied</div>
                      </div>
                   </div>
                </div>

                <div className="pt-4 space-y-3">
                  <button 
                    onClick={() => handleStatusChange(selectedTenant.name, selectedTenant.status === 'Active' ? 'Suspended' : 'Active')}
                    className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all shadow-lg hover:scale-[1.02] active:scale-95 ${selectedTenant.status === 'Active' ? 'bg-pos-danger/10 text-pos-danger border border-pos-danger/30 hover:bg-pos-danger/20' : 'bg-pos-primary/10 text-pos-primary border border-pos-primary/30 hover:bg-pos-primary/20'}`}
                  >
                    {selectedTenant.status === 'Active' ? 'Revoke Sovereignty' : 'Restore Sovereignty'}
                  </button>
                  <p className="text-[9px] text-center text-pos-muted font-bold italic">Changing quotas will automatically update billing for the next cycle.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-pos-muted space-y-4">
              <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-pos-border flex items-center justify-center animate-pulse">
                <ShieldCheck size={24} className="opacity-20" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest">Select Tenant for Control</p>
            </div>
          )}
          
          {/* Subtle background glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-pos-primary/5 rounded-full blur-3xl group-hover:bg-pos-primary/10 transition-all" />
        </div>
      </div>
    </div>
  );
};

export default TenantManagement;
