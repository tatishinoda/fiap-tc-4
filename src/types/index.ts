// ============================================================================
// VALIDATION & UI TYPES
// ============================================================================

// Resultado de validação
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Botão de alerta customizado
export interface AlertButton {
  text: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
}

// ============================================================================
// DTOs para comunicação com Firestore
// ============================================================================

// ============================================================================
// USER DTOs
// ============================================================================

// DTO para salvar User no Firestore
export interface UserFirestoreDTO {
  email: string;
  name: string;
  createdAt?: any; // Firestore Timestamp
  updatedAt?: any; // Firestore Timestamp
}

// ============================================================================
// TRANSACTION DTOs
// ============================================================================

// DTO para salvar Transaction no Firestore
export interface TransactionDTO {
  userId: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'PAYMENT' | 'INVESTMENT';
  amount: number;
  description: string;
  date: any; // Firestore Timestamp
  category?: string;
  receiptUrl?: string;
  createdAt?: any; // Firestore Timestamp
  updatedAt?: any; // Firestore Timestamp
}

// ============================================================================
// FORM DTOs
// ============================================================================

// DTO para formulário de transação
export interface TransactionFormData {
  type: 'income' | 'expense' | 'transfer';
  category: string;
  amount: string;
  description: string;
  date: Date;
}
