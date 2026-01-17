import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatCurrencyInput } from '../../utils/format';

interface CurrencyInputProps extends Omit<TextInputProps, 'onChangeText' | 'value'> {
  label?: string;
  value: string;
  onChangeValue: (value: string) => void;
  showIcon?: boolean;
  error?: string;
}

export function CurrencyInput({
  label,
  value,
  onChangeValue,
  showIcon = true,
  error,
  placeholder = '0,00',
  ...textInputProps
}: CurrencyInputProps) {
  const handleChange = (text: string) => {
    const formatted = formatCurrencyInput(text);
    onChangeValue(formatted);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={[styles.inputContainer, error && styles.inputContainerError]}>
        {showIcon && (
          <Ionicons name="cash-outline" size={20} color="#666" style={styles.icon} />
        )}
        <Text style={styles.currencyPrefix}>R$</Text>
        <TextInput
          style={[styles.input, showIcon && styles.inputWithIcon]}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={value}
          onChangeText={handleChange}
          keyboardType="numeric"
          {...textInputProps}
        />
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  inputContainerError: {
    borderColor: '#FF3B30',
  },
  icon: {
    marginRight: 12,
  },
  currencyPrefix: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginRight: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 12,
  },
  inputWithIcon: {
    // Adjust padding if icon is present
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
  },
});
