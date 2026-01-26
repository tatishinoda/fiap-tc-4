import { useStore } from '../../state/store';

export const useNotification = () => {
  const notification = useStore((state) => state.notification);
  const showNotification = useStore((state) => state.showNotification);
  const clearNotification = useStore((state) => state.clearNotification);

  return {
    notification,
    showNotification,
    clearNotification,
  };
};
