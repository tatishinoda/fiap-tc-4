/**
 * Transaction API - Chamadas de transações
 */

import apiClient from './client';
import { TRANSACTION_ENDPOINTS } from './endpoints';
import { Transaction } from '../types';

export interface CreateTransactionRequest {
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  description: string;
  category: string;
  date: Date | string;
}

export interface UpdateTransactionRequest extends Partial<CreateTransactionRequest> {}

export interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

/**
 * Lista todas as transações do usuário
 */
export const getAllTransactions = async (
  userId: string,
  limit?: number
): Promise<Transaction[]> => {
  const response = await apiClient.get<Transaction[]>(TRANSACTION_ENDPOINTS.LIST, {
    params: { userId, limit },
  });
  return response.data;
};

/**
 * Cria uma nova transação
 */
export const createTransaction = async (
  data: CreateTransactionRequest
): Promise<Transaction> => {
  const response = await apiClient.post<Transaction>(TRANSACTION_ENDPOINTS.CREATE, data);
  return response.data;
};

/**
 * Atualiza uma transação existente
 */
export const updateTransaction = async (
  id: string,
  data: UpdateTransactionRequest
): Promise<Transaction> => {
  const response = await apiClient.put<Transaction>(
    TRANSACTION_ENDPOINTS.UPDATE(id),
    data
  );
  return response.data;
};

/**
 * Deleta uma transação
 */
export const deleteTransaction = async (id: string): Promise<void> => {
  await apiClient.delete(TRANSACTION_ENDPOINTS.DELETE(id));
};

/**
 * Busca o resumo financeiro do usuário
 */
export const getFinancialSummary = async (
  userId: string
): Promise<TransactionSummary> => {
  const response = await apiClient.get<TransactionSummary>(
    TRANSACTION_ENDPOINTS.SUMMARY,
    {
      params: { userId },
    }
  );
  return response.data;
};
