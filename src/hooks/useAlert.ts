import { useState, useCallback } from 'react';
import { AlertType } from '../components/ui/Alert';

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

export interface AlertButton {
  text: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
}

export interface AlertConfig {
  type?: AlertType;
  title: string;
  message?: string;
  buttons?: AlertButton[];
  closeOnBackdropPress?: boolean;
}

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

export function useAlert() {
  // --------------------------------------------------------------------------
  // Estado
  // --------------------------------------------------------------------------

  const [alertConfig, setAlertConfig] = useState<AlertConfig & { visible: boolean }>({
    visible: false,
    type: 'info',
    title: '',
    message: '',
    buttons: [],
    closeOnBackdropPress: true,
  });

  // --------------------------------------------------------------------------
  // Controles Básicos
  // --------------------------------------------------------------------------

  // Exibe alert com configuração customizada
  const showAlert = useCallback((config: AlertConfig) => {
    setAlertConfig({
      ...config,
      visible: true,
    });
  }, []);

  // Oculta o alert atual
  const hideAlert = useCallback(() => {
    setAlertConfig((prev) => ({
      ...prev,
      visible: false,
    }));
  }, []);

  // --------------------------------------------------------------------------
  // Atalhos por Tipo
  // --------------------------------------------------------------------------

  // Exibe alert de sucesso
  const showSuccess = useCallback(
    (title: string, message?: string, buttons?: AlertButton[]) => {
      showAlert({ type: 'success', title, message, buttons });
    },
    [showAlert]
  );

  // Exibe alert de erro
  const showError = useCallback(
    (title: string, message?: string, buttons?: AlertButton[]) => {
      showAlert({ type: 'error', title, message, buttons });
    },
    [showAlert]
  );

  // Exibe alert de aviso
  const showWarning = useCallback(
    (title: string, message?: string, buttons?: AlertButton[]) => {
      showAlert({ type: 'warning', title, message, buttons });
    },
    [showAlert]
  );

  // Exibe alert informativo
  const showInfo = useCallback(
    (title: string, message?: string, buttons?: AlertButton[]) => {
      showAlert({ type: 'info', title, message, buttons });
    },
    [showAlert]
  );

  // --------------------------------------------------------------------------
  // Diálogos Especiais
  // --------------------------------------------------------------------------

  // Exibe diálogo de confirmação com botões Cancelar/Confirmar
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

  // --------------------------------------------------------------------------
  // Retorno do Hook
  // --------------------------------------------------------------------------

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
