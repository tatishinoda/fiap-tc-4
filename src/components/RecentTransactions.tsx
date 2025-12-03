import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { Transaction } from '../types';

interface RecentTransactionsProps {
  transactions: Transaction[];
  isLoading?: boolean;
  onSeeAll: () => void;
  showTitle?: boolean;
}

export function RecentTransactions({ 
  transactions, 
  isLoading = false, 
  onSeeAll,
  showTitle = false
}: RecentTransactionsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value / 100);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'income':
        return 'arrow-up-circle';
      case 'expense':
        return 'arrow-down-circle';
      case 'transfer':
        return 'swap-horizontal';
      default:
        return 'ellipse';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'income':
        return '#4CAF50';
      case 'expense':
        return '#F44336';
      case 'transfer':
        return '#FF9800';
      default:
        return '#757575';
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        {showTitle && (
          <View style={styles.titleHeader}>
            <Text style={styles.title}>Transações recentes</Text>
          </View>
        )}
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando transações...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showTitle && (
        <View style={styles.titleHeader}>
          <Text style={styles.title}>Transações recentes</Text>
          <TouchableOpacity onPress={onSeeAll}>
            <Text style={styles.seeAllText}>Ver todas</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {!showTitle && (
        <View style={styles.header}>
          <TouchableOpacity onPress={onSeeAll}>
            <Text style={styles.seeAllText}>Ver todas</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {transactions.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="receipt-outline" size={48} color="#E0E0E0" />
          <Text style={styles.emptyText}>Nenhuma transação encontrada</Text>
          <Text style={styles.emptySubtext}>
            Comece adicionando sua primeira transação
          </Text>
        </View>
      ) : (
        <View style={styles.transactionsList}>
          {transactions.slice(0, 5).map((transaction) => (
            <TouchableOpacity key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionLeft}>
                <View style={[
                  styles.iconContainer,
                  { backgroundColor: `${getTransactionColor(transaction.type)}15` }
                ]}>
                  <Ionicons 
                    name={getTransactionIcon(transaction.type)} 
                    size={18} 
                    color={getTransactionColor(transaction.type)} 
                  />
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.description}>
                    {transaction.description}
                  </Text>
                  <Text style={styles.category}>
                    {transaction.category}
                  </Text>
                  <Text style={styles.date}>
                    {format(transaction.date, 'dd/MM/yyyy')}
                  </Text>
                </View>
              </View>
              <Text style={[
                styles.amount,
                { color: getTransactionColor(transaction.type) }
              ]}>
                {transaction.type === 'expense' ? '-' : '+'}
                {formatCurrency(Math.abs(transaction.amount))}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  titleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
  },
  seeAllText: {
    color: '#1A73E8',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    paddingVertical: 32,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  loadingText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '400',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.04)',
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
    marginTop: 12,
    marginBottom: 6,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    fontWeight: '400',
  },
  transactionsList: {
    gap: 12,
  },
  transactionItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.04)',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  transactionInfo: {
    flex: 1,
  },
  description: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  category: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
    fontWeight: '400',
  },
  date: {
    fontSize: 11,
    color: '#999',
    fontWeight: '400',
  },
  amount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
