import { auth, db } from '../config/firebase';
import {  signInWithEmailAndPassword,  createUserWithEmailAndPassword,  signOut, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { User } from '../../domain/entities/User';
import { UserMapper } from '../mappers/UserMapper';

export class FirebaseAuthRepository implements IAuthRepository {
  async login(email: string, password: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Buscar dados completos do usuário no Firestore
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    
    if (userDoc.exists()) {
      return UserMapper.fromFirestore(userDoc.id, userDoc.data() as any);
    }
    
    // Fallback: se não existir no Firestore, usar dados do Authentication
    return UserMapper.toDomain(userCredential.user);
  }

  async signUp(email: string, password: string, name: string): Promise<User> {
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
