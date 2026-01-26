// Gerencia o estado global de loading da aplicação

import { StateCreator } from 'zustand';

export interface LoadingSlice {
  isLoading: boolean;
  loadingMessage: string | null;
  setLoading: (isLoading: boolean, message?: string) => void;
}

export const createLoadingSlice: StateCreator<
  LoadingSlice,
  [],
  [],
  LoadingSlice
> = (set) => ({
  isLoading: false,
  loadingMessage: null,
  
  setLoading: (isLoading: boolean, message?: string) => {
    set({
      isLoading,
      loadingMessage: message || null,
    });
  },
});
