
import { create } from 'zustand';

type signInStore = {
  isSignin: boolean;
  setIsSignin: (value: boolean) => void;
};

export const useSigninStore = create<signInStore>((set) => ({
  isSignin: false, // default value
  setIsSignin: (value: boolean) => set({ isSignin: value }),
}));
