import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { RootStackParamList, TabParamList } from '../types/navigation';
import { GlobalNotification } from '../components/GlobalNotification';
import { ConfirmModal } from '../components/ConfirmModal';
import { colors } from '../theme/colors';
import { getNavigationIcon, ACTION_ICONS } from '../utils/icons';

// Telas de autenticação
import LoginScreen from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';

// Telas protegidas
import HomeScreen from '../screens/protected/HomeScreen';
import TransactionsScreen from '../screens/protected/TransactionsScreen';
import TransactionFormScreen from '../screens/protected/TransactionFormScreen';

// Componente de loading
import LoadingScreen from '../components/LoadingScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Stack de autenticação
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
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
          <Text style={styles.welcomeText}>Olá, {user?.name?.split(' ')[0]}!</Text>
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
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ tabBarLabel: 'Início' }}
        />
        <Tab.Screen
          name="Transactions"
          component={TransactionsScreen}
          options={{ tabBarLabel: 'Transações' }}
        />
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

// Stack principal para telas protegidas
function ProtectedStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={ProtectedTabs} />
      <Stack.Screen
        name="AddTransaction"
        component={TransactionFormScreen}
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
      />
      <Stack.Screen
        name="EditTransaction"
        component={TransactionFormScreen}
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
      />
    </Stack.Navigator>
  );
}

export function AppNavigator() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <ProtectedStack /> : <AuthStack />}
      <GlobalNotification />
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
