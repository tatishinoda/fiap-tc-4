import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ChartData {
  income: number;
  expense: number;
}

interface FinancialChartProps {
  data: ChartData;
  isLoading?: boolean;
}

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 80;
const CHART_HEIGHT = 120;

export function FinancialChart({ data, isLoading = false }: FinancialChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value / 100);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando gráfico...</Text>
        </View>
      </View>
    );
  }

  const total = data.income + data.expense;
  const incomePercentage = total > 0 ? (data.income / total) * 100 : 50;
  const expensePercentage = total > 0 ? (data.expense / total) * 100 : 50;

  return (
    <View style={styles.container}>
      {total === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="bar-chart-outline" size={48} color="#E0E0E0" />
          <Text style={styles.emptyText}>Nenhum dado para exibir</Text>
        </View>
      ) : (
        <View style={styles.chartContainer}>
          {/* Progress Bar Chart */}
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressSegment,
                { 
                  width: `${incomePercentage}%`,
                  backgroundColor: '#4CAF50'
                }
              ]} 
            />
            <View 
              style={[
                styles.progressSegment,
                { 
                  width: `${expensePercentage}%`,
                  backgroundColor: '#F44336'
                }
              ]} 
            />
          </View>
          
          {/* Legend */}
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
              <Text style={styles.legendLabel}>
                Entradas ({incomePercentage.toFixed(0)}%)
              </Text>
              <Text style={styles.legendValue}>
                {formatCurrency(data.income)}
              </Text>
            </View>
            
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#F44336' }]} />
              <Text style={styles.legendLabel}>
                Saídas ({expensePercentage.toFixed(0)}%)
              </Text>
              <Text style={styles.legendValue}>
                {formatCurrency(data.expense)}
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.04)',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  loadingText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '400',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
    color: '#888',
    marginTop: 12,
    fontWeight: '400',
  },
  chartContainer: {
    paddingVertical: 4,
  },
  progressBar: {
    height: 8,
    flexDirection: 'row',
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#F8F9FA',
    marginBottom: 20,
  },
  progressSegment: {
    height: '100%',
  },
  legend: {
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  legendColor: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  legendLabel: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    fontWeight: '400',
  },
  legendValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});
