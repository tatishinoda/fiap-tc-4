// ViewModel para a tela de listagem de transações

import { useEffect } from 'react';
import { container } from '../../di/container';
import { DeleteTransactionUseCase } from '../../domain/usecases/transaction/DeleteTransactionUseCase';
import { GetAllTransactionsUseCase } from '../../domain/usecases/transaction/GetAllTransactionsUseCase';
import { GetFinancialSummaryUseCase } from '../../domain/usecases/transaction/GetFinancialSummaryUseCase';
import { GetPaginatedTransactionsUseCase } from '../../domain/usecases/transaction/GetPaginatedTransactionsUseCase';
import { authSelectors } from '../../state/selectors/authSelectors';
import { transactionSelectors } from '../../state/selectors/transactionSelectors';
import { useStore } from '../../state/store';

export const useTransactionsViewModel = () => {
  const user = useStore(authSelectors.user);
  const transactions = useStore(transactionSelectors.transactions);
  const summary = useStore(transactionSelectors.summary);
  const isLoading = useStore(transactionSelectors.isLoading);
  const error = useStore(transactionSelectors.error);

  const setLoading = useStore((state) => state.setLoading);
  const setError = useStore((state) => state.setError);
  const setTransactions = useStore((state) => state.setTransactions);
  const setSummary = useStore((state) => state.setSummary);
  const removeTransaction = useStore((state) => state.removeTransaction);
  const clearError = useStore((state) => state.clearError);

  const getAllTransactionsUseCase = container.get<GetAllTransactionsUseCase>('GetAllTransactionsUseCase');
  const getPaginatedTransactionsUseCase = container.get<GetPaginatedTransactionsUseCase>('GetPaginatedTransactionsUseCase');
  const deleteTransactionUseCase = container.get<DeleteTransactionUseCase>('DeleteTransactionUseCase');
  const getFinancialSummaryUseCase = container.get<GetFinancialSummaryUseCase>('GetFinancialSummaryUseCase');

  // Carrega transações automaticamente quando o usuário muda
  useEffect(() => {
    if (user?.id) {
      fetchTransactions();
    }
  }, [user?.id]);

  const fetchTransactions = async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const [transactionsData, summaryData] = await Promise.all([
        getAllTransactionsUseCase.execute(user.id),
        getFinancialSummaryUseCase.execute(user.id),
      ]);

      setTransactions(transactionsData);
      setSummary(summaryData);
    } catch (err: any) {
      const errorMessage = err?.message || 'Erro ao carregar transações';
      setError(errorMessage);
      console.error('Erro ao buscar transações:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    setLoading(true);
    setError(null);

    try {
      await deleteTransactionUseCase.execute(transactionId);
      removeTransaction(transactionId);

      // Atualiza o resumo após deletar
      if (user?.id) {
        const summaryData = await getFinancialSummaryUseCase.execute(user.id);
        setSummary(summaryData);
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Erro ao deletar transação';
      setError(errorMessage);
      console.error('Erro ao deletar transação:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refreshTransactions = async () => {
    await fetchTransactions();
  };

  // Funções de paginação para scroll infinito
  const fetchPaginatedTransactions = async (limit: number = 10, lastDoc?: any) => {
    if (!user?.id) return { transactions: [], lastDoc: null, hasMore: false };

    try {
      return await getPaginatedTransactionsUseCase.execute(user.id, limit, lastDoc);
    } catch (err: any) {
      console.error('Erro ao buscar transações paginadas:', err);
      throw err;
    }
  };

  // Buscar total de transações (apenas para contagem)
  const fetchTransactionCount = async () => {
    if (!user?.id) return 0;

    try {
      const allTransactions = await getAllTransactionsUseCase.execute(user.id);
      return allTransactions.length;
    } catch (err: any) {
      console.error('Erro ao buscar total de transações:', err);
      return 0;
    }
  };

  return {
    transactions,
    summary,
    isLoading,
    error,
    balance: summary.balance,
    income: summary.totalIncome,
    expenses: summary.totalExpense,
    fetchTransactions,
    fetchPaginatedTransactions,
    fetchTransactionCount,
    deleteTransaction: handleDeleteTransaction,
    refreshTransactions,
    clearError,
  };
};
