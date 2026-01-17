import { Transaction } from '../../../domain/entities/Transaction';
import { ITransactionRepository } from '../../../domain/repositories/ITransactionRepository';

export class GetAllTransactionsUseCase {
  constructor(private transactionRepository: ITransactionRepository) {}

  async execute(userId: string): Promise<Transaction[]> {
    if (!userId) {
      throw new Error('ID do usuário é obrigatório');
    }

    return await this.transactionRepository.getAll(userId);
  }
}
