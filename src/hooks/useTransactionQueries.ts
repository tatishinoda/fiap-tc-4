import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth';
import * as TransactionService from '../../services/TransactionService';
import { Transaction } from '../../types';

/**
 * Hook para buscar transações com cache
 *
 * Features:
 * - Cache automático de 5 minutos
 * - Refetch ao focar no app
 * - Loading e error states
 * - Sincronização automática
 */
export function useTransactions() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['transactions', user?.id],
    queryFn: () => {
      if (!user?.id) throw new Error('Usuário não autenticado');
      return TransactionService.getAllTransactions(user.id);
    },
    enabled: !!user?.id, // Só executa se tiver usuário
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para buscar transações paginadas com cache
 */
export function useTransactionsPaginated(pageSize: number = 10) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['transactions-paginated', user?.id, pageSize],
    queryFn: () => {
      if (!user?.id) throw new Error('Usuário não autenticado');
      return TransactionService.getTransactionsPaginated(user.id, pageSize);
    },
    enabled: !!user?.id,
    staleTime: 3 * 60 * 1000, // 3 minutos
  });
}

/**
 * Hook para criar transação com invalidação automática do cache
 */
export function useCreateTransaction() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (data: TransactionService.CreateTransactionData) =>
      TransactionService.createTransaction(data),

    // Optimistic update: atualiza UI antes da resposta do servidor
    onMutate: async (newTransaction) => {
      // Cancela queries em andamento
      await queryClient.cancelQueries({ queryKey: ['transactions', user?.id] });

      // Salva snapshot do cache anterior
      const previousTransactions = queryClient.getQueryData<Transaction[]>([
        'transactions',
        user?.id,
      ]);

      // Atualiza cache otimisticamente
      if (previousTransactions) {
        const tempTransaction: Transaction = {
          id: 'temp-' + Date.now(),
          ...newTransaction,
          date: new Date(newTransaction.date),
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        queryClient.setQueryData<Transaction[]>(
          ['transactions', user?.id],
          [tempTransaction, ...previousTransactions]
        );
      }

      return { previousTransactions };
    },

    // Se der erro, restaura cache anterior
    onError: (err, newTransaction, context) => {
      if (context?.previousTransactions) {
        queryClient.setQueryData(
          ['transactions', user?.id],
          context.previousTransactions
        );
      }
    },

    // Sempre invalida queries após sucesso ou erro
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', user?.id] });
    },
  });
}

/**
 * Hook para atualizar transação
 */
export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: TransactionService.UpdateTransactionData;
    }) => TransactionService.updateTransaction(id, data),

    onSuccess: () => {
      // Invalida cache após sucesso
      queryClient.invalidateQueries({ queryKey: ['transactions', user?.id] });
    },
  });
}

/**
 * Hook para deletar transação
 */
export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (id: string) => TransactionService.deleteTransaction(id),

    // Optimistic update: remove da UI imediatamente
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ['transactions', user?.id] });

      const previousTransactions = queryClient.getQueryData<Transaction[]>([
        'transactions',
        user?.id,
      ]);

      if (previousTransactions) {
        queryClient.setQueryData<Transaction[]>(
          ['transactions', user?.id],
          previousTransactions.filter((t) => t.id !== deletedId)
        );
      }

      return { previousTransactions };
    },

    onError: (err, deletedId, context) => {
      if (context?.previousTransactions) {
        queryClient.setQueryData(
          ['transactions', user?.id],
          context.previousTransactions
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', user?.id] });
    },
  });
}

/**
 * Hook para cálculos financeiros com cache
 */
export function useFinancialSummary() {
  const { data: transactions, isLoading } = useTransactions();

  return useQuery({
    queryKey: ['financial-summary', transactions?.length],
    queryFn: () => {
      if (!transactions) return { balance: 0, income: 0, expenses: 0 };

      const income = transactions
        .filter((t) => t.type === 'DEPOSIT')
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = transactions
        .filter((t) =>
          ['WITHDRAWAL', 'PAYMENT', 'TRANSFER', 'INVESTMENT'].includes(t.type)
        )
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        balance: income - expenses,
        income,
        expenses,
      };
    },
    enabled: !isLoading && !!transactions,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
}
