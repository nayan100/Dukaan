import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, Truck, ShoppingBag, 
  ArrowRight, CheckCircle2, Clock, ShieldAlert 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBranchStore, type BranchTask } from '../../store/useBranchStore';

const ActionInbox: React.FC = () => {
  const tasks = useBranchStore(s => s.tasks);
  const resolveTask = useBranchStore(s => s.resolveTask);
  const navigate = useNavigate();

  const pendingTasks = tasks.filter(t => t.status === 'pending');

  return (
    <div className="p-10 space-y-10 max-w-5xl mx-auto">
      <header>
        <div className="flex items-center gap-3 mb-2">
            <Clock className="text-emerald-400" size={20} />
            <span className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400">Real-time Priority</span>
        </div>
        <h1 className="text-4xl font-black tracking-tighter uppercase italic text-slate-100">Action Inbox</h1>
        <p className="text-slate-400 font-medium mt-2">Operational tasks requiring immediate branch attention.</p>
      </header>

      <div className="grid gap-6">
        {pendingTasks.length > 0 ? (
          pendingTasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onResolve={() => resolveTask(task.id)}
              onNavigate={(path) => navigate(path)}
            />
          ))
        ) : (
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-20 text-center">
            <CheckCircle2 className="mx-auto text-emerald-500/20 mb-6" size={64} />
            <h3 className="text-xl font-black uppercase tracking-tight text-slate-500">Inbox is Clear</h3>
            <p className="text-slate-600 font-bold mt-2">All branch operations are currently optimal.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const TaskCard = ({ task, onResolve, onNavigate }: { task: BranchTask, onResolve: () => void, onNavigate: (path: string) => void }) => {
  const configs = {
    logistics: {
      icon: Truck,
      path: '/branch/logistics',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      text: 'text-emerald-400'
    },
    stock_alert: {
      icon: AlertTriangle,
      path: '/branch/inventory',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      text: 'text-amber-400'
    },
    quota_warning: {
      icon: ShieldAlert,
      path: '/branch/inventory',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      text: 'text-rose-400'
    },
    procurement_approval: {
      icon: ShoppingBag,
      path: '/branch/procurement',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      text: 'text-blue-400'
    }
  };

  const config = configs[task.type];
  const Icon = config.icon;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-slate-900 border ${config.border} p-6 rounded-2xl flex items-center gap-6 group hover:bg-slate-800/50 transition-all`}
    >
      <div className={`w-16 h-16 rounded-xl ${config.bg} flex items-center justify-center ${config.text} border ${config.border} shadow-inner`}>
        <Icon size={32} />
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
           <span className={`text-[10px] font-black uppercase tracking-widest ${config.text}`}>{task.type.replace('_', ' ')}</span>
           <span className="w-1 h-1 bg-slate-700 rounded-full" />
           <span className="text-[10px] font-bold text-slate-500 uppercase">{new Date(task.createdAt).toLocaleTimeString()}</span>
        </div>
        <h3 className="text-lg font-black tracking-tight text-slate-100">{task.title}</h3>
        <p className="text-slate-400 text-sm font-medium mt-1">{task.description}</p>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={onResolve}
          className="px-4 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all text-[10px] font-black uppercase tracking-widest"
        >
          Dismiss
        </button>
        <button 
          onClick={() => onNavigate(config.path)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${config.bg} ${config.text} border ${config.border} hover:scale-105 transition-all text-[10px] font-black uppercase tracking-widest`}
        >
          Take Action <ArrowRight size={14} />
        </button>
      </div>
    </motion.div>
  );
};

export default ActionInbox;
