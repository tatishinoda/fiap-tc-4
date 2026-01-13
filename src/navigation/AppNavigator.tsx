import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React, { lazy, Suspense } from 'react';
import { Alert, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ConfirmModal } from '../components/ConfirmModal';
import { GlobalNotification } from '../components/GlobalNotification';
import { useAuth } from '../hooks/useAuth';
import { useDefaultPreload } from '../hooks/useSmartPreload';
import { colors } from '../theme/colors';
import { RootStackParamList, TabParamList } from '../types/navigation';
import { ACTION_ICONS, getNavigationIcon } from '../utils/icons';

// Componente de loading (carregado imediatamente)
import LoadingScreen from '../components/LoadingScreen';

// 🚀 LAZY LOADING: Telas carregadas sob demanda
// Telas de autenticação
const LoginScreen = lazy(() => import('../screens/auth/LoginScreen'));
const SignUpScreen = lazy(() => import('../screens/auth/SignUpScreen'));

// Telas protegidas
const HomeScreen = lazy(() => import('../screens/protected/HomeScreen'));
const TransactionsScreen = lazy(() => import('../screens/protected/TransactionsScreen'));
const TransactionFormScreen = lazy(() => import('../screens/protected/TransactionFormScreen'));

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Stack de autenticação com Suspense
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login">
        {(props) => (
          <Suspense fallback={<LoadingScreen />}>
            <LoginScreen {...props} />
          </Suspense>
        )}
      </Stack.Screen>
      <Stack.Screen name="SignUp">
        {(props) => (
          <Suspense fallback={<LoadingScreen />}>
            <SignUpScreen {...props} />
          </Suspense>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

// Tab Navigator para telas protegidas
function ProtectedTabs() {
  const { user, signOut } = useAuth();
  const insets = useSafeAreaInsets();
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    setShowLogoutModal(false);
    try {
      await signOut();
    } catch (error) {
      console.error('❌ Logout error:', error);
      Alert.alert('Erro', 'Erro ao fazer logout');
    }
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor={colors.brand.forest} />

      {/* Header Fixo */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.welcomeText}>
            Olá, {user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Usuário'}!
          </Text>
          <TouchableOpacity
            onPress={handleLogout}
            style={styles.logoutButton}
            activeOpacity={0.7}
          >
            <Ionicons name={ACTION_ICONS.logout} size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Navigator */}
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            switch (route.name) {
              case 'Home':
                iconName = getNavigationIcon('home', focused);
                break;
              case 'Transactions':
                iconName = getNavigationIcon('transactions', focused);
                break;
              default:
                iconName = 'help-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: colors.brand.forest,
          tabBarInactiveTintColor: '#666',
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: '#E0E0E0',
            paddingBottom: Platform.OS === 'web' ? 16 : (insets.bottom > 0 ? insets.bottom : 12),
            paddingTop: Platform.OS === 'web' ? 8 : 8,
            height: Platform.OS === 'web' ? 'auto' : 70 + (insets.bottom > 0 ? insets.bottom : 0),
            minHeight: Platform.OS === 'web' ? 80 : undefined,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: 'bold',
            marginTop: 4,
          },
          tabBarItemStyle: Platform.OS === 'web' ? {
            paddingVertical: 12,
          } : undefined,
        })}
      >
        <Tab.Screen name="Home" options={{ tabBarLabel: 'Início' }}>
          {(props) => (
            <Suspense fallback={<LoadingScreen />}>
              <HomeScreen {...props} />
            </Suspense>
          )}
        </Tab.Screen>
        <Tab.Screen name="Transactions" options={{ tabBarLabel: 'Transações' }}>
          {(props) => (
            <Suspense fallback={<LoadingScreen />}>
              <TransactionsScreen {...props} />
            </Suspense>
          )}
        </Tab.Screen>
      </Tab.Navigator>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        visible={showLogoutModal}
        title="Sair"
        message="Tem certeza que deseja sair da sua conta?"
        confirmText="Sair"
        cancelText="Cancelar"
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </View>
  );
}

// Stack principal para telas protegidas com Suspense
function ProtectedStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={ProtectedTabs} />
      <Stack.Screen
        name="AddTransaction"
        options={{
          headerShown: true,
          headerTitle: 'Nova Transação',
          headerStyle: {
            backgroundColor: colors.brand.forest,
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          presentation: 'modal',
        }}
      >
        {(props) => (
          <Suspense fallback={<LoadingScreen />}>
            <TransactionFormScreen {...props} />
          </Suspense>
        )}
      </Stack.Screen>
      <Stack.Screen
        name="EditTransaction"
        options={{
          headerShown: true,
          headerTitle: 'Editar Transação',
          headerStyle: {
            backgroundColor: colors.brand.forest,
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          presentation: 'modal',
        }}
      >
        {(props) => (
          <Suspense fallback={<LoadingScreen />}>
            <TransactionFormScreen {...props} />
          </Suspense>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

// Componente interno que usa o hook de navegação
function NavigationContent() {
  const { isAuthenticated } = useAuth();

  // 🚀 Pré-carregamento inteligente de telas (dentro do NavigationContainer)
  useDefaultPreload();

  return (
    <>
      {isAuthenticated ? <ProtectedStack /> : <AuthStack />}
      <GlobalNotification />
    </>
  );
}

export function AppNavigator() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <NavigationContent />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: colors.brand.forest,
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 8,
  },
});
