import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Text } from './ui';
import { useAppContext } from '../context/AppContext';
import { colors } from '../theme/colors';

/**
 * Componente de Loading Global
 * Exibe um overlay de loading quando há operações globais em andamento
 */
export const GlobalLoading: React.FC = () => {
  const { isLoading, loadingMessage } = useAppContext();

  if (!isLoading) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary[600]} />
        {loadingMessage && (
          <Text style={styles.message}>{loadingMessage}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    minWidth: 150,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  message: {
    marginTop: 16,
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
});
