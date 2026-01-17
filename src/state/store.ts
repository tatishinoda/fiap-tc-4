import { create } from 'zustand';
import { createAuthSlice, AuthSlice } from './slices/authSlice';
import { createTransactionSlice, TransactionState } from './slices/transactionSlice';
import { createNotificationSlice, NotificationSlice } from './slices/notificationSlice';
import { createLoadingSlice, LoadingSlice } from './slices/loadingSlice';

type StoreState = AuthSlice & TransactionState & NotificationSlice & LoadingSlice;

export const useStore = create<StoreState>()((...a) => ({
  ...createAuthSlice(...a),
  ...createTransactionSlice(...a),
  ...createNotificationSlice(...a),
  ...createLoadingSlice(...a),
}));
