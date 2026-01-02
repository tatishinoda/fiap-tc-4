import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

/**
 * Cross-platform secure storage utility
 * Uses SecureStore on native platforms (iOS/Android) and localStorage on web
 */
export const secureStorage = {
  /**
   * Store a value securely
   */
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS !== 'web') {
      await SecureStore.setItemAsync(key, value);
    } else {
      localStorage.setItem(key, value);
    }
  },

  /**
   * Retrieve a stored value
   */
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS !== 'web') {
      return await SecureStore.getItemAsync(key);
    } else {
      return localStorage.getItem(key);
    }
  },

  /**
   * Remove a stored value
   */
  async removeItem(key: string): Promise<void> {
    if (Platform.OS !== 'web') {
      await SecureStore.deleteItemAsync(key);
    } else {
      localStorage.removeItem(key);
    }
  },

  /**
   * Clear all stored values
   */
  async clear(): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.clear();
    }
    // Note: SecureStore doesn't have a clear all method
    // Items must be removed individually on native platforms
  },
};
