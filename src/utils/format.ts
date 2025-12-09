import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TransactionType } from '../types';

/**
 * Formata valor em centavos para moeda brasileira
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value / 100);
};

/**
 * Formata valor sem o símbolo de moeda
 */
export const formatCurrencyValue = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
};

/**
 * Formata data para formato brasileiro
 */
export const formatDate = (date: Date, formatString: string = "dd/MM/yyyy"): string => {
  return format(date, formatString, { locale: ptBR });
};

/**
 * Formata data completa com mês por extenso
 */
export const formatDateLong = (date: Date): string => {
  return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
};

/**
 * Formata data relativa (hoje, ontem, etc)
 */
export const formatDateRelative = (date: Date): string => {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  if (format(date, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd')) {
    return 'Hoje';
  }
  if (format(date, 'yyyy-MM-dd') === format(yesterday, 'yyyy-MM-dd')) {
    return 'Ontem';
  }
  return format(date, "dd 'de' MMMM", { locale: ptBR });
};

/**
 * Formata valor com sinal baseado no tipo de transação
 */
export const formatAmount = (value: number, type: TransactionType): string => {
  const sign = type === 'DEPOSIT' ? '+' : '-';
  return `${sign}${formatCurrency(Math.abs(value))}`;
};

/**
 * Formata valor compacto (1000 -> 1K, 1000000 -> 1M)
 */
export const formatCurrencyCompact = (value: number): string => {
  const absValue = Math.abs(value / 100);
  if (absValue >= 1000000) {
    return `R$ ${(absValue / 1000000).toFixed(1)}M`;
  }
  if (absValue >= 1000) {
    return `R$ ${(absValue / 1000).toFixed(1)}K`;
  }
  return formatCurrency(value);
};

/**
 * Formata porcentagem
 */
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};
