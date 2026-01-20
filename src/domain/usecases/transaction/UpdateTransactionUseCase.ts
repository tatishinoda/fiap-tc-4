import { ITransactionRepository, UpdateTransactionDTO } from '../../../domain/repositories/ITransactionRepository';

export class UpdateTransactionUseCase {
  constructor(private transactionRepository: ITransactionRepository) {}

  async execute(
    transactionId: string,
    userId: string,
    data: UpdateTransactionDTO
  ): Promise<void> {
    if (!transactionId) {
      throw new Error('ID da transação é obrigatório');
    }

    if (!userId) {
      throw new Error('ID do usuário é obrigatório');
    }

    if (data.amount !== undefined && data.amount <= 0) {
      throw new Error('O valor da transação deve ser maior que zero');
    }

    if (data.description !== undefined && data.description.trim() === '') {
      throw new Error('A descrição não pode estar vazia');
    }

    await this.transactionRepository.update(transactionId, userId, data);
  }
}
