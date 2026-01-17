import { Transaction } from '../../../domain/entities/Transaction';
import { ITransactionRepository, CreateTransactionDTO } from '../../../domain/repositories/ITransactionRepository';

export class CreateTransactionUseCase {
  constructor(private transactionRepository: ITransactionRepository) {}

  async execute(data: CreateTransactionDTO): Promise<Transaction> {
    if (!data.userId) {
      throw new Error('ID do usuário é obrigatório');
    }

    if (data.amount <= 0) {
      throw new Error('O valor da transação deve ser maior que zero');
    }

    if (!data.description || data.description.trim() === '') {
      throw new Error('A descrição é obrigatória');
    }

    if (!data.type) {
      throw new Error('O tipo da transação é obrigatório');
    }

    return await this.transactionRepository.create(data);
  }
}