import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { formatCurrency } from '../../utils';

interface QuickAction {
  id: string;
  title: string;
  icon: string;
  color: string;
  onPress: () => void;
}

interface FinancialOverviewProps {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  isLoading?: boolean;
  actions?: QuickAction[];
}

export function FinancialOverview({
  balance,
  totalIncome,
  totalExpense,
  isLoading = false,
  actions = []
}: FinancialOverviewProps) {
  const [showBalance, setShowBalance] = useState(true);
  const [hoveredActionId, setHoveredActionId] = useState<string | null>(null);

  const windowWidth = Dimensions.get('window').width;
  const isDesktop = Platform.OS === 'web' && windowWidth >= 768;

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
        style={[styles.gradientContainer, !isDesktop && styles.gradientContainerMobile]}
      >
        <View style={isDesktop ? styles.desktopLayout : styles.mobileLayout}>
          {/* Coluna Esquerda: Saldo + Entradas/Saídas */}
          <View style={isDesktop ? styles.leftColumn : styles.fullWidth}>
            {/* Header minimalista */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Text style={styles.headerTitle}>Saldo</Text>
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
          </View>

          {/* Coluna Direita: Botões de Ação (apenas desktop) */}
          {isDesktop && actions.length > 0 && (
            <View style={styles.rightColumn}>
              <View style={styles.actionsContainer}>
                {actions.map((action) => {
                  const isHovered = hoveredActionId === action.id;
                  return (
                    <TouchableOpacity
                      key={action.id}
                      style={[
                        styles.actionButton,
                        isHovered && { backgroundColor: 'rgba(255, 255, 255, 0.15)' }
                      ]}
                      onPress={action.onPress}
                      activeOpacity={0.7}
                      {...(Platform.OS === 'web' && {
                        onMouseEnter: () => setHoveredActionId(action.id),
                        onMouseLeave: () => setHoveredActionId(null),
                      } as any)}
                    >
                      <View style={[styles.iconCircle, { backgroundColor: action.color }]}>
                        <Ionicons name={action.icon as any} size={24} color="#FFFFFF" />
                      </View>
                      <Text style={styles.actionText}>{action.title}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}
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
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  gradientContainerMobile: {
    borderRadius: 0,
  },
  desktopLayout: {
    flexDirection: 'row',
    gap: 32,
  },
  mobileLayout: {
    flexDirection: 'column',
  },
  leftColumn: {
    flex: 1,
    minWidth: 0,
  },
  rightColumn: {
    width: 220,
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
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
