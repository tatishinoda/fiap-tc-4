import { ITransactionRepository, PaginatedResult } from '../../repositories/ITransactionRepository';

export class GetPaginatedTransactionsUseCase {
  constructor(private transactionRepository: ITransactionRepository) {}

  async execute(userId: string, limit: number, lastDoc?: any): Promise<PaginatedResult> {
    if (!userId) {
      throw new Error('ID do usuário é obrigatório');
    }
    return await this.transactionRepository.getPaginated(userId, limit, lastDoc);
  }
}
