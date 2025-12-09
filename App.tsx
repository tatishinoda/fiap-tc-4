import React, { useEffect } from 'react';
import { LogBox } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-gesture-handler';
import './global.css';

import { AppProviders } from './src/context';
import { AppNavigator } from './src/navigation/AppNavigator';

// Ignorar warnings específicos do Firebase + Hermes
LogBox.ignoreLogs([
  'INTERNAL ASSERTION FAILED', // Firebase Auth + Hermes
  'Expected a class definition', // Firebase Auth + Hermes
  'without providing AsyncStorage', // Firebase detecta AsyncStorage automaticamente
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
    </AppProviders>
  );
}
