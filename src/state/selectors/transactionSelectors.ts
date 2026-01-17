import { TransactionState } from '../slices/transactionSlice';

export const transactionSelectors = {
  // Selectors básicos
  transactions: (state: TransactionState) => state.transactions,
  summary: (state: TransactionState) => state.summary,
  isLoading: (state: TransactionState) => state.isLoading,
  error: (state: TransactionState) => state.error,
  lastUpdated: (state: TransactionState) => state.lastUpdated,

  // Selectors derivados
  totalIncome: (state: TransactionState) => state.summary.totalIncome,
  totalExpense: (state: TransactionState) => state.summary.totalExpense,
  balance: (state: TransactionState) => state.summary.balance,

  // Filtra transações por tipo
  transactionsByType: (state: TransactionState, type: string) =>
    state.transactions.filter((t) => t.type === type),

  // Busca transação por ID
  transactionById: (state: TransactionState, id: string) =>
    state.transactions.find((t) => t.id === id),

  // Transações recentes (últimas N)
  recentTransactions: (state: TransactionState, limit: number = 5) =>
    state.transactions.slice(0, limit),
};
