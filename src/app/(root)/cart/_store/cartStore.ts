/* eslint-disable no-unused-vars */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TCartItem = {
  serviceId: string;
  serviceName: string;
  serviceType: string;
  description: string;
  features: string[];
  pricing: {
    credits: number;
    price: number;
  }[];
  selectedPricing: {
    credits: number;
    price: number;
    discount?: {
      type: 'flat' | 'percentage';
      coupon?: string;
      value: number;
      description?: string;
    };
  };
  customAttributes?: {
    companyId?: string; // this is for Single Company Unlock
    companyName?: string;
  };
  currency: string;
  basePrice: number;
};

export type TCartStore = {
  items: TCartItem[];
  addItem: (item: TCartItem) => void;
  updateItem: (index: number, updatedItem: TCartItem) => void;
  removeItem: (index: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<TCartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existingItemIndex = state.items.findIndex((i) => {
            // Check if custom attributes exist and compare companyId
            if (item.customAttributes && i.customAttributes) {
              return (
                i.customAttributes.companyId === item.customAttributes.companyId
              );
            }
            // If custom attributes don't exist, compare serviceId
            return i.serviceId === item.serviceId;
          });
          if (existingItemIndex > -1) {
            // If item exists, replace it completely
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex] = item;
            return { items: updatedItems };
          }
          // If item doesn't exist, add it to the cart
          return { items: [...state.items, item] };
        }),
      updateItem: (index, updatedItem) =>
        set((state) => ({
          items: state.items.map((item, i) =>
            i === index ? updatedItem : item
          ),
        })),
      removeItem: (index) =>
        set((state) => ({
          items: state.items.filter((_, i) => i !== index),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
    }
  )
);
