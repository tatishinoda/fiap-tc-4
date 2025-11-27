import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Formatar valor monetário para Real brasileiro
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

/**
 * Formatar data para exibição
 */
export const formatDate = (date: Date, pattern: string = 'dd/MM/yyyy'): string => {
  return format(date, pattern, { locale: ptBR });
};

/**
 * Validar e-mail
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validar CPF
 */
export const isValidCPF = (cpf: string): boolean => {
  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/\D/g, '');
  
  // Verifica se tem 11 dígitos
  if (cleanCPF.length !== 11) return false;
  
  // Verifica se não são todos iguais
  if (/^(\d)\1+$/.test(cleanCPF)) return false;
  
  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let firstDigit = (sum * 10) % 11;
  if (firstDigit === 10) firstDigit = 0;
  if (firstDigit !== parseInt(cleanCPF.charAt(9))) return false;
  
  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  let secondDigit = (sum * 10) % 11;
  if (secondDigit === 10) secondDigit = 0;
  if (secondDigit !== parseInt(cleanCPF.charAt(10))) return false;
  
  return true;
};

/**
 * Formatar CPF
 */
export const formatCPF = (cpf: string): string => {
  const cleanCPF = cpf.replace(/\D/g, '');
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

/**
 * Formatar telefone
 */
export const formatPhone = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length === 11) {
    return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (cleanPhone.length === 10) {
    return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return phone;
};

/**
 * Gerar ID único
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Truncar texto
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength - 3) + '...';
};

/**
 * Calcular diferença de dias
 */
export const daysBetween = (date1: Date, date2: Date): number => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Capitalizar primeira letra de cada palavra
 */
export const capitalizeWords = (text: string): string => {
  return text.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Cores do tema
 */
export const colors = {
  primary: '#1A73E8',
  secondary: '#34A853',
  error: '#F44336',
  warning: '#FF9800',
  success: '#4CAF50',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  text: '#333333',
  textSecondary: '#666666',
  textLight: '#999999',
  border: '#E0E0E0',
  income: '#4CAF50',
  expense: '#F44336',
  transfer: '#FF9800',
};

/**
 * Categorias padrão
 */
export const defaultCategories = {
  income: [
    { id: 'salary', name: 'Salário', icon: 'briefcase-outline', color: colors.income },
    { id: 'freelance', name: 'Freelance', icon: 'laptop-outline', color: colors.income },
    { id: 'investment', name: 'Investimentos', icon: 'trending-up-outline', color: colors.income },
    { id: 'bonus', name: 'Bônus', icon: 'gift-outline', color: colors.income },
    { id: 'other-income', name: 'Outros', icon: 'add-circle-outline', color: colors.income },
  ],
  expense: [
    { id: 'food', name: 'Alimentação', icon: 'restaurant-outline', color: colors.expense },
    { id: 'transport', name: 'Transporte', icon: 'car-outline', color: colors.expense },
    { id: 'health', name: 'Saúde', icon: 'medical-outline', color: colors.expense },
    { id: 'education', name: 'Educação', icon: 'school-outline', color: colors.expense },
    { id: 'entertainment', name: 'Entretenimento', icon: 'game-controller-outline', color: colors.expense },
    { id: 'shopping', name: 'Compras', icon: 'bag-outline', color: colors.expense },
    { id: 'bills', name: 'Contas', icon: 'receipt-outline', color: colors.expense },
    { id: 'other-expense', name: 'Outros', icon: 'remove-circle-outline', color: colors.expense },
  ],
};
