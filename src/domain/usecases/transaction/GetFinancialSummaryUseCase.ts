import { FinancialSummary } from '../../../domain/entities/Transaction';
import { ITransactionRepository } from '../../../domain/repositories/ITransactionRepository';

export class GetFinancialSummaryUseCase {
  constructor(private transactionRepository: ITransactionRepository) {}

  async execute(userId: string): Promise<FinancialSummary> {
    if (!userId) {
      throw new Error('ID do usuário é obrigatório');
    }

    return await this.transactionRepository.getSummary(userId);
  }
}
