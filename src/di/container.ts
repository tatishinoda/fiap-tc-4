import { FirebaseAuthRepository } from '../infrastructure/repositories/FirebaseAuthRepository';
import { LoginUseCase } from '@/domain/usecases/auth/LoginUseCase';
import { SignUpUseCase } from '@/domain/usecases/auth/SignUpUseCase';
import { LogoutUseCase } from '@/domain/usecases/auth/LogoutUseCase';

import { FirebaseTransactionRepository } from '../infrastructure/repositories/FirebaseTransactionRepository';
import { GetAllTransactionsUseCase } from '@/domain/usecases/transaction/GetAllTransactionsUseCase';
import { GetPaginatedTransactionsUseCase } from '@/domain/usecases/transaction/GetPaginatedTransactionsUseCase';
import { CreateTransactionUseCase } from '@/domain/usecases/transaction/CreateTransactionUseCase';
import { UpdateTransactionUseCase } from '@/domain/usecases/transaction/UpdateTransactionUseCase';
import { DeleteTransactionUseCase } from '@/domain/usecases/transaction/DeleteTransactionUseCase';
import { GetFinancialSummaryUseCase } from '@/domain/usecases/transaction/GetFinancialSummaryUseCase';

class DIContainer {
  private services = new Map<string, any>();

  constructor() {
    this.registerDependencies();
  }

  private registerDependencies() {
    // Repositories
    const authRepository = new FirebaseAuthRepository();
    this.services.set('AuthRepository', authRepository);

    const transactionRepository = new FirebaseTransactionRepository();
    this.services.set('TransactionRepository', transactionRepository);

    // Use Cases - Auth
    this.services.set('LoginUseCase', new LoginUseCase(authRepository));
    this.services.set('SignUpUseCase', new SignUpUseCase(authRepository));
    this.services.set('LogoutUseCase', new LogoutUseCase(authRepository));

    // Use Cases - Transaction
    this.services.set('GetAllTransactionsUseCase', new GetAllTransactionsUseCase(transactionRepository));
    this.services.set('GetPaginatedTransactionsUseCase', new GetPaginatedTransactionsUseCase(transactionRepository));
    this.services.set('CreateTransactionUseCase', new CreateTransactionUseCase(transactionRepository));
    this.services.set('UpdateTransactionUseCase', new UpdateTransactionUseCase(transactionRepository));
    this.services.set('DeleteTransactionUseCase', new DeleteTransactionUseCase(transactionRepository));
    this.services.set('GetFinancialSummaryUseCase', new GetFinancialSummaryUseCase(transactionRepository));
  }

  get<T>(key: string): T {
    const service = this.services.get(key);
    if (!service) {
      throw new Error(`Service ${key} not found in DI Container`);
    }
    return service;
  }
}

export const container = new DIContainer();
