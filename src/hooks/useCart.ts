import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Book } from '../types';

interface CartItem extends Book {
  quantity: number;
}

interface CartStore {
  cartItems: CartItem[];
  addToCart: (book: Book) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
}

export const useCart = create<CartStore>()(
  persist(
    (set) => ({
      cartItems: [],
      addToCart: (book) =>
        set((state) => {
          const existingItem = state.cartItems.find((item) => item.id === book.id);
          if (existingItem) {
            return {
              cartItems: state.cartItems.map((item) =>
                item.id === book.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return { cartItems: [...state.cartItems, { ...book, quantity: 1 }] };
        }),
      removeFromCart: (id) =>
        set((state) => ({
          cartItems: state.cartItems.filter((item) => item.id !== id),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        })),
    }),
    {
      name: 'cart-storage',
    }
  )
);