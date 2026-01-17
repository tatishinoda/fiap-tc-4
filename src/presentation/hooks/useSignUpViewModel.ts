import { useState } from 'react';
import { SignUpUseCase } from '../../application/usecases/auth/SignUpUseCase';
import { container } from '../../di/container';
import { useAuthActions, useAuthLoading, useAuthError } from '../../state/selectors/authSelectors';

export const useSignUpViewModel = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const { setUser, setLoading, setError } = useAuthActions();
  const isLoading = useAuthLoading();
  const error = useAuthError();

  const handleSignUp = async () => {
    try {
      setLoading(true);
      setError(null);

      const signUpUseCase = container.get<SignUpUseCase>('SignUpUseCase');
      const user = await signUpUseCase.execute(email, password, name);
      
      setUser(user);
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    name,
    setName,
    handleSignUp,
    isLoading,
    error,
  };
};
