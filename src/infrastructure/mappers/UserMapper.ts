import { User as FirebaseUser } from 'firebase/auth';
import { User } from '../../domain/entities/User';

export class UserMapper {
  static toDomain(firebaseUser: FirebaseUser): User {
    return new User(
      firebaseUser.uid,
      firebaseUser.email || '',
      firebaseUser.displayName || '',
      new Date(firebaseUser.metadata.creationTime || Date.now())
    );
  }
}
