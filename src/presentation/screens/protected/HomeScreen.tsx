import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { CategoryAnalysis } from '../../components/CategoryAnalysis';
import { FinancialChart } from '../../components/FinancialChart';
import { FinancialInsights } from '../../components/FinancialInsights';
import { FinancialOverview } from '../../components/FinancialOverview';
import { FinancialPieChart } from '../../components/FinancialPieChart';
import { QuickActions } from '../../components/QuickActions';
import { RecentTransactions } from '../../components/RecentTransactions';
import { Alert } from '../../components/ui';
import { useAlert } from '../../hooks/useAlert';
import { useHomeViewModel } from '../../hooks/useHomeViewModel';
import { colors, spacing } from '../../../theme';
import { TransactionType } from '../../../types';
import { RootStackParamList } from '../../../types/navigation';
import { TRANSACTION_TYPE_CONFIG } from '../../../utils';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const {
    user,
    transactions,
    recentTransactions,
    balance,
    income,
    expenses,
    isLoading,
    error,
    refreshDashboard,
    clearError,
  } = useHomeViewModel();

  const { alert, showInfo } = useAlert();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshDashboard();
    setRefreshing(false);
  };

  const handleSeeAllTransactions = () => {
    navigation.navigate('Transactions');
  };

  const handleTransactionPress = (transaction: any) => {
    navigation.navigate('EditTransaction', { transactionId: transaction.id });
  };

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
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
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
          isLoading={isLoading}
        />

        {/* Ações Rápidas */}
        <QuickActions actions={quickActions} />

        {/* Análises Financeiras */}
        <FinancialInsights
          totalIncome={income}
          totalExpense={expenses}
          balance={balance}
          transactions={transactions}
          refreshing={refreshing}
        />

        {/* Transações Recentes */}
        <RecentTransactions
          transactions={recentTransactions}
          isLoading={isLoading}
          onSeeAll={handleSeeAllTransactions}
          onTransactionPress={handleTransactionPress}
          showTitle={true}
        />

        {/* Gráfico de Pizza - Distribuição Financeira */}
        <FinancialPieChart
          transactions={transactions}
        />

        {/* Gastos por Categoria */}
        <CategoryAnalysis transactions={transactions} />

        {/* Resumo Financeiro */}
        <FinancialChart
          data={{
            income: income,
            expense: expenses
          }}
          isLoading={isLoading}
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
  scrollContent: {
    paddingBottom: spacing.xl * 2,
    flexGrow: 1,
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
