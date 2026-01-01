import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import { DocumentSnapshot } from 'firebase/firestore';
import { useAuth } from '../../hooks/useAuth';
import { useTransactionContext } from '../../context';
import { Transaction } from '../../types';
import { RootStackParamList } from '../../types/navigation';
import { formatAmount, getTransactionColor, getCategoryColor, getCategoryIcon } from '../../utils';
import * as TransactionService from '../../services/TransactionService';

type TransactionsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Transactions'>;

interface TransactionsScreenProps {
  navigation: TransactionsScreenNavigationProp;
}

type FilterType = 'all' | 'income' | 'expense' | 'transfer';

export default function TransactionsScreen({ navigation }: TransactionsScreenProps) {
  const { user } = useAuth();
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');

  // Infinite scroll state
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 10;

  // Reload transactions when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (user?.id) {
        loadInitialTransactions();
      }
    }, [user?.id])
  );

  useEffect(() => {
    applyFilters();
  }, [allTransactions, searchQuery, selectedFilter]);

  const loadInitialTransactions = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const { transactions, lastDoc: newLastDoc } = await TransactionService.getTransactionsPaginated(
        user.id,
        PAGE_SIZE
      );
      setAllTransactions(transactions);
      setLastDoc(newLastDoc);
      setHasMore(newLastDoc !== null);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
      Alert.alert('Erro', 'Não foi possível carregar as transações');
    } finally {
      setLoading(false);
    }
  };

  const loadMoreTransactions = async () => {
    if (!user?.id || !hasMore || loadingMore) return;

    setLoadingMore(true);
    try {
      const { transactions, lastDoc: newLastDoc } = await TransactionService.getTransactionsPaginated(
        user.id,
        PAGE_SIZE,
        lastDoc || undefined
      );
      // Ensure no duplicates by filtering out transactions that already exist
      setAllTransactions(prev => {
        const existingIds = new Set(prev.map(t => t.id));
        const newTransactions = transactions.filter(t => !existingIds.has(t.id));
        return [...prev, ...newTransactions];
      });
      setLastDoc(newLastDoc);
      setHasMore(newLastDoc !== null);
    } catch (error) {
      console.error('Erro ao carregar mais transações:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allTransactions];

    // Filtro por tipo
    if (selectedFilter !== 'all') {
      if (selectedFilter === 'income') {
        filtered = filtered.filter(t => t.type === 'DEPOSIT');
      } else if (selectedFilter === 'expense') {
        filtered = filtered.filter(t => t.type !== 'DEPOSIT');
      } else if (selectedFilter === 'transfer') {
        filtered = filtered.filter(t => t.type === 'TRANSFER');
      }
    }

    // Filtro por busca
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        t.description.toLowerCase().includes(query) ||
        (t.category && t.category.toLowerCase().includes(query))
      );
    }

    setFilteredTransactions(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setLastDoc(null);
    setHasMore(true);
    await loadInitialTransactions();
    setRefreshing(false);
  };

  const renderFooter = () => {
    if (loadingMore) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color="#4a9fb8" />
          <Text style={styles.footerText}>Carregando mais...</Text>
        </View>
      );
    }

    // Show end message if there are transactions and no more to load
    if (!hasMore && filteredTransactions.length > 0 && !loading) {
      return (
        <View style={styles.endOfList}>
          <Ionicons name="checkmark-circle-outline" size={20} color="#6b7280" />
          <Text style={styles.endOfListText}>Você chegou ao fim da lista</Text>
        </View>
      );
    }

    return null;
  };

  const renderEmptyState = () => (
    <View style={styles.centerState}>
      <View style={styles.emptyCard}>
        <Ionicons
          name={searchQuery ? "search-outline" : "receipt-outline"}
          size={64}
          color="rgba(0, 0, 0, 0.3)"
        />
        <Text style={styles.emptyTitle}>
          {searchQuery ? 'Nenhum resultado encontrado' : 'Nenhuma transação encontrada'}
        </Text>
        <Text style={styles.emptySubtitle}>
          {searchQuery
            ? 'Tente buscar por outro termo'
            : 'Comece adicionando sua primeira transação'}
        </Text>
      </View>
    </View>
  );

  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <TouchableOpacity
      style={styles.transactionItem}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('EditTransaction', { transactionId: item.id })}
    >
      <View style={styles.transactionLeft}>
        <View style={[
          styles.iconContainer,
          { backgroundColor: getCategoryColor(item.category) }
        ]}>
          <Ionicons
            name={getCategoryIcon(item.category)}
            size={22}
            color="#FFFFFF"
          />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionTitle}>
            {item.description}
          </Text>
          <Text style={styles.transactionCategory}>
            {item.category}
          </Text>
        </View>
      </View>
      <View style={styles.transactionRight}>
        <Text style={[
          styles.amount,
          { color: getTransactionColor(item.type) }
        ]}>
          {formatAmount(item.amount, item.type)}
        </Text>
        <Ionicons name="chevron-forward" size={18} color="#999999" />
      </View>
    </TouchableOpacity>
  );

  const getFilterLabel = (filter: FilterType) => {
    switch (filter) {
      case 'all': return 'Todas';
      case 'income': return 'Receitas';
      case 'expense': return 'Despesas';
      case 'transfer': return 'Transferências';
    }
  };

  const getFilterColor = (filter: FilterType) => {
    switch (filter) {
      case 'income': return '#4CAF50';
      case 'expense': return '#F44336';
      case 'transfer': return '#FF9800';
      default: return '#2d6073'; // forest
    }
  };

  return (
    <View style={styles.container}>
      {/* Header com busca e filtros */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Transações</Text>
          <Text style={styles.headerSubtitle}>
            {filteredTransactions.length} {filteredTransactions.length === 1 ? 'transação' : 'transações'}
          </Text>
        </View>

        {/* Barra de busca clean */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="rgba(0, 0, 0, 0.4)" style={styles.searchIcon} />
          <TextInput
            placeholder="Buscar transações..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            placeholderTextColor="rgba(0, 0, 0, 0.4)"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="rgba(0, 0, 0, 0.3)" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filtros rápidos */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          {(['all', 'income', 'expense', 'transfer'] as FilterType[]).map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterChip,
                selectedFilter === filter && styles.filterChipActive
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text style={[
                styles.filterChipText,
                selectedFilter === filter && styles.filterChipTextActive
              ]}>
                {getFilterLabel(filter)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Lista de transações */}
      <FlatList
        data={filteredTransactions}
        renderItem={renderTransactionItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={loading ? (
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color="#4a9fb8" />
            <Text style={styles.loadingText}>Carregando...</Text>
          </View>
        ) : renderEmptyState()}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#4a9fb8"
            colors={['#4a9fb8']}
          />
        }
        onEndReached={loadMoreTransactions}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
  },
  headerTop: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(0, 0, 0, 0.5)',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 0,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    height: 48,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '400',
    color: '#1a1a1a',
    height: 48,
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  filtersContainer: {
    marginBottom: 8,
  },
  filtersContent: {
    paddingRight: 24,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  filterChipActive: {
    backgroundColor: '#4a9fb8',
    borderColor: '#4a9fb8',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(0, 0, 0, 0.6)',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  listContainer: {
    padding: 24,
    paddingBottom: 100,
  },
  centerState: {
    flex: 1,
    minHeight: 400,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '400',
    color: 'rgba(0, 0, 0, 0.5)',
    marginTop: 12,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    marginTop: 8,
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.5)',
  },
  endOfList: {
    paddingVertical: 24,
    paddingBottom: 32,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  endOfListText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  emptyCard: {
    padding: 40,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: 20,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(0, 0, 0, 0.5)',
    marginTop: 8,
    textAlign: 'center',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    marginBottom: 12,
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
    marginRight: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 13,
    fontWeight: '400',
    color: '#666666',
  },
  transactionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
});
