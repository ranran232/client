
import { create } from 'zustand';

type loadingStore = {
loading: boolean;
  setLoading: (value: boolean) => void;
};

export const useLoadingStore = create<loadingStore>((set) => ({
  loading: true, // default value
  setLoading: (value: boolean) => set({ loading: value }),
}));
