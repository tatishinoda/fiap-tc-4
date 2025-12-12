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

  useEffect(() => {
    setTokenGetter(() => authStore.token);
  }, [authStore.token]);

  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChange(async (firebaseUser: FirebaseUser | null) => {
      setLoading(true);
      authStore.setLoading(true);
      
      if (firebaseUser) {
        try {
          const userData = await AuthService.getCurrentUser();
          
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
          
          setUser(userData);
          setIsAuthenticated(true);
          await authStore.login(userData as any, token);
        } catch (error) {
          console.error('Erro ao obter dados do usuário:', error);
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
      
      if (!userData) {
        throw new Error('Dados do usuário não encontrados');
      }
      
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
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
      
      if (!userData) {
        throw new Error('Erro ao criar usuário');
      }
      
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
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
      await authStore.logout();
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
