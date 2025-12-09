/**
 * Transaction Store - Gerenciamento de estado de transações
 */

import { create } from 'zustand';
import { Transaction } from '../types';

interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

interface TransactionState {
  // State
  transactions: Transaction[];
  summary: FinancialSummary;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;

  // Actions
  setTransactions: (transactions: Transaction[]) => void;
  setSummary: (summary: FinancialSummary) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  removeTransaction: (id: string) => void;
  clearTransactions: () => void;
  clearError: () => void;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  // Initial state
  transactions: [],
  summary: {
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  },
  isLoading: false,
  error: null,
  lastUpdated: null,

  // Actions
  setTransactions: (transactions) =>
    set({
      transactions,
      lastUpdated: new Date(),
      error: null,
    }),

  setSummary: (summary) =>
    set({
      summary,
      error: null,
    }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error, isLoading: false }),

  clearError: () => set({ error: null }),

  // Adiciona uma transação
  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions],
      lastUpdated: new Date(),
    })),

  // Atualiza uma transação existente
  updateTransaction: (id, updatedData) =>
    set((state) => ({
      transactions: state.transactions.map((t) =>
        t.id === id ? { ...t, ...updatedData } : t
      ),
      lastUpdated: new Date(),
    })),

  // Remove uma transação
  removeTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
      lastUpdated: new Date(),
    })),

  // Limpa todas as transações (útil no logout)
  clearTransactions: () =>
    set({
      transactions: [],
      summary: {
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
      },
      lastUpdated: null,
      error: null,
    }),
}));
