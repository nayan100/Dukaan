import React, { useEffect } from 'react';
import { useHQStore } from '../../store/useHQStore';
import { CheckCircle2, Clock, Filter, Search, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_APPROVALS = [
  { id: 'A1', type: 'Transfer', title: 'Inventory Rebalance: KTM to Pokhara', requester: 'ktm_manager', amount: 45000, date: '2026-06-08', priority: 'high' },
  { id: 'A2', type: 'Procurement', title: 'Bulk Purchase: Organic Coffee (50kg)', requester: 'everest_owner', amount: 85000, date: '2026-06-09', priority: 'urgent' },
  { id: 'A3', type: 'Exception', title: 'Budget Override: Branch B3 Marketing', requester: 'b3_manager', amount: 12000, date: '2026-06-09', priority: 'normal' },
];

const ApprovalCenter: React.FC = () => {
  const { approvalQueue, removeApprovalTask } = { 
      approvalQueue: useHQStore(s => s.approvalQueue),
      removeApprovalTask: useHQStore(s => s.removeApprovalTask)
  };

  useEffect(() => {
    // Populate mock approvals if empty
    if (useHQStore.getState().approvalQueue.length === 0) {
      MOCK_APPROVALS.forEach(a => useHQStore.getState().addApprovalTask({ ...a, status: 'pending' as any }));
    }
  }, []);

  return (
    <div className="p-10 space-y-10 bg-slate-950 min-h-screen text-white">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">Global Approval Center</h1>
          <p className="text-slate-400 font-medium mt-2">Centralized command for critical chain-wide authorization requests.</p>
        </div>
        <div className="flex gap-4">
           <div className="relative">
             <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
             <input 
               type="text" 
               placeholder="Search requests..." 
               className="bg-slate-900 border border-slate-800 pl-12 pr-6 py-3 rounded-xl text-xs font-bold focus:border-emerald-500 transition-all outline-none"
             />
           </div>
           <button className="bg-slate-900 border border-slate-800 p-3 rounded-xl hover:bg-slate-800 transition-colors">
             <Filter size={18} className="text-slate-400" />
           </button>
        </div>
      </header>

      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-slate-800 flex items-center justify-between bg-slate-950/30">
          <div className="flex gap-8">
            <Tab label="Pending" count={approvalQueue.length} active />
            <Tab label="Archive" count={0} />
          </div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Showing {approvalQueue.length} Active Requests</span>
        </div>

        <div className="divide-y divide-slate-800/50">
          <AnimatePresence>
            {approvalQueue.map((item) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8 hover:bg-slate-800/30 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-8">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${
                    item.priority === 'urgent' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' :
                    item.priority === 'high' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                    'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                  }`}>
                    <Clock size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                       <span className="px-2 py-0.5 bg-slate-800 rounded-md text-[8px] font-black uppercase tracking-widest text-slate-400">
                         {item.type}
                       </span>
                       <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                         Requested by @{item.requester} · {item.date}
                       </span>
                    </div>
                    <h3 className="text-lg font-black text-slate-100 uppercase tracking-tight">{item.title}</h3>
                    <p className="text-xs text-slate-500 font-bold mt-1">Total Impact: रु {item.amount.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                   <button className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-500 hover:text-slate-300 hover:border-slate-600 transition-all">
                     <MessageSquare size={18} />
                   </button>
                   <div className="w-px h-8 bg-slate-800 mx-2" />
                   <button 
                    onClick={() => removeApprovalTask(item.id)}
                    className="px-6 py-3 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
                   >
                     Reject
                   </button>
                   <button 
                    onClick={() => removeApprovalTask(item.id)}
                    className="px-6 py-3 bg-emerald-500 text-slate-950 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/10"
                   >
                     Approve
                   </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {approvalQueue.length === 0 && (
             <div className="p-20 text-center space-y-4">
                <CheckCircle2 className="mx-auto text-slate-700" size={64} />
                <h3 className="text-xl font-black uppercase tracking-tight text-slate-500">Inbox is Clear</h3>
                <p className="text-xs text-slate-600 font-bold">All critical authorization requests have been handled.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Tab = ({ label, count, active }: any) => (
  <button className={`flex items-center gap-3 pb-8 border-b-2 transition-all ${
    active ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-500 hover:text-slate-300'
  }`}>
    <span className="text-xs font-black uppercase tracking-widest">{label}</span>
    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black ${
      active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
    }`}>{count}</span>
  </button>
);

export default ApprovalCenter;
