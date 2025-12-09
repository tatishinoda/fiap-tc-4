import { useEffect, useState } from 'react';

/**
 * Debounce hook for delayed actions
 * @param value - Value to debounce
 * @param delay - Delay in milliseconds (default: 500ms)
 */
export const useDebounce = <T>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
