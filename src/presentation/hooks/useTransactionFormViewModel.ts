// ViewModel para a tela de formulário de transações (criar/editar)

import { useState } from 'react';
import { useStore } from '../../state/store';
import { authSelectors } from '../../state/selectors/authSelectors';
import { container } from '../../di/container';
import { CreateTransactionUseCase } from '../../domain/usecases/transaction/CreateTransactionUseCase';
import { UpdateTransactionUseCase } from '../../domain/usecases/transaction/UpdateTransactionUseCase';
import { GetFinancialSummaryUseCase } from '../../domain/usecases/transaction/GetFinancialSummaryUseCase';
import { CreateTransactionDTO, UpdateTransactionDTO } from '../../domain/repositories/ITransactionRepository';
import { TransactionFormData } from '../../types';
import { TransactionType } from '../../domain/entities/Transaction';

// Mapeia tipo do formulário para tipo da entidade
const mapFormTypeToEntityType = (formType: TransactionFormData['type']): TransactionType => {
  const typeMap: Record<TransactionFormData['type'], TransactionType> = {
    'income': 'DEPOSIT',
    'expense': 'WITHDRAWAL',
    'transfer': 'TRANSFER',
  };
  return typeMap[formType];
};

export const useTransactionFormViewModel = () => {
  const user = useStore(authSelectors.user);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addTransaction = useStore((state) => state.addTransaction);
  const updateTransactionInStore = useStore((state) => state.updateTransaction);
  const setSummary = useStore((state) => state.setSummary);

  const createTransactionUseCase = container.get<CreateTransactionUseCase>('CreateTransactionUseCase');
  const updateTransactionUseCase = container.get<UpdateTransactionUseCase>('UpdateTransactionUseCase');
  const getFinancialSummaryUseCase = container.get<GetFinancialSummaryUseCase>('GetFinancialSummaryUseCase');

  const createTransaction = async (data: Omit<CreateTransactionDTO, 'userId'>) => {
    if (!user?.id) {
      throw new Error('Usuário não autenticado');
    }

    setIsLoading(true);
    setError(null);

    try {
      const transactionData: CreateTransactionDTO = {
        ...data,
        userId: user.id,
      };

      const newTransaction = await createTransactionUseCase.execute(transactionData);
      addTransaction(newTransaction);

      // Atualiza o resumo financeiro
      const summaryData = await getFinancialSummaryUseCase.execute(user.id);
      setSummary(summaryData);

      return newTransaction;
    } catch (err: any) {
      const errorMessage = err?.message || 'Erro ao criar transação';
      setError(errorMessage);
      console.error('Erro ao criar transação:', err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTransaction = async (transactionId: string, data: UpdateTransactionDTO) => {
    if (!user?.id) {
      throw new Error('Usuário não autenticado');
    }

    setIsLoading(true);
    setError(null);

    try {
      await updateTransactionUseCase.execute(transactionId, user.id, data);
      updateTransactionInStore(transactionId, data);

      // Atualiza o resumo financeiro
      const summaryData = await getFinancialSummaryUseCase.execute(user.id);
      setSummary(summaryData);
    } catch (err: any) {
      const errorMessage = err?.message || 'Erro ao atualizar transação';
      setError(errorMessage);
      console.error('Erro ao atualizar transação:', err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  // Cria transação a partir de TransactionFormData
  const createTransactionFromForm = async (formData: TransactionFormData) => {
    const amount = parseFloat(formData.amount.replace(/[^\d,.-]/g, '').replace(',', '.'));
    
    const createDTO: Omit<CreateTransactionDTO, 'userId'> = {
      type: mapFormTypeToEntityType(formData.type),
      amount,
      description: formData.description,
      category: formData.category || undefined,
      date: formData.date,
    };

    return await createTransaction(createDTO);
  };

  // Atualiza transação a partir de TransactionFormData
  const updateTransactionFromForm = async (transactionId: string, formData: Partial<TransactionFormData>) => {
    const updateDTO: UpdateTransactionDTO = {};

    if (formData.type) {
      updateDTO.type = mapFormTypeToEntityType(formData.type);
    }
    
    if (formData.amount) {
      updateDTO.amount = parseFloat(formData.amount.replace(/[^\d,.-]/g, '').replace(',', '.'));
    }

    if (formData.description !== undefined) {
      updateDTO.description = formData.description;
    }

    if (formData.category !== undefined) {
      updateDTO.category = formData.category || undefined;
    }

    if (formData.date) {
      updateDTO.date = formData.date;
    }

    return await updateTransaction(transactionId, updateDTO);
  };

  return {
    isLoading,
    error,
    createTransaction,
    updateTransaction,
    createTransactionFromForm,
    updateTransactionFromForm,
    clearError,
  };
};
