import { RecentTransactions } from '@/components/RecentTransactions';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { Dimensions, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { CategoryAnalysis } from '../../components/CategoryAnalysis';
import { FinancialChart } from '../../components/FinancialChart';
import { FinancialInsights } from '../../components/FinancialInsights';
import { FinancialOverview } from '../../components/FinancialOverview';
import { FinancialPieChart } from '../../components/FinancialPieChart';
import { QuickActions } from '../../components/QuickActions';
import { Alert } from '../../components/ui';
import { useAlert } from '../../hooks/useAlert';
import { useAuth } from '../../hooks/useAuth';
import { useFinancialSummary, useTransactions } from '../../hooks/useTransactionQueries';
import { colors, spacing } from '../../theme';
import { TransactionType } from '../../types';
import { RootStackParamList } from '../../types/navigation';
import { TRANSACTION_TYPE_CONFIG } from '../../utils';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { user } = useAuth();
  const { data: transactions = [], isLoading: loading, refetch } = useTransactions();
  const { data: summary } = useFinancialSummary();
  const { alert, showInfo } = useAlert();
  const windowWidth = Dimensions.get('window').width;
  const isDesktop = windowWidth >= 768;

  const [refreshing, setRefreshing] = useState(false);

  // Extrair valores do summary ou usar 0
  const balance = summary?.balance ?? 0;
  const income = summary?.income ?? 0;
  const expenses = summary?.expenses ?? 0;

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const recentTransactions = transactions.slice(0, 5);

  const handleSeeAllTransactions = () => {
    navigation.navigate('Transactions');
  };

  const handleTransactionPress = (transaction: any) => {
    navigation.navigate('EditTransaction', { transactionId: transaction.id });
  };

  // Ações rápidas usando configuração centralizada
  const quickActions = (['DEPOSIT', 'TRANSFER', 'WITHDRAWAL'] as TransactionType[]).map(
    (type, index) => {
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
    }
  );

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
          isLoading={loading}
        />

        {/* Ações Rápidas */}
        <QuickActions actions={quickActions} />

        {/* Widgets Container */}
        <View style={isDesktop ? styles.widgetsGrid : styles.widgetsMobile}>
          {/* Card de Análises */}
          <View style={isDesktop ? styles.widgetItem : null}>
            <FinancialInsights
              totalIncome={income}
              totalExpense={expenses}
              balance={balance}
              transactions={transactions}
              refreshing={refreshing}
            />
          </View>

          {/* Card de Transações Recentes */}
          <View style={isDesktop ? styles.widgetItem : null}>
            <RecentTransactions
              transactions={recentTransactions}
              isLoading={loading}
              onSeeAll={handleSeeAllTransactions}
              onTransactionPress={handleTransactionPress}
              showTitle={true}
            />
          </View>

          {/* Card de Gráfico Pizza */}
          <View style={isDesktop ? styles.widgetItem : null}>
            <FinancialPieChart transactions={transactions} />
          </View>

          {/* Card de Categorias */}
          <View style={isDesktop ? styles.widgetItem : null}>
            <CategoryAnalysis transactions={transactions} />
          </View>

          {/* Card de Resumo */}
          <View style={isDesktop ? styles.widgetItem : null}>
            <FinancialChart
              data={{
                income: income,
                expense: expenses,
              }}
              isLoading={loading}
              showTitle={true}
            />
          </View>
        </View>
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
  widgetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -10,
    maxWidth: 1100,
    alignSelf: 'center',
    width: '100%',
  },
  widgetsMobile: {
    flexDirection: 'column',
  },
  widgetItem: {
    width: '50%',
    paddingHorizontal: 10,
    marginBottom: 20,
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
