// Gerenciamento de estado de transações usando Zustand

import { StateCreator } from 'zustand';
import { Transaction, FinancialSummary } from '../../domain/entities/Transaction';

export interface TransactionState {
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

export const createTransactionSlice: StateCreator<TransactionState> = (set) => ({
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

  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions],
      lastUpdated: new Date(),
    })),

  updateTransaction: (id, updatedData) =>
    set((state) => ({
      transactions: state.transactions.map((t) =>
        t.id === id ? { ...t, ...updatedData } : t
      ),
      lastUpdated: new Date(),
    })),

  removeTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
      lastUpdated: new Date(),
    })),

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
});
