import React, { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { TransactionProvider } from './TransactionContext';
import { AppProvider } from './AppContext';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Provider unificado que agrupa todos os Context Providers da aplicação.
 * Ordem de encapsulamento:
 * 1. AppProvider - Configurações globais da aplicação (tema, loading, etc.)
 * 2. AuthProvider - Autenticação e gerenciamento de usuário
 * 3. TransactionProvider - Gerenciamento de transações (requer autenticação)
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AppProvider>
      <AuthProvider>
        <TransactionProvider>
          {children}
        </TransactionProvider>
      </AuthProvider>
    </AppProvider>
  );
}
