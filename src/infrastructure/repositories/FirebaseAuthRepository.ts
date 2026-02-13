import { auth, db } from '../config/firebase';
import {  signInWithEmailAndPassword,  createUserWithEmailAndPassword,  signOut, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { User } from '../../domain/entities/User';
import { UserMapper } from '../mappers/UserMapper';

export class FirebaseAuthRepository implements IAuthRepository {
  private handleAuthError(error: any): never {
    const errorCode = error.code;

    switch (errorCode) {
      case 'auth/invalid-credential':
      case 'auth/invalid-credentials':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        throw new Error('E-mail ou senha incorretos. Verifique suas credenciais e tente novamente.');

      case 'auth/user-disabled':
        throw new Error('Esta conta foi desativada. Entre em contato com o suporte.');

      case 'auth/too-many-requests':
        throw new Error('Muitas tentativas de login. Por favor, aguarde alguns minutos e tente novamente.');

      case 'auth/network-request-failed':
        throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');

      case 'auth/email-already-in-use':
        throw new Error('Este e-mail já está cadastrado.');

      case 'auth/weak-password':
        throw new Error('Senha muito fraca. Use pelo menos 6 caracteres.');

      case 'auth/invalid-email':
        throw new Error('E-mail inválido.');

      default:
        throw new Error('Erro ao autenticar. Tente novamente mais tarde.');
    }
  }

  async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Buscar dados completos do usuário no Firestore
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));

      if (userDoc.exists()) {
        return UserMapper.fromFirestore(userDoc.id, userDoc.data() as any);
      }

      // Fallback: se não existir no Firestore, usar dados do Authentication
      return UserMapper.toDomain(userCredential.user);
    } catch (error: any) {
      this.handleAuthError(error);
    }
  }

  async signUp(email: string, password: string, name: string): Promise<User> {
    try {
      // 1. Criar usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // 2. Atualizar displayName no perfil do Authentication
      await updateProfile(userCredential.user, {
        displayName: name
      });

      // 3. Criar objeto User do domínio temporário (para retornar)
      const now = new Date();
      const user = new User(
        userCredential.user.uid,
        email,
        name,
        now,
        now
      );

      // 4. Salvar no Firestore com serverTimestamp
      const userData = {
        ...UserMapper.toFirestore(user),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(doc(db, 'users', user.id), userData);

      return user;
    } catch (error: any) {
      this.handleAuthError(error);
    }
  }

  async logout(): Promise<void> {
    await signOut(auth);
  }

  async getCurrentUser(): Promise<User | null> {
    const firebaseUser = auth.currentUser;

    if (!firebaseUser) {
      return null;
    }

    // Buscar dados completos do usuário no Firestore
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

    if (userDoc.exists()) {
      return UserMapper.fromFirestore(userDoc.id, userDoc.data() as any);
    }

    // Fallback: se não existir no Firestore, usar dados do Authentication
    return UserMapper.toDomain(firebaseUser);
  }
}
