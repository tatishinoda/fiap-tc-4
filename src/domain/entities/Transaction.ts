export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'PAYMENT' | 'INVESTMENT';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  date: Date;
  description: string;
  category?: string;
  receiptUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}
