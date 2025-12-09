import React, { useState } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, typography, cards, spacing, borderRadius } from '../../theme';

export interface InputProps extends TextInputProps {
  /** Input label */
  label?: string;
  /** Error message */
  error?: string;
  /** Helper text */
  helperText?: string;
  /** Container style */
  containerStyle?: ViewStyle;
  /** Input style */
  inputStyle?: TextStyle;
  /** Left icon component */
  leftIcon?: React.ReactNode;
  /** Right icon component */
  rightIcon?: React.ReactNode;
}

/**
 * Input Component
 * Design glassmorphism com foco em acessibilidade e estética
 */
export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  containerStyle,
  inputStyle,
  leftIcon,
  rightIcon,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasError = !!error;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[typography.labelLarge, styles.label]}>
          {label}
        </Text>
      )}
      <View
        style={[
          cards.glassCard,
          styles.inputContainer,
          isFocused && styles.focused,
          hasError && styles.error,
        ]}
      >
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
        <TextInput
          style={[
            typography.bodyLarge,
            styles.input,
            inputStyle,
          ]}
          placeholderTextColor={colors.light.text.disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>
      {(error || helperText) && (
        <Text style={[typography.bodyMedium, styles.helperText, hasError && styles.errorText]}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    color: colors.light.text.primary,
    marginBottom: spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    minHeight: 52,
  },
  focused: {
    borderColor: colors.brand.teal,
    borderWidth: 2,
    backgroundColor: colors.light.interactive.focused,
  },
  error: {
    borderColor: colors.error.main,
    borderWidth: 2,
  },
  input: {
    flex: 1,
    color: colors.light.text.primary,
    paddingVertical: spacing.sm,
  },
  iconLeft: {
    marginRight: spacing.sm,
  },
  iconRight: {
    marginLeft: spacing.sm,
  },
  helperText: {
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
    color: colors.light.text.muted,
  },
  errorText: {
    color: colors.error.main,
  },
});
