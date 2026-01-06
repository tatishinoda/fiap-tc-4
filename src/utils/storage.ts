/**
 * Utilitários de armazenamento e upload
 * Fornece storage seguro cross-platform e upload de arquivos para Firebase
 */

import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// ============================================================================
// STORAGE SEGURO CROSS-PLATFORM
// ============================================================================

/**
 * Utilitário de storage seguro cross-platform
 * Usa SecureStore no iOS/Android e localStorage na web
 */
export const secureStorage = {
  // Armazena um valor de forma segura
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS !== 'web') {
      await SecureStore.setItemAsync(key, value);
    } else {
      localStorage.setItem(key, value);
    }
  },

  // Recupera um valor armazenado
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS !== 'web') {
      return await SecureStore.getItemAsync(key);
    } else {
      return localStorage.getItem(key);
    }
  },

  // Remove um valor armazenado
  async removeItem(key: string): Promise<void> {
    if (Platform.OS !== 'web') {
      await SecureStore.deleteItemAsync(key);
    } else {
      localStorage.removeItem(key);
    }
  },

  // Limpa todos os valores armazenados (apenas web)
  async clear(): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.clear();
    }
    // Nota: SecureStore não possui método clear()
    // Itens devem ser removidos individualmente em plataformas nativas
  },
};

// ============================================================================
// UPLOAD DE ARQUIVOS
// ============================================================================

// Faz upload de imagem de recibo para Firebase Storage
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
    console.error('Error uploading receipt:', error);
    throw new Error('Falha ao fazer upload do recibo');
  }
}
