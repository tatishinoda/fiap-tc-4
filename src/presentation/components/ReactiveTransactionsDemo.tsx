import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useTransactionStream, useFinancialSummary, useRecentTransactions } from '../../hooks/useTransactionStream';
import { colors, spacing } from '../../theme';
import { formatCurrency } from '../../utils';

/**
 * Exemplo de componente usando Programação Reativa com RxJS
 * 
 * Features demonstradas:
 * - useTransactionStream: Stream reativo de todas transações
 * - useFinancialSummary: Cálculo reativo de resumo financeiro
 * - useRecentTransactions: Stream das últimas 5 transações
 * - Atualizações em tempo real via Firestore onSnapshot
 * - Sem necessidade de refetch manual
 */
export function ReactiveTransactionsDemo() {
  // Hook com stream reativo - atualiza automaticamente quando Firebase muda
  const { transactions, loading, error } = useTransactionStream();
  
  // Resumo financeiro calculado reativamente
  const summary = useFinancialSummary();
  
  // Últimas 5 transações reativamente
  const recentTransactions = useRecentTransactions();

  // Log para demonstrar atualizações em tempo real
  useEffect(() => {
    console.log('🔄 Transações atualizadas reativamente:', transactions.length);
  }, [transactions]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Carregando transações...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Erro: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Resumo Financeiro Reativo */}
      <View style={styles.summaryCard}>
        <Text style={styles.title}>💰 Resumo Reativo</Text>
        
        <View style={styles.summaryRow}>
          <Text style={styles.label}>Receitas:</Text>
          <Text style={[styles.value, styles.income]}>
            {formatCurrency(summary.totalIncome)}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.label}>Despesas:</Text>
          <Text style={[styles.value, styles.expense]}>
            {formatCurrency(summary.totalExpenses)}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.label}>Saldo:</Text>
          <Text
            style={[
              styles.value,
              styles.balance,
              summary.balance < 0 && styles.negative,
            ]}
          >
            {formatCurrency(summary.balance)}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.label}>Total:</Text>
          <Text style={styles.value}>{summary.transactionCount} transações</Text>
        </View>

        {summary.topCategory && (
          <View style={styles.summaryRow}>
            <Text style={styles.label}>Top Categoria:</Text>
            <Text style={styles.value}>{summary.topCategory}</Text>
          </View>
        )}
      </View>

      {/* Lista de Transações Recentes Reativas */}
      <View style={styles.transactionsCard}>
        <Text style={styles.title}>⚡ Transações Recentes (Stream)</Text>
        <Text style={styles.subtitle}>
          Atualizações em tempo real via Firestore onSnapshot + RxJS
        </Text>

        <FlatList
          data={recentTransactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.transactionItem}>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionDescription}>
                  {item.description}
                </Text>
                <Text style={styles.transactionCategory}>{item.category}</Text>
              </View>
              <Text
                style={[
                  styles.transactionAmount,
                  item.type === 'income' ? styles.income : styles.expense,
                ]}
              >
                {item.type === 'income' ? '+' : '-'}
                {formatCurrency(item.amount)}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhuma transação ainda</Text>
          }
        />
      </View>

      {/* Indicador de atualização em tempo real */}
      <View style={styles.realtimeIndicator}>
        <View style={styles.pulsingDot} />
        <Text style={styles.realtimeText}>
          🔴 Conectado ao Firebase (Tempo Real)
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.neutral.background,
  },
  summaryCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transactionsCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    padding: spacing.lg,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.neutral.dark,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: 12,
    color: colors.neutral.medium,
    marginBottom: spacing.md,
    fontStyle: 'italic',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.light,
  },
  label: {
    fontSize: 14,
    color: colors.neutral.medium,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.neutral.dark,
  },
  income: {
    color: colors.semantic.success,
  },
  expense: {
    color: colors.semantic.error,
  },
  balance: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  negative: {
    color: colors.semantic.error,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.light,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral.dark,
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 12,
    color: colors.neutral.medium,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: colors.neutral.medium,
    marginTop: spacing.lg,
  },
  loadingText: {
    textAlign: 'center',
    color: colors.neutral.medium,
    fontSize: 16,
  },
  errorText: {
    textAlign: 'center',
    color: colors.semantic.error,
    fontSize: 16,
  },
  realtimeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.neutral.light,
    borderRadius: 8,
  },
  pulsingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.semantic.error,
    marginRight: spacing.sm,
  },
  realtimeText: {
    fontSize: 12,
    color: colors.neutral.medium,
    fontWeight: '600',
  },
});
