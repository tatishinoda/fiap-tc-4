import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Transaction } from '../../../domain/entities/Transaction';
import { transactionStream } from '../../../infrastructure/streams/TransactionStream';
import { authSelectors } from '../../../state/selectors/authSelectors';
import { useStore } from '../../../state/store';
import { colors } from '../../../theme';
import { RootStackParamList } from '../../../types/navigation';
import { formatAmount, formatDateRelative, getTransactionColor, getTransactionIcon, normalizeCategory } from '../../../utils';
import { AdvancedFiltersModal, FilterOptions } from '../../components/AdvancedFiltersModal';
import { useTransactionsViewModel } from '../../hooks/useTransactionsViewModel';

type TransactionsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Transactions'>;

interface TransactionsScreenProps {
  navigation: TransactionsScreenNavigationProp;
}

type FilterType = 'all' | 'income' | 'expense' | 'transfer';

const DEFAULT_FILTER_OPTIONS: FilterOptions = {
  dateFrom: null,
  dateTo: null,
  categories: [],
  types: [],
  amountMin: '',
  amountMax: '',
  sortBy: 'date-desc',
};

export default function TransactionsScreen({ navigation }: TransactionsScreenProps) {
  const user = useStore(authSelectors.user);
  const {
    fetchPaginatedTransactions,
    fetchTransactionCount,
    isLoading: loading,
    error,
    deleteTransaction,
    clearError,
  } = useTransactionsViewModel();

  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<FilterOptions>(DEFAULT_FILTER_OPTIONS);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  const windowWidth = Dimensions.get('window').width;
  const isDesktop = Platform.OS === 'web' && windowWidth >= 768;

  // Estados para scroll infinito
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 10;

  useFocusEffect(
    React.useCallback(() => {
      loadInitialTransactions();
    }, [])
  );

  useEffect(() => {
    applyFilters();
  }, [allTransactions, searchQuery, selectedFilter, advancedFilters]);

  // Carrega transações iniciais
  const loadInitialTransactions = async () => {
    try {
      const [result, total] = await Promise.all([
        fetchPaginatedTransactions(PAGE_SIZE),
        fetchTransactionCount()
      ]);
      setAllTransactions(result.transactions);
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
      // Define o total real do banco de dados
      setTotalTransactions(total);
    } catch (err) {
      console.error('Erro ao carregar transações:', err);
    }
  };

  // Carrega mais transações
  const loadMoreTransactions = async () => {
    if (!hasMore || loadingMore) return;

    setLoadingMore(true);
    try {
      const result = await fetchPaginatedTransactions(PAGE_SIZE, lastDoc);
      setAllTransactions(prev => {
        // Criar Set de IDs existentes para evitar duplicatas
        const existingIds = new Set(prev.map(t => t.id));
        // Filtrar apenas transações que ainda não existem
        const newTransactions = result.transactions.filter(t => !existingIds.has(t.id));
        return [...prev, ...newTransactions];
      });
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
    } catch (err) {
      console.error('Erro ao carregar mais transações:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allTransactions];

    if (advancedFilters.dateFrom) {
      filtered = filtered.filter(t => {
        const transactionDate = t.date instanceof Date ? t.date : new Date(t.date);
        const fromDate = new Date(advancedFilters.dateFrom!);
        fromDate.setHours(0, 0, 0, 0);
        transactionDate.setHours(0, 0, 0, 0);
        return transactionDate >= fromDate;
      });
    }

    if (advancedFilters.dateTo) {
      filtered = filtered.filter(t => {
        const transactionDate = t.date instanceof Date ? t.date : new Date(t.date);
        const toDate = new Date(advancedFilters.dateTo!);
        toDate.setHours(23, 59, 59, 999);
        return transactionDate <= toDate;
      });
    }

    if (advancedFilters.types.length > 0) {
      filtered = filtered.filter(t => advancedFilters.types.includes(t.type));
    }

    if (advancedFilters.categories.length > 0) {
      const normalizedFilterCategories = advancedFilters.categories.map(normalizeCategory);
      filtered = filtered.filter(t =>
        t.category && normalizedFilterCategories.includes(normalizeCategory(t.category))
      );
    }

    if (advancedFilters.amountMin !== '') {
      const cleanValue = advancedFilters.amountMin.replace(/\D/g, '');
      if (cleanValue) {
        const minAmount = parseInt(cleanValue);
        filtered = filtered.filter(t => t.amount >= minAmount);
      }
    }

    if (advancedFilters.amountMax !== '') {
      const cleanValue = advancedFilters.amountMax.replace(/\D/g, '');
      if (cleanValue) {
        const maxAmount = parseInt(cleanValue);
        filtered = filtered.filter(t => t.amount <= maxAmount);
      }
    }

    // Filtro rápido por tipo (retrocompatibilidade)
    if (selectedFilter !== 'all') {
      if (selectedFilter === 'income') {
        filtered = filtered.filter(t => t.type === 'DEPOSIT');
      } else if (selectedFilter === 'expense') {
        filtered = filtered.filter(t => t.type !== 'DEPOSIT');
      } else if (selectedFilter === 'transfer') {
        filtered = filtered.filter(t => t.type === 'TRANSFER');
      }
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        t.description.toLowerCase().includes(query) ||
        (t.category && t.category.toLowerCase().includes(query))
      );
    }

    // Aplicar ordenação
    switch (advancedFilters.sortBy) {
      case 'date-desc':
        filtered.sort((a, b) => {
          const dateA = a.date instanceof Date ? a.date : new Date(a.date);
          const dateB = b.date instanceof Date ? b.date : new Date(b.date);
          return dateB.getTime() - dateA.getTime();
        });
        break;
      case 'date-asc':
        filtered.sort((a, b) => {
          const dateA = a.date instanceof Date ? a.date : new Date(a.date);
          const dateB = b.date instanceof Date ? b.date : new Date(b.date);
          return dateA.getTime() - dateB.getTime();
        });
        break;
      case 'amount-desc':
        filtered.sort((a, b) => b.amount - a.amount);
        break;
      case 'amount-asc':
        filtered.sort((a, b) => a.amount - b.amount);
        break;
    }

    setFilteredTransactions(filtered);
  };

  const hasActiveAdvancedFilters = () => {
    return (
      advancedFilters.dateFrom !== null ||
      advancedFilters.dateTo !== null ||
      advancedFilters.categories.length > 0 ||
      advancedFilters.types.length > 0 ||
      advancedFilters.amountMin !== '' ||
      advancedFilters.amountMax !== '' ||
      advancedFilters.sortBy !== 'date-desc'
    );
  };

  const hasAnyActiveFilter = () => {
    return (
      searchQuery.trim() !== '' ||
      selectedFilter !== 'all' ||
      hasActiveAdvancedFilters()
    );
  };

  const getDisplayCount = () => {
    return hasAnyActiveFilter() ? filteredTransactions.length : totalTransactions;
  };

  const handleApplyAdvancedFilters = (filters: FilterOptions) => {
    setAdvancedFilters(filters);
  };

  const getAvailableCategories = (): string[] => {
    const categories = allTransactions
      .map(t => t.category)
      .filter((category): category is string => !!category && category.trim() !== '');
    return Array.from(new Set(categories)).sort();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setLastDoc(null);
    transactionStream.resetPagination();
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

    if (!hasMore && filteredTransactions.length > 0) {
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

  const renderTransactionItem = ({ item }: { item: Transaction }) => {
    const isHovered = hoveredId === item.id;
    return (
      <Pressable
        style={[
          styles.transactionItem,
          isHovered && Platform.OS === 'web' && {
            backgroundColor: '#f8f9fa',
            borderColor: '#d0d0d0',
            shadowOpacity: 0.08,
          }
        ]}
        onPress={() => navigation.navigate('EditTransaction', { transactionId: item.id })}
        onHoverIn={() => setHoveredId(item.id)}
        onHoverOut={() => setHoveredId(null)}
      >
      <View style={styles.transactionLeft}>
        <View style={[
          styles.iconContainer,
          { backgroundColor: getTransactionColor(item.type) }
        ]}>
          <Ionicons
            name={getTransactionIcon(item.type)}
            size={22}
            color="#FFFFFF"
          />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionTitle} numberOfLines={1}>
            {item.description}
          </Text>
          {item.category && (
            <Text style={styles.transactionCategory} numberOfLines={1}>
              {item.category}
            </Text>
          )}
          <Text style={styles.transactionDate}>
            {formatDateRelative(item.date)}
          </Text>
        </View>
      </View>
      <View style={styles.transactionRight}>
        <Text style={[styles.amount]} numberOfLines={1}>
          {formatAmount(item.amount, item.type)}
        </Text>
        <Ionicons name="chevron-forward" size={18} color="#999999" />
      </View>
    </Pressable>
    );
  };

  const getFilterLabel = (filter: FilterType) => {
    switch (filter) {
      case 'all': return 'Todas';
      case 'income': return 'Receitas';
      case 'expense': return 'Despesas';
      case 'transfer': return 'Transferências';
    }
  };

  return (
    <View style={styles.container}>
      {isDesktop ? (
        <View style={styles.desktopLayout}>
          {/* Sidebar Left - Menu */}
          <View style={styles.sidebar}>
            <View style={styles.sidebarHeader}>
              <Ionicons name="wallet-outline" size={32} color="#FFFFFF" />
              <Text style={styles.sidebarTitle}>ByteBank</Text>
            </View>

            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeText}>
                Olá, {user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Usuário'}!
              </Text>
            </View>

            <View style={styles.navMenu}>
              <Pressable
                style={[
                  styles.navItemInactive,
                  hoveredNav === 'home' && { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                ]}
                onPress={() => navigation.navigate('Home')}
                onHoverIn={() => setHoveredNav('home')}
                onHoverOut={() => setHoveredNav(null)}
              >
                <Ionicons name="home-outline" size={24} color="rgba(255, 255, 255, 0.6)" />
                <Text style={styles.navTextInactive}>Início</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.navItem,
                  hoveredNav === 'transactions' && { backgroundColor: 'rgba(255, 255, 255, 0.15)' }
                ]}
                onHoverIn={() => setHoveredNav('transactions')}
                onHoverOut={() => setHoveredNav(null)}
              >
                <Ionicons name="receipt" size={24} color="#FFFFFF" />
                <Text style={styles.navText}>Transações</Text>
              </Pressable>
            </View>
          </View>

          {/* Main Content */}
          <View style={styles.mainContent}>
      {/* Header com busca e filtros */}
      <View style={[styles.header, isDesktop && styles.headerDesktop]}>
        <View style={isDesktop ? styles.contentWrapper : null}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>Transações</Text>
            <Text style={styles.headerSubtitle}>
              {getDisplayCount()} {getDisplayCount() === 1 ? 'transação' : 'transações'}
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

          {/* Filtros rápidos e botão de filtros avançados */}
        <View style={styles.filtersRow}>
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

          {/* Advanced Filters Button */}
          <TouchableOpacity
            style={[
              styles.advancedFilterButton,
              hasActiveAdvancedFilters() && styles.advancedFilterButtonActive
            ]}
            onPress={() => setShowAdvancedFilters(true)}
            activeOpacity={0.7}
          >
            <Ionicons
              name="options-outline"
              size={20}
              color={hasActiveAdvancedFilters() ? '#FFFFFF' : 'rgba(0, 0, 0, 0.6)'}
            />
            {hasActiveAdvancedFilters() && (
              <View style={styles.filterBadge}>
                <View style={styles.filterBadgeDot} />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
      </View>

      {/* Lista de transações */}
      <FlatList
        data={filteredTransactions}
        renderItem={renderTransactionItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContainer, isDesktop && styles.listContainerDesktop]}
        style={{ flex: 1 }}
        ListEmptyComponent={loading ? (
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color="#4a9fb8" />
            <Text style={styles.loadingText}>Carregando...</Text>
          </View>
        ) : renderEmptyState()}
        ListFooterComponent={renderFooter}
        onEndReached={loadMoreTransactions}
        onEndReachedThreshold={0.3}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#4a9fb8"
            colors={['#4a9fb8']}
          />
        }
        showsVerticalScrollIndicator={false}
      />
          </View>
        </View>
      ) : (
        <>
          {/* Header com busca e filtros - Mobile */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <Text style={styles.headerTitle}>Transações</Text>
              <Text style={styles.headerSubtitle}>
                {getDisplayCount()} {getDisplayCount() === 1 ? 'transação' : 'transações'}
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

            {/* Filtros rápidos e botão de filtros avançados */}
            <View style={styles.filtersRow}>
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

              {/* Advanced Filters Button */}
              <TouchableOpacity
                style={[
                  styles.advancedFilterButton,
                  hasActiveAdvancedFilters() && styles.advancedFilterButtonActive
                ]}
                onPress={() => setShowAdvancedFilters(true)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="options-outline"
                  size={20}
                  color={hasActiveAdvancedFilters() ? '#FFFFFF' : 'rgba(0, 0, 0, 0.6)'}
                />
                {hasActiveAdvancedFilters() && (
                  <View style={styles.filterBadge}>
                    <View style={styles.filterBadgeDot} />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Lista de transações - Mobile */}
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
            onEndReached={loadMoreTransactions}
            onEndReachedThreshold={0.5}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#4a9fb8"
                colors={['#4a9fb8']}
              />
            }
            showsVerticalScrollIndicator={false}
          />
        </>
      )}

      {/* Advanced Filters Modal */}
      <AdvancedFiltersModal
        visible={showAdvancedFilters}
        onClose={() => setShowAdvancedFilters(false)}
        onApply={handleApplyAdvancedFilters}
        initialFilters={advancedFilters}
        availableCategories={getAvailableCategories()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  desktopLayout: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 240,
    backgroundColor: colors.brand.forest,
    padding: 24,
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 48,
  },
  sidebarTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  welcomeSection: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  navMenu: {
    gap: 8,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  navItemInactive: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  navText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  navTextInactive: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
    marginLeft: 12,
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    zIndex: 10,
  },
  headerDesktop: {
    paddingHorizontal: 0,
  },
  contentWrapper: {
    maxWidth: 1000,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 24,
  },
  listWrapper: {
    flex: 1,
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
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  filtersContainer: {
    flex: 1,
    marginBottom: 8,
  },
  filtersContent: {
    paddingRight: 8,
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
  advancedFilterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e8e8e8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  advancedFilterButtonActive: {
    backgroundColor: '#4a9fb8',
    borderColor: '#4a9fb8',
  },
  filterBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF5252',
  },
  content: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  listContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 100,
  },
  listContainerDesktop: {
    maxWidth: 1000,
    width: '100%',
    alignSelf: 'center',
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
    padding: 14,
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
