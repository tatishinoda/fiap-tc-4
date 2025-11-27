import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Transaction, TransactionFormData } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class TransactionService {
  private static COLLECTION = 'transactions';

  // Criar nova transação
  static async createTransaction(
    userId: string,
    transactionData: TransactionFormData
  ): Promise<Transaction> {
    try {
      const transactionDoc = {
        userId,
        type: transactionData.type,
        category: transactionData.category,
        amount: parseFloat(transactionData.amount),
        description: transactionData.description,
        date: Timestamp.fromDate(transactionData.date),
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date()),
      };

      const docRef = await addDoc(collection(db, this.COLLECTION), transactionDoc);

      return {
        id: docRef.id,
        userId,
        type: transactionData.type,
        category: transactionData.category,
        amount: parseFloat(transactionData.amount),
        description: transactionData.description,
        date: transactionData.date,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      throw new Error('Erro ao salvar transação');
    }
  }

  // Buscar transações do usuário
  static async getUserTransactions(
    userId: string,
    limitCount: number = 50
  ): Promise<Transaction[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION),
        where('userId', '==', userId),
        orderBy('date', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          type: data.type,
          category: data.category,
          amount: data.amount,
          description: data.description,
          date: data.date.toDate(),
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        };
      });
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      throw new Error('Erro ao carregar transações');
    }
  }

  // Buscar transação por ID
  static async getTransactionById(transactionId: string): Promise<Transaction | null> {
    try {
      const docRef = doc(db, this.COLLECTION, transactionId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      const data = docSnap.data();
      return {
        id: docSnap.id,
        userId: data.userId,
        type: data.type,
        category: data.category,
        amount: data.amount,
        description: data.description,
        date: data.date.toDate(),
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      };
    } catch (error) {
      console.error('Erro ao buscar transação:', error);
      throw new Error('Erro ao carregar transação');
    }
  }

  // Atualizar transação
  static async updateTransaction(
    transactionId: string,
    updateData: Partial<TransactionFormData>
  ): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION, transactionId);
      
      const updateDocData = {
        ...updateData,
        amount: updateData.amount ? parseFloat(updateData.amount) : undefined,
        date: updateData.date ? Timestamp.fromDate(updateData.date) : undefined,
        updatedAt: Timestamp.fromDate(new Date()),
      };

      // Remove campos undefined
      Object.keys(updateDocData).forEach(key => 
        updateDocData[key as keyof typeof updateDocData] === undefined && 
        delete updateDocData[key as keyof typeof updateDocData]
      );

      await updateDoc(docRef, updateDocData);
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      throw new Error('Erro ao atualizar transação');
    }
  }

  // Deletar transação
  static async deleteTransaction(transactionId: string): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION, transactionId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
      throw new Error('Erro ao deletar transação');
    }
  }

  // Obter resumo financeiro
  static async getFinancialSummary(userId: string): Promise<{
    totalIncome: number;
    totalExpense: number;
    balance: number;
  }> {
    try {
      const transactions = await this.getUserTransactions(userId, 1000);
      
      const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
      };
    } catch (error) {
      console.error('Erro ao calcular resumo financeiro:', error);
      throw new Error('Erro ao calcular resumo financeiro');
    }
  }

  // Filtrar transações por categoria
  static async getTransactionsByCategory(
    userId: string,
    category: string
  ): Promise<Transaction[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION),
        where('userId', '==', userId),
        where('category', '==', category),
        orderBy('date', 'desc')
      );

      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          type: data.type,
          category: data.category,
          amount: data.amount,
          description: data.description,
          date: data.date.toDate(),
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        };
      });
    } catch (error) {
      console.error('Erro ao filtrar transações:', error);
      throw new Error('Erro ao filtrar transações');
    }
  }
}
