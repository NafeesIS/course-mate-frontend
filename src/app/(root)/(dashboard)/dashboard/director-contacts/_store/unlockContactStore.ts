/* eslint-disable no-unused-vars */
import { create } from 'zustand';

export interface IContactDetails {
  emailAddress: string;
  mobileNumber: string;
}

export interface IUnlockBulkPurchaseStore {
  availableDirectorUnlockCredits: number;
  setAvailableDirectorUnlockCredits: (credits: number) => void;
  availableCompanyUnlockCredits: number;
  setAvailableCompanyUnlockCredits: (credits: number) => void;
  contactDetails: IContactDetails;
  setContactDetails: (details: IContactDetails) => void;
  contactDetailsLoading: boolean;
  setContactDetailsLoading: (loading: boolean) => void;
  contactDetailsError: string;
  setContactDetailsError: (error: string) => void;
  unlockedDins: string[];
  addUnlockedDin: (din: string) => void;
  isContactUnlocked: (din: string) => boolean;
}

export const useUnlockBulkPurchaseStore = create<IUnlockBulkPurchaseStore>(
  (set, get) => ({
    availableDirectorUnlockCredits: 0,
    setAvailableDirectorUnlockCredits: (credits: number) =>
      set({ availableDirectorUnlockCredits: credits }),

    availableCompanyUnlockCredits: 0,
    setAvailableCompanyUnlockCredits: (credits: number) =>
      set({ availableCompanyUnlockCredits: credits }),

    contactDetails: {
      emailAddress: '',
      mobileNumber: '',
    },
    setContactDetails: (details: IContactDetails) =>
      set({ contactDetails: details }),

    contactDetailsLoading: false,
    setContactDetailsLoading: (loading: boolean) =>
      set({ contactDetailsLoading: loading }),

    contactDetailsError: '',
    setContactDetailsError: (error: string) =>
      set({ contactDetailsError: error }),

    unlockedDins: [],
    addUnlockedDin: (din: string) =>
      set((state) => ({ unlockedDins: [...state.unlockedDins, din] })),
    isContactUnlocked: (din: string) => get().unlockedDins.includes(din),
  })
);
