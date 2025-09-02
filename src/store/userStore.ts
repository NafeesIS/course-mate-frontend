/* eslint-disable no-unused-vars */
import { create } from 'zustand';
import { IUserSignInDetails } from './userStoreTypes';

// STORE USER INFO AFTER SIGN IN / SIGN UP
export type TUserSignInDetails = {
  userSignInDetails: IUserSignInDetails | null;
  userSignInDetailsLoading: boolean;
  userSignInDetailsError: any;
  refetchUserSignInDetails: (() => void) | null; // Add the refetch function here
  setUserSignInDetails: (val: IUserSignInDetails | null) => void;
  setUserSignInDetailsLoading: (val: boolean) => void;
  setUserSignInDetailsError: (val: any) => void;
  setRefetchUserSignInDetails: (val: (() => void) | null) => void; // Setter for refetch function
};

export const useUserSignInDetails = create<TUserSignInDetails>((set) => ({
  userSignInDetails: null,
  userSignInDetailsLoading: true,
  userSignInDetailsError: null,
  refetchUserSignInDetails: null, // Initialize refetch as null
  setUserSignInDetails: (data) => set({ userSignInDetails: data }),
  setUserSignInDetailsLoading: (loading) =>
    set({ userSignInDetailsLoading: loading }),
  setUserSignInDetailsError: (err) => set({ userSignInDetailsError: err }),
  setRefetchUserSignInDetails: (refetchFn) =>
    set({ refetchUserSignInDetails: refetchFn }),
}));
