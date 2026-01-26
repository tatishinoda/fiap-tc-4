/**
 * Configuração de cores para transações
 * Responsável por toda a lógica visual de cores
 * 
 * ============================================================================
 * IMPORTANTE: Ao adicionar um novo tipo de transação, adicione a cor aqui!
 * ============================================================================
 * 
 * Dica: Use cores distintas e acessíveis para cada tipo
 */

import { TransactionType } from '../domain/entities/Transaction';

// ============================================================================
// MAPEAMENTO DE CORES
// ============================================================================

/** Mapa de cores por tipo de transação */
export const TRANSACTION_COLORS: Record<TransactionType, string> = {
  DEPOSIT: '#00D4AA',      // Verde - Receitas
  WITHDRAWAL: '#FF8C42',   // Laranja - Saques
  TRANSFER: '#4A90E2',     // Azul - Transferências
  PAYMENT: '#FF6B6B',      // Vermelho - Pagamentos
  INVESTMENT: '#9B59B6',   // Roxo - Investimentos
};

// ============================================================================
// FUNÇÕES
// ============================================================================

/**
 * Retorna a cor para um tipo de transação
 * @param type - Tipo da transação
 * @returns Cor em formato hexadecimal
 */
export function getTransactionColor(type: TransactionType): string {
  return TRANSACTION_COLORS[type] || '#95a5a6';
}

/**
 * Retorna cor hexadecimal convertida para rgba com opacidade
 * @param color - Cor em formato hexadecimal
 * @param opacity - Opacidade de 0 a 1
 * @returns Cor em formato rgba
 */
export function getColorWithOpacity(color: string, opacity: number): string {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
