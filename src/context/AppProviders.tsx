import React, { ReactNode } from 'react';
import { QueryProvider } from '../infrastructure/cache/QueryProvider';
import { AuthProvider } from './AuthContext';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Provider unificado que agrupa todos os Context Providers da aplicação.
 * Ordem de encapsulamento:
 * 1. QueryProvider - React Query para cache (mais externo)
 * 2. AuthProvider - Autenticação e gerenciamento de usuário
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryProvider>
  );
}
