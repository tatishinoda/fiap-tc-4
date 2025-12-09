import { StyleSheet } from 'react-native';
import { colors } from '../theme';

/**
 * Estilos comuns reutilizáveis em todas as telas
 * Evita duplicação de código de estilos
 */

export const commonStyles = StyleSheet.create({
  // Container
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },

  // Theme Switcher
  themeSwitcher: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },

  // Content
  content: {
    flex: 1,
    padding: 20,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  centeredContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  headerWithMargin: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 60,
  },

  // Card
  formCard: {
    padding: 24,
    marginBottom: 20,
  },

  // Title
  formTitle: {
    marginBottom: 24,
    textAlign: 'center',
  },
  sectionTitle: {
    marginBottom: 16,
    marginTop: 24,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },

  // Loading & Empty States
  loadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },

  // Buttons
  buttonMargin: {
    marginTop: 8,
  },

  // Row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

/**
 * Função helper para obter o estilo do container
 */
export const getThemedContainerStyle = () => commonStyles.container;

/**
 * Função helper para obter cor de texto baseado na variante
 */
export const getThemedTextColor = (variant: 'primary' | 'secondary' | 'tertiary' = 'primary') => {
  switch (variant) {
    case 'secondary': return colors.light.text.secondary;
    case 'tertiary': return colors.light.text.tertiary;
    default: return colors.light.text.primary;
  }
};
