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
  loadingMessage?: string;
  setLoading: (loading: boolean, message?: string) => void;
  
  // Notificações
  showNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
  notification: Notification | null;
  clearNotification: () => void;
  
  // Configurações
  language: string;
  currency: string;
  
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

  const setLoading = useCallback((loading: boolean, message?: string) => {
    appStore.setGlobalLoading(loading, message);
  }, [appStore]);

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

  const setOnlineStatus = useCallback((status: boolean) => {
    setIsOnline(status);
  }, []);

  const value: AppContextType = {
    theme: appStore.colorScheme,
    toggleTheme,
    setTheme,
    isLoading: appStore.isGlobalLoading,
    loadingMessage: appStore.loadingMessage,
    setLoading,
    showNotification,
    notification,
    clearNotification,
    language: 'pt-BR',
    currency: 'BRL',
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
