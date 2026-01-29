import { Ionicons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { CategoryChips, CurrencyInput } from '../../components/ui';
import { useAppContext } from '../../context';
import { useAuth } from '../../hooks/useAuth';
import {
    useCreateTransaction,
    useDeleteTransaction,
    useTransactions,
    useUpdateTransaction,
} from '../../hooks/useTransactionQueries';
import { colors } from '../../theme';
import { TransactionType } from '../../types';
import { RootStackParamList } from '../../types/navigation';
import {
    combineCategories,
    getSuggestedCategories,
    getUnifiedCategory,
    TRANSACTION_TYPE_CONFIG,
    TRANSACTION_TYPES,
    validateTransaction,
} from '../../utils';
import { deleteReceipt, uploadReceipt } from '../../utils/storage';

type TransactionFormScreenRouteProp = RouteProp<
  RootStackParamList,
  'AddTransaction' | 'EditTransaction'
>;
type TransactionFormScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AddTransaction' | 'EditTransaction'
>;

interface TransactionFormScreenProps {
  route: TransactionFormScreenRouteProp;
  navigation: TransactionFormScreenNavigationProp;
}

export default function TransactionFormScreen({ route, navigation }: TransactionFormScreenProps) {
  const { data: transactions = [], isLoading: loading } = useTransactions();
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const deleteMutation = useDeleteTransaction();
  const { showNotification } = useAppContext();
  const { user } = useAuth();

  const transactionId = (route.params as any)?.transactionId;
  const isEditing = !!transactionId;
  const existingTransaction = isEditing ? transactions.find((t) => t.id === transactionId) : null;

  const preSelectedType = !isEditing ? (route.params as any)?.type : existingTransaction?.type;

  const [type, setType] = useState<TransactionType>(preSelectedType || 'DEPOSIT');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [receiptUri, setReceiptUri] = useState<string | null>(null);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);

  useEffect(() => {
    if (isEditing && existingTransaction) {
      setType(existingTransaction.type);
      const amountInReais = existingTransaction.amount / 100;
      setAmount(amountInReais.toFixed(2).replace('.', ','));
      setDescription(existingTransaction.description);

      // Normaliza categoria carregada priorizando as sugeridas
      const loadedCategory = existingTransaction.category || '';
      if (loadedCategory) {
        const normalizedCategory = getUnifiedCategory(
          loadedCategory,
          [],
          getSuggestedCategories(existingTransaction.type)
        );
        setCategory(normalizedCategory);
      } else {
        setCategory('');
      }

      setReceiptUri((existingTransaction as any).receiptUrl || null);
    }
  }, [isEditing, existingTransaction]);

  useEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Editar Transação' : 'Nova Transação',
    });
  }, [isEditing, navigation]);

  const suggestedCategories = getSuggestedCategories(type);

  const existingCategoriesRaw = transactions
    .map((t) => t.category)
    .filter((cat): cat is string => cat !== null && cat !== undefined && cat !== '');

  const existingCategories = combineCategories(existingCategoriesRaw, suggestedCategories);

  // Unifica sugeridas + personalizadas para exibição
  const allCategoriesToShow = combineCategories(suggestedCategories, existingCategoriesRaw);

  const handleCategoryChange = (inputCategory: string) => {
    setCategory(inputCategory);
  };

  const handleCategoryBlur = () => {
    if (!category.trim()) {
      setCategory('');
      return;
    }

    const unifiedCategory = getUnifiedCategory(category, existingCategories, suggestedCategories);
    setCategory(unifiedCategory);
  };

  const handleCategoryChipPress = (selectedCategory: string) => {
    const unifiedCategory = getUnifiedCategory(
      selectedCategory,
      existingCategories,
      suggestedCategories
    );
    setCategory(unifiedCategory);
  };

  const handlePickImage = async () => {
    try {
      const permission = await ImagePicker.getMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        if (!permission.canAskAgain) {
          showNotification('Permissão negada. Ative nas configurações do dispositivo', 'error');
          return;
        }

        const newPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!newPermission.granted) {
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setReceiptUri(result.assets[0].uri);
      }
    } catch (error) {
      showNotification('Erro ao selecionar imagem', 'error');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const permission = await ImagePicker.getCameraPermissionsAsync();

      if (!permission.granted) {
        if (!permission.canAskAgain) {
          showNotification('Permissão negada. Ative nas configurações do dispositivo', 'error');
          return;
        }

        const newPermission = await ImagePicker.requestCameraPermissionsAsync();
        if (!newPermission.granted) {
          return;
        }
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setReceiptUri(result.assets[0].uri);
      }
    } catch (error) {
      showNotification('Erro ao tirar foto', 'error');
    }
  };

  const handleRemoveImage = async () => {
    Alert.alert('Remover Recibo', 'Deseja remover o recibo desta transação?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          if (receiptUri && receiptUri.startsWith('http')) {
            try {
              await deleteReceipt(receiptUri);
            } catch (error) {
              // Continua removendo referência mesmo se falhar no Storage
            }
          }

          setReceiptUri(null);
          showNotification('Recibo removido', 'success');
        },
      },
    ]);
  };

  const handleDelete = async () => {
    if (!isEditing || !transactionId) {
      return;
    }

    Alert.alert(
      'Deletar Transação',
      'Tem certeza que deseja deletar esta transação? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMutation.mutateAsync(transactionId);
              showNotification('Transação deletada com sucesso!', 'success');
              navigation.goBack();
            } catch (error: any) {
              showNotification(error.message || 'Erro ao deletar transação', 'error');
            }
          },
        },
      ]
    );
  };

  const handleSubmit = async () => {
    try {
      const validation = validateTransaction(amount, description);
      if (!validation.isValid) {
        showNotification(validation.error || 'Erro de validação', 'error');
        return;
      }

      if (!user) {
        showNotification('Usuário não autenticado', 'error');
        return;
      }

      // Converte formato brasileiro (2.000,50) para número
      const amountValue = parseFloat(amount.replace(/\./g, '').replace(',', '.'));

      if (isNaN(amountValue)) {
        showNotification('Valor inválido', 'error');
        return;
      }

      setUploadingReceipt(true);

      const amountInCents = Math.round(amountValue * 100);

      // Upload de recibo novo (URI local) ou mantém URL existente
      let receiptUrl: string | undefined;
      if (receiptUri && !receiptUri.startsWith('http')) {
        try {
          const tempId = isEditing ? transactionId : `temp_${Date.now()}`;
          receiptUrl = await uploadReceipt(receiptUri, user.id, tempId || '');
        } catch (uploadError: any) {
          showNotification(uploadError.message || 'Erro ao fazer upload do recibo', 'error');
          setUploadingReceipt(false);
          return;
        }
      } else if (receiptUri) {
        receiptUrl = receiptUri;
      }

      if (isEditing && transactionId) {
        const updateData: any = {
          type,
          amount: amountInCents,
          description,
          date: existingTransaction?.date || new Date(),
        };

        if (category) {
          updateData.category = category;
        }

        if (receiptUrl !== undefined) {
          updateData.receiptUrl = receiptUrl || null;
        } else if (receiptUri === null && existingTransaction?.receiptUrl) {
          updateData.receiptUrl = null;
        }

        await updateMutation.mutateAsync({ id: transactionId, data: updateData });

        const typeLabel = TRANSACTION_TYPE_CONFIG[type].label;
        showNotification(`${typeLabel} atualizada com sucesso!`, 'success');
      } else {
        const newTransactionData: any = {
          type,
          amount: amountInCents,
          description,
          date: new Date(),
        };

        if (category) {
          newTransactionData.category = category;
        }

        if (receiptUrl) {
          newTransactionData.receiptUrl = receiptUrl;
        }

        await createMutation.mutateAsync(newTransactionData);

        const typeLabel = TRANSACTION_TYPE_CONFIG[type].label;
        showNotification(`${typeLabel} adicionada com sucesso!`, 'success');
      }

      setAmount('');
      setDescription('');
      setCategory('');
      setReceiptUri(null);
      setUploadingReceipt(false);
      navigation.goBack();
    } catch (error: any) {
      setUploadingReceipt(false);
      showNotification(
        error.message ||
          (isEditing ? 'Erro ao atualizar transação' : 'Erro ao adicionar transação'),
        'error'
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.form}>
          <Text style={styles.sectionLabel}>Tipo de Transação</Text>
          <View style={styles.typeGrid}>
            {TRANSACTION_TYPES.map((transactionType) => {
              const config = TRANSACTION_TYPE_CONFIG[transactionType];
              return (
                <TouchableOpacity
                  key={transactionType}
                  style={[
                    styles.typeCard,
                    type === transactionType && styles.typeCardActive,
                    { borderColor: type === transactionType ? config.color : '#E0E0E0' },
                  ]}
                  onPress={() => setType(transactionType)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.typeIcon,
                      { backgroundColor: type === transactionType ? config.color : '#F8F9FA' },
                    ]}
                  >
                    <Ionicons
                      name={config.icon}
                      size={20}
                      color={type === transactionType ? '#FFFFFF' : '#666'}
                    />
                  </View>
                  <Text
                    style={[
                      styles.typeLabel,
                      type === transactionType && {
                        color: config.color,
                        fontWeight: '600',
                      },
                    ]}
                  >
                    {config.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <CurrencyInput value={amount} onChangeValue={setAmount} showIcon={true} />

          <View style={styles.inputContainer}>
            <Ionicons
              name="document-text-outline"
              size={20}
              color="#666"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Descrição"
              placeholderTextColor="#999"
              value={description}
              onChangeText={setDescription}
              maxLength={25}
            />
          </View>

          <View style={[styles.inputContainer, { marginBottom: 8 }]}>
            <Ionicons name="pricetag-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Categoria (opcional)"
              placeholderTextColor="#999"
              value={category}
              onChangeText={handleCategoryChange}
              onBlur={handleCategoryBlur}
              maxLength={25}
            />
          </View>

          {allCategoriesToShow.length > 0 && (
            <View style={{ marginBottom: 16 }}>
              <CategoryChips
                categories={allCategoriesToShow}
                selectedCategories={category ? [category] : []}
                onCategoryPress={handleCategoryChipPress}
                showLabel={true}
                labelText="Categorias:"
              />
            </View>
          )}

          <View style={styles.receiptSection}>
            <Text style={styles.sectionLabel}>Recibo (opcional)</Text>

            {receiptUri ? (
              <View style={styles.receiptPreviewContainer}>
                <Image source={{ uri: receiptUri }} style={styles.receiptPreview} />
                <TouchableOpacity style={styles.removeReceiptButton} onPress={handleRemoveImage}>
                  <Ionicons name="close-circle" size={24} color="#F44336" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.receiptButtonsContainer}>
                <TouchableOpacity style={styles.receiptButton} onPress={handlePickImage}>
                  <Ionicons name="images-outline" size={24} color="#666" />
                  <Text style={styles.receiptButtonText}>Galeria</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.receiptButton} onPress={handleTakePhoto}>
                  <Ionicons name="camera-outline" size={24} color="#666" />
                  <Text style={styles.receiptButtonText}>Câmera</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              (loading || uploadingReceipt) && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={loading || uploadingReceipt}
          >
            {uploadingReceipt ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#FFFFFF" />
                <Text style={[styles.submitButtonText, { marginLeft: 8 }]}>Fazendo upload...</Text>
              </View>
            ) : (
              <Text style={styles.submitButtonText}>
                {loading
                  ? isEditing
                    ? 'Atualizando...'
                    : 'Adicionando...'
                  : isEditing
                    ? 'Atualizar'
                    : 'Adicionar'}
              </Text>
            )}
          </TouchableOpacity>

          {isEditing && (
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} disabled={loading}>
              <Ionicons name="trash-outline" size={20} color="#F44336" />
              <Text style={styles.deleteButtonText}>Deletar Transação</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
  typeCard: {
    width: '31%',
    aspectRatio: 1,
    borderWidth: 2,
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  typeCardActive: {
    borderWidth: 2,
    backgroundColor: '#F8F9FA',
  },
  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  typeLabel: {
    fontSize: 11,
    textAlign: 'center',
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    backgroundColor: colors.brand.forest,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#B0BEC5',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  receiptSection: {
    marginBottom: 16,
  },
  receiptButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  receiptButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 16,
    backgroundColor: '#F8F9FA',
  },
  receiptButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  receiptPreviewContainer: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  receiptPreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removeReceiptButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#F44336',
    borderRadius: 8,
    paddingVertical: 16,
    marginTop: 12,
  },
  deleteButtonText: {
    color: '#F44336',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
