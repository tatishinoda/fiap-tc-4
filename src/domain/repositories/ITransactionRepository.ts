import { Transaction, FinancialSummary } from '../entities/Transaction';

export interface CreateTransactionDTO {
  userId: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'PAYMENT' | 'INVESTMENT';
  amount: number;
  date: Date;
  description: string;
  category?: string;
  receiptUrl?: string;
}

export interface UpdateTransactionDTO {
  type?: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'PAYMENT' | 'INVESTMENT';
  amount?: number;
  date?: Date;
  description?: string;
  category?: string;
  receiptUrl?: string;
}

export interface ITransactionRepository {
  getAll(userId: string): Promise<Transaction[]>;
  create(data: CreateTransactionDTO): Promise<Transaction>;
  update(transactionId: string, userId: string, data: UpdateTransactionDTO): Promise<void>;
  delete(transactionId: string): Promise<void>;
  getSummary(userId: string): Promise<FinancialSummary>;
}
