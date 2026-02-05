import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { FinancialSummary, Transaction, TransactionType } from '../../domain/entities/Transaction';

/**
 * TransactionStream - Gerenciador reativo de transações usando RxJS
 *
 * Implementa programação reativa para atualização em tempo real de transações.
 * Usa Observables para notificar componentes sobre mudanças de estado.
 *
 * Features:
 * - BehaviorSubject para manter estado atual
 * - Observables para streams reativos
 * - Operators RxJS para transformações e filtros
 * - Debounce para otimização de performance
 */
export class TransactionStream {
  // BehaviorSubject mantém o valor atual e emite para novos subscribers
  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new Subject<Error | null>();

  // Subject para paginação (scroll infinito)
  private loadMoreSubject = new Subject<{ limit: number; lastDoc: any }>();
  private paginatedTransactionsSubject = new BehaviorSubject<Transaction[]>([]);
  private hasMoreSubject = new BehaviorSubject<boolean>(true);

  // Observables públicos (read-only)
  public transactions$: Observable<Transaction[]> = this.transactionsSubject.asObservable();
  public loading$: Observable<boolean> = this.loadingSubject.asObservable();
  public error$: Observable<Error | null> = this.errorSubject.asObservable();

  // Observables para paginação
  public paginatedTransactions$: Observable<Transaction[]> = this.paginatedTransactionsSubject.asObservable();
  public hasMore$: Observable<boolean> = this.hasMoreSubject.asObservable();

  /**
   * Atualiza o stream de transações
   */
  updateTransactions(transactions: Transaction[]): void {
    this.transactionsSubject.next(transactions);
  }

  /**
   * Adiciona uma nova transação ao stream
   */
  addTransaction(transaction: Transaction): void {
    const currentTransactions = this.transactionsSubject.value;
    this.transactionsSubject.next([transaction, ...currentTransactions]);
  }

  /**
   * Atualiza uma transação existente no stream
   */
  updateTransaction(id: string, updatedTransaction: Partial<Transaction>): void {
    const currentTransactions = this.transactionsSubject.value;
    const newTransactions = currentTransactions.map((t) =>
      t.id === id ? { ...t, ...updatedTransaction } : t
    );
    this.transactionsSubject.next(newTransactions);
  }

  /**
   * Remove uma transação do stream
   */
  removeTransaction(id: string): void {
    const currentTransactions = this.transactionsSubject.value;
    const newTransactions = currentTransactions.filter((t) => t.id !== id);
    this.transactionsSubject.next(newTransactions);
  }

  /**
   * Obtém transações do tipo específico
   */
  getTransactionsByType$(type: TransactionType): Observable<Transaction[]> {
    return this.transactions$.pipe(
      map((transactions) => transactions.filter((t) => t.type === type))
    );
  }

  /**
   * Obtém transações por categoria
   */
  getTransactionsByCategory$(category: string): Observable<Transaction[]> {
    return this.transactions$.pipe(
      map((transactions) => transactions.filter((t) => t.category && t.category === category))
    );
  }

  /**
   * Obtém transações filtradas por período
   */
  getTransactionsByPeriod$(startDate: Date, endDate: Date): Observable<Transaction[]> {
    return this.transactions$.pipe(
      map((transactions) =>
        transactions.filter((t) => {
          const transactionDate = new Date(t.date);
          return transactionDate >= startDate && transactionDate <= endDate;
        })
      )
    );
  }

  /**
   * Busca reativa de transações (com debounce)
   */
  searchTransactions$(searchTerm$: Observable<string>): Observable<Transaction[]> {
    return searchTerm$.pipe(
      debounceTime(300), // Espera 300ms após parar de digitar
      distinctUntilChanged(), // Só emite se o valor mudou
      map((term) => {
        const lowerTerm = term.toLowerCase();
        return this.transactionsSubject.value.filter(
          (t) =>
            t.description.toLowerCase().includes(lowerTerm) ||
            (t.category && t.category.toLowerCase().includes(lowerTerm))
        );
      })
    );
  }

  /**
   * Calcula resumo financeiro reativo
   */
  getFinancialSummary$(): Observable<FinancialSummary> {
    return this.transactions$.pipe(
      map((transactions) => {
        const income = transactions
          .filter((t) => t.type === 'DEPOSIT')
          .reduce((sum, t) => sum + t.amount, 0);

        const expenses = transactions
          .filter((t) => t.type === 'WITHDRAWAL' || t.type === 'PAYMENT')
          .reduce((sum, t) => sum + t.amount, 0);

        const balance = income - expenses;

        return {
          totalIncome: income,
          totalExpense: expenses,
          balance,
        };
      })
    );
  }

  /**
   * Stream de transações recentes (últimas 5)
   */
  getRecentTransactions$(): Observable<Transaction[]> {
    return this.transactions$.pipe(map((transactions) => transactions.slice(0, 5)));
  }

  /**
   * Stream que emite apenas quando há novas transações
   */
  getNewTransactions$(): Observable<Transaction> {
    return new Observable((observer) => {
      let previousLength = 0;

      const subscription = this.transactions$.subscribe((transactions) => {
        if (transactions.length > previousLength) {
          // Nova transação adicionada
          observer.next(transactions[0]);
        }
        previousLength = transactions.length;
      });

      return () => subscription.unsubscribe();
    });
  }

  /**
   * Atualiza estado de loading
   */
  setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  /**
   * Emite erro
   */
  setError(error: Error | null): void {
    this.errorSubject.next(error);
  }

  /**
   * Atualiza transações paginadas (para scroll infinito)
   */
  updatePaginatedTransactions(transactions: Transaction[], append: boolean = false): void {
    if (append) {
      const current = this.paginatedTransactionsSubject.value;
      this.paginatedTransactionsSubject.next([...current, ...transactions]);
    } else {
      this.paginatedTransactionsSubject.next(transactions);
    }
  }

  /**
   * Define se há mais transações para carregar
   */
  setHasMore(hasMore: boolean): void {
    this.hasMoreSubject.next(hasMore);
  }

  /**
   * Obtém transações paginadas atuais
   */
  getCurrentPaginatedTransactions(): Transaction[] {
    return this.paginatedTransactionsSubject.value;
  }

  /**
   * Reseta paginação
   */
  resetPagination(): void {
    this.paginatedTransactionsSubject.next([]);
    this.hasMoreSubject.next(true);
  }

  /**
   * Limpa todas as transações
   */
  clear(): void {
    this.transactionsSubject.next([]);
    this.paginatedTransactionsSubject.next([]);
    this.loadingSubject.next(false);
    this.errorSubject.next(null);
    this.hasMoreSubject.next(true);
  }

  /**
   * Destrói o stream e libera recursos
   */
  destroy(): void {
    this.transactionsSubject.complete();
    this.loadingSubject.complete();
    this.errorSubject.complete();
    this.loadMoreSubject.complete();
    this.paginatedTransactionsSubject.complete();
    this.hasMoreSubject.complete();
  }
}

// Singleton global do stream
export const transactionStream = new TransactionStream();
