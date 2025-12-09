import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Text,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTransactionContext } from '../../context';
import { useAppContext } from '../../context';
import { useAuth } from '../../hooks/useAuth';
import { TransactionType } from '../../types';
import { RootStackParamList } from '../../types/navigation';
import { colors } from '../../theme';
import { TRANSACTION_TYPE_CONFIG, TRANSACTION_TYPES, getSuggestedCategories, validateTransaction } from '../../utils';

type AddTransactionScreenRouteProp = RouteProp<RootStackParamList, 'AddTransaction'>;
type AddTransactionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddTransaction'>;

interface AddTransactionScreenProps {
  route: AddTransactionScreenRouteProp;
  navigation: AddTransactionScreenNavigationProp;
}

export default function AddTransactionScreen({ route, navigation }: AddTransactionScreenProps) {
  const { addTransaction, loading } = useTransactionContext();
  const { showNotification } = useAppContext();
  const { user } = useAuth();

  const preSelectedType = route.params?.type;

  const [type, setType] = useState<TransactionType>(preSelectedType || 'DEPOSIT');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  // Pega categorias sugeridas baseado no tipo
  const suggestedCategories = getSuggestedCategories(type);

  const handleSubmit = async () => {
    // Validação centralizada
    const validation = validateTransaction(amount, description);
    if (!validation.isValid) {
      showNotification(validation.error || 'Erro de validação', 'error');
      return;
    }

    if (!user) {
      showNotification('Usuário não autenticado', 'error');
      return;
    }

    const amountValue = parseFloat(amount.replace(',', '.'));

    try {
      // Converte para centavos
      const amountInCents = Math.round(amountValue * 100);

      // Adiciona transação usando Context
      await addTransaction({
        type,
        amount: amountInCents,
        description,
        category: category || undefined,
        date: new Date(),
        userId: user.id,
        updatedAt: new Date(),
      });

      const typeLabel = TRANSACTION_TYPE_CONFIG[type].label;
      showNotification(`${typeLabel} adicionada com sucesso!`, 'success');

      // Limpa formulário e volta
      setAmount('');
      setDescription('');
      setCategory('');
      navigation.goBack();
    } catch (error: any) {
      showNotification(
        error.message || 'Erro ao adicionar transação',
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
        {/* Form */}
        <View style={styles.form}>

          {/* Tipo de transação */}
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
                  { borderColor: type === transactionType ? config.color : '#E0E0E0' }
                ]}
                onPress={() => setType(transactionType)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.typeIcon,
                  { backgroundColor: type === transactionType ? config.color : '#F8F9FA' }
                ]}>
                  <Ionicons
                    name={config.icon}
                    size={20}
                    color={type === transactionType ? '#FFFFFF' : '#666'}
                  />
                </View>
                <Text style={[
                  styles.typeLabel,
                  type === transactionType && { 
                    color: config.color, 
                    fontWeight: '600' 
                  }
                ]}>
                  {config.label}
                </Text>
              </TouchableOpacity>
            );})}
          </View>

          {/* Valor */}
          <View style={styles.inputContainer}>
            <Ionicons name="cash-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Valor (R$)"
              placeholderTextColor="#999"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
          </View>

          {/* Descrição */}
          <View style={styles.inputContainer}>
            <Ionicons name="document-text-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Descrição"
              placeholderTextColor="#999"
              value={description}
              onChangeText={setDescription}
            />
          </View>

          {/* Categoria */}
          <View style={styles.inputContainer}>
            <Ionicons name="pricetag-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Categoria (opcional)"
              placeholderTextColor="#999"
              value={category}
              onChangeText={setCategory}
            />
          </View>

          {/* Botões */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Adicionando...' : 'Adicionar'}
            </Text>
          </TouchableOpacity>
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
    marginBottom: 24,
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
  }
});
