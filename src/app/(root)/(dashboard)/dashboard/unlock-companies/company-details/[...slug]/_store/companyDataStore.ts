/* eslint-disable no-unused-vars */
import {
  TCompanyLastUpdatedInfo,
  TCompanyMasterData,
} from '@/app/(root)/company/_types/CompanyDetails';
import { create } from 'zustand';

interface CompanyDataState {
  companyData: TCompanyMasterData | null;
  setCompanyData: (data: TCompanyMasterData) => void;
  clearCompanyData: () => void;
  // ---- company data last updated info ----
  lastUpdatedInfo: TCompanyLastUpdatedInfo | null;
  lastUpdatedInfoLoading: boolean;
  setLastUpdatedInfo: (date: TCompanyLastUpdatedInfo) => void;
  setLastUpdatedInfoLoading: (loading: boolean) => void;
  resetLastUpdatedInfo: () => void;
}

export const useCompanyDataStore = create<CompanyDataState>((set) => ({
  companyData: null,
  setCompanyData: (data) => set({ companyData: data }),
  clearCompanyData: () => set({ companyData: null }),
  // ---- company data last updated info ----
  lastUpdatedInfo: null,
  lastUpdatedInfoLoading: false,
  setLastUpdatedInfo: (data) => set({ lastUpdatedInfo: data }),
  setLastUpdatedInfoLoading: (loading) =>
    set({ lastUpdatedInfoLoading: loading }),
  resetLastUpdatedInfo: () => set({ lastUpdatedInfo: null }),
}));
