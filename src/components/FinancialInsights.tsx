import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  Easing,
  withTiming,
} from 'react-native-reanimated';
import { Transaction } from '../types';

interface FinancialInsightsProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactions: Transaction[];
  refreshing?: boolean;
}

export function FinancialInsights({
  totalIncome,
  totalExpense,
  balance,
  transactions,
  refreshing = false,
}: FinancialInsightsProps) {
  // Converter de centavos para reais
  const incomeValue = totalIncome / 100;
  const expenseValue = totalExpense / 100;
  const balanceValue = balance / 100;
  
  // Filtrar apenas transações de despesa
  const expenseTransactions = transactions.filter(t => 
    t.type === 'WITHDRAWAL' || t.type === 'PAYMENT' || t.type === 'TRANSFER' || t.type === 'INVESTMENT'
  );
  
  // Calcular métricas
  const savingsRate = incomeValue > 0 ? ((incomeValue - expenseValue) / incomeValue) * 100 : 0;
  const avgExpense = expenseTransactions.length > 0 ? expenseValue / expenseTransactions.length : 0;
  const financialHealth = balanceValue > 0 ? 'Positivo' : 'Atenção';
  const healthColor = balanceValue > 0 ? '#4CAF50' : '#FF9800';

  // Animações para cada card
  const card1TranslateY = useSharedValue(50);
  const card1Opacity = useSharedValue(0);
  const card2TranslateY = useSharedValue(50);
  const card2Opacity = useSharedValue(0);
  const card3TranslateY = useSharedValue(50);
  const card3Opacity = useSharedValue(0);
  const card4TranslateY = useSharedValue(50);
  const card4Opacity = useSharedValue(0);

  useEffect(() => {
    // Resetar antes de animar
    card1TranslateY.value = 50;
    card1Opacity.value = 0;
    card2TranslateY.value = 50;
    card2Opacity.value = 0;
    card3TranslateY.value = 50;
    card3Opacity.value = 0;
    card4TranslateY.value = 50;
    card4Opacity.value = 0;

    // Animar cada card com delay escalonado (slide + fade)
    card1TranslateY.value = withSpring(0, { damping: 20, stiffness: 90 });
    card1Opacity.value = withTiming(1, { duration: 600 });
    
    card2TranslateY.value = withDelay(100, withSpring(0, { damping: 20, stiffness: 90 }));
    card2Opacity.value = withDelay(100, withTiming(1, { duration: 600 }));
    
    card3TranslateY.value = withDelay(200, withSpring(0, { damping: 20, stiffness: 90 }));
    card3Opacity.value = withDelay(200, withTiming(1, { duration: 600 }));
    
    card4TranslateY.value = withDelay(300, withSpring(0, { damping: 20, stiffness: 90 }));
    card4Opacity.value = withDelay(300, withTiming(1, { duration: 600 }));
  }, [totalIncome, totalExpense, balance, refreshing]);

  const card1Style = useAnimatedStyle(() => ({
    transform: [{ translateY: card1TranslateY.value }],
    opacity: card1Opacity.value,
  }));

  const card2Style = useAnimatedStyle(() => ({
    transform: [{ translateY: card2TranslateY.value }],
    opacity: card2Opacity.value,
  }));

  const card3Style = useAnimatedStyle(() => ({
    transform: [{ translateY: card3TranslateY.value }],
    opacity: card3Opacity.value,
  }));

  const card4Style = useAnimatedStyle(() => ({
    transform: [{ translateY: card4TranslateY.value }],
    opacity: card4Opacity.value,
  }));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Análises Financeiras</Text>
      
      <View style={styles.insightsGrid}>
        {/* Taxa de Economia */}
        <Animated.View style={[styles.insightCard, card1Style]}>
          <LinearGradient
            colors={['#667EEA', '#764BA2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="trending-up" size={24} color="#FFF" />
            </View>
            <Text style={styles.insightLabel}>Taxa de Economia</Text>
            <Text style={styles.insightValue}>{savingsRate.toFixed(1)}%</Text>
            <Text style={styles.insightDescription}>
              {savingsRate > 20 ? 'Excelente!' : savingsRate > 10 ? 'Bom' : 'Pode melhorar'}
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Saúde Financeira */}
        <Animated.View style={[styles.insightCard, card2Style]}>
          <LinearGradient
            colors={balanceValue > 0 ? ['#4CAF50', '#45B7A0'] : ['#FF9800', '#F57C00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="heart" size={24} color="#FFF" />
            </View>
            <Text style={styles.insightLabel}>Saúde Financeira</Text>
            <Text style={styles.insightValue}>{financialHealth}</Text>
            <Text style={styles.insightDescription}>
              Saldo {balanceValue > 0 ? 'positivo' : 'negativo'}
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Gasto Médio */}
        <Animated.View style={[styles.insightCard, card3Style]}>
          <LinearGradient
            colors={['#F093FB', '#F5576C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="analytics" size={24} color="#FFF" />
            </View>
            <Text style={styles.insightLabel}>Gasto Médio</Text>
            <Text style={styles.insightValue}>{formatCurrency(avgExpense)}</Text>
            <Text style={styles.insightDescription}>Por transação</Text>
          </LinearGradient>
        </Animated.View>

        {/* Total de Transações */}
        <Animated.View style={[styles.insightCard, card4Style]}>
          <LinearGradient
            colors={['#4FACFE', '#00F2FE']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="receipt" size={24} color="#FFF" />
            </View>
            <Text style={styles.insightLabel}>Transações</Text>
            <Text style={styles.insightValue}>{transactions.length}</Text>
            <Text style={styles.insightDescription}>Total de operações</Text>
          </LinearGradient>
        </Animated.View>
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
  insightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  insightCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  gradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 8,
  },
  insightValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 4,
  },
  insightDescription: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
});
