/**
 * Auth Store - Gerenciamento de estado de autenticação
 * Integrado com AuthContext para compatibilidade
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

interface User {
  id: string;
  email: string;
  name?: string;
  createdAt?: Date;
}

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Setters
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // Login - Salva token no SecureStore e user no state
      login: async (user, token) => {
        try {
          // Salva token de forma segura
          await SecureStore.setItemAsync('userToken', token);
          
          // Atualiza state
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          console.error('[AuthStore] Error saving token:', error);
          set({ error: 'Erro ao salvar credenciais' });
        }
      },

      // Logout - Remove token e limpa state
      logout: async () => {
        try {
          // Remove token seguro
          await SecureStore.deleteItemAsync('userToken');
          
          // Limpa state
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          console.error('[AuthStore] Error removing token:', error);
        }
      },
    }),
    {
      name: 'bytebank-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Não persiste o token no AsyncStorage por segurança
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Helper para obter o token (usado pelo API client)
export const getAuthToken = (): string | null => {
  return useAuthStore.getState().token;
};
