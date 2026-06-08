import { create } from 'zustand';

export type ApprovalTask = {
  id: string;
  type: string;
  title: string;
  status: 'pending' | 'approved' | 'rejected';
  [key: string]: any;
};

export type WizardStateData = {
  activeWizard: string | null;
  step: number;
  data: Record<string, any>;
};

export type AnalyticsData = {
  globalRevenue: number;
  branchPerformance: any[];
};

interface HQState {
  approvalQueue: ApprovalTask[];
  approvalHistory: ApprovalTask[];
  wizardState: WizardStateData;
  analytics: AnalyticsData;
  
  addApprovalTask: (task: ApprovalTask) => void;
  removeApprovalTask: (taskId: string) => void;
  
  approveTask: (taskId: string) => void;
  rejectTask: (taskId: string) => void;
  
  setWizardState: (activeWizard: string | null, step?: number, data?: Record<string, any>) => void;
  clearWizardState: () => void;
}

export const useHQStore = create<HQState>((set) => ({
  approvalQueue: [],
  approvalHistory: [],
  wizardState: {
    activeWizard: null,
    step: 0,
    data: {}
  },
  analytics: {
    globalRevenue: 0,
    branchPerformance: []
  },
  
  addApprovalTask: (task) => set((state) => ({
    approvalQueue: [...state.approvalQueue, task]
  })),
  
  removeApprovalTask: (taskId) => set((state) => ({
    approvalQueue: state.approvalQueue.filter(t => t.id !== taskId)
  })),

  approveTask: (taskId) => set((state) => {
    const task = state.approvalQueue.find(t => t.id === taskId);
    if (!task) return state;
    return {
      approvalQueue: state.approvalQueue.filter(t => t.id !== taskId),
      approvalHistory: [...state.approvalHistory, { ...task, status: 'approved' }]
    };
  }),

  rejectTask: (taskId) => set((state) => {
    const task = state.approvalQueue.find(t => t.id === taskId);
    if (!task) return state;
    return {
      approvalQueue: state.approvalQueue.filter(t => t.id !== taskId),
      approvalHistory: [...state.approvalHistory, { ...task, status: 'rejected' }]
    };
  }),
  
  setWizardState: (activeWizard, step = 0, data = {}) => set((state) => ({
    wizardState: {
      ...state.wizardState,
      activeWizard,
      step,
      data: { ...state.wizardState.data, ...data }
    }
  })),
  
  clearWizardState: () => set(() => ({
    wizardState: {
      activeWizard: null,
      step: 0,
      data: {}
    }
  }))
}));
