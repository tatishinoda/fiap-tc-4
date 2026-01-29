import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';

/**
 * Hook para preload inteligente de telas
 * Pré-carrega telas baseado na navegação atual
 */
export function useSmartPreload() {
  const navigation = useNavigation();

  useEffect(() => {
    // Listener para mudanças de navegação
    const unsubscribe = navigation.addListener('state', (e) => {
      if (!e?.data?.state) return;

      const state = e.data.state;
      if (!state.routes || !Array.isArray(state.routes) || state.index === undefined) return;

      const currentRoute = state.routes[state.index];
      if (!currentRoute) return;

      // Preload baseado na tela atual
      setTimeout(() => {
        switch (currentRoute.name) {
          case 'Home':
            // Quando estiver na Home, preload Transactions e AddTransaction
            preloadScreen(() => import('../presentation/screens/protected/TransactionsScreen'));
            setTimeout(() => {
              preloadScreen(
                () => import('../presentation/screens/protected/TransactionFormScreen')
              );
            }, 100);
            break;

          case 'Transactions':
            // Quando estiver em Transactions, preload AddTransaction e EditTransaction
            preloadScreen(() => import('../presentation/screens/protected/TransactionFormScreen'));
            break;

          case 'Login':
            // Quando estiver no Login, preload SignUp e Home
            preloadScreen(() => import('../presentation/screens/auth/SignUpScreen'));
            setTimeout(() => {
              preloadScreen(() => import('../presentation/screens/protected/HomeScreen'));
            }, 100);
            break;

          case 'SignUp':
            // Quando estiver no SignUp, preload Login
            preloadScreen(() => import('../presentation/screens/auth/LoginScreen'));
            break;
        }
      }, 100); // Delay para não interferir na navegação atual
    });

    return unsubscribe;
  }, [navigation]);
}

/**
 * Função auxiliar para preload de telas
 */
function preloadScreen(importFunc: () => Promise<any>) {
  try {
    importFunc().catch(() => {
      // Ignora erros de preload silenciosamente
    });
  } catch (error) {
    // Ignora erros de preload silenciosamente
  }
}
