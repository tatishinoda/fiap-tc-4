/**
 * Auth API - Chamadas de autenticação
 */

import apiClient from './client';
import { AUTH_ENDPOINTS } from './endpoints';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name?: string;
    createdAt?: string;
  };
  token: string;
}

/**
 * Faz login na API
 */
export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>(AUTH_ENDPOINTS.LOGIN, data);
  return response.data;
};

/**
 * Registra novo usuário
 */
export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>(AUTH_ENDPOINTS.REGISTER, data);
  return response.data;
};

/**
 * Faz logout (revoga token no servidor)
 */
export const logout = async (): Promise<void> => {
  await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
};

/**
 * Busca dados do usuário autenticado
 */
export const getCurrentUser = async () => {
  const response = await apiClient.get(AUTH_ENDPOINTS.ME);
  return response.data;
};

/**
 * Renova o token de acesso
 */
export const refreshToken = async (refreshToken: string): Promise<{ token: string }> => {
  const response = await apiClient.post(AUTH_ENDPOINTS.REFRESH_TOKEN, {
    refreshToken,
  });
  return response.data;
};
