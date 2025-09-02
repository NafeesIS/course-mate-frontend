/* eslint-disable no-unused-vars */

import { create } from 'zustand';

// COMPANY DETAILS LAST UPDATED TIME: FOR LAST UPDATED TIME IN THE COMPANY DETAILS PAGE
type ComplianceCheckStatusFirstTime = {
  lastUpdatedAt: string;
  setLastUpdatedAt: (val: string) => void;
};
export const useCompanyDetailsLastUpdatedTime =
  create<ComplianceCheckStatusFirstTime>((set) => ({
    lastUpdatedAt: '',
    setLastUpdatedAt: (val: string) => set({ lastUpdatedAt: val }),
  }));
