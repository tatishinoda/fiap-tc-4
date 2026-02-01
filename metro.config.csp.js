/**
 * Content Security Policy (CSP) Configuration
 * Previne ataques XSS, clickjacking e outros vetores de ataque malicioso
 * Aplica-se apenas quando rodando no Expo Web
 */

const cspConfig = {
  // Permite scripts apenas do próprio domínio e Firebase
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Necessário para React e Metro bundler
    'https://*.firebaseapp.com',
    'https://*.googleapis.com',
  ],

  // Permite estilos do próprio domínio
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Necessário para styled-components e NativeWind
  ],

  // Permite conexões apenas para domínios confiáveis
  'connect-src': [
    "'self'",
    'https://*.firebaseio.com',
    'https://*.googleapis.com',
    'https://*.firebaseapp.com',
    'https://firestore.googleapis.com',
    'wss://*.firebaseio.com', // WebSocket para Firestore real-time
  ],

  // Permite imagens de qualquer lugar (assets locais e URLs externas)
  'img-src': [
    "'self'",
    'data:',
    'https:',
    'blob:',
  ],

  // Permite fontes do próprio domínio e Google Fonts
  'font-src': [
    "'self'",
    'data:',
    'https://fonts.gstatic.com',
  ],

  // Previne frames (clickjacking protection)
  'frame-ancestors': ["'none'"],

  // Permite apenas HTTPS
  'upgrade-insecure-requests': [],
};

/**
 * Converte objeto CSP em string para header
 */
function buildCSPString(config) {
  return Object.entries(config)
    .map(([directive, sources]) => {
      if (sources.length === 0) return directive;
      return `${directive} ${sources.join(' ')}`;
    })
    .join('; ');
}

module.exports = {
  cspConfig,
  cspString: buildCSPString(cspConfig),
};
