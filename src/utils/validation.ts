import { Alert } from 'react-native';

/**
 * Utilitários para validação de formulários
 * Centraliza lógica de validação repetida nas telas
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Valida email
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email.trim()) {
    return { isValid: false, error: 'Email é obrigatório' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Email inválido' };
  }

  return { isValid: true };
};

/**
 * Valida senha
 */
export const validatePassword = (password: string, minLength: number = 6): ValidationResult => {
  if (!password.trim()) {
    return { isValid: false, error: 'Senha é obrigatória' };
  }

  if (password.length < minLength) {
    return { 
      isValid: false, 
      error: `A senha deve ter pelo menos ${minLength} caracteres` 
    };
  }

  return { isValid: true };
};

/**
 * Valida confirmação de senha
 */
export const validatePasswordConfirmation = (
  password: string, 
  confirmPassword: string
): ValidationResult => {
  if (!confirmPassword.trim()) {
    return { isValid: false, error: 'Confirmação de senha é obrigatória' };
  }

  if (password !== confirmPassword) {
    return { isValid: false, error: 'As senhas não coincidem' };
  }

  return { isValid: true };
};

/**
 * Valida nome
 */
export const validateName = (name: string, minLength: number = 2): ValidationResult => {
  if (!name.trim()) {
    return { isValid: false, error: 'Nome é obrigatório' };
  }

  if (name.trim().length < minLength) {
    return { 
      isValid: false, 
      error: `O nome deve ter pelo menos ${minLength} caracteres` 
    };
  }

  return { isValid: true };
};

/**
 * Valida campos obrigatórios
 */
export const validateRequired = (value: string, fieldName: string): ValidationResult => {
  if (!value.trim()) {
    return { isValid: false, error: `${fieldName} é obrigatório` };
  }

  return { isValid: true };
};

/**
 * Valida múltiplos campos e exibe alerta se houver erro
 */
export const validateFields = (validations: ValidationResult[]): boolean => {
  const firstError = validations.find(v => !v.isValid);
  
  if (firstError) {
    Alert.alert('Erro de Validação', firstError.error);
    return false;
  }

  return true;
};

/**
 * Valida formulário de login
 */
export const validateLoginForm = (email: string, password: string): boolean => {
  return validateFields([
    validateEmail(email),
    validatePassword(password),
  ]);
};

/**
 * Valida formulário de cadastro
 */
export const validateSignUpForm = (
  name: string,
  email: string,
  password: string,
  confirmPassword: string
): boolean => {
  return validateFields([
    validateName(name),
    validateEmail(email),
    validatePassword(password),
    validatePasswordConfirmation(password, confirmPassword),
  ]);
};

/**
 * Valida valor monetário
 */
export const validateAmount = (amount: string): ValidationResult => {
  if (!amount.trim()) {
    return { isValid: false, error: 'Valor é obrigatório' };
  }

  const numAmount = parseFloat(amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    return { isValid: false, error: 'Valor inválido' };
  }

  return { isValid: true };
};

/**
 * Valida descrição de transação
 */
export const validateDescription = (description: string, minLength: number = 3): ValidationResult => {
  if (!description.trim()) {
    return { isValid: false, error: 'Descrição é obrigatória' };
  }

  if (description.trim().length < minLength) {
    return { 
      isValid: false, 
      error: `A descrição deve ter pelo menos ${minLength} caracteres` 
    };
  }

  return { isValid: true };
};

/**
 * Valida CPF brasileiro
 */
export const validateCPF = (cpf: string): ValidationResult => {
  if (!cpf.trim()) {
    return { isValid: false, error: 'CPF é obrigatório' };
  }

  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/\D/g, '');
  
  // Verifica se tem 11 dígitos
  if (cleanCPF.length !== 11) {
    return { isValid: false, error: 'CPF deve ter 11 dígitos' };
  }
  
  // Verifica se não são todos iguais
  if (/^(\d)\1+$/.test(cleanCPF)) {
    return { isValid: false, error: 'CPF inválido' };
  }
  
  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let firstDigit = (sum * 10) % 11;
  if (firstDigit === 10) firstDigit = 0;
  if (firstDigit !== parseInt(cleanCPF.charAt(9))) {
    return { isValid: false, error: 'CPF inválido' };
  }
  
  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  let secondDigit = (sum * 10) % 11;
  if (secondDigit === 10) secondDigit = 0;
  if (secondDigit !== parseInt(cleanCPF.charAt(10))) {
    return { isValid: false, error: 'CPF inválido' };
  }
  
  return { isValid: true };
};

/**
 * Valida formulário de transação (com Alert)
 */
export const validateTransactionForm = (
  amount: string,
  description: string
): boolean => {
  return validateFields([
    validateAmount(amount),
    validateDescription(description),
  ]);
};

/**
 * Valida formulário de transação (retorna resultado sem Alert)
 */
export const validateTransaction = (
  amount: string,
  description: string
): ValidationResult => {
  // Valida amount primeiro
  const amountResult = validateAmount(amount);
  if (!amountResult.isValid) {
    return amountResult;
  }

  // Valida description
  const descriptionResult = validateDescription(description);
  if (!descriptionResult.isValid) {
    return descriptionResult;
  }

  return { isValid: true };
};
