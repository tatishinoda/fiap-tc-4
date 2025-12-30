import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useTransactionStore } from '../store/transaction.store';
import * as TransactionService from '../services/TransactionService';
import { Transaction } from '../types';
import { useAuth } from '../hooks/useAuth';

export interface TransactionContextType {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  balance: number;
  income: number;
  expenses: number;
  
  fetchTransactions: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => Promise<void>;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  refreshTransactions: () => Promise<void>;
  clearError: () => void;
}

export const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

interface TransactionProviderProps {
  children: ReactNode;
}

export function TransactionProvider({ children }: TransactionProviderProps) {
  const transactionStore = useTransactionStore();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchTransactions();
    }
  }, [user?.id]);

  const fetchTransactions = useCallback(async () => {
    if (!user?.id) {
      console.log('Usuário não autenticado, não é possível buscar transações');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const transactions = await TransactionService.getAllTransactions(user.id);
      transactionStore.setTransactions(transactions);
    } catch (err: any) {
      const errorMessage = err?.message || 'Erro ao carregar transações';
      setError(errorMessage);
      console.error('Erro ao buscar transações:', err);
    } finally {
      setLoading(false);
    }
  }, [transactionStore, user?.id]);

  const addTransaction = useCallback(async (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    if (!user?.id) {
      throw new Error('Usuário não autenticado');
    }

    setLoading(true);
    setError(null);
    
    try {
      const transactionData: TransactionService.CreateTransactionData = {
        userId: user.id,
        type: transaction.type,
        amount: transaction.amount,
        date: transaction.date,
        description: transaction.description,
        category: transaction.category
      };
      
      const newTransaction = await TransactionService.createTransaction(transactionData);
      transactionStore.addTransaction(newTransaction);
    } catch (err: any) {
      const errorMessage = err?.message || 'Erro ao adicionar transação';
      setError(errorMessage);
      console.error('Erro ao adicionar transação:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [transactionStore, user?.id]);

  const updateTransaction = useCallback(async (id: string, transaction: Partial<Transaction>) => {
    if (!user?.id) {
      throw new Error('Usuário não autenticado');
    }

    setLoading(true);
    setError(null);
    
    try {
      const updateData: TransactionService.UpdateTransactionData = {
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description,
        category: transaction.category,
        date: transaction.date,
      };
      
      await TransactionService.updateTransaction(id, user.id, updateData);
      await fetchTransactions();
    } catch (err: any) {
      const errorMessage = err?.message || 'Erro ao atualizar transação';
      setError(errorMessage);
      console.error('Erro ao atualizar transação:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [transactionStore, user?.id, fetchTransactions]);

  const deleteTransaction = useCallback(async (id: string) => {
    if (!user?.id) {
      throw new Error('Usuário não autenticado');
    }

    setLoading(true);
    setError(null);
    
    try {
      await TransactionService.deleteTransaction(id);
      transactionStore.removeTransaction(id);
    } catch (err: any) {
      const errorMessage = err?.message || 'Erro ao deletar transação';
      setError(errorMessage);
      console.error('Erro ao deletar transação:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [transactionStore, user?.id]);

  const refreshTransactions = useCallback(async () => {
    await fetchTransactions();
  }, [fetchTransactions]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const balance = transactionStore.transactions.reduce((acc, t) => 
    acc + (t.type === 'DEPOSIT' ? t.amount : -t.amount), 0
  );

  const income = transactionStore.transactions
    .filter(t => t.type === 'DEPOSIT')
    .reduce((acc, t) => acc + t.amount, 0);

  const expenses = transactionStore.transactions
    .filter(t => t.type === 'WITHDRAWAL' || t.type === 'PAYMENT' || t.type === 'TRANSFER' || t.type === 'INVESTMENT')
    .reduce((acc, t) => acc + t.amount, 0);

  const value: TransactionContextType = {
    transactions: transactionStore.transactions,
    loading: loading || transactionStore.isLoading,
    error: error || transactionStore.error,
    balance,
    income,
    expenses,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refreshTransactions,
    clearError,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactionContext() {
  const context = useContext(TransactionContext);
  
  if (context === undefined) {
    throw new Error('useTransactionContext deve ser usado dentro de um TransactionProvider');
  }
  
  return context;
}
