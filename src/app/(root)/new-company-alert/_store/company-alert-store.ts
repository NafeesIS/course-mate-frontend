/* eslint-disable no-unused-vars */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ICompanyAlertPlan, IZonalPricing } from '../_utils/types';

interface INewCompanyAlertStore {
  selectedPlan: ICompanyAlertPlan | null;
  selectedZones: IZonalPricing[];
  selectedDuration: 'monthly' | 'quarterly' | 'annually' | 'trial';
  setSelectedPlan: (plan: ICompanyAlertPlan | null) => void;
  setSelectedZones: (states: IZonalPricing[]) => void;
  setSelectedDuration: (
    duration: 'monthly' | 'quarterly' | 'annually' | 'trial'
  ) => void;
}

export const useNewCompanyAlertStore = create<INewCompanyAlertStore>()(
  persist(
    (set) => ({
      selectedPlan: null,
      selectedZones: [],
      selectedDuration: 'quarterly',

      setSelectedPlan: (plan) => set({ selectedPlan: plan }),
      setSelectedZones: (states) => set({ selectedZones: states }),
      setSelectedDuration: (duration) => set({ selectedDuration: duration }),
    }),
    {
      name: 'new-company-alert-store', // Unique name for storage
    }
  )
);
