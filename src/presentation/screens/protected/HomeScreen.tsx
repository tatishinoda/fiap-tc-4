import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { Dimensions, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TransactionType } from '../../../domain/entities/Transaction';
import { colors, spacing } from '../../../theme';
import { RootStackParamList } from '../../../types/navigation';
import { TRANSACTION_TYPE_CONFIG } from '../../../utils';
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
  const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  
  React.useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setWindowWidth(window.width);
    });
    return () => subscription?.remove();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      refreshDashboard();
    }, [])
  );
  
  const isDesktop = windowWidth >= 768;
  const isSingleColumn = isDesktop && windowWidth < 1307;

  // Ajustar número de transações recentes baseado na plataforma
  const displayRecentTransactions = isDesktop ? transactions.slice(0, 9) : recentTransactions;

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
              <TouchableOpacity 
                style={[
                  styles.navItem,
                  hoveredNav === 'home' && { backgroundColor: 'rgba(255, 255, 255, 0.15)' }
                ]} 
                activeOpacity={0.7}
                onMouseEnter={() => setHoveredNav('home')}
                onMouseLeave={() => setHoveredNav(null)}
              >
                <Ionicons name="home" size={24} color="#FFFFFF" />
                <Text style={styles.navText}>Início</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.navItemInactive,
                  hoveredNav === 'transactions' && { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                ]} 
                activeOpacity={0.7}
                onPress={handleSeeAllTransactions}
                onMouseEnter={() => setHoveredNav('transactions')}
                onMouseLeave={() => setHoveredNav(null)}
              >
                <Ionicons name="receipt-outline" size={24} color="rgba(255, 255, 255, 0.6)" />
                <Text style={styles.navTextInactive}>Transações</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Main Content */}
          <ScrollView
            style={styles.mainContent}
            contentContainerStyle={styles.mainScrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.brand.forest}
              />
            }
          >
            <FinancialOverview
              balance={balance}
              totalIncome={income}
              totalExpense={expenses}
              isLoading={isLoading}
              actions={isSingleColumn ? [] : quickActions}
            />

            {isSingleColumn && <QuickActions actions={quickActions} />}

            <View style={styles.widgetsGrid}>
              <View style={isSingleColumn ? styles.widgetFull : styles.widgetHalf}>
                <FinancialInsights
                  totalIncome={income}
                  totalExpense={expenses}
                  balance={balance}
                  transactions={transactions}
                  refreshing={refreshing}
                />
              </View>

              <View style={isSingleColumn ? styles.widgetFull : styles.widgetHalf}>
                <FinancialPieChart transactions={transactions} />
              </View>

              <View style={isSingleColumn ? styles.widgetFull : styles.widgetHalf}>
                <CategoryAnalysis transactions={transactions} />
              </View>

              <View style={isSingleColumn ? styles.widgetFull : styles.widgetHalf}>
                <FinancialChart
                  data={{ income: income, expense: expenses }}
                  isLoading={isLoading}
                  showTitle={true}
                />
              </View>
            </View>
          </ScrollView>

          {/* Sidebar Right - Transactions */}
          <View style={styles.rightSidebar}>
            <RecentTransactions
              transactions={displayRecentTransactions}
              isLoading={isLoading}
              onSeeAll={handleSeeAllTransactions}
              onTransactionPress={handleTransactionPress}
              showTitle={true}
            />
          </View>
        </View>
      ) : (
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
          <FinancialOverview
            balance={balance}
            totalIncome={income}
            totalExpense={expenses}
            isLoading={isLoading}
            actions={[]}
          />

          <QuickActions actions={quickActions} />

          <FinancialInsights
            totalIncome={income}
            totalExpense={expenses}
            balance={balance}
            transactions={transactions}
            refreshing={refreshing}
          />

          <RecentTransactions
            transactions={recentTransactions}
            isLoading={isLoading}
            onSeeAll={handleSeeAllTransactions}
            onTransactionPress={handleTransactionPress}
            showTitle={true}
          />

          <FinancialPieChart transactions={transactions} />

          <CategoryAnalysis transactions={transactions} />

          <FinancialChart
            data={{ income: income, expense: expenses }}
            isLoading={isLoading}
            showTitle={true}
          />
        </ScrollView>
      )}

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
    paddingHorizontal: 24,
    paddingTop: 24,
    height: '100vh',
  },
  mainScrollContent: {
    paddingBottom: 32,
  },
  rightSidebar: {
    width: 340,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderLeftWidth: 1,
    borderLeftColor: '#E0E0E0',
  },
  widgetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
    flex: 1,
    alignItems: 'stretch',
  },
  widgetFull: {
    width: '100%',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  widgetHalf: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
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
