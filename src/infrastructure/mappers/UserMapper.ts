import { User as FirebaseUser } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
import { User } from '../../domain/entities/User';
import { UserFirestoreDTO } from '../../types';

export class UserMapper {
  // Converte FirebaseUser (Authentication) para User do domínio
  static toDomain(firebaseUser: FirebaseUser): User {
    const now = new Date();
    return new User(
      firebaseUser.uid,
      firebaseUser.email || '',
      firebaseUser.displayName || '',
      new Date(firebaseUser.metadata.creationTime || now),
      now
    );
  }

  // Converte dados do Firestore para User do domínio
  static fromFirestore(docId: string, data: any): User {
    return new User(
      docId,
      data.email,
      data.name,
      data.createdAt instanceof Timestamp 
        ? data.createdAt.toDate() 
        : data.createdAt instanceof Date 
        ? data.createdAt 
        : new Date(data.createdAt),
      data.updatedAt instanceof Timestamp 
        ? data.updatedAt.toDate() 
        : data.updatedAt instanceof Date 
        ? data.updatedAt 
        : new Date(data.updatedAt)
    );
  }

  // Converte User do domínio para formato do Firestore
  static toFirestore(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Omit<UserFirestoreDTO, 'createdAt' | 'updatedAt'> {
    return {
      email: user.email,
      name: user.name,
    };
  }
}
