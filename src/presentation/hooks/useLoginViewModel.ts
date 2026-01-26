import { useState } from 'react';
import { LoginUseCase } from '../../domain/usecases/auth/LoginUseCase';
import { container } from '../../di/container';
import { useAuthActions, useAuthLoading, useAuthError } from '../../state/selectors/authSelectors';

export const useLoginViewModel = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { setUser, setLoading, setError } = useAuthActions();
  const isLoading = useAuthLoading();
  const error = useAuthError();

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      const loginUseCase = container.get<LoginUseCase>('LoginUseCase');
      const user = await loginUseCase.execute(email, password);
      
      setUser(user);
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    handleLogin,
    isLoading,
    error,
  };
};
