import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../hooks/useAuth';
import { TransactionService } from '../../services/TransactionService';
import { Transaction } from '../../types';
import { RootStackParamList } from '../../types/navigation';
import { FinancialChart } from '../../components/FinancialChart';
import { FinancialOverview } from '../../components/FinancialOverview';
import { RecentTransactions } from '../../components/RecentTransactions';
import { QuickActions } from '../../components/QuickActions';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!user) return;

    try {
      const [transactionsData, summaryData] = await Promise.all([
        TransactionService.getUserTransactions(user.id, 5), // Apenas 5 recentes
        TransactionService.getFinancialSummary(user.id),
      ]);

      setTransactions(transactionsData);
      setSummary(summaryData);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleSeeAllTransactions = () => {
    navigation.navigate('Transactions');
  };

  const quickActions = [
    {
      id: '1',
      title: 'Adicionar\nReceita',
      icon: 'add-circle',
      color: '#4CAF50',
      onPress: () => {
        // TODO: Navegar para tela de adicionar receita
        Alert.alert('Em breve', 'Funcionalidade em desenvolvimento');
      },
    },
    {
      id: '2',
      title: 'Adicionar\nDespesa',
      icon: 'remove-circle',
      color: '#F44336',
      onPress: () => {
        // TODO: Navegar para tela de adicionar despesa
        Alert.alert('Em breve', 'Funcionalidade em desenvolvimento');
      },
    },
    {
      id: '3',
      title: 'Transferir',
      icon: 'swap-horizontal',
      color: '#FF9800',
      onPress: () => {
        // TODO: Navegar para tela de transferência
        Alert.alert('Em breve', 'Funcionalidade em desenvolvimento');
      },
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Visão Financeira Geral */}
        <FinancialOverview 
          balance={summary.balance}
          totalIncome={summary.totalIncome}
          totalExpense={summary.totalExpense}
          isLoading={isLoading}
        />

        {/* Ações Rápidas */}
        <Text style={styles.sectionTitle}>Ações rápidas</Text>
        <QuickActions actions={quickActions} />

        {/* Transações Recentes */}
        <RecentTransactions 
          transactions={transactions}
          isLoading={isLoading}
          onSeeAll={handleSeeAllTransactions}
          showTitle={true}
        />
      
        {/* Receitas e despesas */}
        <Text style={styles.sectionTitle}>Receitas e despesas</Text>
        <FinancialChart 
          data={{
            income: summary.totalIncome,
            expense: summary.totalExpense
          }}
          isLoading={isLoading}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 20,
    marginTop: 12,
    letterSpacing: -0.3,
  },
});
