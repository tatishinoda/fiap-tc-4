import { Platform, Alert as RNAlert } from 'react-native';

/**
 * Wrapper para Alert que funciona tanto em mobile quanto na web
 * Em mobile usa Alert.alert nativo
 * Na web usa window.alert ou pode ser integrado com sistema de notificação
 */
export const showAlert = (
  title: string,
  message?: string,
  buttons?: Array<{ text: string; onPress?: () => void; style?: 'default' | 'cancel' | 'destructive' }>
) => {
  if (Platform.OS === 'web') {
    // Na web, usa window.alert (simples mas funcional)
    const fullMessage = message ? `${title}\n\n${message}` : title;

    if (buttons && buttons.length > 1) {
      // Para múltiplos botões na web, usa window.confirm
      const result = window.confirm(fullMessage);
      const confirmedButton = buttons.find(b => b.style !== 'cancel');
      const cancelButton = buttons.find(b => b.style === 'cancel');

      if (result && confirmedButton?.onPress) {
        confirmedButton.onPress();
      } else if (!result && cancelButton?.onPress) {
        cancelButton.onPress();
      }
    } else {
      // Para um único botão ou sem botões
      window.alert(fullMessage);
      if (buttons && buttons[0]?.onPress) {
        buttons[0].onPress();
      }
    }
  } else {
    // Em mobile, usa Alert nativo
    RNAlert.alert(title, message, buttons as any);
  }
};

/**
 * Confirmação simples que funciona em todas as plataformas
 */
export const showConfirm = (
  title: string,
  message: string,
  onConfirm: () => void,
  onCancel?: () => void
) => {
  showAlert(title, message, [
    {
      text: 'Cancelar',
      style: 'cancel',
      onPress: onCancel,
    },
    {
      text: 'Confirmar',
      onPress: onConfirm,
    },
  ]);
};
