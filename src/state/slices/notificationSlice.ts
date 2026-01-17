// Gerencia o estado global de notificações da aplicação

import { StateCreator } from 'zustand';

export interface NotificationState {
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface NotificationSlice {
  notification: NotificationState | null;
  showNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
  clearNotification: () => void;
}

export const createNotificationSlice: StateCreator<
  NotificationSlice,
  [],
  [],
  NotificationSlice
> = (set) => ({
  notification: null,
  
  showNotification: (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    set({
      notification: {
        message,
        type,
      },
    });
  },
  
  clearNotification: () => {
    set({ notification: null });
  },
});
