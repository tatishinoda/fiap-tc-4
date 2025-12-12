import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TransactionType } from '../types';

// Formata valor em centavos para moeda brasileira (R$ 1.234,56)
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value / 100);
};

// Formata valor numérico sem símbolo de moeda (1.234,56)
export const formatCurrencyValue = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
};

export const formatDate = (date: Date, formatString: string = "dd/MM/yyyy"): string => {
  return format(date, formatString, { locale: ptBR });
};

export const formatDateLong = (date: Date): string => {
  return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
};

// Retorna "Hoje", "Ontem" ou data por extenso para transações recentes
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

// Formata valor com sinal + ou - baseado no tipo da transação
export const formatAmount = (value: number, type: TransactionType): string => {
  const sign = type === 'DEPOSIT' ? '+' : '-';
  return `${sign}${formatCurrency(Math.abs(value))}`;
};

// Formata valores grandes de forma compacta (1K, 1M)
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

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};
