import { User as FirebaseUser } from 'firebase/auth';
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { clearCache } from '../infrastructure/cache/QueryProvider';
import { User } from '../domain/entities/User';
import { container } from '../di/container';
import { LoginUseCase } from '../domain/usecases/auth/LoginUseCase';
import { SignUpUseCase } from '../domain/usecases/auth/SignUpUseCase';
import { LogoutUseCase } from '../domain/usecases/auth/LogoutUseCase';
import { FirebaseAuthRepository } from '../infrastructure/repositories/FirebaseAuthRepository';
import { useStore } from '../state/store';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Zustand store
  const setUserStore = useStore((state) => state.setUser);
  const clearAuth = useStore((state) => state.clearAuth);

  // Repository
  const authRepository = container.get<FirebaseAuthRepository>('AuthRepository');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await authRepository.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
          setUserStore(currentUser);
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      const loginUseCase = container.get<LoginUseCase>('LoginUseCase');
      const loggedUser = await loginUseCase.execute(email, password);
      setUser(loggedUser);
      setIsAuthenticated(true);
      setUserStore(loggedUser);
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string): Promise<void> => {
    try {
      const signUpUseCase = container.get<SignUpUseCase>('SignUpUseCase');
      const newUser = await signUpUseCase.execute(email, password, name);
      setUser(newUser);
      setIsAuthenticated(true);
      setUserStore(newUser);
    } catch (error) {
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await clearCache();
      const logoutUseCase = container.get<LogoutUseCase>('LogoutUseCase');
      await logoutUseCase.execute();
      setUser(null);
      setIsAuthenticated(false);
      clearAuth();
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
