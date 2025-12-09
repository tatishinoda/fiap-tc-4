import { useState, useCallback } from 'react';
import { AlertType } from '../components/ui/Alert';

interface AlertButton {
  text: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
}

interface AlertConfig {
  type?: AlertType;
  title: string;
  message?: string;
  buttons?: AlertButton[];
  closeOnBackdropPress?: boolean;
}

/**
 * Hook para gerenciar o estado e ações do Alert customizado
 * 
 * Uso:
 * ```tsx
 * const { alert, showAlert, hideAlert } = useAlert();
 * 
 * showAlert({
 *   type: 'success',
 *   title: 'Sucesso!',
 *   message: 'Operação realizada com sucesso'
 * });
 * 
 * return <Alert {...alert} />;
 * ```
 */
export function useAlert() {
  const [alertConfig, setAlertConfig] = useState<AlertConfig & { visible: boolean }>({
    visible: false,
    type: 'info',
    title: '',
    message: '',
    buttons: [],
    closeOnBackdropPress: true,
  });

  const showAlert = useCallback((config: AlertConfig) => {
    setAlertConfig({
      ...config,
      visible: true,
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlertConfig((prev) => ({
      ...prev,
      visible: false,
    }));
  }, []);

  // Atalhos para tipos comuns de alert
  const showSuccess = useCallback(
    (title: string, message?: string, buttons?: AlertButton[]) => {
      showAlert({ type: 'success', title, message, buttons });
    },
    [showAlert]
  );

  const showError = useCallback(
    (title: string, message?: string, buttons?: AlertButton[]) => {
      showAlert({ type: 'error', title, message, buttons });
    },
    [showAlert]
  );

  const showWarning = useCallback(
    (title: string, message?: string, buttons?: AlertButton[]) => {
      showAlert({ type: 'warning', title, message, buttons });
    },
    [showAlert]
  );

  const showInfo = useCallback(
    (title: string, message?: string, buttons?: AlertButton[]) => {
      showAlert({ type: 'info', title, message, buttons });
    },
    [showAlert]
  );

  const showConfirm = useCallback(
    (
      title: string,
      message: string,
      onConfirm: () => void,
      onCancel?: () => void
    ) => {
      showAlert({
        type: 'warning',
        title,
        message,
        buttons: [
          {
            text: 'Cancelar',
            onPress: onCancel || hideAlert,
            variant: 'ghost',
          },
          {
            text: 'Confirmar',
            onPress: onConfirm,
            variant: 'primary',
          },
        ],
        closeOnBackdropPress: false,
      });
    },
    [showAlert, hideAlert]
  );

  return {
    alert: {
      ...alertConfig,
      onClose: hideAlert,
    },
    showAlert,
    hideAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
  };
}
