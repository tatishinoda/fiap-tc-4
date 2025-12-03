# 🏦 ByteBank Mobile

Aplicação  de gestão financeira desenvolvida com React Native.

## 📱 Funcionalidades

### 🔐 **Autenticação & Segurança**
- [x] Registrar novo Login
- [x] Login com email e senha
- [x] Autenticação segura via Firebase Auth
- [x] Persistência de sessão com AsyncStorage
- [x] Armazenamento seguro com Expo SecureStore

### 🏠 **Tela Inicial**
- [ ] Resumo financeiro
- [ ] Gráficos
- [ ] Listar/Filtrar transações
- [ ] Adicionar/Editar transações
- [ ] Anexar arquivos as transações

### ☁️ **Cloud & Sincronização**
- [ ] Sincronização em tempo real com Firebase
- [ ] Armazenamento seguro no Cloud Firestore

### 🎨 **Interface & Experiência**
- [x] Design moderno e intuitivo
- [x] Navegação em abas
- [x] Interface responsiva
- [ ] Temas e cores personalizadas
- [ ] Animações

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
- Expo CLI: `npm install expo-cli`
- Conta no Firebase (Este projeto já está configurado com Firebase)

### **1. Clone o projeto**

### **2. Instalar dependências**
```bash
npm install
```

### **3. Executar o projeto**
```bash
npm start
```

### **4. Testar no dispositivo**
- Instale o **Expo Go** no seu celular
- Escaneie o QR Code gerado

### **5. Visualizar dados no Firebase**
📋 **Consulte**: [FIREBASE.md](FIREBASE.md) para entender como os dados são organizados no Firebase   .
   


## 🔧 **Configurações de Desenvolvimento**

### **Scripts Disponíveis**
```bash
npm start          # Iniciar Expo Dev Server
npm run android    # Executar no Android
npm run ios        # Executar no iOS
npm run web        # Executar na web
npm run build      # Build de produção
```


## 🎯 **Próximos Passos**

### **Funcionalidades Planejadas**
- [ ] Tela de Login / Gerenciamento de Estado (Gerencie o estado global (como login e dados de transações) usando Context API)
- [ ] [Home Page] Exibir gráficos (Baseados nas transações do usuário)
- [ ] [Home Page] Exibir análises financeiras (Baseados nas transações do usuário)
- [ ] [Home Page] Implementar animações para transições entre seções do dashboard (Implementar animações para transições entre seções do dashboard utilizando Animated)
avançados (por data, categoria, etc.) na lista de transações
- [ ] [Adicionar/Editar Transação] Permitir adicionar e editar transações
- [ ] [Adicionar/Editar Transação] Validação Avançada de campos, como o valor e a categoria da transação
- [ ] [Adicionar/Editar Transação] Upload de Recibos: Permitir o upload de recibos ou documentos relacionados à transação, salvando-os no Firebase Storage
- [ ] [Listagem de Transações] Incluir filtros
avançados (por data, categoria, etc.) na lista de transações com Cloud Firestore para buscar as transações  (Baseados nas transações do usuário)
- [ ] [Listagem de Transações] Implementar scroll infinito ou paginação


### **Status REAL do Projeto**
✅ **Configuração Base** - Código pronto e Firebase configurado  
✅ **Firebase Integration** - Credenciais configuradas e testadas 
✅ **Autenticação** - Testado  
✅ **Navegação** - Testado navegação e proteção de rotas
🔄 **Transações** - Interface pronta, aguardando dados reais  
📋 **Próximo passo** - **IMPLEMENTAR SISTEMA DE TRANSAÇÕES**  
⏳ **Adicionar Transações** - Próxima funcionalidade  
⏳ **Listagem Transações** - Aguardando implementação  