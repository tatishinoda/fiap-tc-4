import React from 'react';
import { View, TextInput, FlatList, StyleSheet, Text } from 'react-native';
import { useTransactionSearch } from '../../hooks/useTransactionStream';
import { colors, spacing } from '../../theme';
import { formatCurrency, formatDate } from '../../utils';

/**
 * Exemplo de busca reativa com debounce
 * 
 * Demonstra:
 * - Debounce automático de 300ms (não faz busca a cada letra)
 * - distinctUntilChanged (não busca se o termo não mudou)
 * - UI responsiva sem lag
 * - Performance otimizada
 */
export function ReactiveSearchExample() {
  const { searchTerm, setSearchTerm, results } = useTransactionSearch();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔍 Busca Reativa com Debounce</Text>
      
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar transações (descrição ou categoria)..."
        placeholderTextColor={colors.neutral.medium}
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      <Text style={styles.resultCount}>
        {results.length} {results.length === 1 ? 'resultado' : 'resultados'}
      </Text>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.resultItem}>
            <View style={styles.resultInfo}>
              <Text style={styles.resultDescription}>{item.description}</Text>
              <Text style={styles.resultMeta}>
                {item.category} • {formatDate(item.date)}
              </Text>
            </View>
            <Text
              style={[
                styles.resultAmount,
                item.type === 'income' ? styles.income : styles.expense,
              ]}
            >
              {item.type === 'income' ? '+' : '-'}
              {formatCurrency(item.amount)}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {searchTerm
                ? '🔍 Nenhuma transação encontrada'
                : '💡 Digite para buscar transações'}
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />

      {/* Indicador de debounce */}
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>⚡ Performance:</Text>
        <Text style={styles.infoText}>
          • Debounce de 300ms (espera você parar de digitar)
        </Text>
        <Text style={styles.infoText}>
          • Não busca se o termo não mudou
        </Text>
        <Text style={styles.infoText}>
          • Busca instantânea no cache local (sem servidor)
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.neutral.dark,
    marginBottom: spacing.lg,
  },
  searchInput: {
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    padding: spacing.md,
    fontSize: 16,
    color: colors.neutral.dark,
    borderWidth: 1,
    borderColor: colors.neutral.light,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  resultCount: {
    fontSize: 14,
    color: colors.neutral.medium,
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  listContent: {
    flexGrow: 1,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  resultInfo: {
    flex: 1,
  },
  resultDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.neutral.dark,
    marginBottom: 4,
  },
  resultMeta: {
    fontSize: 12,
    color: colors.neutral.medium,
  },
  resultAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: spacing.md,
  },
  income: {
    color: colors.semantic.success,
  },
  expense: {
    color: colors.semantic.error,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyText: {
    fontSize: 16,
    color: colors.neutral.medium,
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: colors.brand.forest + '10',
    borderRadius: 12,
    padding: spacing.md,
    marginTop: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.brand.forest,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.neutral.dark,
    marginBottom: spacing.xs,
  },
  infoText: {
    fontSize: 12,
    color: colors.neutral.medium,
    marginBottom: spacing.xs / 2,
  },
});
