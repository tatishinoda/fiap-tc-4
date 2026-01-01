import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebase';

/**
 * Faz upload de uma imagem para o Firebase Storage
 * @param uri - URI local da imagem
 * @param userId - ID do usuário
 * @param transactionId - ID da transação
 * @returns URL da imagem no Storage
 */
export const uploadReceipt = async (
  uri: string,
  userId: string,
  transactionId: string
): Promise<string> => {
  try {
    // Buscar o blob da imagem
    const response = await fetch(uri);
    
    if (!response.ok) {
      throw new Error('Não foi possível acessar a imagem');
    }
    
    const blob = await response.blob();
    
    // Validar tamanho (10MB)
    if (blob.size > 10 * 1024 * 1024) {
      throw new Error('Imagem muito grande. Máximo 10MB');
    }

    // Criar referência no Storage: transaction-receipts/{userId}/{transactionId}.jpg
    const filename = `${transactionId}_${Date.now()}.jpg`;
    const storageRef = ref(storage, `transaction-receipts/${userId}/${filename}`);

    // Upload do blob
    await uploadBytes(storageRef, blob);

    // Obter URL de download
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error: any) {
    console.error('Erro ao fazer upload do recibo:', error);
    
    // Mensagens de erro mais específicas
    if (error.code === 'storage/unauthorized') {
      throw new Error('Sem permissão. Verifique as regras do Storage');
    } else if (error.code === 'storage/canceled') {
      throw new Error('Upload cancelado');
    } else if (error.code === 'storage/unknown') {
      throw new Error('Erro desconhecido. Verifique sua conexão');
    } else if (error.message) {
      throw new Error(error.message);
    }
    
    throw new Error('Falha ao fazer upload do recibo');
  }
};

/**
 * Deleta um recibo do Firebase Storage
 * @param receiptUrl - URL do recibo a ser deletado
 */
export const deleteReceipt = async (receiptUrl: string): Promise<void> => {
  try {
    // Extrair o path do Storage da URL
    const decodedUrl = decodeURIComponent(receiptUrl);
    const pathMatch = decodedUrl.match(/\/o\/(.+?)\?/);
    
    if (!pathMatch) {
      throw new Error('URL inválida');
    }

    const path = pathMatch[1];
    const storageRef = ref(storage, path);

    await deleteObject(storageRef);
  } catch (error) {
    console.error('Erro ao deletar recibo:', error);
    throw new Error('Falha ao deletar recibo');
  }
};
