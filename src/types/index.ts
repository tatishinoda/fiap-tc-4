export interface User {
  id: string;
  email: string;
  name: string;
  cpf?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'PAYMENT' | 'INVESTMENT';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  date: Date;
  description: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense';
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export interface TransactionFormData {
  type: 'income' | 'expense' | 'transfer';
  category: string;
  amount: string;
  description: string;
  date: Date;
}
