/**
 * Hook to manage color scheme - Fixed to light theme
 */
export const useColorScheme = () => {
  return {
    colorScheme: 'light' as const,
    isDarkMode: false,
  };
};
