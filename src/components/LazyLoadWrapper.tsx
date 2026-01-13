import React, { ComponentType, Suspense } from 'react';
import LoadingScreen from './LoadingScreen';

/**
 * Wrapper para lazy loading de componentes com fallback personalizado
 *
 * @example
 * const HomeScreen = lazy(() => import('./screens/HomeScreen'));
 * <LazyLoadWrapper component={HomeScreen} {...props} />
 */

interface LazyLoadWrapperProps {
  component: ComponentType<any>;
  fallback?: React.ReactNode;
  [key: string]: any;
}

export function LazyLoadWrapper({
  component: Component,
  fallback = <LoadingScreen />,
  ...props
}: LazyLoadWrapperProps) {
  return (
    <Suspense fallback={fallback}>
      <Component {...props} />
    </Suspense>
  );
}

/**
 * HOC para criar componentes lazy com Suspense integrado
 *
 * @example
 * const HomeScreen = withLazyLoad(() => import('./screens/HomeScreen'));
 */
export function withLazyLoad<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = React.lazy(importFn);

  return (props: any) => (
    <Suspense fallback={fallback || <LoadingScreen />}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

/**
 * Hook para pré-carregar componentes lazy de forma antecipada
 * Útil para melhorar a performance ao antecipar navegação
 *
 * @example
 * const preload = usePreloadScreen();
 *
 * // Pré-carregar ao passar o mouse (web) ou ao tocar (mobile)
 * <Button onMouseEnter={() => preload(() => import('./screens/HomeScreen'))}>
 *   Ir para Home
 * </Button>
 */
export function usePreloadScreen() {
  return React.useCallback((importFn: () => Promise<any>) => {
    // Inicia o carregamento mas não espera
    importFn().catch((err) => {
      console.warn('Falha ao pré-carregar tela:', err);
    });
  }, []);
}
