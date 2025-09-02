/* eslint-disable no-unused-vars */
import { TAllServiceCatalogs } from '@/types/ServiceCatalogTypes';
import { create } from 'zustand';

// STORE PRICING INFO
export type TPricingStore = {
  serviceCatalogFromDB: TAllServiceCatalogs | null;
  serviceCatalogFromDBPending: boolean;
  serviceCatalogFromDBError: Error | null;
  refetchServiceCatalogFromDB: (() => void) | null;
  setServiceCatalogFromDB: (data: TAllServiceCatalogs) => void;
  setServiceCatalogFromDBPending: (pending: boolean) => void;
  setServiceCatalogFromDBError: (error: Error | null) => void;
  setRefetchServiceCatalogFromDB: (val: (() => void) | null) => void;
};

export const usePricingStore = create<TPricingStore>((set) => ({
  serviceCatalogFromDB: null,
  serviceCatalogFromDBPending: false,
  serviceCatalogFromDBError: null,
  refetchServiceCatalogFromDB: null,
  setServiceCatalogFromDB: (data: TAllServiceCatalogs) =>
    set({ serviceCatalogFromDB: data }),
  setServiceCatalogFromDBPending: (pending: boolean) =>
    set({ serviceCatalogFromDBPending: pending }),
  setServiceCatalogFromDBError: (error: Error | null) =>
    set({ serviceCatalogFromDBError: error }),
  setRefetchServiceCatalogFromDB: (val: (() => void) | null) =>
    set({ refetchServiceCatalogFromDB: val }),
}));
