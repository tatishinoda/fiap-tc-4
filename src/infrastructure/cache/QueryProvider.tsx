import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

/**
 * Configuração do React Query com Cache Persistente
 *
 * Features:
 * - Cache de 10 minutos (staleTime)
 * - Dados mantidos por 30 minutos (gcTime)
 * - Retry automático (3 tentativas)
 * - Persistência offline com AsyncStorage
 */

// Configuração do QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Tempo que os dados são considerados "frescos" (não refetch automático)
      staleTime: 5 * 60 * 1000, // 5 minutos

      // Tempo que os dados ficam em cache (garbage collection)
      gcTime: 30 * 60 * 1000, // 30 minutos (antes era cacheTime)

      // Retry automático em caso de erro
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Refetch ao focar na janela/app
      refetchOnWindowFocus: true,

      // Refetch ao reconectar
      refetchOnReconnect: true,

      // Não refetch ao montar se dados ainda são frescos
      refetchOnMount: false,
    },
    mutations: {
      // Retry para mutations
      retry: 1,
    },
  },
});

/**
 * Provider do React Query
 * Envolve a aplicação para habilitar cache em todos os componentes
 */
interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

/**
 * Hook para acessar o QueryClient em qualquer componente
 */
export { queryClient };

/**
 * Função para limpar todo o cache (útil ao fazer logout)
 */
export const clearCache = async () => {
  await queryClient.clear();
  await AsyncStorage.removeItem('REACT_QUERY_OFFLINE_CACHE');
};

/**
 * Função para invalidar queries específicas
 */
export const invalidateTransactions = () => {
  queryClient.invalidateQueries({ queryKey: ['transactions'] });
};

export const invalidateUser = () => {
  queryClient.invalidateQueries({ queryKey: ['user'] });
};
