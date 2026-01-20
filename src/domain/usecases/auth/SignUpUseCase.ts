import { IAuthRepository } from '../../../domain/repositories/IAuthRepository';
import { User } from '../../../domain/entities/User';

export class SignUpUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(email: string, password: string, name: string): Promise<User> {
    if (!User.isValidEmail(email)) {
      throw new Error('Email inválido');
    }

    if (password.length < 6) {
      throw new Error('Senha deve ter pelo menos 6 caracteres');
    }

    if (!name || name.trim().length < 3) {
      throw new Error('Nome deve ter pelo menos 3 caracteres');
    }

    return await this.authRepository.signUp(email, password, name);
  }
}
