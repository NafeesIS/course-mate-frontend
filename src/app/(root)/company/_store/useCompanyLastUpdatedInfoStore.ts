import { create } from 'zustand';

interface CompanyUpdateStore {
  lastUpdatedAt: string | null;
  // eslint-disable-next-line no-unused-vars
  setLastUpdatedAt: (date: string) => void;
  resetLastUpdatedAt: () => void;
}

export const useCompanyLastUpdatedInfoStore = create<CompanyUpdateStore>(
  (set) => ({
    lastUpdatedAt: null,
    setLastUpdatedAt: (date) => set({ lastUpdatedAt: date }),
    resetLastUpdatedAt: () => set({ lastUpdatedAt: null }),
  })
);
