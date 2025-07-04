// store/useUserStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type UserStore = {
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      isAdmin: false,
      setIsAdmin: (value: boolean) => set({ isAdmin: value }),
    }),
    {
      name: 'user-store', // key in localStorage
    }
  )
);
