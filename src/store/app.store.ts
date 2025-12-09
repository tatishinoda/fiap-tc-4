import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ColorScheme } from '../theme';

interface AppState {
  // Theme
  colorScheme: ColorScheme;
  isSystemTheme: boolean;
  
  // Actions
  setColorScheme: (scheme: ColorScheme) => void;
  toggleColorScheme: () => void;
  setSystemTheme: (useSystem: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state - Fixed to light theme
      colorScheme: 'light',
      isSystemTheme: false,

      // Actions (kept for compatibility)
      setColorScheme: (scheme) => set({ colorScheme: 'light' }),
      
      toggleColorScheme: () => set({ colorScheme: 'light' }),

      setSystemTheme: (useSystem) => set({ isSystemTheme: false }),
    }),
    {
      name: 'bytebank-app-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
