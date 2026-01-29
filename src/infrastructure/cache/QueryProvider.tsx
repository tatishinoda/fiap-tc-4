import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { ReactNode } from 'react';

/**
 * Configuração do QueryClient para cache global
 *
 * Features:
 * - Cache de 5 minutos (staleTime)
 * - Dados mantidos por 30 minutos em memória (gcTime)
 * - Retry automático com 3 tentativas
 * - Refetch ao focar no app
 * - Refetch ao reconectar internet
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos - dados considerados "frescos"
      gcTime: 30 * 60 * 1000, // 30 minutos - tempo de garbage collection
      retry: 3, // 3 tentativas em caso de erro
      refetchOnWindowFocus: true, // Refetch ao focar no app
      refetchOnReconnect: true, // Refetch ao reconectar internet
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Delay exponencial
    },
    mutations: {
      retry: 1, // Apenas 1 retry para mutations
      retryDelay: 1000,
    },
  },
});

interface QueryProviderProps {
  children: ReactNode;
}

/**
 * Provider para React Query
 * Deve ser o provider mais externo da aplicação
 */
export function QueryProvider({ children }: QueryProviderProps) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

/**
 * Função para limpar todo o cache
 * Útil ao fazer logout
 */
export const clearCache = async () => {
  await queryClient.clear();
  console.log('✅ Cache limpo');
};

/**
 * Função para invalidar queries de transações
 * Força refetch da próxima vez que for acessado
 */
export const invalidateTransactions = (userId?: string) => {
  queryClient.invalidateQueries({ queryKey: ['transactions', userId] });
};
