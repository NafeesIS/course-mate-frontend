import { BASE_URL_BACKEND } from '@/constants';
import { create } from 'zustand';

export type UnlockedCompany = {
  companyId: string;
  companyName: string;
  expiryDate: string;
  unlockedAt: string;
  unlockType: 'report' | 'documents';
};

type UnlockedCompaniesResponse = {
  success: boolean;
  message: string;
  data: UnlockedCompany[];
};

type UnlockedCompaniesStore = {
  unlockedCompanies: UnlockedCompany[];
  success: boolean;
  message: string;
  isLoading: boolean;
  error: Error | null;
  fetchUnlockedCompanies: (
    // eslint-disable-next-line no-unused-vars
    userId: string
  ) => Promise<UnlockedCompaniesResponse>;
  // eslint-disable-next-line no-unused-vars
  isCompanyUnlocked: (cin: string) => {
    isUnlocked: boolean;
    unlockType: string | null;
  };
};

export const useUnlockedCompaniesStore = create<UnlockedCompaniesStore>(
  (set, get) => ({
    unlockedCompanies: [],
    success: false,
    message: '',
    isLoading: false,
    error: null,
    fetchUnlockedCompanies: async (userId: string) => {
      set({ isLoading: true });
      try {
        const res = await fetch(
          `${BASE_URL_BACKEND}/api/v1/unlock-company/user-unlocked-companies`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              _userId: userId,
            }),
          }
        );
        if (!res.ok) {
          throw new Error('Failed to fetch unlocked companies');
        }
        const data: UnlockedCompaniesResponse = await res.json();
        set({
          unlockedCompanies: data.data,
          success: data.success,
          message: data.message,
          isLoading: false,
          error: null,
        });
        return data;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'An unknown error occurred';
        set({ error: new Error(errorMessage), isLoading: false });
        throw error;
      }
    },
    isCompanyUnlocked: (cin: string) => {
      const { unlockedCompanies } = get();
      const company = unlockedCompanies.find(
        (company) => company.companyId === cin
      );
      return company
        ? { isUnlocked: true, unlockType: company.unlockType }
        : { isUnlocked: false, unlockType: null };
    },
  })
);
