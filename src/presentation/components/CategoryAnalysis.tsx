import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Transaction } from '../../types';
import { formatCurrency } from '../../utils';

interface CategoryAnalysisProps {
  transactions: Transaction[];
}

interface CategoryData {
  category: string;
  total: number;
  count: number;
  percentage: number;
}

export function CategoryAnalysis({ transactions }: CategoryAnalysisProps) {
  // Filtrar apenas transações de despesa
  const expenseTransactions = transactions.filter(t => 
    t.type === 'WITHDRAWAL' || t.type === 'PAYMENT' || t.type === 'TRANSFER' || t.type === 'INVESTMENT'
  );
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

  const categoryMap = new Map<string, CategoryData>();

  expenseTransactions.forEach(transaction => {
    const categoryName = transaction.category || 'Sem categoria';
    const existing = categoryMap.get(categoryName);

    if (existing) {
      existing.total += transaction.amount;
      existing.count += 1;
    } else {
      categoryMap.set(categoryName, {
        category: categoryName,
        total: transaction.amount,
        count: 1,
        percentage: 0,
      });
    }
  });

  // Calcular percentuais e ordenar
  const categories = Array.from(categoryMap.values())
    .map(cat => ({
      ...cat,
      percentage: totalExpenses > 0 ? (cat.total / totalExpenses) * 100 : 0,
      total: cat.total / 100, // Converter de centavos
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5); // Top 5 categorias

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (categories.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Gastos por Categoria</Text>
      
      <View style={styles.card}>
        {categories.map((category, index) => (
          <View key={index} style={styles.categoryItem}>
            <View style={styles.categoryHeader}>
              <View style={styles.categoryLeft}>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{category.category}</Text>
                  <Text style={styles.categoryCount}>{category.count} transações</Text>
                </View>
              </View>

              <View style={styles.categoryRight}>
                <Text style={styles.categoryAmount}>{formatCurrency(category.total)}</Text>
                <Text style={styles.categoryPercentage}>{category.percentage.toFixed(1)}%</Text>
              </View>
            </View>

            {/* Barra de progresso */}
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${category.percentage}%`,
                    backgroundColor: '#F44336'
                  }
                ]} 
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  categoryItem: {
    marginBottom: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  categoryLeft: {
    flex: 1,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  categoryCount: {
    fontSize: 12,
    color: '#999',
  },
  categoryRight: {
    alignItems: 'flex-end',
  },
  categoryAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  categoryPercentage: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
});
