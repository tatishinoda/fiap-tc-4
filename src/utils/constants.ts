/**
 * Constantes e configurações da aplicação
 * Define tipos de transação, categorias sugeridas e configurações relacionadas
 */

import { Ionicons } from '@expo/vector-icons';
import { TransactionType } from '../types';

// ============================================================================
// CONFIGURAÇÃO DE TIPOS DE TRANSAÇÃO
// ============================================================================

/** Configuração completa dos tipos de transação (label, ícone, cor, descrição) */
export const TRANSACTION_TYPE_CONFIG: Record<
  TransactionType,
  {
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    description: string;
  }
> = {
  DEPOSIT: {
    label: 'Depósito',
    icon: 'arrow-down-circle',
    color: '#00D4AA',
    description: 'Receitas e entradas',
  },
  WITHDRAWAL: {
    label: 'Saque',
    icon: 'cash-outline',
    color: '#FF8C42',
    description: 'Retiradas em dinheiro',
  },
  TRANSFER: {
    label: 'Transferência',
    icon: 'swap-horizontal',
    color: '#4A90E2',
    description: 'Transferências e PIX',
  },
  PAYMENT: {
    label: 'Pagamento',
    icon: 'card-outline',
    color: '#FF6B6B',
    description: 'Contas e pagamentos',
  },
  INVESTMENT: {
    label: 'Investimento',
    icon: 'trending-up',
    color: '#9B59B6',
    description: 'Aplicações financeiras',
  },
};

// ============================================================================
// CATEGORIAS SUGERIDAS
// ============================================================================

/** Categorias sugeridas por tipo de transação */
export const SUGGESTED_CATEGORIES: Record<TransactionType, string[]> = {
  DEPOSIT: [
    'Salário',
    'Freelance',
    'Renda Extra',
    'Presente',
    'Reembolso',
    'Venda',
  ],
  WITHDRAWAL: [
    'Dinheiro',
    'Emergência',
    'Outros',
  ],
  TRANSFER: [
    'Transferência',
    'PIX',
    'DOC/TED',
    'Entre contas',
  ],
  PAYMENT: [
    'Alimentação',
    'Transporte',
    'Saúde',
    'Educação',
    'Lazer',
    'Compras',
    'Conta de Luz',
    'Conta de Água',
    'Internet',
    'Aluguel',
    'Telefone',
  ],
  INVESTMENT: [
    'Ações',
    'Tesouro Direto',
    'Poupança',
    'Fundos',
    'CDB',
    'LCI/LCA',
  ],
};

// ============================================================================
// FUNÇÕES AUXILIARES
// ============================================================================

/** Lista de todos os tipos de transação disponíveis */
export const TRANSACTION_TYPES = Object.keys(TRANSACTION_TYPE_CONFIG) as TransactionType[];

// Obtém a configuração completa de um tipo de transação
export const getTransactionTypeConfig = (type: TransactionType) => {
  return TRANSACTION_TYPE_CONFIG[type];
};

// Obtém categorias sugeridas para um tipo específico de transação
export const getSuggestedCategories = (type: TransactionType): string[] => {
  return SUGGESTED_CATEGORIES[type] || [];
};
