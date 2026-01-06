/**
 * Utilitários de filtragem e ordenação de transações
 * Fornece filtros avançados, ordenação e extração de dados
 */

import { Transaction, TransactionType } from '../types';
import { FilterOptions } from '../components/AdvancedFiltersModal';

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

export type QuickFilterType = 'all' | 'income' | 'expense' | 'transfer';

interface FilterTransactionsParams {
  transactions: Transaction[];
  advancedFilters: FilterOptions;
  quickFilter?: QuickFilterType;
  searchQuery?: string;
}

// ============================================================================
// FILTRAGEM DE TRANSAÇÕES
// ============================================================================

// Aplica todos os filtros configurados em uma lista de transações
export function filterTransactions({
  transactions,
  advancedFilters,
  quickFilter = 'all',
  searchQuery = '',
}: FilterTransactionsParams): Transaction[] {
  let filtered = [...transactions];

  // Date range filters
  if (advancedFilters.dateFrom) {
    filtered = filtered.filter(t => {
      const transactionDate = t.date instanceof Date ? t.date : new Date(t.date);
      const fromDate = new Date(advancedFilters.dateFrom!);
      fromDate.setHours(0, 0, 0, 0);
      transactionDate.setHours(0, 0, 0, 0);
      return transactionDate >= fromDate;
    });
  }

  if (advancedFilters.dateTo) {
    filtered = filtered.filter(t => {
      const transactionDate = t.date instanceof Date ? t.date : new Date(t.date);
      const toDate = new Date(advancedFilters.dateTo!);
      toDate.setHours(23, 59, 59, 999);
      return transactionDate <= toDate;
    });
  }

  // Transaction type filters
  if (advancedFilters.types.length > 0) {
    filtered = filtered.filter(t => advancedFilters.types.includes(t.type));
  }

  // Category filters
  if (advancedFilters.categories.length > 0) {
    filtered = filtered.filter(t =>
      t.category && advancedFilters.categories.includes(t.category)
    );
  }

  // Amount range filters
  if (advancedFilters.amountMin !== '') {
    const minAmount = parseCurrencyToNumber(advancedFilters.amountMin);
    if (minAmount > 0) {
      filtered = filtered.filter(t => t.amount >= minAmount);
    }
  }

  if (advancedFilters.amountMax !== '') {
    const maxAmount = parseCurrencyToNumber(advancedFilters.amountMax);
    if (maxAmount > 0) {
      filtered = filtered.filter(t => t.amount <= maxAmount);
    }
  }

  // Quick filter by type
  if (quickFilter !== 'all') {
    if (quickFilter === 'income') {
      filtered = filtered.filter(t => t.type === 'DEPOSIT');
    } else if (quickFilter === 'expense') {
      filtered = filtered.filter(t => t.type !== 'DEPOSIT');
    } else if (quickFilter === 'transfer') {
      filtered = filtered.filter(t => t.type === 'TRANSFER');
    }
  }

  // Search filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(t =>
      t.description.toLowerCase().includes(query) ||
      (t.category && t.category.toLowerCase().includes(query))
    );
  }

  return filtered;
}

// ============================================================================
// ORDENAÇÃO DE TRANSAÇÕES
// ============================================================================

// Ordena transações baseado no critério especificado
export function sortTransactions(
  transactions: Transaction[],
  sortBy: FilterOptions['sortBy']
): Transaction[] {
  const sorted = [...transactions];

  switch (sortBy) {
    case 'date-desc':
      sorted.sort((a, b) => {
        const dateA = a.date instanceof Date ? a.date : new Date(a.date);
        const dateB = b.date instanceof Date ? b.date : new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      });
      break;
    case 'date-asc':
      sorted.sort((a, b) => {
        const dateA = a.date instanceof Date ? a.date : new Date(a.date);
        const dateB = b.date instanceof Date ? b.date : new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });
      break;
    case 'amount-desc':
      sorted.sort((a, b) => b.amount - a.amount);
      break;
    case 'amount-asc':
      sorted.sort((a, b) => a.amount - b.amount);
      break;
  }

  return sorted;
}

// ============================================================================
// UTILITÁRIOS DE FILTROS
// ============================================================================

// Verifica se há filtros avançados ativos
export function hasActiveFilters(filters: FilterOptions): boolean {
  return (
    filters.dateFrom !== null ||
    filters.dateTo !== null ||
    filters.categories.length > 0 ||
    filters.types.length > 0 ||
    filters.amountMin !== '' ||
    filters.amountMax !== '' ||
    filters.sortBy !== 'date-desc'
  );
}

// Extrai categorias únicas de uma lista de transações
export function extractCategories(transactions: Transaction[]): string[] {
  const categories = transactions
    .map(t => t.category)
    .filter((category): category is string => !!category && category.trim() !== '');
  return Array.from(new Set(categories)).sort();
}

// ============================================================================
// CONVERSÃO DE VALORES
// ============================================================================

// Converte string de moeda formatada para número em centavos
function parseCurrencyToNumber(formattedValue: string): number {
  const cleanValue = formattedValue.replace(/\D/g, '');
  return cleanValue ? parseInt(cleanValue) : 0;
}
