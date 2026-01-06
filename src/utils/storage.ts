import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

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

/**
 * Upload receipt image to Firebase Storage
 */
export async function uploadReceipt(
  uri: string,
  userId: string,
  transactionId: string
): Promise<string> {
  try {
    const storage = getStorage();
    const filename = `receipts/${userId}/${transactionId}_${Date.now()}.jpg`;
    const storageRef = ref(storage, filename);

    // Fetch the image as a blob
    const response = await fetch(uri);
    const blob = await response.blob();

    // Upload to Firebase Storage
    await uploadBytes(storageRef, blob);

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error: any) {
    throw new Error('Falha ao fazer upload do recibo');
  }
}

/**
 * Delete receipt image from Firebase Storage
 */
export async function deleteReceipt(receiptUrl: string): Promise<void> {
  try {
    const storage = getStorage();
    
    // Extrai o caminho do arquivo da URL
    // URL format: https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{path}?alt=media&token={token}
    const urlParts = receiptUrl.split('/o/');
    if (urlParts.length < 2) {
      throw new Error('URL de recibo inválida');
    }
    
    const pathWithParams = urlParts[1];
    const path = decodeURIComponent(pathWithParams.split('?')[0]);
    
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error: any) {
    // Não lança erro para não bloquear a remoção do recibo no Firestore
    // Mesmo que falhe a deleção no Storage, a referência será removida
  }
}
