import { ViewStyle, TextStyle } from 'react-native';
import { colors } from './colors';

/**
 * Shadow System - Natural e funcional
 */
export const shadows = {
  // Card shadows - Naturais
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  } as ViewStyle,

  cardElevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  } as ViewStyle,

  // Button shadows - Simples
  button: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  } as ViewStyle,

  // Glow sutil - Apenas para focos
  glow: {
    shadowColor: colors.brand.mint,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  } as ViewStyle,

  // Subtle shadow - Para separadores
  subtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  } as ViewStyle,

  // Sem sombra
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  } as ViewStyle,
};

/**
 * Card Styles
 */
export const cards = {
  // Cartão de saldo principal - Branco com sombra
  balanceCard: {
    backgroundColor: colors.light.surface,
    borderRadius: 16,
    padding: 24,
    ...shadows.card,
  } as ViewStyle,

  // Cartão padrão - Branco simples
  glassCard: {
    backgroundColor: colors.light.surface,
    borderRadius: 16,
    padding: 24,
    ...shadows.card,
  } as ViewStyle,

  // Cartão de ação rápida - Branco com borda
  actionCard: {
    backgroundColor: colors.light.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.light.border,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,

  // Cartão de transação - Branco simples
  transactionCard: {
    backgroundColor: colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
    padding: 16,
  } as ViewStyle,
  
  // Cartão elevado - Com sombra forte
  elevated: {
    backgroundColor: colors.light.surface,
    borderRadius: 16,
    padding: 24,
    ...shadows.cardElevated,
  } as ViewStyle,
};

/**
 * Typography Styles
 */
export const typography = {
  // Títulos principais
  displayLarge: {
    fontSize: 48,
    fontWeight: '700' as const,
    color: colors.light.text.onBackground,          // Branco no header
    letterSpacing: -1,
  } as TextStyle,

  displayMedium: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: colors.light.text.onBackground,          // Branco no header
  } as TextStyle,

  // Títulos de seção (em cards brancos)
  headlineLarge: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.light.text.primary,               // #333
    letterSpacing: 0,
  } as TextStyle,

  headlineMedium: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.light.text.primary,               // #333
  } as TextStyle,

  // Valores monetários
  currencyLarge: {
    fontSize: 42,
    fontWeight: '700' as const,
    color: colors.light.text.primary,
    letterSpacing: -1,
  } as TextStyle,

  currencyMedium: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.brand.mint,
  } as TextStyle,

  // Corpo de texto
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: colors.light.text.primary,               // #333
    lineHeight: 24,
  } as TextStyle,

  bodyMedium: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: colors.light.text.secondary,             // #666
    lineHeight: 20,
  } as TextStyle,

  // Labels
  labelLarge: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.light.text.secondary,
  } as TextStyle,

  labelMedium: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: colors.light.text.tertiary,
  } as TextStyle,
  
  // Caption
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: colors.light.text.tertiary,
    lineHeight: 16,
  } as TextStyle,

  // Button text
  button: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.light.text.onPrimary,             // Branco em botões
  } as TextStyle,
};

/**
 * Input Styles
 */
export const inputs = {
  // Container do input
  container: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    backgroundColor: colors.light.input.background,  // #F8F9FA
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.light.input.border,          // #E0E0E0
    paddingHorizontal: 16,
    marginBottom: 16,
  } as ViewStyle,

  // Input focado
  containerFocused: {
    borderColor: colors.light.input.borderFocused,   // Teal
    borderWidth: 2,
  } as ViewStyle,

  // Input com erro
  containerError: {
    borderColor: colors.error.main,
    borderWidth: 1,
  } as ViewStyle,

  // Input field
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: colors.light.text.primary,                // #333
  } as TextStyle,

  // Ícone dentro do input
  icon: {
    marginRight: 12,
    color: colors.light.text.secondary,              // #666
  } as TextStyle,

  // Label do input
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.light.text.primary,
    marginBottom: 8,
  } as TextStyle,

  // Placeholder
  placeholder: {
    color: colors.light.text.placeholder,            // #999
  } as TextStyle,
};

/**
 * Button Styles
 */
export const buttons = {
  // Botão primário - Verde sólido
  primary: {
    backgroundColor: colors.brand.teal,              // #2d5a47
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,

  // Botão secundário - Outline
  secondary: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.brand.teal,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,

  // Botão ghost - Transparente
  ghost: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,

  // Botão ícone
  icon: {
    backgroundColor: colors.light.interactive.default,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,

  // Botão danger
  danger: {
    backgroundColor: colors.error.main,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,

  // Botão desabilitado
  disabled: {
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
};

/**
 * Spacing System
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

/**
 * Border Radius
 */
export const borderRadius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  full: 9999,
};

/**
 * Layout Helpers
 */
export const layout = {
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  } as ViewStyle,

  containerWithGradient: {
    flex: 1,
    // Nota: Para gradiente real, use LinearGradient do expo-linear-gradient
  } as ViewStyle,

  section: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  } as ViewStyle,

  row: {
    flexDirection: 'row' as const,
    alignItems: 'center',
  } as ViewStyle,

  rowBetween: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    justifyContent: 'space-between',
  } as ViewStyle,

  center: {
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
};
