import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useAppStore } from '../store/app.store';
import { ColorScheme } from '../theme';

export interface AppContextType {
  // Tema
  theme: ColorScheme;
  toggleTheme: () => void;
  setTheme: (theme: ColorScheme) => void;
  
  // Loading global
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  
  // Notificações
  showNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
  notification: Notification | null;
  clearNotification: () => void;
  
  // Configurações
  language: string;
  setLanguage: (language: string) => void;
  currency: string;
  setCurrency: (currency: string) => void;
  
  // Estado da aplicação
  isOnline: boolean;
  setOnlineStatus: (status: boolean) => void;
}

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
  timestamp: number;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const appStore = useAppStore();
  const [notification, setNotification] = useState<Notification | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  // Auto-clear notification após 5 segundos
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  const toggleTheme = useCallback(() => {
    appStore.toggleColorScheme();
  }, [appStore]);

  const setTheme = useCallback((theme: ColorScheme) => {
    appStore.setColorScheme(theme);
  }, [appStore]);

  const setLoading = useCallback((loading: boolean) => {
    // TODO: Implementar loading global no store
    console.log('Setting loading:', loading);
  }, []);

  const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({
      message,
      type,
      timestamp: Date.now(),
    });
  }, []);

  const clearNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const setLanguage = useCallback((language: string) => {
    // Implementar lógica de mudança de idioma
    console.log('Mudando idioma para:', language);
  }, []);

  const setCurrency = useCallback((currency: string) => {
    // Implementar lógica de mudança de moeda
    console.log('Mudando moeda para:', currency);
  }, []);

  const setOnlineStatus = useCallback((status: boolean) => {
    setIsOnline(status);
  }, []);

  const value: AppContextType = {
    theme: appStore.colorScheme,
    toggleTheme,
    setTheme,
    isLoading: false, // TODO: Implementar loading global no store
    setLoading,
    showNotification,
    notification,
    clearNotification,
    language: 'pt-BR', // TODO: Implementar persistência
    setLanguage,
    currency: 'BRL', // TODO: Implementar persistência
    setCurrency,
    isOnline,
    setOnlineStatus,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Hook personalizado para usar o AppContext
export function useAppContext() {
  const context = useContext(AppContext);
  
  if (context === undefined) {
    throw new Error('useAppContext deve ser usado dentro de um AppProvider');
  }
  
  return context;
}
