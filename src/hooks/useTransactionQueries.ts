import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { container } from '../di/container';
import { Transaction } from '../domain/entities/Transaction';
import { CreateTransactionUseCase } from '../domain/usecases/transaction/CreateTransactionUseCase';
import { DeleteTransactionUseCase } from '../domain/usecases/transaction/DeleteTransactionUseCase';
import { GetAllTransactionsUseCase } from '../domain/usecases/transaction/GetAllTransactionsUseCase';
import { GetFinancialSummaryUseCase } from '../domain/usecases/transaction/GetFinancialSummaryUseCase';
import { UpdateTransactionUseCase } from '../domain/usecases/transaction/UpdateTransactionUseCase';
import { useAuth } from './useAuth';

/**
 * Hook para buscar transações com cache
 *
 * Features:
 * - Cache automático de 5 minutos
 * - Refetch ao focar no app
 * - Refetch ao reconectar internet
 */
export function useTransactions() {
  const { user } = useAuth();
  const getAllTransactionsUseCase = container.get<GetAllTransactionsUseCase>(
    'GetAllTransactionsUseCase'
  );

  return useQuery({
    queryKey: ['transactions', user?.id],
    queryFn: () => {
      if (!user?.id) throw new Error('User not authenticated');
      return getAllTransactionsUseCase.execute(user.id);
    },
    enabled: !!user?.id, // Só executa se tiver usuário autenticado
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para criar transação com optimistic update
 *
 * Optimistic update: UI atualiza ANTES da resposta do servidor
 * Se der erro, faz rollback automático
 */
export function useCreateTransaction() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const createTransactionUseCase = container.get<CreateTransactionUseCase>(
    'CreateTransactionUseCase'
  );

  return useMutation({
    mutationFn: (data: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
      if (!user?.id) throw new Error('User not authenticated');
      return createTransactionUseCase.execute({ ...data, userId: user.id });
    },

    // Optimistic update: atualiza UI antes da resposta
    onMutate: async (newTransaction) => {
      // Cancela refetch automático
      await queryClient.cancelQueries({ queryKey: ['transactions', user?.id] });

      // Salva estado anterior (para rollback)
      const previousTransactions = queryClient.getQueryData<Transaction[]>([
        'transactions',
        user?.id,
      ]);

      // Atualiza cache otimisticamente
      queryClient.setQueryData<Transaction[]>(['transactions', user?.id], (old = []) => [
        {
          id: `temp-${Date.now()}`,
          ...newTransaction,
          userId: user?.id || '',
          createdAt: new Date(),
          updatedAt: new Date(),
        } as Transaction,
        ...old,
      ]);

      return { previousTransactions };
    },

    // Se der erro, faz rollback
    onError: (err, newTransaction, context: any) => {
      if (context?.previousTransactions) {
        queryClient.setQueryData(['transactions', user?.id], context.previousTransactions);
      }
    },

    // Sempre invalida após conclusão (sucesso ou erro)
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', user?.id] });
    },
  });
}

/**
 * Hook para atualizar transação com optimistic update
 */
export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const updateTransactionUseCase = container.get<UpdateTransactionUseCase>(
    'UpdateTransactionUseCase'
  );

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<Transaction, 'id' | 'userId' | 'createdAt'>>;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');
      return updateTransactionUseCase.execute(user.id, id, data);
    },

    // Optimistic update
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['transactions', user?.id] });

      const previousTransactions = queryClient.getQueryData<Transaction[]>([
        'transactions',
        user?.id,
      ]);

      queryClient.setQueryData<Transaction[]>(['transactions', user?.id], (old = []) =>
        old.map((t) => (t.id === id ? { ...t, ...data, updatedAt: new Date() } : t))
      );

      return { previousTransactions };
    },

    onError: (err, variables, context: any) => {
      if (context?.previousTransactions) {
        queryClient.setQueryData(['transactions', user?.id], context.previousTransactions);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', user?.id] });
    },
  });
}

/**
 * Hook para deletar transação com optimistic update
 */
export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const deleteTransactionUseCase = container.get<DeleteTransactionUseCase>(
    'DeleteTransactionUseCase'
  );

  return useMutation({
    mutationFn: (transactionId: string) => {
      if (!user?.id) throw new Error('User not authenticated');
      return deleteTransactionUseCase.execute(transactionId);
    },

    // Optimistic update: remove da UI imediatamente
    onMutate: async (transactionId) => {
      await queryClient.cancelQueries({ queryKey: ['transactions', user?.id] });

      const previousTransactions = queryClient.getQueryData<Transaction[]>([
        'transactions',
        user?.id,
      ]);

      queryClient.setQueryData<Transaction[]>(['transactions', user?.id], (old = []) =>
        old.filter((t) => t.id !== transactionId)
      );

      return { previousTransactions };
    },

    onError: (err, transactionId, context: any) => {
      if (context?.previousTransactions) {
        queryClient.setQueryData(['transactions', user?.id], context.previousTransactions);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', user?.id] });
    },
  });
}

/**
 * Hook para calcular summary financeiro com cache
 * Usa dados das transações já em cache
 */
export function useFinancialSummary() {
  const { user } = useAuth();
  const getFinancialSummaryUseCase = container.get<GetFinancialSummaryUseCase>(
    'GetFinancialSummaryUseCase'
  );

  return useQuery({
    queryKey: ['financial-summary', user?.id],
    queryFn: () => {
      if (!user?.id) throw new Error('User not authenticated');
      return getFinancialSummaryUseCase.execute(user.id);
    },
    enabled: !!user?.id,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
}
