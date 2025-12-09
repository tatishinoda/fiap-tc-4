import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from './Text';
import { Button } from './Button';
import { colors, cards, spacing, borderRadius, shadows } from '../../theme';

export type AlertType = 'info' | 'success' | 'warning' | 'error';

export interface AlertButton {
  text: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
}

interface AlertProps {
  visible: boolean;
  type?: AlertType;
  title: string;
  message?: string;
  buttons?: AlertButton[];
  onClose?: () => void;
  closeOnBackdropPress?: boolean;
}

/**
 * Alert Component
 * Modal customizado com design glassmorphism
 */
export function Alert({
  visible,
  type = 'info',
  title,
  message,
  buttons = [],
  onClose,
  closeOnBackdropPress = true,
}: AlertProps) {
  const handleBackdropPress = () => {
    if (closeOnBackdropPress && onClose) {
      onClose();
    }
  };

  const getIconConfig = () => {
    switch (type) {
      case 'success':
        return {
          name: 'checkmark-circle' as const,
          color: colors.success.main,
          backgroundColor: colors.success.light,
        };
      case 'warning':
        return {
          name: 'warning' as const,
          color: colors.warning.main,
          backgroundColor: colors.warning.light,
        };
      case 'error':
        return {
          name: 'close-circle' as const,
          color: colors.error.main,
          backgroundColor: colors.error.light,
        };
      default:
        return {
          name: 'information-circle' as const,
          color: colors.brand.teal,
          backgroundColor: colors.finance.income.light,
        };
    }
  };

  const iconConfig = getIconConfig();

  const finalButtons: AlertButton[] =
    buttons.length > 0
      ? buttons
      : [
          {
            text: 'OK',
            onPress: onClose || (() => {}),
            variant: 'primary',
          },
        ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable style={styles.backdrop} onPress={handleBackdropPress}>
        <Pressable
          style={[cards.glassCard, styles.container]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          {onClose && (
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.light.text.muted} />
            </TouchableOpacity>
          )}

          {/* Icon */}
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: iconConfig.backgroundColor },
            ]}
          >
            <Ionicons
              name={iconConfig.name}
              size={48}
              color={iconConfig.color}
            />
          </View>

          {/* Title */}
          <Text
            variant="headlineMedium"
            align="center"
            style={styles.title}
          >
            {title}
          </Text>

          {/* Mensagem */}
          {message && (
            <Text
              variant="bodyMedium"
              align="center"
              color={colors.light.text.secondary}
              style={styles.message}
            >
              {message}
            </Text>
          )}

          {/* Botões */}
          <View
            style={[
              styles.buttonsContainer,
              finalButtons.length > 2 && styles.buttonsContainerColumn,
            ]}
          >
            {finalButtons.map((button, index) => (
              <Button
                key={index}
                onPress={button.onPress}
                variant={button.variant || 'primary'}
                style={styles.button}
              >
                {button.text}
              </Button>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.light.scrim,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    padding: spacing.xl,
    ...shadows.cardElevated,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  title: {
    marginBottom: spacing.sm,
  },
  message: {
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  buttonsContainerColumn: {
    flexDirection: 'column',
  },
  button: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    padding: spacing.xs,
    zIndex: 1,
  },
});
