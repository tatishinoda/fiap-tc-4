export const colors = {
  // Brand Colors - Premium Banking
  brand: {
    deepForest: '#012a36',    // Azul-verde escuro profundo (background mais escuro)
    forest: '#024D60',        // Azul-verde escuro (cor principal - NOVA)
    teal: '#037a94',          // Azul-verde médio (destaque primário)
    mint: '#05a3c7',          // Azul-verde claro (destaque secundário)
    sage: '#3bc4e0',          // Azul claro (acentos)
  },

  // Primary Scale - Escala de Azul-Verde
  primary: {
    50: '#e6f7fb',   // Azul clarinho
    100: '#b3e5f2',
    200: '#80d3e9',
    300: '#3bc4e0',  // Sage
    400: '#1eb4d6',
    500: '#05a3c7',  // Mint (principal claro)
    600: '#048ba8',
    700: '#037a94',  // Teal (médio)
    800: '#024D60',  // Forest (principal - NOVA)
    900: '#012a36',  // Deep Forest (mais escuro)
  },

  // Theme Colors
  light: {
    // Backgrounds - Clean & Simple
    background: '#024D60',        // Forest (Azul-Verde Escuro - NOVA)
    backgroundSecondary: '#012a36', // Deep Forest
    backgroundCard: '#FFFFFF',    // Branco para cards
    
    backgroundGradient: {
      start: '#024D60',           // Forest (Azul-Verde Escuro)
      end: '#037a94',             // Teal
    },
    
    // Surfaces (Cards, Modals, etc) - Brancos e sólidos
    surface: '#FFFFFF',                         // Branco sólido
    surfaceElevated: '#FFFFFF',
    surfaceGlass: '#FFFFFF',
    surfaceHighlight: '#F8F9FA',                // Cinza clarinho
    
    // Input specific - Estilo clean
    input: {
      background: '#F8F9FA',                    // Cinza clarinho
      backgroundFocused: '#FFFFFF',             // Branco ao focar
      border: '#E0E0E0',                        // Cinza claro
      borderFocused: '#037a94',                 // Teal ao focar
      placeholder: '#999999',
    },
    
    // Borders - Simples e claras
    border: '#E0E0E0',                          // Cinza claro
    borderLight: '#F0F0F0',                     // Mais claro
    borderAccent: '#037a94',                    // Teal para destaque
    
    // Overlays
    overlay: 'rgba(2, 77, 96, 0.96)',
    scrim: 'rgba(0, 0, 0, 0.6)',
    modalBackground: 'rgba(2, 77, 96, 0.92)',
    
    // Text Hierarchy
    text: {
      primary: '#333333',           // Cinza escuro para texto em branco
      secondary: '#666666',         // Cinza médio
      tertiary: '#999999',          // Cinza claro
      accent: '#037a94',            // Azul-verde médio - Para links e valores
      success: '#05a3c7',           // Azul-verde para valores positivos
      disabled: '#CCCCCC',
      muted: '#999999',
      inverse: '#FFFFFF',           // Branco para backgrounds coloridos
      placeholder: '#999999',
      onPrimary: '#FFFFFF',         // Branco em botões coloridos
      onBackground: '#FFFFFF',      // Branco no header colorido
    },
    
    // Interactive States - Simples e funcional
    interactive: {
      default: '#F8F9FA',                     // Cinza clarinho
      hover: '#E8EAED',                       // Cinza ao hover
      pressed: '#D1D5DB',                     // Cinza ao pressionar
      focused: '#037a94',                     // Azul-verde médio ao focar
      active: '#037a94',                      // Azul-verde médio ativo
      disabled: '#E0E0E0',
    },
    
    // Gradients - Premium Banking
    gradient: {
      primary: ['#012a36', '#024D60'],              // Deep Forest → Forest
      secondary: ['#024D60', '#037a94'],            // Forest → Teal
      tertiary: ['#037a94', '#05a3c7'],            // Teal → Mint
      card: ['rgba(2, 77, 96, 0.9)', 'rgba(3, 122, 148, 0.15)'],
      button: ['#037a94', '#05a3c7'],               // Azul-verde gradient
      hero: ['#012a36', '#024D60', '#037a94'],     // Triple gradient
      overlay: ['rgba(2, 77, 96, 0)', 'rgba(2, 77, 96, 0.95)'],
    },
  },

  // Financial Colors - Banking Specific
  finance: {
    // Receitas (Income) - Azul-verde vibrante
    income: {
      main: '#05a3c7',                      // Azul-verde mint - Receitas
      light: 'rgba(5, 163, 199, 0.15)',
      lighter: 'rgba(5, 163, 199, 0.08)',
      dark: '#048ba8',
      glow: 'rgba(5, 163, 199, 0.5)',
      gradient: ['#05a3c7', '#3bc4e0'],
    },
    
    // Despesas (Expense) - Rosa/Coral suave (contraste com verde)
    expense: {
      main: '#ff8a80',                      // Coral suave - Despesas
      light: 'rgba(255, 138, 128, 0.15)',
      lighter: 'rgba(255, 138, 128, 0.08)',
      dark: '#e57373',
      glow: 'rgba(255, 138, 128, 0.4)',
      gradient: ['#ff8a80', '#ff6b6b'],
    },
    
    // Transferências - Azul suave
    transfer: {
      main: '#80d8ff',                      // Azul claro - Transferências
      light: 'rgba(128, 216, 255, 0.15)',
      lighter: 'rgba(128, 216, 255, 0.08)',
      dark: '#4fc3f7',
      glow: 'rgba(128, 216, 255, 0.4)',
      gradient: ['#80d8ff', '#3bc4e0'],
    },
    
    // Saldo/Balance
    balance: {
      positive: '#05a3c7',    // Azul-verde mint - Positivo
      negative: '#ff8a80',    // Coral - Negativo
      neutral: '#3bc4e0',     // Sage - Neutro
      zero: '#1eb4d6',        // Azul-verde intermediário
    },
  },

  // Quick Actions - Cores vibrantes e distintas
  actions: {
    // Adicionar Receita
    income: {
      icon: '#05a3c7',                            // Azul-verde mint
      iconSecondary: '#3bc4e0',
      background: 'rgba(5, 163, 199, 0.12)',
      backgroundHover: 'rgba(5, 163, 199, 0.18)',
      border: 'rgba(5, 163, 199, 0.25)',
      glow: 'rgba(5, 163, 199, 0.4)',
    },
    
    // Adicionar Despesa
    expense: {
      icon: '#ff8a80',                            // Coral
      iconSecondary: '#ffab91',
      background: 'rgba(255, 138, 128, 0.12)',
      backgroundHover: 'rgba(255, 138, 128, 0.18)',
      border: 'rgba(255, 138, 128, 0.25)',
      glow: 'rgba(255, 138, 128, 0.4)',
    },
    
    // Transferir
    transfer: {
      icon: '#80d8ff',                            // Azul claro
      iconSecondary: '#a7ffeb',
      background: 'rgba(128, 216, 255, 0.12)',
      backgroundHover: 'rgba(128, 216, 255, 0.18)',
      border: 'rgba(128, 216, 255, 0.25)',
      glow: 'rgba(128, 216, 255, 0.4)',
    },
    
    // Pagar Conta
    payment: {
      icon: '#ffd180',                            // Laranja claro
      iconSecondary: '#ffe57f',
      background: 'rgba(255, 209, 128, 0.12)',
      backgroundHover: 'rgba(255, 209, 128, 0.18)',
      border: 'rgba(255, 209, 128, 0.25)',
      glow: 'rgba(255, 209, 128, 0.4)',
    },
    
    // Investimentos
    investment: {
      icon: '#ea80fc',                            // Roxo claro
      iconSecondary: '#ce93d8',
      background: 'rgba(234, 128, 252, 0.12)',
      backgroundHover: 'rgba(234, 128, 252, 0.18)',
      border: 'rgba(234, 128, 252, 0.25)',
      glow: 'rgba(234, 128, 252, 0.4)',
    },
  },

  // Navigation
  navigation: {
    inactive: 'rgba(5, 163, 199, 0.4)',   // Azul-verde com baixa opacidade
    active: '#3bc4e0',                      // Azul claro
    indicator: '#05a3c7',                   // Azul-verde mint
    background: '#024D60',
  },

  // Semantic Colors - Status & Feedback
  success: {
    light: '#3bc4e0',                   // Azul claro
    main: '#05a3c7',                    // Azul-verde mint
    dark: '#048ba8',
    background: 'rgba(5, 163, 199, 0.12)',
    border: 'rgba(5, 163, 199, 0.3)',
  },
  
  warning: {
    light: '#ffe57f',                   // Amarelo suave
    main: '#ffd180',                    // Laranja claro
    dark: '#ffb84d',
    background: 'rgba(255, 209, 128, 0.12)',
    border: 'rgba(255, 209, 128, 0.3)',
  },
  
  error: {
    light: '#ffab91',                   // Coral claro
    main: '#ff8a80',                    // Coral
    dark: '#e57373',
    background: 'rgba(255, 138, 128, 0.12)',
    border: 'rgba(255, 138, 128, 0.3)',
  },
  
  info: {
    light: '#a7ffeb',                   // Aqua claro
    main: '#80d8ff',                    // Azul claro
    dark: '#4fc3f7',
    background: 'rgba(128, 216, 255, 0.12)',
    border: 'rgba(128, 216, 255, 0.3)',
  },

  // Effects - Sutis e elegantes
  effects: {
    glow: 'rgba(5, 163, 199, 0.3)',            // Glow suave
    glowStrong: 'rgba(5, 163, 199, 0.5)',      // Reduzido
    shadow: 'rgba(0, 0, 0, 0.4)',               // Sombra mais forte
    shadowStrong: 'rgba(0, 0, 0, 0.6)',
    blur: 'rgba(45, 53, 64, 0.3)',              // Cinza
    shimmer: 'rgba(255, 255, 255, 0.05)',       // Shimmer branco sutil
    frosted: 'rgba(255, 255, 255, 0.02)',       // Muito sutil
    overlay: 'rgba(0, 0, 0, 0.7)',              // Overlay escuro
  },
} as const;

export type ColorScheme = 'light' | 'dark';
