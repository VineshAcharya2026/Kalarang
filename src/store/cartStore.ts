import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OrderItem, Product } from '../types';

interface CartState {
  items: OrderItem[];
  addItem: (product: Product, color: string) => void;
  removeItem: (productId: string, color: string) => void;
  updateQty: (productId: string, color: string, qty: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const recalculate = (items: OrderItem[]) => {
  const itemCount = items.reduce((sum, item) => sum + item.qty, 0);
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  return { itemCount, total };
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      total: 0,
      itemCount: 0,

      addItem: (product: Product, color: string) =>
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.productId === product.id && item.color === color
          );

          let newItems = [...state.items];

          if (existingIndex > -1) {
            newItems[existingIndex] = {
              ...newItems[existingIndex],
              qty: newItems[existingIndex].qty + 1,
            };
          } else {
            newItems.push({
              productId: product.id,
              productName: product.name,
              color: color || (product.colors && product.colors[0]) || 'Standard',
              image: (product.images && product.images[0]) || '',
              price: product.salePrice,
              qty: 1,
            });
          }

          return {
            items: newItems,
            ...recalculate(newItems),
          };
        }),

      removeItem: (productId: string, color: string) =>
        set((state) => {
          const newItems = state.items.filter(
            (item) => !(item.productId === productId && item.color === color)
          );
          return {
            items: newItems,
            ...recalculate(newItems),
          };
        }),

      updateQty: (productId: string, color: string, qty: number) =>
        set((state) => {
          if (qty <= 0) {
            const newItems = state.items.filter(
              (item) => !(item.productId === productId && item.color === color)
            );
            return {
              items: newItems,
              ...recalculate(newItems),
            };
          }

          const newItems = state.items.map((item) => {
            if (item.productId === productId && item.color === color) {
              return { ...item, qty };
            }
            return item;
          });

          return {
            items: newItems,
            ...recalculate(newItems),
          };
        }),

      clearCart: () =>
        set(() => ({
          items: [],
          total: 0,
          itemCount: 0,
        })),
    }),
    {
      name: 'kalarang-cart-storage',
    }
  )
);
