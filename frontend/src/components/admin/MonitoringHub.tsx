import React from 'react';

interface BranchActivity {
  branch: string;
  active_sessions: number;
  last_sync: string;
  status: 'Online' | 'Offline';
}

interface ResourceUsage {
  tenant: string;
  db_size: string;
  doc_count: number;
  attachment_count: number;
}

const MOCK_BRANCH_ACTIVITY: BranchActivity[] = [
  { branch: 'Downtown Kathmandu', active_sessions: 4, last_sync: '2 mins ago', status: 'Online' },
  { branch: 'Lalitpur Hub', active_sessions: 2, last_sync: '5 mins ago', status: 'Online' },
  { branch: 'Pokhara Lakeside', active_sessions: 0, last_sync: '1 hour ago', status: 'Offline' },
];

const MOCK_RESOURCE_USAGE: ResourceUsage[] = [
  { tenant: 'Metro Retail', db_size: '245 MB', doc_count: 12450, attachment_count: 156 },
  { tenant: 'City Mart', db_size: '112 MB', doc_count: 5600, attachment_count: 84 },
];

const MonitoringHub: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-white mb-6">Monitoring Hub</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Branch Activity Widget */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Branch Activity</h4>
              <span className="text-xs text-slate-500">Live POS Sessions</span>
            </div>
            <div className="space-y-4">
              {MOCK_BRANCH_ACTIVITY.map((branch) => (
                <div key={branch.branch} className="flex justify-between items-center p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div>
                    <div className="text-sm font-medium text-slate-200">{branch.branch}</div>
                    <div className="text-xs text-slate-500">Sync: {branch.last_sync}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-200">{branch.active_sessions} Sessions</div>
                    <div className={`text-[10px] uppercase font-bold ${branch.status === 'Online' ? 'text-emerald-500' : 'text-slate-500'}`}>
                      ● {branch.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resource Usage Widget */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Resource Usage</h4>
              <span className="text-xs text-slate-500">DB & Documents</span>
            </div>
            <div className="space-y-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-800">
                    <th className="pb-2">Tenant</th>
                    <th className="pb-2">DB Size</th>
                    <th className="pb-2">Docs</th>
                    <th className="pb-2">Files</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {MOCK_RESOURCE_USAGE.map((usage) => (
                    <tr key={usage.tenant} className="text-slate-300">
                      <td className="py-3 font-medium">{usage.tenant}</td>
                      <td className="py-3">{usage.db_size}</td>
                      <td className="py-3">{usage.doc_count.toLocaleString()}</td>
                      <td className="py-3">{usage.attachment_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Event Stream Simulation */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-6">
        <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">Event Stream</h4>
        <div className="space-y-2 font-mono text-[11px]">
          <div className="text-emerald-500/80">[23:15:01] INFO: Tenant 'Metro Retail' created new Purchase Order PO-00124</div>
          <div className="text-slate-500">[23:14:45] SYNC: Branch 'Lalitpur Hub' synced 12 invoices</div>
          <div className="text-amber-500/80">[23:12:10] WARN: Tenant 'City Mart' reached 80% of storage quota</div>
          <div className="text-slate-500">[23:10:05] AUTH: SaaS Admin logged in from 192.168.1.5</div>
        </div>
      </div>
    </div>
  );
};

export default MonitoringHub;
