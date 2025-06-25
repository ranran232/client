// store/useUserStore.ts
import { create } from 'zustand';

type UserStore = {
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  isAdmin: false, // default value
  setIsAdmin: (value: boolean) => set({ isAdmin: value }),
}));
