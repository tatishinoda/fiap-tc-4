import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, buttons, typography, shadows, borderRadius } from '../../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'icon' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends TouchableOpacityProps {
  /** Button text */
  children: string;
  /** Visual variant */
  variant?: ButtonVariant;
  /** Size variant */
  size?: ButtonSize;
  /** Loading state */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Full width */
  fullWidth?: boolean;
  /** Custom style */
  style?: ViewStyle;
  /** Custom text style */
  textStyle?: TextStyle;
}

/**
 * Button Component
 * Design refinado com glassmorphism
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
  ...props
}) => {
  const isDisabled = disabled || loading;

  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return buttons.primary;
      case 'secondary':
        return buttons.secondary;
      case 'ghost':
        return buttons.ghost;
      case 'icon':
        return buttons.icon;
      case 'danger':
        return buttons.danger;
      default:
        return buttons.primary;
    }
  };

  const getTextColor = () => {
    if (variant === 'ghost') return colors.brand.teal;
    if (variant === 'secondary') return colors.light.text.primary;
    if (variant === 'danger') return colors.light.text.primary;
    return colors.brand.deepForest;
  };

  return (
    <TouchableOpacity
      style={[
        getButtonStyle(),
        styles[`${size}Container`],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
      disabled={isDisabled}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'ghost' ? colors.brand.teal : colors.brand.deepForest}
          size="small"
        />
      ) : (
        <Text
          style={[
            typography.labelLarge,
            { color: getTextColor() },
            styles[`${size}Text`],
            textStyle,
          ]}
        >
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Sizes
  smContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    minHeight: 40,
  },
  mdContainer: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    minHeight: 52,
  },
  lgContainer: {
    paddingVertical: 18,
    paddingHorizontal: 36,
    minHeight: 60,
  },
  // States
  disabled: {
    opacity: 0.4,
  },
  fullWidth: {
    width: '100%',
  },
  // Text sizes
  smText: {
    fontSize: 13,
    letterSpacing: 0.3,
  },
  mdText: {
    fontSize: 14,
    letterSpacing: 0.5,
  },
  lgText: {
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
