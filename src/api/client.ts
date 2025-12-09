/**
 * Axios client with interceptors
 * Handles authentication, errors, and loading states globally
 */

import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_BASE_URL } from './endpoints';

// Criar instância do Axios
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Estado de loading global (pode ser integrado com Zustand depois)
let activeRequests = 0;

// Função para obter o token (será configurada depois)
let getTokenFunction: (() => string | null) | null = null;

export const setTokenGetter = (getter: () => string | null) => {
  getTokenFunction = getter;
};

// Request Interceptor - Adiciona token automaticamente
apiClient.interceptors.request.use(
  (config) => {
    activeRequests++;

    // Adiciona token se existir
    if (getTokenFunction) {
      const token = getTokenFunction();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Log em desenvolvimento
    if (__DEV__) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    activeRequests--;
    return Promise.reject(error);
  }
);

// Response Interceptor - Trata erros globalmente
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    activeRequests--;

    // Log em desenvolvimento
    if (__DEV__) {
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    }

    return response;
  },
  async (error: AxiosError) => {
    activeRequests--;

    // Log de erro
    if (__DEV__) {
      console.error('[API Error]', {
        url: error.config?.url,
        status: error.response?.status,
        message: error.message,
      });
    }

    // Trata erros específicos
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Token inválido ou expirado
          // O AuthContext irá tratar o logout
          console.log('[API] Unauthorized - Token inválido');
          break;

        case 403:
          // Sem permissão
          console.log('[API] Forbidden - Sem permissão');
          break;

        case 404:
          // Recurso não encontrado
          console.log('[API] Not Found');
          break;

        case 500:
        case 502:
        case 503:
          // Erro no servidor
          console.log('[API] Server Error');
          break;

        default:
          console.log(`[API] Error ${status}`);
      }

      // Retorna mensagem de erro amigável
      const errorMessage = (data as any)?.message || 'Erro ao processar requisição';
      return Promise.reject(new Error(errorMessage));
    }

    // Erro de rede
    if (error.message === 'Network Error') {
      return Promise.reject(new Error('Erro de conexão. Verifique sua internet.'));
    }

    // Timeout
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Tempo de requisição excedido. Tente novamente.'));
    }

    return Promise.reject(error);
  }
);

// Helper para saber se há requisições ativas
export const hasActiveRequests = () => activeRequests > 0;

// Export default
export default apiClient;
