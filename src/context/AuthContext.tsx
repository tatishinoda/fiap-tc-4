import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { AuthService } from '../services/AuthService';
import { AuthContextType, User } from '../types';
import { useAuthStore } from '../store/auth.store';
import { setTokenGetter } from '../api/client';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Integração com Zustand store
  const authStore = useAuthStore();

  // Configura o token getter para o API client
  useEffect(() => {
    setTokenGetter(() => authStore.token);
  }, [authStore.token]);

  useEffect(() => {
    // Listener para mudanças no estado de autenticação
    const unsubscribe = AuthService.onAuthStateChange(async (firebaseUser: FirebaseUser | null) => {
      setLoading(true);
      authStore.setLoading(true);
      
      if (firebaseUser) {
        try {
          const userData = await AuthService.getCurrentUser();
          
          // Se não encontrou dados do usuário, faz logout
          if (!userData) {
            console.error('Dados do usuário não encontrados no Firestore');
            await AuthService.signOut();
            setUser(null);
            setIsAuthenticated(false);
            await authStore.logout();
            setLoading(false);
            authStore.setLoading(false);
            return;
          }
          
          const token = await firebaseUser.getIdToken();
          
          // Atualiza Context
          setUser(userData);
          setIsAuthenticated(true);
          
          // Atualiza Zustand Store
          await authStore.login(userData as any, token);
        } catch (error) {
          console.error('Erro ao obter dados do usuário:', error);
          // Faz logout em caso de erro
          await AuthService.signOut();
          setUser(null);
          setIsAuthenticated(false);
          await authStore.logout();
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
        await authStore.logout();
      }
      
      setLoading(false);
      authStore.setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      const userData = await AuthService.signIn(email, password);
      
      // Verifica se realmente obteve os dados do usuário
      if (!userData) {
        throw new Error('Dados do usuário não encontrados');
      }
      
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      // Garante que o estado está limpo em caso de erro
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string): Promise<void> => {
    setLoading(true);
    try {
      const userData = await AuthService.signUp(email, password, name);
      
      // Verifica se realmente criou o usuário
      if (!userData) {
        throw new Error('Erro ao criar usuário');
      }
      
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      // Garante que o estado está limpo em caso de erro
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    setLoading(true);
    try {
      await AuthService.signOut();
      await authStore.logout(); // Limpa Zustand store
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
