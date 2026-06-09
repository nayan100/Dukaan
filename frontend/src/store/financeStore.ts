import { create } from 'zustand';

export type AuditFlag = 'suspicious_price' | 'rounding_error' | 'discount_velocity' | 'void_anomaly';

interface FinanceState {
  flags: Record<string, AuditFlag[]>;
  toggleFlag: (entryId: string, flag: AuditFlag) => void;
  clearFlags: () => void;
  getFlags: (entryId: string) => AuditFlag[];
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  flags: {},
  
  toggleFlag: (entryId, flag) => set((state) => {
    const existing = state.flags[entryId] || [];
    const updated = existing.includes(flag)
      ? existing.filter(f => f !== flag)
      : [...existing, flag];
    
    return {
      flags: {
        ...state.flags,
        [entryId]: updated
      }
    };
  }),

  clearFlags: () => set({ flags: {} }),
  
  getFlags: (entryId) => get().flags[entryId] || [],
}));
