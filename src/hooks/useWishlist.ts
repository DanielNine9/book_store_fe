import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Book } from '../types';

interface WishlistStore {
  wishlistItems: Book[];
  addToWishlist: (book: Book) => void;
  removeFromWishlist: (id: number) => void;
  isInWishlist: (id: number) => boolean;
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      wishlistItems: [],
      addToWishlist: (book) =>
        set((state) => ({
          wishlistItems: [...state.wishlistItems, book],
        })),
      removeFromWishlist: (id) =>
        set((state) => ({
          wishlistItems: state.wishlistItems.filter((item) => item.id !== id),
        })),
      isInWishlist: (id) => get().wishlistItems.some((item) => item.id === id),
    }),
    {
      name: 'wishlist-storage',
    }
  )
);