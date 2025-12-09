import { TransactionType } from './index';

// Tipos de navegação para toda a aplicação
export type RootStackParamList = {
  // Rotas de autenticação (públicas)
  Login: undefined;
  SignUp: undefined;
  
  // Rotas protegidas
  MainTabs: undefined;
  Dashboard: undefined;
  Home: undefined;
  Transactions: undefined;
  AddTransaction: {
    type?: TransactionType;
  } | undefined;
};

export type TabParamList = {
  Home: undefined;
  Dashboard: undefined;
  Transactions: undefined;
};
