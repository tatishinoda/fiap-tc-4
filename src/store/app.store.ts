import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ColorScheme } from '../theme';

interface AppState {
  // Theme
  colorScheme: ColorScheme;
  isSystemTheme: boolean;
  
  // Loading global
  isGlobalLoading: boolean;
  loadingMessage?: string;
  
  // Actions
  setColorScheme: (scheme: ColorScheme) => void;
  toggleColorScheme: () => void;
  setSystemTheme: (useSystem: boolean) => void;
  setGlobalLoading: (loading: boolean, message?: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      colorScheme: 'light',
      isSystemTheme: false,
      isGlobalLoading: false,
      loadingMessage: undefined,

      setColorScheme: (scheme) => set({ colorScheme: 'light' }),
      
      toggleColorScheme: () => set({ colorScheme: 'light' }),

      setSystemTheme: (useSystem) => set({ isSystemTheme: false }),
      
      setGlobalLoading: (loading, message) => set({ 
        isGlobalLoading: loading,
        loadingMessage: message 
      }),
    }),
    {
      name: 'bytebank-app-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
