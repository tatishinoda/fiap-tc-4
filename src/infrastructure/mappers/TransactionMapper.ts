import { Timestamp } from 'firebase/firestore';
import { Transaction } from '../../domain/entities/Transaction';

export class TransactionMapper {
  // Converte documento do Firestore para entidade Transaction
  static toDomain(docId: string, data: any): Transaction {
    return {
      id: docId,
      userId: data.userId,
      type: data.type,
      amount: data.amount,
      date: data.date instanceof Timestamp ? data.date.toDate() : new Date(data.date),
      description: data.description,
      category: data.category,
      receiptUrl: data.receiptUrl,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt || Date.now()),
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt || Date.now()),
    };
  }

  // Converte entidade Transaction para formato do Firestore
  static toFirestore(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): any {
    const data: any = {
      userId: transaction.userId,
      type: transaction.type,
      amount: transaction.amount,
      description: transaction.description,
      date: transaction.date instanceof Date ? Timestamp.fromDate(transaction.date) : Timestamp.fromDate(new Date(transaction.date)),
    };

    // Adiciona campos opcionais apenas se definidos
    if (transaction.category) {
      data.category = transaction.category;
    }

    if (transaction.receiptUrl) {
      data.receiptUrl = transaction.receiptUrl;
    }

    return data;
  }
}
