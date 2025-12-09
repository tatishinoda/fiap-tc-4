import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet, TextStyle } from 'react-native';
import { colors, typography } from '../../theme';

export type TextVariant = 
  | 'displayLarge' 
  | 'displayMedium' 
  | 'headlineLarge' 
  | 'headlineMedium' 
  | 'currencyLarge' 
  | 'currencyMedium' 
  | 'bodyLarge' 
  | 'bodyMedium' 
  | 'labelLarge' 
  | 'labelMedium';

export type TextAlign = 'left' | 'center' | 'right' | 'justify';

export interface TextProps extends RNTextProps {
  
  variant?: TextVariant;
  /** Text alignment */
  align?: TextAlign;
  /** Text color override */
  color?: string;
  /** Children content */
  children: React.ReactNode;
}

/**
 * Text Component
 * Usa o design system com tipografia refinada
 */
export const Text: React.FC<TextProps> = ({
  variant = 'bodyMedium',
  align = 'left',
  color,
  style,
  children,
  ...props
}) => {
  const variantStyle = typography[variant];
  const textColor = color || variantStyle.color || colors.light.text.primary;

  return (
    <RNText
      style={[
        variantStyle,
        { textAlign: align },
        { color: textColor },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};
