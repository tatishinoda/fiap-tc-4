import { AuthSlice } from '../slices/authSlice';

// Selectors para usar com useStore
export const authSelectors = {
  user: (state: AuthSlice) => state.user,
  isAuthenticated: (state: AuthSlice) => state.isAuthenticated,
  isLoading: (state: AuthSlice) => state.isLoading,
  error: (state: AuthSlice) => state.error,
};

// Hooks customizados (mantidos para compatibilidade)
import { useStore } from '../store';

export const useUser = () => useStore(authSelectors.user);
export const useIsAuthenticated = () => useStore(authSelectors.isAuthenticated);
export const useAuthLoading = () => useStore(authSelectors.isLoading);
export const useAuthError = () => useStore(authSelectors.error);

// Actions
export const useAuthActions = () => {
  const setUser = useStore((state) => state.setUser);
  const setLoading = useStore((state) => state.setLoading);
  const setError = useStore((state) => state.setError);
  const clearAuth = useStore((state) => state.clearAuth);

  return {
    setUser,
    setLoading,
    setError,
    clearAuth,
  };
};
