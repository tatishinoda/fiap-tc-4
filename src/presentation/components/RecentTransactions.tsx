import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Transaction } from '../../types';
import { formatAmount, formatDateRelative, getTransactionColor, getTransactionIcon } from '../../utils';

interface RecentTransactionsProps {
  transactions: Transaction[];
  isLoading?: boolean;
  onSeeAll: () => void;
  showTitle?: boolean;
  onTransactionPress?: (transaction: Transaction) => void;
}

export function RecentTransactions({ 
  transactions, 
  isLoading = false, 
  onSeeAll,
  showTitle = false,
  onTransactionPress
}: RecentTransactionsProps) {

  if (isLoading) {
    return (
      <View style={styles.container}>
        {showTitle && (
          <View style={styles.titleHeader}>
            <Text style={styles.sectionTitle}>Transações recentes</Text>
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
          <Text style={styles.sectionTitle}>Transações recentes</Text>
          <TouchableOpacity onPress={onSeeAll}>
            <Text style={styles.seeAllText}>Ver todas </Text>
          </TouchableOpacity>
        </View>
      )}
      
      {transactions.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="receipt-outline" size={56} color="#999999" />
          <Text style={styles.emptyText}>Nenhuma transação encontrada</Text>
          <Text style={styles.emptySubtext}>Comece adicionando sua primeira transação</Text>
        </View>
      ) : (
        <View style={styles.transactionsList}>
          {transactions.slice(0, 5).map((transaction) => (
            <TouchableOpacity 
              key={transaction.id} 
              style={styles.transactionItem}
              activeOpacity={0.7}
              onPress={() => onTransactionPress?.(transaction)}
            >
              <View style={styles.transactionLeft}>
                <View style={[
                  styles.iconContainer,
                  { backgroundColor: getTransactionColor(transaction.type) }
                ]}>
                  <Ionicons 
                    name={getTransactionIcon(transaction.type)} 
                    size={22} 
                    color="#FFFFFF" 
                  />
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionTitle} numberOfLines={1}>
                    {transaction.description}
                  </Text>
                  {transaction.category && (
                    <Text style={styles.transactionCategory} numberOfLines={1}>
                      {transaction.category}
                    </Text>
                  )}
                  <Text style={styles.transactionDate}>
                    {formatDateRelative(transaction.date)}
                  </Text>
                </View>
              </View>
              <View style={styles.transactionRight}>
                <Text style={[styles.amount]} numberOfLines={1}>
                  {formatAmount(transaction.amount, transaction.type)}
                </Text>
                <Ionicons name="chevron-forward" size={18} color="#999999" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  titleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: -0.3,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#024D60',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#999999',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
    textAlign: 'center',
  },
  transactionsList: {
    gap: 12,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  transactionInfo: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 3,
    lineHeight: 18,
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 0,
    flex: 1,
  },
  transactionCategory: {
    fontSize: 11,
    fontWeight: '500',
    color: '#666666',
    marginBottom: 2,
    lineHeight: 14,
  },
  dateSeparator: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#999999',
  },
  transactionDate: {
    fontSize: 10,
    fontWeight: '400',
    color: '#999999',
    lineHeight: 13,
  },
  transactionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 0,
  },
  amount: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.3,
    flexShrink: 0,
  },
});
