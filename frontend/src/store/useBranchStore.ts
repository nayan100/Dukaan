import { create } from 'zustand';

export type BranchTaskType = 'logistics' | 'stock_alert' | 'quota_warning' | 'procurement_approval';

export interface BranchTask {
  id: string;
  type: BranchTaskType;
  title: string;
  description: string;
  status: 'pending' | 'resolved' | 'dismissed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  metadata?: Record<string, any>;
}

interface BranchState {
  tasks: BranchTask[];
  
  addTask: (task: BranchTask) => void;
  resolveTask: (taskId: string) => void;
  dismissTask: (taskId: string) => void;
}

export const useBranchStore = create<BranchState>((set) => ({
  tasks: [
    {
      id: 'task-1',
      type: 'logistics',
      title: '72-Hour Transit Alert',
      description: 'Inventory from HQ has been in transit for over 72 hours. Urgent follow-up required.',
      status: 'pending',
      priority: 'critical',
      createdAt: new Date().toISOString(),
      metadata: { shipmentId: 'SH-001' }
    },
    {
      id: 'task-2',
      type: 'stock_alert',
      title: 'Low Stock: Wireless Mouse',
      description: 'Current stock (5) is below safety threshold (10).',
      status: 'pending',
      priority: 'high',
      createdAt: new Date().toISOString(),
      metadata: { productId: 'ITEM-002', currentStock: 5 }
    },
    {
      id: 'task-3',
      type: 'quota_warning',
      title: 'Local Quota Threshold Reached',
      description: 'Sales quota for "Electronics" is at 85% of monthly limit.',
      status: 'pending',
      priority: 'medium',
      createdAt: new Date().toISOString(),
      metadata: { category: 'Electronics', percentage: 85 }
    },
    {
      id: 'task-4',
      type: 'procurement_approval',
      title: 'Pending Receipt: Office Supplies',
      description: 'Vendor has delivered items. Please verify and confirm receipt.',
      status: 'pending',
      priority: 'low',
      createdAt: new Date().toISOString(),
      metadata: { poId: 'PO-992' }
    }
  ],
  
  addTask: (task) => set((state) => ({
    tasks: [task, ...state.tasks]
  })),
  
  resolveTask: (taskId) => set((state) => ({
    tasks: state.tasks.map(t => t.id === taskId ? { ...t, status: 'resolved' } : t)
  })),
  
  dismissTask: (taskId) => set((state) => ({
    tasks: state.tasks.filter(t => t.id !== taskId)
  }))
}));
