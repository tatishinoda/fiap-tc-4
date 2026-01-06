/**
 * Utilitários gerais da aplicação
 * Funções auxiliares para manipulação de strings, IDs e datas
 */

// ============================================================================
// GERAÇÃO DE IDS
// ============================================================================

// Gera um ID único baseado em timestamp e random
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// ============================================================================
// MANIPULAÇÃO DE STRINGS
// ============================================================================

// Trunca texto com reticências se exceder o tamanho máximo
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength - 3) + '...';
};

// Capitaliza a primeira letra de cada palavra
export const capitalizeWords = (text: string): string => {
  return text.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

// ============================================================================
// CÁLCULOS DE DATA
// ============================================================================

// Calcula a diferença em dias entre duas datas
export const daysBetween = (date1: Date, date2: Date): number => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};


