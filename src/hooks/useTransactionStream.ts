import { useEffect, useState } from 'react';
import { Subject } from 'rxjs';
import { container } from '../di/container';
import { FinancialSummary, Transaction, TransactionType } from '../domain/entities/Transaction';
import { FirebaseTransactionRepository } from '../infrastructure/repositories/FirebaseTransactionRepository';
import { transactionStream } from '../infrastructure/streams/TransactionStream';
import { useAuth } from './useAuth';

/**
 * Hook para consumir o stream reativo de transações
 *
 * Features:
 * - Atualização em tempo real via Firestore onSnapshot
 * - Integração com RxJS streams
 * - Estado local sincronizado com Firebase
 * - Cleanup automático ao desmontar
 */
export function useTransactionStream() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    const repository = container.get<FirebaseTransactionRepository>(
      'FirebaseTransactionRepository'
    );

    // Inscreve no stream RxJS
    const streamSubscription = transactionStream.transactions$.subscribe((transactions) => {
      setTransactions(transactions);
    });

    const loadingSubscription = transactionStream.loading$.subscribe(setLoading);
    const errorSubscription = transactionStream.error$.subscribe(setError);

    // Inscreve no Firestore onSnapshot para atualizações em tempo real
    const unsubscribeFirestore = repository.subscribeToTransactions(
      user.id,
      (transactions) => {
        transactionStream.updateTransactions(transactions);
        transactionStream.setLoading(false);
      },
      (error) => {
        transactionStream.setError(error);
        transactionStream.setLoading(false);
      }
    );

    // Cleanup: cancela todas as inscrições ao desmontar
    return () => {
      streamSubscription.unsubscribe();
      loadingSubscription.unsubscribe();
      errorSubscription.unsubscribe();
      unsubscribeFirestore();
    };
  }, [user?.id]);

  return {
    transactions,
    loading,
    error,
  };
}

/**
 * Hook para filtrar transações por tipo reativamente
 */
export function useTransactionsByType(type: TransactionType) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const subscription = transactionStream.getTransactionsByType$(type).subscribe(setTransactions);

    return () => subscription.unsubscribe();
  }, [type]);

  return transactions;
}

/**
 * Hook para obter resumo financeiro reativo
 */
export function useFinancialSummary() {
  const [summary, setSummary] = useState<FinancialSummary>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });

  useEffect(() => {
    const subscription = transactionStream.getFinancialSummary$().subscribe(setSummary);

    return () => subscription.unsubscribe();
  }, []);

  return summary;
}

/**
 * Hook para busca reativa de transações
 */
export function useTransactionSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Transaction[]>([]);

  useEffect(() => {
    const searchSubject = new Subject<string>();

    const subscription = transactionStream
      .searchTransactions$(searchSubject.asObservable())
      .subscribe(setResults);

    // Emite o termo de busca
    if (searchTerm) {
      searchSubject.next(searchTerm);
    } else {
      // Retorna todas as transações quando não há busca
      const subscription = transactionStream.transactions$.subscribe(setResults);
      return () => {
        subscription.unsubscribe();
        searchSubject.complete();
      };
    }

    return () => {
      subscription.unsubscribe();
      searchSubject.complete();
    };
  }, [searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    results,
  };
}

/**
 * Hook para transações recentes (últimas 5) reativamente
 */
export function useRecentTransactions() {
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const subscription = transactionStream
      .getRecentTransactions$()
      .subscribe(setRecentTransactions);

    return () => subscription.unsubscribe();
  }, []);

  return recentTransactions;
}

/**
 * Hook para notificações de novas transações
 */
export function useNewTransactionNotifications(
  onNewTransaction?: (transaction: Transaction) => void
) {
  useEffect(() => {
    if (!onNewTransaction) return;

    const subscription = transactionStream.getNewTransactions$().subscribe(onNewTransaction);

    return () => subscription.unsubscribe();
  }, [onNewTransaction]);
}

/**
 * Hook para transações filtradas por período reativamente
 */
export function useTransactionsByPeriod(startDate: Date, endDate: Date) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const subscription = transactionStream
      .getTransactionsByPeriod$(startDate, endDate)
      .subscribe(setTransactions);

    return () => subscription.unsubscribe();
  }, [startDate, endDate]);

  return transactions;
}

/**
 * Hook para transações por categoria reativamente
 */
export function useTransactionsByCategory(category: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const subscription = transactionStream
      .getTransactionsByCategory$(category)
      .subscribe(setTransactions);

    return () => subscription.unsubscribe();
  }, [category]);

  return transactions;
}
