import { Alert } from 'react-native';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

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

// Valida múltiplos campos e exibe alerta com o primeiro erro encontrado
export const validateFields = (validations: ValidationResult[]): boolean => {
  const firstError = validations.find(v => !v.isValid);
  
  if (firstError) {
    Alert.alert('Erro de Validação', firstError.error);
    return false;
  }

  return true;
};

export const validateLoginForm = (email: string, password: string): boolean => {
  return validateFields([
    validateEmail(email),
    validatePassword(password),
  ]);
};

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

export const validateTransactionForm = (
  amount: string,
  description: string
): boolean => {
  return validateFields([
    validateAmount(amount),
    validateDescription(description),
  ]);
};

// Valida transação e retorna resultado detalhado (sem Alert)
export const validateTransaction = (
  amount: string,
  description: string
): ValidationResult => {
  const amountResult = validateAmount(amount);
  if (!amountResult.isValid) {
    return amountResult;
  }

  const descriptionResult = validateDescription(description);
  if (!descriptionResult.isValid) {
    return descriptionResult;
  }

  return { isValid: true };
};

// Valida integridade dos dados da transação antes de salvar
export const validateTransactionData = (data: {
  type: string;
  amount: number;
  description: string;
  category?: string;
  date: Date;
  userId: string;
}): ValidationResult => {
  // Valida userId
  if (!data.userId || data.userId.trim() === '') {
    return { isValid: false, error: 'ID do usuário é obrigatório' };
  }

  // Valida tipo de transação
  const validTypes = ['DEPOSIT', 'WITHDRAWAL', 'TRANSFER', 'PAYMENT', 'INVESTMENT'];
  if (!validTypes.includes(data.type)) {
    return { isValid: false, error: 'Tipo de transação inválido' };
  }

  // Valida valor
  if (typeof data.amount !== 'number' || data.amount <= 0) {
    return { isValid: false, error: 'Valor deve ser um número positivo' };
  }

  // Valida se o valor não é muito grande (limite de segurança)
  if (data.amount > 999999999.99) {
    return { isValid: false, error: 'Valor excede o limite permitido' };
  }

  // Valida descrição
  if (!data.description || data.description.trim().length < 3) {
    return { isValid: false, error: 'Descrição deve ter pelo menos 3 caracteres' };
  }

  if (data.description.trim().length > 200) {
    return { isValid: false, error: 'Descrição deve ter no máximo 200 caracteres' };
  }

  if (data.category && data.category.trim().length > 50) {
    return { isValid: false, error: 'Categoria deve ter no máximo 50 caracteres' };
  }

  if (!(data.date instanceof Date) || isNaN(data.date.getTime())) {
    return { isValid: false, error: 'Data inválida' };
  }

  // Impede datas muito antigas (> 10 anos)
  const tenYearsAgo = new Date();
  tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);
  if (data.date < tenYearsAgo) {
    return { isValid: false, error: 'Data muito antiga (limite: 10 anos)' };
  }

  // Impede datas futuras (> 1 dia)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (data.date > tomorrow) {
    return { isValid: false, error: 'Data não pode ser no futuro' };
  }

  return { isValid: true };
};

// Remove caracteres perigosos da descrição (XSS prevention)
export const sanitizeDescription = (description: string): string => {
  return description
    .trim()
    .replace(/[<>]/g, '')
    .slice(0, 200);
};

export const sanitizeCategory = (category?: string): string | undefined => {
  if (!category) return undefined;
  
  return category
    .trim()
    .replace(/[<>]/g, '')
    .slice(0, 50);
};

// Valida e sanitiza dados de transação em um único passo
export const validateAndSanitizeTransaction = (data: {
  type: string;
  amount: number;
  description: string;
  category?: string;
  date: Date;
  userId: string;
}): { isValid: boolean; error?: string; sanitizedData?: any } => {
  const validationResult = validateTransactionData(data);
  
  if (!validationResult.isValid) {
    return validationResult;
  }

  return {
    isValid: true,
    sanitizedData: {
      ...data,
      description: sanitizeDescription(data.description),
      category: sanitizeCategory(data.category),
      amount: Math.round(data.amount * 100) / 100, // Garante 2 casas decimais
    }
  };
};
