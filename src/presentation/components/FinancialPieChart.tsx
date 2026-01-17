import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';
import { Transaction, TransactionType } from '../../types';
import { TRANSACTION_TYPE_CONFIG } from '../../utils/constants';
import { formatCurrency, formatCurrencyCompact } from '../../utils';
import { INSIGHT_ICONS } from '../../utils/icons';

interface TypeData {
  type: string;
  amount: number;
  color: string;
  icon: string;
  percentage: number;
}

interface FinancialPieChartProps {
  transactions: Transaction[];
}

export function FinancialPieChart({ transactions }: FinancialPieChartProps) {
  // Agrupar transações por tipo
  const typeMap = new Map<TransactionType, number>();
  
  transactions.forEach(transaction => {
    const current = typeMap.get(transaction.type) || 0;
    typeMap.set(transaction.type, current + transaction.amount);
  });

  // Converter para array e ordenar por valor
  const typeData: TypeData[] = Array.from(typeMap.entries())
    .map(([type, amount]) => {
      const config = TRANSACTION_TYPE_CONFIG[type];
      return {
        type: config.label,
        amount: amount / 100, // Converter de centavos
        color: config.color,
        icon: config.icon,
        percentage: 0, // Será calculado abaixo
      };
    })
    .sort((a, b) => b.amount - a.amount);

  const totalAmount = typeData.reduce((sum, item) => sum + item.amount, 0);
  
  // Calcular percentuais
  typeData.forEach(item => {
    item.percentage = totalAmount > 0 ? item.amount / totalAmount : 0;
  });

  // Calcular saldo (receitas - despesas)
  const incomeTransactions = transactions.filter(t => t.type === 'DEPOSIT');
  const expenseTransactions = transactions.filter(t => 
    t.type === 'WITHDRAWAL' || t.type === 'PAYMENT' || t.type === 'TRANSFER' || t.type === 'INVESTMENT'
  );
  
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0) / 100;
  const totalExpense = expenseTransactions.reduce((sum, t) => sum + t.amount, 0) / 100;
  const balance = totalIncome - totalExpense;

  // Animação de escala
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = 0;
    scale.value = withSpring(1, {
      damping: 12,
      stiffness: 80,
    });
  }, [totalAmount]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const size = 200;
  const strokeWidth = 30;
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(value));
  };

  if (totalAmount === 0 || typeData.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Distribuição por Tipo</Text>
        <View style={styles.emptyState}>
          <Ionicons name="pie-chart-outline" size={48} color="#E0E0E0" />
          <Text style={styles.emptyText}>Sem dados para exibir</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Distribuição por Tipo de Transação</Text>
      
      <View style={styles.card}>
        <Animated.View style={[styles.chartContainer, animatedStyle]}>
          <Svg width={size} height={size}>
            <G rotation={-90} origin={`${center}, ${center}`}>
              {/* Círculo de fundo */}
              <Circle
                cx={center}
                cy={center}
                r={radius}
                stroke="#F0F0F0"
                strokeWidth={strokeWidth}
                fill="none"
              />

              {/* Arcos das categorias */}
              {typeData.map((item, index) => {
                // Calcular rotação acumulada
                const previousPercentage = typeData
                  .slice(0, index)
                  .reduce((sum, cat) => sum + cat.percentage, 0);
                const rotation = previousPercentage * 360;
                const strokeDashoffset = circumference * (1 - item.percentage);

                return (
                  <G key={item.type} rotation={rotation} origin={`${center}, ${center}`}>
                    <Circle
                      cx={center}
                      cy={center}
                      r={radius}
                      stroke={item.color}
                      strokeWidth={strokeWidth}
                      fill="none"
                      strokeDasharray={`${circumference} ${circumference}`}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                    />
                  </G>
                );
              })}
            </G>
            
            {/* Texto central */}
            <SvgText
              x={center}
              y={center - 10}
              fontSize="14"
              fontWeight="600"
              fill="#999"
              textAnchor="middle"
            >
              Saldo
            </SvgText>
            <SvgText
              x={center}
              y={center + 15}
              fontSize="20"
              fontWeight="700"
              fill={balance >= 0 ? "#4CAF50" : "#F44336"}
              textAnchor="middle"
            >
              {formatCurrency(balance)}
            </SvgText>
          </Svg>
        </Animated.View>

        {/* Legenda */}
        <View style={styles.legend}>
          {typeData.slice(0, 5).map((item, index) => (
            <View key={item.type}>
              <View style={styles.legendItem}>
                <View style={styles.legendLeft}>
                  <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                  <View style={styles.legendInfo}>
                    <Text style={styles.legendLabel}>{item.type}</Text>
                    <Text style={styles.legendPercentage}>{(item.percentage * 100).toFixed(1)}%</Text>
                  </View>
                </View>
                <Text style={[styles.legendValue, { color: item.color }]}>
                  {formatCurrency(item.amount)}
                </Text>
              </View>
              {index < Math.min(typeData.length - 1, 4) && <View style={styles.divider} />}
            </View>
          ))}
          {typeData.length > 5 && (
            <Text style={styles.moreCategories}>
              +{typeData.length - 5} tipos
            </Text>
          )}
        </View>
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
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  legend: {
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  legendInfo: {
    flex: 1,
  },
  legendLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  legendPercentage: {
    fontSize: 12,
    color: '#999',
  },
  legendValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
  moreCategories: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    marginTop: 12,
  },
});
