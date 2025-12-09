import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { formatCurrency } from '../utils';

interface FinancialOverviewProps {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  isLoading?: boolean;
}

export function FinancialOverview({ 
  balance, 
  totalIncome, 
  totalExpense, 
  isLoading = false 
}: FinancialOverviewProps) {
  const [showBalance, setShowBalance] = useState(true);

  const toggleBalanceVisibility = () => {
    setShowBalance(!showBalance);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#024D60', '#03607a', '#037a94']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientContainer}
        >
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Carregando dados financeiros...</Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#024D60', '#03607a', '#037a94']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientContainer}
      >
        {/* Header minimalista */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Saldo</Text>
            {/* <Text style={styles.headerSubtitle}>Conta corrente</Text> */}
          </View>
          <TouchableOpacity onPress={toggleBalanceVisibility} style={styles.eyeButton}>
            <Ionicons 
              name={showBalance ? 'eye-outline' : 'eye-off-outline'} 
              size={22} 
              color="rgba(255, 255, 255, 0.7)" 
            />
          </TouchableOpacity>
        </View>

        {/* Saldo principal clean */}
        <View style={styles.balanceSection}>
          <Text style={styles.balanceValue}>
            {showBalance ? formatCurrency(balance) : '••••••••'}
          </Text>
        </View>

        {/* Divisor elegante */}
        <View style={styles.divider} />

        {/* Resumo compacto */}
        <View style={styles.summarySection}>
          <View style={styles.summaryItem}>
            <View style={styles.summaryIndicator}>
              <View style={[styles.dot, { backgroundColor: '#00D4AA' }]} />
              <Text style={styles.summaryLabel}>Entradas</Text>
            </View>
            <Text style={styles.summaryValue}>
              {showBalance ? formatCurrency(totalIncome) : '••••••'}
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <View style={styles.summaryIndicator}>
              <View style={[styles.dot, { backgroundColor: '#FF6B6B' }]} />
              <Text style={styles.summaryLabel}>Saídas</Text>
            </View>
            <Text style={styles.summaryValue}>
              {showBalance ? formatCurrency(totalExpense) : '••••••'}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    marginHorizontal: -24,
    marginTop: 0,
  },
  gradientContainer: {
    paddingHorizontal: 28,
    paddingTop: 40,
    paddingBottom: 45,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '400',
    marginBottom: 2,
  },
  // headerSubtitle: {
  //   fontSize: 12,
  //   color: 'rgba(255, 255, 255, 0.5)',
  //   fontWeight: '400',
  // },
  eyeButton: {
    padding: 8,
    borderRadius: 12
  },
  balanceSection: {
    marginBottom: 20,
  },
  balanceValue: {
    fontSize: 42,
    fontWeight: '300',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 24,
  },
  summarySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
  },
  summaryIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '400',
  },
  summaryValue: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '400',
  },
});
