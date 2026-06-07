import React, { useState } from 'react';
import { Users, UserPlus, ShieldCheck, Mail, Key, ShieldAlert, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

interface UserStaff {
  email: string;
  name: string;
  role: string;
  status: 'Active' | 'Suspended';
  branch?: string;
}

const MOCK_STAFF: UserStaff[] = [
  { email: 'cashier1@test.com', name: 'Krishna Prasad', role: 'POS', status: 'Active', branch: 'Thamel Flagship' },
  { email: 'cashier2@test.com', name: 'Maya Tamang', role: 'POS', status: 'Active', branch: 'Thamel Flagship' },
  { email: 'acc1@test.com', name: 'Hari Lamsal', role: 'Accountant', status: 'Active' },
];

const UserManagement: React.FC = () => {
  const { user } = useAuth();
  const [staff, setStaff] = useState<UserStaff[]>(MOCK_STAFF);
  const [isAdding, setIsAdding] = useState(false);

  // Quota calculation based on role
  const quota = {
    max: user?.role === 'Branch Owner' ? (user.allocated_pos_quota || 0) : 5, // Mock 5 for Single Owner
    used: staff.filter(s => s.role === 'POS').length
  };

  const remaining = quota.max - quota.used;

  return (
    <div className="p-10 space-y-10 max-w-7xl mx-auto">
      <header className="flex justify-between items-end border-b border-pos-border pb-8">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter text-pos-white mb-2 italic">Personnel Command</h2>
          <p className="text-pos-muted font-bold tracking-tight">Manage your authorized staff and session access.</p>
        </div>
        
        <div className="bg-pos-surface border border-pos-border rounded-2xl p-4 flex items-center gap-4 shadow-xl">
           <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${remaining <= 0 ? 'bg-pos-danger/10 text-pos-danger' : 'bg-pos-primary/10 text-pos-primary'}`}>
              <Users size={20} />
           </div>
           <div>
              <div className="text-[10px] font-black uppercase text-pos-muted tracking-widest">POS Seats</div>
              <div className="text-xl font-black text-pos-white tracking-tighter">{quota.used} / {quota.max}</div>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
           <div className="flex justify-between items-center">
              <h3 className="text-xl font-black uppercase tracking-tighter text-pos-white">Authorized Personnel</h3>
              <Button 
                 variant="primary" 
                 size="sm" 
                 disabled={remaining <= 0}
                 onClick={() => setIsAdding(true)}
                 className="font-black uppercase tracking-widest text-[10px]"
              >
                 <UserPlus size={14} className="mr-2" /> Add Staff
              </Button>
           </div>

           <div className="bg-pos-surface border border-pos-border rounded-3xl overflow-hidden shadow-2xl">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-pos-black/30 border-b border-pos-border">
                       <th className="px-6 py-4 text-[10px] font-black text-pos-muted uppercase tracking-widest">User Details</th>
                       <th className="px-6 py-4 text-[10px] font-black text-pos-muted uppercase tracking-widest">Role</th>
                       <th className="px-6 py-4 text-[10px] font-black text-pos-muted uppercase tracking-widest">Status</th>
                       <th className="px-6 py-4 text-[10px] font-black text-pos-muted uppercase tracking-widest">Action</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-pos-border">
                    {staff.map(s => (
                       <tr key={s.email} className="hover:bg-pos-primary/5 transition-all">
                          <td className="px-6 py-5">
                             <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-pos-black flex items-center justify-center font-black text-pos-muted uppercase text-sm border border-pos-border">
                                   {s.name.substring(0, 2)}
                                </div>
                                <div>
                                   <div className="font-bold text-pos-white">{s.name}</div>
                                   <div className="text-[10px] text-pos-muted font-bold">{s.email}</div>
                                </div>
                             </div>
                          </td>
                          <td className="px-6 py-5">
                             <span className="text-xs font-black text-pos-white uppercase tracking-tighter">{s.role}</span>
                             {s.branch && <div className="text-[9px] text-pos-muted font-bold uppercase">{s.branch}</div>}
                          </td>
                          <td className="px-6 py-5">
                             <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${s.status === 'Active' ? 'text-pos-primary bg-pos-primary/10 border border-pos-primary/20' : 'text-pos-danger bg-pos-danger/10 border border-pos-danger/20'}`}>
                                {s.status === 'Active' ? <ShieldCheck size={10} /> : <ShieldAlert size={10} />}
                                {s.status}
                             </span>
                          </td>
                          <td className="px-6 py-5">
                             <button className="p-2 text-pos-danger/50 hover:text-pos-danger transition-colors">
                                <Trash2 size={16} />
                             </button>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

        <div className="space-y-6">
           <div className="bg-pos-surface border border-pos-border rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
              <div className="relative z-10 space-y-6">
                 <div className="flex items-center gap-3 border-b border-pos-border pb-4 text-pos-primary">
                    <ShieldCheck size={20} />
                    <h3 className="text-lg font-black uppercase tracking-tighter">Sovereign Authority</h3>
                 </div>
                 
                 <div className="space-y-4">
                    <p className="text-[11px] font-bold text-pos-muted leading-relaxed">
                       As a <span className="text-pos-white">{user?.role}</span>, you are authorized to provision new staff credentials within your allocated quota.
                    </p>
                    
                    <div className="p-4 bg-pos-black rounded-2xl border border-pos-border space-y-3">
                       <div className="text-[9px] font-black text-pos-muted uppercase tracking-widest">Quick Security Tip</div>
                       <p className="text-[10px] font-bold text-pos-white italic">
                          Never share administrative credentials. Every action is logged in the Global Audit Trail.
                       </p>
                    </div>

                    <div className="pt-4">
                       <div className="text-[9px] font-black text-pos-muted uppercase tracking-widest mb-3">Resource Allocation</div>
                       <div className="w-full h-2 bg-pos-black rounded-full overflow-hidden mb-2">
                          <div 
                             className={`h-full transition-all ${remaining <= 0 ? 'bg-pos-danger' : 'bg-pos-primary'}`} 
                             style={{ width: `${(quota.used / quota.max) * 100}%` }}
                          />
                       </div>
                       <div className="flex justify-between text-[9px] font-bold text-pos-muted uppercase">
                          <span>{quota.used} Seats Used</span>
                          <span>{remaining} Remaining</span>
                       </div>
                    </div>
                 </div>
              </div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-pos-primary/5 rounded-full blur-3xl group-hover:bg-pos-primary/10 transition-all" />
           </div>
        </div>
      </div>

      {isAdding && (
         <div className="fixed inset-0 z-50 bg-pos-black/80 backdrop-blur-md flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-pos-surface border border-pos-border rounded-3xl p-8 shadow-2xl">
               <h3 className="text-2xl font-black uppercase tracking-tighter text-pos-white mb-6">Provision New Personnel</h3>
               <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsAdding(false); }}>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-pos-muted tracking-widest pl-1">Full Name</label>
                     <input type="text" className="w-full bg-pos-black border border-pos-border rounded-xl p-4 text-pos-white font-bold" placeholder="e.g. Suman Sharma" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-pos-muted tracking-widest pl-1">Email / Username</label>
                     <div className="relative">
                        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-pos-muted" />
                        <input type="email" className="w-full bg-pos-black border border-pos-border rounded-xl p-4 pl-12 text-pos-white font-bold" placeholder="staff@example.com" />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-pos-muted tracking-widest pl-1">Initial Password</label>
                     <div className="relative">
                        <Key size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-pos-muted" />
                        <input type="password" underline="false" className="w-full bg-pos-black border border-pos-border rounded-xl p-4 pl-12 text-pos-white font-bold" placeholder="••••••••" />
                     </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                     <Button variant="outline" className="flex-1 uppercase font-black tracking-widest text-[10px]" onClick={() => setIsAdding(false)}>Cancel</Button>
                     <Button variant="primary" className="flex-1 uppercase font-black tracking-widest text-[10px]" type="submit">Grant Access</Button>
                  </div>
               </form>
            </div>
         </div>
      )}
    </div>
  );
};

export default UserManagement;
