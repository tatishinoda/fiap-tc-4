import { Ionicons } from '@expo/vector-icons';
import { TransactionType } from '../types';

/**
 * Ícones por tipo de transação
 */
export const TRANSACTION_ICONS = {
  DEPOSIT: 'arrow-down-circle',
  WITHDRAWAL: 'cash-outline',
  TRANSFER: 'swap-horizontal',
  PAYMENT: 'card-outline',
  INVESTMENT: 'trending-up',
} as const;

/**
 * Ícones por categoria
 */
export const CATEGORY_ICONS = {
  // Alimentação
  'alimentação': 'restaurant',
  'mercado': 'cart',
  'restaurante': 'fast-food',
  
  // Renda
  'salário': 'wallet',
  'renda': 'cash',
  'trabalho': 'briefcase',
  'freelance': 'laptop',
  
  // Contas
  'conta': 'document-text',
  'aluguel': 'home',
  'internet': 'wifi',
  'luz': 'flash',
  
  // Investimentos
  'investimento': 'trending-up',
  'poupança': 'analytics',
  'ações': 'stats-chart',
  'tesouro direto': 'server',
  
  // Transporte
  'transporte': 'car',
  'combustível': 'water',
  'uber': 'car-sport',
  
  // Saúde
  'saúde': 'medkit',
  'farmácia': 'medical',
  'médico': 'fitness',
  
  // Lazer
  'lazer': 'game-controller',
  'entretenimento': 'film',
  'cinema': 'videocam',
  'streaming': 'play-circle',
  
  // Educação
  'educação': 'school',
  'curso': 'book',
  'livro': 'library',
  
  // Compras
  'compras': 'bag-handle',
  'roupa': 'shirt',
  'eletrônico': 'phone-portrait',
  
  // Outros
  'outros': 'ellipse',
  'default': 'ellipse',
} as const;

/**
 * Retorna o ícone baseado no tipo de transação
 */
export const getTransactionIcon = (type: TransactionType): keyof typeof Ionicons.glyphMap => {
  return TRANSACTION_ICONS[type] || 'ellipse';
};

/**
 * Retorna o ícone apropriado baseado na categoria
 */
export const getCategoryIcon = (category?: string): keyof typeof Ionicons.glyphMap => {
  if (!category) return CATEGORY_ICONS.default;
  
  const lower = category.toLowerCase().trim();
  
  // Busca exata
  if (lower in CATEGORY_ICONS) {
    return CATEGORY_ICONS[lower as keyof typeof CATEGORY_ICONS];
  }
  
  // Busca por palavras-chave
  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (lower.includes(key) || key.includes(lower)) {
      return icon;
    }
  }
  
  return CATEGORY_ICONS.default;
};
