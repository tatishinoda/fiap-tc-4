import React from 'react';
import { View, ViewProps, StyleSheet, ViewStyle } from 'react-native';
import { cards, spacing, borderRadius } from '../../theme';

export type CardVariant = 'glass' | 'balance' | 'action' | 'transaction';

export interface CardProps extends ViewProps {
  
  variant?: CardVariant;
  /** Children components */
  children: React.ReactNode;
  /** Custom style */
  style?: ViewStyle;
  /** Remove padding */
  noPadding?: boolean;
}

/**
 * Card Component
 * Design glassmorphism e elevações refinadas
 */
export const Card: React.FC<CardProps> = ({
  variant = 'glass',
  children,
  style,
  noPadding = false,
  ...props
}) => {
  const getCardStyle = () => {
    switch (variant) {
      case 'glass':
        return cards.glassCard;
      case 'balance':
        return cards.balanceCard;
      case 'action':
        return cards.actionCard;
      case 'transaction':
        return cards.transactionCard;
      default:
        return cards.glassCard;
    }
  };

  return (
    <View
      style={[
        getCardStyle(),
        noPadding && styles.noPadding,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  noPadding: {
    padding: 0,
  },
});
