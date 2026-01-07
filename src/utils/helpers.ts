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

// ============================================================================
// NORMALIZAÇÃO DE CATEGORIAS
// ============================================================================

// Normaliza uma categoria para comparação (case-insensitive e sem espaços extras)
export const normalizeCategory = (category: string): string => {
  return category.trim().toLowerCase();
};

// Encontra uma categoria existente que corresponda (case-insensitive)
// Retorna a categoria original da lista ou null se não encontrar
export const findExistingCategory = (
  inputCategory: string,
  existingCategories: string[]
): string | null => {
  const normalizedInput = normalizeCategory(inputCategory);
  
  const found = existingCategories.find(
    (cat) => normalizeCategory(cat) === normalizedInput
  );
  
  return found || null;
};

// Retorna a categoria a ser usada: 
// 1. Prioriza categorias sugeridas das constantes
// 2. Depois categorias existentes do usuário
// 3. Por último, usa o input do usuário
export const getUnifiedCategory = (
  inputCategory: string,
  existingCategories: string[],
  suggestedCategories: string[] = []
): string => {
  // Primeiro verifica nas categorias sugeridas (constants.ts)
  const fromSuggested = findExistingCategory(inputCategory, suggestedCategories);
  if (fromSuggested) {
    return fromSuggested;
  }
  
  // Depois verifica nas categorias existentes do usuário
  const fromExisting = findExistingCategory(inputCategory, existingCategories);
  if (fromExisting) {
    return fromExisting;
  }
  
  // Se não encontrou nada, usa a entrada do usuário (com trim)
  return inputCategory.trim();
};

/**
 * Combina múltiplas listas de categorias removendo duplicatas case-insensitive
 * Prioriza categorias que aparecem primeiro (sugeridas > existentes > outras)
 * @param categoriesLists - Arrays de categorias em ordem de prioridade
 * @returns Array unificado sem duplicatas
 */
export const combineCategories = (...categoriesLists: string[][]): string[] => {
  const seen = new Set<string>();
  const result: string[] = [];

  // Processa cada lista de categorias na ordem de prioridade
  for (const categories of categoriesLists) {
    for (const category of categories) {
      const normalized = normalizeCategory(category);
      
      // Se não vimos essa categoria ainda (case-insensitive), adiciona
      if (!seen.has(normalized)) {
        seen.add(normalized);
        result.push(category); // Adiciona com a capitalização original
      }
    }
  }

  return result.sort(); // Ordena alfabeticamente
};


