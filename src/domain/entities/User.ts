export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly createdAt: Date
  ) {}

  // Regra de negócio
  get displayName(): string {
    return this.name || this.email.split('@')[0];
  }

  // Validação
  static isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
