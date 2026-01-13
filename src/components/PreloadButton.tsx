import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme';
import { usePreloadScreen } from './LazyLoadWrapper';
import { Text } from './ui';

/**
 * Botão Otimizado com Preload
 *
 * Este botão pré-carrega a tela de destino ao ser pressionado,
 * melhorando a experiência de navegação.
 *
 * @example
 * <PreloadButton
 *   title="Ir para Home"
 *   screenName="Home"
 *   preloadScreen={() => import('../screens/protected/HomeScreen')}
 * />
 */

interface PreloadButtonProps {
  title: string;
  screenName: string;
  preloadScreen: () => Promise<any>;
  params?: any;
  style?: any;
}

export function PreloadButton({
  title,
  screenName,
  preloadScreen,
  params,
  style,
}: PreloadButtonProps) {
  const navigation = useNavigation();
  const preload = usePreloadScreen();
  const [isPreloading, setIsPreloading] = React.useState(false);

  const handlePress = () => {
    // @ts-ignore - navegação funciona mesmo sem tipos perfeitos
    navigation.navigate(screenName, params);
  };

  const handlePressIn = () => {
    // Inicia preload quando o usuário começa a pressionar
    if (!isPreloading) {
      setIsPreloading(true);
      preload(preloadScreen);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      activeOpacity={0.7}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.brand.forest,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
