import { ITransactionRepository } from '../../../domain/repositories/ITransactionRepository';

export class DeleteTransactionUseCase {
  constructor(private transactionRepository: ITransactionRepository) {}

  async execute(transactionId: string): Promise<void> {
    if (!transactionId) {
      throw new Error('ID da transação é obrigatório');
    }

    await this.transactionRepository.delete(transactionId);
  }
}
