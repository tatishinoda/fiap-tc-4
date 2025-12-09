# 🏦 ByteBank Mobile

Aplicação de gestão financeira desenvolvida com React Native.

## 📱 Funcionalidades

### 🔐 **Autenticação & Segurança**
- [x] Registrar novo Login
- [x] Login com email e senha
- [x] Autenticação segura via Firebase Auth
- [x] Persistência de sessão com AsyncStorage
- [x] Armazenamento seguro com Expo SecureStore

### 💰 **Sistema Financeiro**
- [x] Cálculo automático de saldo baseado em transações
- [ ] Resumo financeiro (receitas, despesas, saldo)
- [ ] Gráficos de análise financeira
- [ ] Transações (depósitos, saques, investimentos, metas)

### 🏠 **Tela Inicial**
- [ ] Dashboard com visão geral financeira
- [ ] Gráficos interativos
- [ ] Listar/Filtrar transações recentes
- [ ] Adicionar/Editar transações
- [ ] Anexar arquivos às transações

### ☁️ **Cloud & Sincronização**
- [x] Integração com Firebase Firestore
- [ ] Sincronização em tempo real
- [x] Regras de segurança configuradas
- [ ] Armazenamento de arquivos (Storage)

### 🎨 **Interface & Experiência**
- [x] Design moderno e intuitivo
- [x] Navegação em abas
- [x] Interface responsiva
- [ ] Animações e transições suaves

## 📁 **Estrutura do Projeto**
   
```   
bytebank-mobile/   
├── .env                   # Variáveis de ambiente (Firebase)
├── .env.example           # Template das variáveis
├── .gitignore             # Arquivos ignorados pelo Git
├── app.json               # Configuração do Expo
├── App.tsx                # Componente principal da aplicação
├── index.ts               # Ponto de entrada
├── package.json           # Dependências e scripts
├── tsconfig.json          # Configuração TypeScript
├── firestore.rules        # Regras de segurança Firestore
├── storage.rules          # Regras de segurança Storage
├── README.md              # Documentação principal
├── FIREBASE.md            # Guia do Firebase
├── assets/                # Recursos estáticos (ícones, splash)
└── src/                   # Código fonte
    ├── components/        # Componentes reutilizáveis
    ├── config/            # Configurações
    │   └── firebase.ts    # Configuração Firebase
    ├── context/           # Contextos React (estado global)
    ├── hooks/             # Custom hooks
    ├── navigation/        # Sistema de navegação
    ├── screens/           # Telas da aplicação
    │   ├── auth/          # Telas de autenticação
    │   └── protected/     # Telas protegidas (requer login)
    ├── services/          # Lógica de negócio/APIs
    ├── types/             # Definições TypeScript
    └── utils/             # Funções utilitárias
```

## 🛠️ **Tecnologias Utilizadas**

### **Core**
- **React Native** 0.74.5
- **Expo** SDK 51
- **TypeScript** 5.3.3

### **Firebase & Backend**
- **Firebase** 10.7.1
- **Firebase Auth** - Autenticação
- **Cloud Firestore** - Banco de dados
- **Firebase Storage** - Armazenamento

### **Navegação & Estado**
- **React Navigation** 6.x
- **React Hook Form** 7.66.0
- **AsyncStorage** 1.23.1

### **UI & Animações**
- **Expo Vector Icons** 14.0.2
- **React Native Reanimated** 3.10.1
- **React Native Gesture Handler** 2.16.1

### **Utilitários**
- **Axios** 1.13.2
- **Date-fns** 3.0.0
- **UUID** 11.1.0
- **Expo SecureStore** 13.0.2

## 🚀 **Como Executar**

### **Pré-requisitos**
- Node.js 18+ (recomendado)
- npm ou yarn
- Expo CLI: `npm install -g expo-cli`
- Conta no Firebase (gratuita)

### **1. Clone o projeto**
```bash
git clone <seu-repositorio>
cd bytebank-mobile
```

### **2. Instalar dependências**
```bash
npm install
```

### **3. Configurar Firebase**
```bash
# Copie o arquivo de exemplo e configure suas credenciais
npm run setup
# Edite o .env com suas credenciais do Firebase Console
```

### **4. Executar o projeto**
```bash
npm start
```

### **4. Testar no dispositivo**
- Instale o **Expo Go** no seu celular
- Escaneie o QR Code gerado

### **5. Visualizar dados no Firebase**
📋 **Consulte**: [FIREBASE.md](FIREBASE.md) para entender como os dados são organizados no Firebase.

## 📚 **Documentação**

- **[SINGLE_ACCOUNT_MODEL.md](SINGLE_ACCOUNT_MODEL.md)** - Modelo de conta única (essencial!)
- **[COMPLETE_SYSTEM.md](COMPLETE_SYSTEM.md)** - Sistema completo de transações e investimentos
- **[FIRESTORE_SETUP.md](FIRESTORE_SETUP.md)** - Configuração detalhada do Firestore
- **[FIREBASE.md](FIREBASE.md)** - Guia de configuração do Firebase

## 🔧 **Configurações de Desenvolvimento**

### **Scripts Disponíveis**
```bash
npm start          # Iniciar Expo Dev Server
npm run android    # Executar no Android
npm run ios        # Executar no iOS
npm run web        # Executar na web
npm run build      # Build de produção
```