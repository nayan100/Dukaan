import React, { useState } from 'react';
import { Building2, ShoppingCart, Plus, Trash2, Edit3, ShieldCheck } from 'lucide-react';
import Button from '../ui/Button';

interface Branch {
  id: string;
  name: string;
  location: string;
  pos_quota: number;
  pos_used: number;
  manager: string;
  status?: 'Active' | 'Provisioning';
}

const MOCK_BRANCHES: Branch[] = [
  { id: 'BR-001', name: 'Thamel Flagship', location: 'Kathmandu', pos_quota: 5, pos_used: 3, manager: 'Ram Prasad', status: 'Active' },
  { id: 'BR-002', name: 'Pokhara Lakeside', location: 'Pokhara', pos_quota: 3, pos_used: 2, manager: 'Sita Devi', status: 'Active' },
];

const BranchManagement: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>(MOCK_BRANCHES);
  const [isAdding, setIsAdding] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchPos, setNewBranchPos] = useState('');
  const [newBranchLocation, setNewBranchLocation] = useState('');
  
  // Simulated Tenant Quotas
  const tenantQuota = {
    max_branches: 5,
    max_pos_seats: 20,
    used_branches: branches.length,
    used_pos_seats: branches.reduce((acc, b) => acc + b.pos_quota, 0)
  };

  const remainingBranches = tenantQuota.max_branches - tenantQuota.used_branches;
  const remainingPOS = tenantQuota.max_pos_seats - tenantQuota.used_pos_seats;

  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(false);
    
    const newBranch: Branch = {
      id: `BR-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      name: newBranchName,
      location: newBranchLocation || 'New Location',
      pos_quota: parseInt(newBranchPos) || 1,
      pos_used: 0,
      manager: 'Unassigned',
      status: 'Provisioning'
    };
    
    setBranches([...branches, newBranch]);
    setNewBranchName('');
    setNewBranchPos('');
    setNewBranchLocation('');
    
    // Simulate provisioning completion
    setTimeout(() => {
        setBranches(prev => prev.map(b => 
            b.id === newBranch.id ? { ...b, status: 'Active' } : b
        ));
    }, 5000);
  };

  return (
    <div className="p-10 space-y-10 max-w-7xl mx-auto">
      <header className="flex justify-between items-end border-b border-pos-border pb-8">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter text-pos-white mb-2 italic">Branch Architecture</h2>
          <p className="text-pos-muted font-bold tracking-tight">Expand your chain across the sovereign network.</p>
        </div>
        
        <div className="flex gap-6">
           <div className="bg-pos-surface border border-pos-border rounded-2xl p-4 flex items-center gap-4 shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-pos-primary/10 flex items-center justify-center text-pos-primary">
                 <Building2 size={20} />
              </div>
              <div>
                 <div className="text-[10px] font-black uppercase text-pos-muted tracking-widest">Branch Slots</div>
                 <div className="text-xl font-black text-pos-white tracking-tighter">{tenantQuota.used_branches} / {tenantQuota.max_branches}</div>
              </div>
           </div>
           <div className="bg-pos-surface border border-pos-border rounded-2xl p-4 flex items-center gap-4 shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-pos-secondary/10 flex items-center justify-center text-pos-secondary">
                 <ShoppingCart size={20} />
              </div>
              <div>
                 <div className="text-[10px] font-black uppercase text-pos-muted tracking-widest">POS Pool</div>
                 <div className="text-xl font-black text-pos-white tracking-tighter">{tenantQuota.used_pos_seats} / {tenantQuota.max_pos_seats}</div>
              </div>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
             <h3 className="text-xl font-black uppercase tracking-tighter text-pos-white">Active Branches</h3>
             <Button 
                variant="primary" 
                size="sm" 
                disabled={remainingBranches <= 0}
                onClick={() => setIsAdding(true)}
                className="font-black uppercase tracking-widest text-[10px]"
             >
                <Plus size={14} className="mr-2" /> New Branch
             </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {branches.map(branch => (
              <div key={branch.id} className={`bg-pos-surface border ${branch.status === 'Provisioning' ? 'border-blue-500/50' : 'border-pos-border'} rounded-3xl p-6 shadow-2xl hover:border-pos-primary/30 transition-all group relative overflow-hidden`}>
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-12 h-12 rounded-2xl bg-pos-black flex items-center justify-center shadow-inner ${branch.status === 'Provisioning' ? 'text-blue-500 animate-pulse' : 'text-pos-primary'}`}>
                    <Building2 size={24} />
                  </div>
                  {branch.status === 'Provisioning' ? (
                      <span className="px-2 py-1 bg-blue-500/10 text-blue-500 text-[10px] font-bold uppercase rounded-lg border border-blue-500/20 flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" /> Provisioning
                      </span>
                  ) : (
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 bg-pos-black rounded-lg text-pos-muted hover:text-pos-white transition-colors"><Edit3 size={16} /></button>
                      <button className="p-2 bg-pos-black rounded-lg text-pos-danger/50 hover:text-pos-danger transition-colors"><Trash2 size={16} /></button>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <h4 className="text-xl font-black text-pos-white uppercase tracking-tighter">{branch.name}</h4>
                  <p className="text-xs text-pos-muted font-bold tracking-tight">{branch.location} · {branch.id}</p>
                </div>

                <div className="space-y-4 pt-4 border-t border-pos-border/50">
                   <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <ShoppingCart size={14} className="text-pos-secondary" />
                        <span className="text-[10px] font-black uppercase text-pos-muted tracking-widest">POS Allocation</span>
                      </div>
                      <span className="text-sm font-black text-pos-white tracking-tighter">{branch.pos_used} / {branch.pos_quota}</span>
                   </div>
                   <div className="w-full h-1.5 bg-pos-black rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-pos-secondary shadow-[0_0_10px_rgba(var(--pos-secondary-rgb),0.5)] transition-all" 
                        style={{ width: `${(branch.pos_used / branch.pos_quota) * 100}%` }}
                      />
                   </div>
                </div>

                {/* Background Decor */}
                <div className={`absolute -bottom-4 -right-4 text-pos-white/5 font-black text-6xl italic transition-colors ${branch.status === 'Provisioning' ? '' : 'group-hover:text-pos-primary/5'}`}>
                  {branch.id.split('-')[1]}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-pos-surface border border-pos-border rounded-3xl p-8 shadow-2xl relative overflow-hidden">
             <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-3 border-b border-pos-border pb-4 text-pos-primary">
                  <ShieldCheck size={20} />
                  <h3 className="text-lg font-black uppercase tracking-tighter">Chain Security</h3>
                </div>

                <div className="space-y-6">
                   <div className="space-y-2">
                      <div className="text-[10px] font-black uppercase text-pos-muted tracking-widest">Global Manager</div>
                      <div className="p-4 bg-pos-black rounded-2xl border border-pos-border font-bold text-pos-white text-sm">
                        You (Chain Owner)
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div className="text-[10px] font-black uppercase text-pos-muted tracking-widest">Sovereign Limits</div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="p-4 bg-pos-black rounded-2xl border border-pos-border">
                            <div className="text-lg font-black text-pos-white tracking-tighter">{remainingBranches}</div>
                            <div className="text-[9px] font-bold text-pos-muted uppercase tracking-tighter">Slots Left</div>
                         </div>
                         <div className="p-4 bg-pos-black rounded-2xl border border-pos-border">
                            <div className="text-lg font-black text-pos-white tracking-tighter">{remainingPOS}</div>
                            <div className="text-[9px] font-bold text-pos-muted uppercase tracking-tighter">Seats Left</div>
                         </div>
                      </div>
                   </div>

                   <div className="bg-pos-primary/5 border border-pos-primary/20 rounded-2xl p-4">
                      <p className="text-[10px] font-bold text-pos-primary leading-relaxed italic">
                        Creating a branch consumes one branch slot. You must allocate at least 1 POS seat to every branch for operational status.
                      </p>
                   </div>
                </div>
             </div>
             
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-pos-primary/10 rounded-full blur-3xl" />
          </div>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-50 bg-pos-black/80 backdrop-blur-md flex items-center justify-center p-6">
           <div className="max-w-md w-full bg-pos-surface border border-pos-border rounded-3xl p-8 shadow-2xl">
              <h3 className="text-2xl font-black uppercase tracking-tighter text-pos-white mb-6">Initialize New Branch</h3>
              <form className="space-y-6" onSubmit={handleCreateBranch}>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-pos-muted tracking-widest pl-1">Branch Name</label>
                    <input type="text" required value={newBranchName} onChange={(e) => setNewBranchName(e.target.value)} className="w-full bg-pos-black border border-pos-border rounded-xl p-4 text-pos-white font-bold" placeholder="e.g. Biratnagar Express" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-pos-muted tracking-widest pl-1">Location</label>
                    <input type="text" required value={newBranchLocation} onChange={(e) => setNewBranchLocation(e.target.value)} className="w-full bg-pos-black border border-pos-border rounded-xl p-4 text-pos-white font-bold" placeholder="e.g. Biratnagar" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-pos-muted tracking-widest pl-1">POS Allocation</label>
                    <input type="number" required min="1" max={remainingPOS} value={newBranchPos} onChange={(e) => setNewBranchPos(e.target.value)} className="w-full bg-pos-black border border-pos-border rounded-xl p-4 text-pos-white font-bold" placeholder="Seats to allocate" />
                    <p className="text-[9px] font-bold text-pos-muted italic">Available seats: {remainingPOS}</p>
                 </div>
                 <div className="flex gap-4 pt-4">
                    <Button variant="outline" type="button" className="flex-1 uppercase font-black tracking-widest text-[10px]" onClick={() => setIsAdding(false)}>Cancel</Button>
                    <Button variant="primary" className="flex-1 uppercase font-black tracking-widest text-[10px]" type="submit">Deploy Branch</Button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default BranchManagement;
