/**
 * Utilitários de formatação para moeda, datas e valores
 * Todas as funções de moeda esperam valores em CENTAVOS (ex: 1234 = R$ 12,34)
 */

import { format, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TransactionType } from '../domain/entities/Transaction';

// ============================================================================
// CONSTANTES DE FORMATAÇÃO (Performance Optimization)
// ============================================================================

/** Formatador de moeda brasileira (R$) - Reutilizável */
const CURRENCY_FORMATTER = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Formatador de valores numéricos sem símbolo (1.234,56) - Reutilizável */
const NUMBER_FORMATTER = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// ============================================================================
// FORMATADORES DE MOEDA
// ============================================================================

// Formata valor em centavos para moeda brasileira (ex: 1234 → "R$ 12,34")
export const formatCurrency = (value: number): string => {
  // Validação: retorna R$ 0,00 se valor inválido
  if (!isFinite(value) || isNaN(value)) {
    return CURRENCY_FORMATTER.format(0);
  }
  return CURRENCY_FORMATTER.format(value / 100);
};

// Formata valor sem símbolo de moeda (ex: 1234 → "12,34")
export const formatCurrencyValue = (value: number): string => {
  if (!isFinite(value) || isNaN(value)) {
    return NUMBER_FORMATTER.format(0);
  }
  return NUMBER_FORMATTER.format(value / 100);
};

// Formata valor com sinal - para despesas (ex: "R$ 12,34" ou "- R$ 50,00")
export const formatAmount = (value: number, type: TransactionType): string => {
  if (!isFinite(value) || isNaN(value)) {
    return `${type === 'DEPOSIT' ? '' : '- '}${CURRENCY_FORMATTER.format(0)}`;
  }
  const sign = type === 'DEPOSIT' ? '' : '- ';
  return `${sign}${formatCurrency(Math.abs(value))}`;
};

// Formata valores grandes de forma compacta (ex: "R$ 1.2K", "R$ 2.5M")
export const formatCurrencyCompact = (value: number): string => {
  if (!isFinite(value) || isNaN(value)) {
    return CURRENCY_FORMATTER.format(0);
  }
  
  const absValue = Math.abs(value / 100);
  const sign = value < 0 ? '-' : '';
  
  if (absValue >= 1000000) {
    return `${sign}R$ ${(absValue / 1000000).toFixed(1)}M`;
  }
  if (absValue >= 1000) {
    return `${sign}R$ ${(absValue / 1000).toFixed(1)}K`;
  }
  return formatCurrency(value);
};

// ============================================================================
// FORMATADORES DE DATA
// ============================================================================

// Formata data no formato brasileiro (ex: "15/01/2024")
export const formatDate = (date: Date, formatString: string = "dd/MM/yyyy"): string => {
  if (!date || !isValid(date)) {
    return '';
  }
  try {
    return format(date, formatString, { locale: ptBR });
  } catch (error) {
    console.warn('Erro ao formatar data:', error);
    return '';
  }
};

// Formata data por extenso (ex: "15 de janeiro de 2024")
export const formatDateLong = (date: Date): string => {
  if (!date || !isValid(date)) {
    return '';
  }
  try {
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  } catch (error) {
    console.warn('Erro ao formatar data longa:', error);
    return '';
  }
};

// Retorna "Hoje", "Ontem" ou data por extenso (ex: "8 de janeiro")
export const formatDateRelative = (date: Date): string => {
  if (!date || !isValid(date)) {
    return '';
  }
  try {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    const dateStr = format(date, 'yyyy-MM-dd');
    const nowStr = format(now, 'yyyy-MM-dd');
    const yesterdayStr = format(yesterday, 'yyyy-MM-dd');

    if (dateStr === nowStr) return 'Hoje';
    if (dateStr === yesterdayStr) return 'Ontem';
    return format(date, "dd 'de' MMMM", { locale: ptBR });
  } catch (error) {
    console.warn('Erro ao formatar data relativa:', error);
    return '';
  }
};

// Formata data para inputs (ex: "15/01/2024" ou placeholder se null)
export const formatDateInput = (date: Date | null, placeholder: string = 'Selecionar'): string => {
  if (!date || !isValid(date)) {
    return placeholder;
  }
  try {
    return date.toLocaleDateString('pt-BR');
  } catch (error) {
    console.warn('Erro ao formatar data input:', error);
    return placeholder;
  }
};

// ============================================================================
// FORMATADORES DE INPUT
// ============================================================================

// Formata entrada de moeda enquanto usuário digita (ex: "1234" → "12,34")
export const formatCurrencyInput = (value: string): string => {
  if (!value || typeof value !== 'string') {
    return '';
  }
  
  // Remove tudo que não é dígito
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';

  // Trata os dígitos como centavos (últimos 2 dígitos são decimais)
  const valueInCents = parseInt(digits, 10);
  
  // Validação
  if (isNaN(valueInCents)) {
    return '';
  }
  
  // Formata sem dividir por 100, pois já estamos tratando como centavos
  return NUMBER_FORMATTER.format(valueInCents / 100);
};

// ============================================================================
// OUTROS FORMATADORES
// ============================================================================

// Formata valor percentual (ex: 12.5 → "12.5%")
export const formatPercentage = (value: number): string => {
  if (!isFinite(value) || isNaN(value)) {
    return '0.0%';
  }
  return `${value.toFixed(1)}%`;
};