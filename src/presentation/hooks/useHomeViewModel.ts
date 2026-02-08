import { useEffect } from 'react';
import { container } from '../../di/container';
import { GetAllTransactionsUseCase } from '../../domain/usecases/transaction/GetAllTransactionsUseCase';
import { GetFinancialSummaryUseCase } from '../../domain/usecases/transaction/GetFinancialSummaryUseCase';
import { authSelectors } from '../../state/selectors/authSelectors';
import { transactionSelectors } from '../../state/selectors/transactionSelectors';
import { useStore } from '../../state/store';

export const useHomeViewModel = () => {
  const user = useStore(authSelectors.user);
  const transactions = useStore(transactionSelectors.transactions);
  const summary = useStore(transactionSelectors.summary);
  const isLoading = useStore(transactionSelectors.isLoading);
  const error = useStore(transactionSelectors.error);

  const setLoading = useStore((state) => state.setLoading);
  const setError = useStore((state) => state.setError);
  const setTransactions = useStore((state) => state.setTransactions);
  const setSummary = useStore((state) => state.setSummary);
  const clearError = useStore((state) => state.clearError);

  const getAllTransactionsUseCase = container.get<GetAllTransactionsUseCase>('GetAllTransactionsUseCase');
  const getFinancialSummaryUseCase = container.get<GetFinancialSummaryUseCase>('GetFinancialSummaryUseCase');

  // Carrega dados automaticamente quando o usuário muda
  useEffect(() => {
    if (user?.id) {
      loadDashboardData();
    }
  }, [user?.id]);

  const loadDashboardData = async () => {
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
      const errorMessage = err?.message || 'Erro ao carregar dados do dashboard';
      setError(errorMessage);
      console.error('Erro ao carregar dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshDashboard = async () => {
    await loadDashboardData();
  };

  // Transações recentes (últimas 5)
  const recentTransactions = transactionSelectors.recentTransactions(
    { transactions, summary, isLoading, error, lastUpdated: null } as any,
    5
  );

  return {
    user,
    transactions,
    recentTransactions,
    summary,
    balance: summary.balance,
    income: summary.totalIncome,
    expenses: summary.totalExpense,
    isLoading,
    error,
    loadDashboardData,
    refreshDashboard,
    clearError,
  };
};
