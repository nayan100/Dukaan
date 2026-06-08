import { create } from 'zustand';

interface SyncState {
  isOnline: boolean;
  isSyncing: boolean;
  unsyncedCount: number;
  setOnline: (status: boolean) => void;
  setSyncing: (status: boolean) => void;
  setUnsyncedCount: (count: number) => void;
}

export const useSyncStore = create<SyncState>((set) => ({
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  isSyncing: false,
  unsyncedCount: 0,
  setOnline: (status) => set({ isOnline: status }),
  setSyncing: (status) => set({ isSyncing: status }),
  setUnsyncedCount: (count) => set({ unsyncedCount: count }),
}));

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => useSyncStore.getState().setOnline(true));
  window.addEventListener('offline', () => useSyncStore.getState().setOnline(false));
}
