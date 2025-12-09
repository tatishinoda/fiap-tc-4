import { TransactionType } from '../types';

/**
 * Cores por tipo de transação
 */
export const TRANSACTION_COLORS = {
  DEPOSIT: '#00D4AA',      // Verde para receitas
  WITHDRAWAL: '#FF8C42',   // Laranja para saques
  TRANSFER: '#4A90E2',     // Azul para transferências
  PAYMENT: '#FF6B6B',      // Vermelho para pagamentos
  INVESTMENT: '#9B59B6',   // Roxo para investimentos
} as const;

/**
 * Cores por categoria
 */
export const CATEGORY_COLORS = {
  // Alimentação
  'alimentação': '#9b59b6',
  'mercado': '#9b59b6',
  'restaurante': '#8e44ad',
  
  // Renda
  'salário': '#00D4AA',
  'renda': '#00D4AA',
  'trabalho': '#00D4AA',
  'freelance': '#00D4AA',
  
  // Contas
  'conta': '#f39c12',
  'aluguel': '#e67e22',
  'internet': '#f39c12',
  'luz': '#f39c12',
  
  // Investimentos
  'investimento': '#9B59B6',
  'poupança': '#8e44ad',
  'ações': '#9B59B6',
  'tesouro direto': '#9B59B6',
  
  // Transporte
  'transporte': '#3498db',
  'combustível': '#2980b9',
  'uber': '#3498db',
  
  // Saúde
  'saúde': '#e74c3c',
  'farmácia': '#c0392b',
  'médico': '#e74c3c',
  
  // Lazer
  'lazer': '#1abc9c',
  'entretenimento': '#16a085',
  'cinema': '#1abc9c',
  'streaming': '#16a085',
  
  // Educação
  'educação': '#9b59b6',
  'curso': '#8e44ad',
  'livro': '#9b59b6',
  
  // Compras
  'compras': '#e67e22',
  'roupa': '#d35400',
  'eletrônico': '#e67e22',
  
  // Outros
  'outros': '#95a5a6',
  'default': '#95a5a6',
} as const;

/**
 * Retorna a cor baseada no tipo de transação
 */
export const getTransactionColor = (type: TransactionType): string => {
  return TRANSACTION_COLORS[type] || TRANSACTION_COLORS.PAYMENT;
};

/**
 * Retorna a cor baseada na categoria
 */
export const getCategoryColor = (category?: string): string => {
  if (!category) return CATEGORY_COLORS.default;
  
  const lower = category.toLowerCase().trim();
  
  // Busca exata
  if (lower in CATEGORY_COLORS) {
    return CATEGORY_COLORS[lower as keyof typeof CATEGORY_COLORS];
  }
  
  // Busca por palavras-chave
  for (const [key, color] of Object.entries(CATEGORY_COLORS)) {
    if (lower.includes(key) || key.includes(lower)) {
      return color;
    }
  }
  
  return CATEGORY_COLORS.default;
};

/**
 * Retorna cor com opacidade
 */
export const getColorWithOpacity = (color: string, opacity: number): string => {
  // Converte hex para rgba
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};
