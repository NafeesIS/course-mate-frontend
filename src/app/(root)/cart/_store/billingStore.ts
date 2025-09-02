/* eslint-disable no-unused-vars */
// store/billingStore.ts
import { IBillingDetails } from '@/store/userStoreTypes';
import { create } from 'zustand';

export interface BillingState {
  billingInfo: IBillingDetails;
  gstInfo: {
    addGst: boolean;
    gstNumber: string;
  };
  updateBillingInfo: (info: Partial<BillingState['billingInfo']>) => void;
  updateGstInfo: (info: Partial<BillingState['gstInfo']>) => void;
}

export const useBillingStore = create<BillingState>((set) => ({
  billingInfo: {
    _id: '',
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    isDefault: false,
    billingType: 'personal',
  },
  gstInfo: {
    addGst: false,
    gstNumber: '',
  },
  updateBillingInfo: (info) =>
    set((state) => ({ billingInfo: { ...state.billingInfo, ...info } })),
  updateGstInfo: (info) =>
    set((state) => ({ gstInfo: { ...state.gstInfo, ...info } })),
}));
