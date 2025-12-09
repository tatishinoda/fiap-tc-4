import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../hooks/useAuth';
import { useTransactionContext } from '../../context';
import { RootStackParamList } from '../../types/navigation';
import { FinancialChart } from '../../components/FinancialChart';
import { FinancialOverview } from '../../components/FinancialOverview';
import { RecentTransactions } from '../../components/RecentTransactions';
import { QuickActions } from '../../components/QuickActions';
import { Text, Alert } from '../../components/ui';
import { colors, typography, layout, spacing } from '../../theme';
import { useAlert } from '../../hooks/useAlert';
import { TRANSACTION_TYPE_CONFIG } from '../../utils';
import { TransactionType } from '../../types';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { user } = useAuth();
  const {
    transactions,
    loading,
    balance,
    income,
    expenses,
    refreshTransactions,
  } = useTransactionContext();
  const { alert, showInfo } = useAlert();
  
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshTransactions();
    setRefreshing(false);
  };

  const recentTransactions = transactions.slice(0, 5);

  const handleSeeAllTransactions = () => {
    navigation.navigate('Transactions');
  };

  // Ações rápidas usando configuração centralizada
  const quickActions = (['DEPOSIT', 'TRANSFER', 'WITHDRAWAL'] as TransactionType[]).map((type, index) => {
    const config = TRANSACTION_TYPE_CONFIG[type];
    return {
      id: String(index + 1),
      title: config.label,
      icon: config.icon,
      color: config.color,
      onPress: () => {
        navigation.navigate('AddTransaction', { type });
      },
    };
  });

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={colors.brand.forest}
          />
        }
      >
        {/* Visão Financeira Geral */}
        <FinancialOverview 
          balance={balance}
          totalIncome={income}
          totalExpense={expenses}
          isLoading={loading}
        />

        {/* Ações Rápidas */}
        <QuickActions actions={quickActions} />

        {/* Transações Recentes */}
        <RecentTransactions 
          transactions={recentTransactions}
          isLoading={loading}
          onSeeAll={handleSeeAllTransactions}
          showTitle={true}
        />
      
        {/* Resumo Financeiro */}
        <FinancialChart 
          data={{
            income: income,
            expense: expenses
          }}
          isLoading={loading}
          showTitle={true}
        />
      </ScrollView>

      {/* Alert */}
      <Alert {...alert} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: 0,
  },
  header: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    color: '#1a1a1a',
  },
});
