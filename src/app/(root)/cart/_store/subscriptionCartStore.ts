/* eslint-disable no-unused-vars */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TCartItem } from '../_types/types';

export type TSubscriptionCartStore = {
  items: TCartItem[];
  addItem: (item: TCartItem) => void;
  updateItem: (index: number, updatedItem: TCartItem) => void;
  removeItem: (index: number) => void;
  clearCart: () => void;
};

export const useSubscriptionCartStore = create<TSubscriptionCartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (i) => i.serviceId === item.serviceId
          );
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
      name: 'subscription-cart-storage',
    }
  )
);
