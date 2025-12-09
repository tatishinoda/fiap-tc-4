/**
 * API Endpoints centralizados
 */

// Base URL - Altere para sua API real
export const API_BASE_URL = 'https://api.bytebank.com.br'; // TODO: Configurar URL real

// Auth endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  ME: '/auth/me',
} as const;

// Transaction endpoints
export const TRANSACTION_ENDPOINTS = {
  LIST: '/transactions',
  CREATE: '/transactions',
  UPDATE: (id: string) => `/transactions/${id}`,
  DELETE: (id: string) => `/transactions/${id}`,
  SUMMARY: '/transactions/summary',
} as const;

// User endpoints
export const USER_ENDPOINTS = {
  PROFILE: '/user/profile',
  UPDATE_PROFILE: '/user/profile',
} as const;
