/**
 * Constantes e configurações da aplicação
 * Define tipos de transação e categorias sugeridas
 */

import { Ionicons } from '@expo/vector-icons';
import { TransactionType } from '../types';
import { TRANSACTION_ICONS } from './icons';
import { TRANSACTION_COLORS } from './colors';

// ============================================================================
// TIPOS DE TRANSAÇÃO
// ============================================================================

/** Lista de todos os tipos de transação disponíveis */
export const TRANSACTION_TYPES: TransactionType[] = [
  'DEPOSIT',
  'WITHDRAWAL',
  'TRANSFER',
  'PAYMENT',
  'INVESTMENT',
];

/** Labels amigáveis para cada tipo de transação */
export const TRANSACTION_LABELS: Record<TransactionType, string> = {
  DEPOSIT: 'Depósito',
  WITHDRAWAL: 'Saque',
  TRANSFER: 'Transferência',
  PAYMENT: 'Pagamento',
  INVESTMENT: 'Investimento',
};

/** Descrições para cada tipo de transação */
export const TRANSACTION_DESCRIPTIONS: Record<TransactionType, string> = {
  DEPOSIT: 'Receitas e entradas',
  WITHDRAWAL: 'Retiradas em dinheiro',
  TRANSFER: 'Transferências e PIX',
  PAYMENT: 'Contas e pagamentos',
  INVESTMENT: 'Aplicações financeiras',
};

/**
 * Configuração completa dos tipos de transação
 * Objeto gerado dinamicamente combinando ícones, cores, labels e descrições
 */
export const TRANSACTION_TYPE_CONFIG = TRANSACTION_TYPES.reduce((config, type) => {
  config[type] = {
    label: TRANSACTION_LABELS[type],
    icon: TRANSACTION_ICONS[type],
    color: TRANSACTION_COLORS[type],
    description: TRANSACTION_DESCRIPTIONS[type],
  };
  return config;
}, {} as Record<TransactionType, {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  description: string;
}>);

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

// Retorna a configuração completa de um tipo de transação
export function getTransactionConfig(type: TransactionType) {
  return TRANSACTION_TYPE_CONFIG[type];
}

// Verifica se uma string é um tipo de transação válido
export function isValidTransactionType(value: unknown): value is TransactionType {
  return typeof value === 'string' && TRANSACTION_TYPES.includes(value as TransactionType);
}

// Retorna a label de um tipo de transação
export function getTransactionLabel(type: TransactionType): string {
  return TRANSACTION_LABELS[type] || type;
}

// Retorna a descrição de um tipo de transação
export function getTransactionDescription(type: TransactionType): string {
  return TRANSACTION_DESCRIPTIONS[type] || '';
}

// Retorna categorias sugeridas para um tipo específico de transação
export function getSuggestedCategories(type: TransactionType): string[] {
  return SUGGESTED_CATEGORIES[type] || [];
}

// Retorna todas as categorias sugeridas de todos os tipos (sem duplicatas)
export function getAllSuggestedCategories(): string[] {
  return Array.from(
    new Set(
      Object.values(SUGGESTED_CATEGORIES).flat()
    )
  ).sort();
}