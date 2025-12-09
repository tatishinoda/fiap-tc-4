import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Text } from './ui';
import { colors, spacing } from '../theme';

/**
 * Loading Screen Component
 */
export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor={colors.brand.forest} />
      
      <View style={styles.content}>
        <Ionicons name="wallet-outline" size={80} color="#FFFFFF" />
        <Text variant="displayMedium" style={styles.title}>
          ByteBank
        </Text>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.brand.forest,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  loadingContainer: {
    marginTop: spacing.xl,
  },
});
