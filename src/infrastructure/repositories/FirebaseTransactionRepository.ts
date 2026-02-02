import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Transaction, FinancialSummary } from '../../domain/entities/Transaction';
import {
  ITransactionRepository,
  CreateTransactionDTO,
  UpdateTransactionDTO,
} from '../../domain/repositories/ITransactionRepository';
import { TransactionMapper } from '../mappers/TransactionMapper';

const TRANSACTIONS_COLLECTION = 'transactions';

export class FirebaseTransactionRepository implements ITransactionRepository {
  // Busca todas as transações de um usuário
  async getAll(userId: string): Promise<Transaction[]> {
    try {
      const transactionsRef = collection(db, TRANSACTIONS_COLLECTION);
      const q = query(
        transactionsRef,
        where('userId', '==', userId),
        orderBy('date', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const transactions: Transaction[] = [];

      querySnapshot.forEach((doc) => {
        transactions.push(TransactionMapper.toDomain(doc.id, doc.data()));
      });

      return transactions;
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      throw new Error('Erro ao buscar transações do Firestore');
    }
  }

  // Cria uma nova transação
  async create(data: CreateTransactionDTO): Promise<Transaction> {
    try {
      const transactionsRef = collection(db, TRANSACTIONS_COLLECTION);
      
      const transactionData = TransactionMapper.toFirestore({
        ...data,
        date: data.date instanceof Date ? data.date : new Date(data.date),
      } as any);

      // Adiciona timestamps
      transactionData.createdAt = serverTimestamp();
      transactionData.updatedAt = serverTimestamp();

      const docRef = await addDoc(transactionsRef, transactionData);

      // Retorna a transação criada
      const now = new Date();
      return {
        id: docRef.id,
        userId: data.userId,
        type: data.type,
        amount: data.amount,
        date: data.date instanceof Date ? data.date : new Date(data.date),
        description: data.description,
        category: data.category,
        receiptUrl: data.receiptUrl,
        createdAt: now,
        updatedAt: now,
      };
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      throw new Error('Erro ao criar transação no Firestore');
    }
  }

  // Atualiza uma transação existente
  async update(
    transactionId: string,
    userId: string,
    data: UpdateTransactionDTO
  ): Promise<void> {
    try {
      const transactionRef = doc(db, TRANSACTIONS_COLLECTION, transactionId);

      // Remove valores undefined
      const definedFields = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined)
      );

      const updateData: any = {
        ...definedFields,
        updatedAt: serverTimestamp(),
      };

      // Converte data para Timestamp, se presente
      if (data.date) {
        updateData.date = data.date instanceof Date
          ? Timestamp.fromDate(data.date)
          : Timestamp.fromDate(new Date(data.date));
      }

      await updateDoc(transactionRef, updateData);
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      throw new Error('Erro ao atualizar transação no Firestore');
    }
  }

  // Remove uma transação
  async delete(transactionId: string): Promise<void> {
    try {
      const transactionRef = doc(db, TRANSACTIONS_COLLECTION, transactionId);
      await deleteDoc(transactionRef);
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
      throw new Error('Erro ao deletar transação no Firestore');
    }
  }

  // Calcula o resumo financeiro do usuário
  async getSummary(userId: string): Promise<FinancialSummary> {
    try {
      const transactions = await this.getAll(userId);

      let totalIncome = 0;
      let totalExpense = 0;

      transactions.forEach((transaction) => {
        if (transaction.type === 'DEPOSIT') {
          totalIncome += transaction.amount;
        } else if (
          transaction.type === 'WITHDRAWAL' ||
          transaction.type === 'PAYMENT' ||
          transaction.type === 'TRANSFER' ||
          transaction.type === 'INVESTMENT'
        ) {
          totalExpense += transaction.amount;
        }
      });

      const balance = totalIncome - totalExpense;

      return {
        totalIncome,
        totalExpense,
        balance,
      };
    } catch (error) {
      console.error('Erro ao calcular resumo financeiro:', error);
      throw new Error('Erro ao calcular resumo financeiro');
    }
  }

  /**
   * Subscreve para atualizações em tempo real das transações
   * Usa Firestore onSnapshot para programação reativa
   *
   * @param userId - ID do usuário
   * @param callback - Função chamada quando transações mudam
   * @returns Função unsubscribe para cancelar a inscrição
   */
  subscribeToTransactions(
    userId: string,
    callback: (transactions: Transaction[]) => void,
    onError?: (error: Error) => void
  ): Unsubscribe {
    try {
      const transactionsRef = collection(db, TRANSACTIONS_COLLECTION);
      const q = query(
        transactionsRef,
        where('userId', '==', userId),
        orderBy('date', 'desc')
      );

      // onSnapshot retorna uma função unsubscribe
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const transactions: Transaction[] = [];

          snapshot.forEach((doc) => {
            transactions.push(TransactionMapper.toDomain(doc.id, doc.data()));
          });

          // Chama callback com as transações atualizadas
          callback(transactions);
        },
        (error) => {
          console.error('Erro no snapshot de transações:', error);
          if (onError) {
            onError(new Error('Erro ao observar transações em tempo real'));
          }
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error('Erro ao subscrever transações:', error);
      throw new Error('Erro ao configurar listener de transações');
    }
  }

  /**
   * Subscreve para uma transação específica
   * Útil para atualizações em tempo real de uma transação
   */
  subscribeToTransaction(
    transactionId: string,
    callback: (transaction: Transaction | null) => void,
    onError?: (error: Error) => void
  ): Unsubscribe {
    try {
      const transactionRef = doc(db, TRANSACTIONS_COLLECTION, transactionId);

      const unsubscribe = onSnapshot(
        transactionRef,
        (doc) => {
          if (doc.exists()) {
            const transaction = TransactionMapper.toDomain(doc.id, doc.data());
            callback(transaction);
          } else {
            callback(null);
          }
        },
        (error) => {
          console.error('Erro no snapshot da transação:', error);
          if (onError) {
            onError(new Error('Erro ao observar transação em tempo real'));
          }
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error('Erro ao subscrever transação:', error);
      throw new Error('Erro ao configurar listener de transação');
    }
  }
}
