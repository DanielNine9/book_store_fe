import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';


interface AuthStore {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: 'customer') => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuth = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      loading: true,
      signIn: async (email, password) => {
        
      },
      signUp: async (email, password, role) => {
        
      },
      signOut: async () => {
      
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);