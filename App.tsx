import React, { useEffect } from 'react';
import { LogBox } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-gesture-handler';
import './global.css';

import { AppProviders } from './src/context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { GlobalLoading } from './src/components/GlobalLoading';
import { GlobalNotification } from './src/components/GlobalNotification';

// Ignorar warnings específicos
LogBox.ignoreLogs([
  'INTERNAL ASSERTION FAILED', // Firebase Auth + Hermes
  'Expected a class definition', // Firebase Auth + Hermes
  'without providing AsyncStorage', // Firebase Auth (já configurado com AsyncStorage)
  'SafeAreaView has been deprecated', // Vem de bibliotecas de terceiros
]);

// Manter a splash screen visível enquanto carregamos recursos
SplashScreen.preventAutoHideAsync();

export default function App() {
  useEffect(() => {
    // Preparar a aplicação
    async function prepare() {
      try {
        // Aqui você pode carregar fontes, dados iniciais, etc.
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Esconder a splash screen
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  return (
    <AppProviders>
      <AppNavigator />
      <GlobalNotification />
      <GlobalLoading />
    </AppProviders>
  );
}
