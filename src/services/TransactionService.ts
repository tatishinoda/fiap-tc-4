/**
 * Transaction Service
 * Gerencia operações CRUD de transações no Firestore
 */

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
  limit,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Transaction, TransactionType } from '../types';

const TRANSACTIONS_COLLECTION = 'transactions';

export interface CreateTransactionData {
  userId: string;
  type: TransactionType;
  amount: number;
  date: Date | string;
  description: string;
  category?: string;
}

export interface UpdateTransactionData extends Partial<Omit<CreateTransactionData, 'userId'>> {}

// Converte documento do Firestore para objeto Transaction
const firestoreToTransaction = (docId: string, data: any): Transaction => {
  return {
    id: docId,
    userId: data.userId,
    type: data.type,
    amount: data.amount,
    date: data.date instanceof Timestamp ? data.date.toDate() : new Date(data.date),
    description: data.description,
    category: data.category,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt || Date.now()),
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt || Date.now()),
  };
};

// Lista todas as transações do usuário ordenadas por data
export const getAllTransactions = async (
  userId: string,
  limitCount?: number
): Promise<Transaction[]> => {
  try {
    const transactionsRef = collection(db, TRANSACTIONS_COLLECTION);
    
    let q = query(
      transactionsRef,
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );

    if (limitCount) {
      q = query(q, limit(limitCount));
    }

    const querySnapshot = await getDocs(q);
    const transactions: Transaction[] = [];

    querySnapshot.forEach((doc) => {
      transactions.push(firestoreToTransaction(doc.id, doc.data()));
    });

    return transactions;
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    throw new Error('Erro ao buscar transações do Firestore');
  }
};

// Cria nova transação no Firestore
export const createTransaction = async (
  data: CreateTransactionData
): Promise<Transaction> => {
  try {
    const transactionsRef = collection(db, TRANSACTIONS_COLLECTION);
    
    const transactionData = {
      ...data,
      date: data.date instanceof Date ? Timestamp.fromDate(data.date) : Timestamp.fromDate(new Date(data.date)),
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(transactionsRef, transactionData);

    // Retorna transação criada com data normalizada
    const now = new Date();
    return {
      id: docRef.id,
      userId: data.userId,
      type: data.type,
      amount: data.amount,
      date: data.date instanceof Date ? data.date : new Date(data.date),
      description: data.description,
      category: data.category,
      createdAt: now,
      updatedAt: now,
    };
  } catch (error) {
    console.error('Erro ao criar transação:', error);
    throw new Error('Erro ao criar transação no Firestore');
  }
};

// Atualiza transação existente
export const updateTransaction = async (
  transactionId: string,
  userId: string,
  data: UpdateTransactionData
): Promise<void> => {
  try {
    const transactionRef = doc(db, TRANSACTIONS_COLLECTION, transactionId);
    
    const updateData: any = { 
      ...data,
      updatedAt: serverTimestamp(),
    };
    
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
};

// Remove transação do Firestore
export const deleteTransaction = async (transactionId: string): Promise<void> => {
  try {
    const transactionRef = doc(db, TRANSACTIONS_COLLECTION, transactionId);
    await deleteDoc(transactionRef);
  } catch (error) {
    console.error('Erro ao deletar transação:', error);
    throw new Error('Erro ao deletar transação no Firestore');
  }
};

// Calcula resumo financeiro baseado em todas as transações do usuário
export const getFinancialSummary = async (userId: string) => {
  try {
    const transactions = await getAllTransactions(userId);
    
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === 'DEPOSIT') {
        totalIncome += transaction.amount;
      } else if (transaction.type === 'WITHDRAWAL' || transaction.type === 'PAYMENT' || transaction.type === 'TRANSFER' || transaction.type === 'INVESTMENT') {
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
};


