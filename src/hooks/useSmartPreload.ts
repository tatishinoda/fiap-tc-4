import { NavigationState, useNavigation } from '@react-navigation/native';
import { useEffect, useRef } from 'react';

/**
 * Pré-carregamento Inteligente de Telas
 *
 * Este hook monitora a navegação e pré-carrega as telas
 * mais prováveis de serem acessadas em seguida.
 *
 * Estratégias:
 * 1. Pré-carregar tabs adjacentes quando estiver em um tab
 * 2. Pré-carregar tela de edição quando estiver vendo lista
 * 3. Pré-carregar tela de detalhes ao ver resumo
 */

interface PreloadConfig {
  // Mapa de tela atual -> telas para pré-carregar
  [currentScreen: string]: Array<() => Promise<any>>;
}

export function useSmartPreload(config: PreloadConfig) {
  const navigation = useNavigation();
  const preloadedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const unsubscribe = navigation.addListener('state' as any, (e: any) => {
      // Verificações de segurança
      if (!e?.data?.state) return;

      const state: NavigationState = e.data.state;

      // Verifica se state tem a estrutura esperada
      if (!state.routes || !Array.isArray(state.routes) || state.index === undefined) {
        return;
      }

      // Obtém a rota atual
      const currentRoute = state.routes[state.index];
      if (!currentRoute || !currentRoute.name) return;

      const currentScreen = currentRoute.name;

      // Verifica se há telas para pré-carregar
      const screensToPreload = config[currentScreen];

      if (screensToPreload && !preloadedRef.current.has(currentScreen)) {
        // Marca como pré-carregado para não fazer novamente
        preloadedRef.current.add(currentScreen);

        // Pré-carrega todas as telas relacionadas
        screensToPreload.forEach((importFn, index) => {
          // Adiciona delay progressivo para não sobrecarregar
          setTimeout(() => {
            importFn().catch((err) => {
              console.warn(`Falha ao pré-carregar tela ${index}:`, err);
            });
          }, index * 100); // 100ms entre cada pré-carregamento
        });
      }
    });

    return unsubscribe;
  }, [navigation, config]);
}

/**
 * Configuração padrão de pré-carregamento para o ByteBank
 */
export const defaultPreloadConfig: PreloadConfig = {
  // Quando estiver no Login, pré-carrega SignUp e Home
  'Login': [
    () => import('../screens/auth/SignUpScreen'),
    () => import('../screens/protected/HomeScreen'),
  ],

  // Quando estiver no Home, pré-carrega Transactions e Form
  'Home': [
    () => import('../screens/protected/TransactionsScreen'),
    () => import('../screens/protected/TransactionFormScreen'),
  ],

  // Quando estiver em Transactions, pré-carrega Form
  'Transactions': [
    () => import('../screens/protected/TransactionFormScreen'),
  ],
};

/**
 * Hook simplificado que usa a configuração padrão
 */
export function useDefaultPreload() {
  useSmartPreload(defaultPreloadConfig);
}
