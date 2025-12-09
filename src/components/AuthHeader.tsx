import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from './ui';
import { colors, spacing } from '../theme';

interface AuthHeaderProps {
  title?: string;
  subtitle?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
}

/**
 * Auth Header Component
 * Header para telas de autenticação com design refinado
 */
export function AuthHeader({ 
  title = 'ByteBank',
  iconName = 'wallet-outline',
  iconSize = 64
}: AuthHeaderProps) {
  return (
    <View style={styles.header}>
      <Ionicons 
        name={iconName} 
        size={iconSize} 
        color={colors.brand.forest} 
      />
      <Text variant="displayMedium" style={styles.title}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  title: {
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
});
