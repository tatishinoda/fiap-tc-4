import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context';
import { Text } from './ui';
import { colors } from '../theme';

/**
 * Componente de Notificação Global
 * Exibe notificações do AppContext automaticamente
 * 
 * Uso:
 * 1. Adicione <GlobalNotification /> no topo da sua hierarquia de componentes
 * 2. Use showNotification() do useAppContext() em qualquer lugar da app
 */
export function GlobalNotification() {
  const { notification, clearNotification } = useAppContext();
  const slideAnim = React.useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (notification) {
      // Anima para entrar
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();

      // Auto-hide após 4 segundos
      const timer = setTimeout(() => {
        handleClose();
      }, 4000);

      return () => clearTimeout(timer);
    } else {
      // Anima para sair
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [notification]);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      clearNotification();
    });
  };

  if (!notification) return null;

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return 'checkmark-circle';
      case 'error':
        return 'alert-circle';
      case 'info':
      default:
        return 'information-circle';
    }
  };

  const getBackgroundColor = () => {
    switch (notification.type) {
      case 'success':
        return colors.success.main;
      case 'error':
        return colors.error.main;
      case 'info':
      default:
        return colors.info.main;
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.content}>
        <Ionicons name={getIcon()} size={24} color="#fff" />
        <Text
          variant="bodyMedium"
          style={styles.message}
          color="#fff"
        >
          {notification.message}
        </Text>
        <Ionicons
          name="close"
          size={20}
          color="#fff"
          onPress={handleClose}
          style={styles.closeButton}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  message: {
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
});
