import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { User } from '../types';
import * as SecureStore from 'expo-secure-store';

export class AuthService {
  // Registrar novo usuário
  static async signUp(email: string, password: string, name: string): Promise<User> {
    let firebaseUser: FirebaseUser | null = null;
    
    try {
      // Criar usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      firebaseUser = userCredential.user;

      // Criar perfil do usuário no Firestore
      const userData: Omit<User, 'id'> = {
        email: firebaseUser.email!,
        name,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userData);

      // Salvar token de segurança
      await SecureStore.setItemAsync('userToken', firebaseUser.uid);

      return {
        id: firebaseUser.uid,
        ...userData,
      };
    } catch (error: any) {
      console.error('Erro ao registrar usuário:', error);
      
      // Se criou no Auth mas falhou no Firestore, remove do Auth
      if (firebaseUser && error.code !== 'auth/email-already-in-use') {
        try {
          await firebaseUser.delete();
        } catch (deleteError) {
          console.error('Erro ao limpar usuário do Auth:', deleteError);
        }
      }
      
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Fazer login
  static async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Buscar dados do usuário no Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (!userDoc.exists()) {
        // Fazer logout do Firebase Auth se não encontrar dados no Firestore
        await firebaseSignOut(auth);
        throw new Error('Perfil de usuário não encontrado. Por favor, entre em contato com o suporte.');
      }

      const userData = userDoc.data() as Omit<User, 'id'>;
      
      // Salvar token de segurança
      await SecureStore.setItemAsync('userToken', firebaseUser.uid);

      return {
        id: firebaseUser.uid,
        ...userData,
      };
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      // Se já é uma mensagem customizada, mantém ela
      if (error.message && !error.code) {
        throw error;
      }
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Fazer logout
  static async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
      await SecureStore.deleteItemAsync('userToken');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw new Error('Erro ao sair da conta');
    }
  }

  // Obter usuário atual
  static async getCurrentUser(): Promise<User | null> {
    try {
      const firebaseUser = auth.currentUser;
      
      if (!firebaseUser) return null;

      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (!userDoc.exists()) return null;

      const userData = userDoc.data() as Omit<User, 'id'>;
      
      return {
        id: firebaseUser.uid,
        ...userData,
      };
    } catch (error) {
      console.error('Erro ao obter usuário atual:', error);
      return null;
    }
  }

  // Listener para mudanças no estado de autenticação
  static onAuthStateChange(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  // Tradução de mensagens de erro
  private static getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'Usuário não encontrado';
      case 'auth/wrong-password':
        return 'Senha incorreta';
      case 'auth/email-already-in-use':
        return 'E-mail já está em uso';
      case 'auth/weak-password':
        return 'Senha muito fraca. Use pelo menos 6 caracteres';
      case 'auth/invalid-email':
        return 'E-mail inválido';
      case 'auth/network-request-failed':
        return 'Erro de conexão. Verifique sua internet';
      default:
        return 'Erro de autenticação. Tente novamente';
    }
  }
}
