import React, { ReactNode } from 'react';
import { QueryProvider } from '../infrastructure/cache/QueryProvider';
import { AppProvider } from './AppContext';
import { AuthProvider } from './AuthContext';
import { TransactionProvider } from './TransactionContext';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Provider unificado que agrupa todos os Context Providers da aplicação.
 * Ordem de encapsulamento:
 * 1. QueryProvider - React Query para cache e sincronização
 * 2. AppProvider - Configurações globais da aplicação (tema, loading, etc.)
 * 3. AuthProvider - Autenticação e gerenciamento de usuário
 * 4. TransactionProvider - Gerenciamento de transações (requer autenticação)
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <AppProvider>
        <AuthProvider>
          <TransactionProvider>
            {children}
          </TransactionProvider>
        </AuthProvider>
      </AppProvider>
    </QueryProvider>
  );
}
