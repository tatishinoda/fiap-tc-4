/**
 * Configuração centralizada de ícones da aplicação
 * Responsável por toda a lógica visual de ícones
 * Ícones disponíveis: https://icons.expo.fyi/Index/Ionicons
 */

import { Ionicons } from '@expo/vector-icons';
import { TransactionType } from '../types';

// ============================================================================
// TIPOS DE TRANSAÇÃO
// ============================================================================

/** Mapa de ícones por tipo de transação */
export const TRANSACTION_ICONS: Record<TransactionType, keyof typeof Ionicons.glyphMap> = {
  DEPOSIT: 'arrow-down',
  WITHDRAWAL: 'cash-outline',
  TRANSFER: 'swap-horizontal',
  PAYMENT: 'card-outline',
  INVESTMENT: 'trending-up',
};

// ============================================================================
// NAVEGAÇÃO (TABS)
// ============================================================================

/** Ícones de navegação com estados focused/unfocused */
export const NAVIGATION_ICONS = {
  home: {
    focused: 'home' as keyof typeof Ionicons.glyphMap,
    unfocused: 'home-outline' as keyof typeof Ionicons.glyphMap,
  },
  transactions: {
    focused: 'receipt' as keyof typeof Ionicons.glyphMap,
    unfocused: 'receipt-outline' as keyof typeof Ionicons.glyphMap,
  },
} as const;

// ============================================================================
// INSIGHTS FINANCEIROS
// ============================================================================

/** Ícones usados nos cards de insights financeiros */
export const INSIGHT_ICONS = {
  savingsRate: 'trending-up' as keyof typeof Ionicons.glyphMap,
  financialHealth: 'heart' as keyof typeof Ionicons.glyphMap,
  avgExpense: 'analytics' as keyof typeof Ionicons.glyphMap,
  totalTransactions: 'receipt' as keyof typeof Ionicons.glyphMap,
  pieChart: 'pie-chart-outline' as keyof typeof Ionicons.glyphMap,
} as const;

// ============================================================================
// AÇÕES DO USUÁRIO
// ============================================================================

/** Ícones de ações (botões, comandos) */
export const ACTION_ICONS = {
  logout: 'log-out-outline' as keyof typeof Ionicons.glyphMap,
  add: 'add-circle' as keyof typeof Ionicons.glyphMap,
  edit: 'create-outline' as keyof typeof Ionicons.glyphMap,
  delete: 'trash-outline' as keyof typeof Ionicons.glyphMap,
  filter: 'funnel-outline' as keyof typeof Ionicons.glyphMap,
  search: 'search-outline' as keyof typeof Ionicons.glyphMap,
  close: 'close' as keyof typeof Ionicons.glyphMap,
  check: 'checkmark' as keyof typeof Ionicons.glyphMap,
} as const;

// ============================================================================
// ESTADOS E FEEDBACK
// ============================================================================

/** Ícones para estados e feedback visual */
export const STATUS_ICONS = {
  success: 'checkmark-circle' as keyof typeof Ionicons.glyphMap,
  error: 'close-circle' as keyof typeof Ionicons.glyphMap,
  warning: 'warning' as keyof typeof Ionicons.glyphMap,
  info: 'information-circle' as keyof typeof Ionicons.glyphMap,
  loading: 'hourglass-outline' as keyof typeof Ionicons.glyphMap,
} as const;

// ============================================================================
// FUNÇÕES
// ============================================================================

// Retorna o ícone para um tipo de transação
export function getTransactionIcon(type: TransactionType): keyof typeof Ionicons.glyphMap {
  return TRANSACTION_ICONS[type] || 'receipt-outline';
}

// Retorna o ícone de navegação baseado no estado
export function getNavigationIcon(
  screen: keyof typeof NAVIGATION_ICONS,
  focused: boolean
): keyof typeof Ionicons.glyphMap {
  const icons = NAVIGATION_ICONS[screen];
  return focused ? icons.focused : icons.unfocused;
}
