# 🏦 ByteBank Mobile

Aplicação de gestão financeira desenvolvida com React Native.

## 📱 Funcionalidades Principais

- 🔐 **Autenticação completa** - Login, cadastro e gerenciamento de sessão com Firebase
- 💰 **Gestão financeira** - Adicionar, editar e excluir transações (depósitos, saques, transferências, pagamentos, investimentos)
- � **Upload de recibos** - Anexe fotos de comprovantes usando câmera ou galeria
- �📊 **Dashboard interativo** - Visão geral do saldo, gráficos de entradas vs saídas, análise por categoria
- 📋 **Listagem de transações** - Busca avançada e filtros por tipo, categoria, valor e data
- 🎨 **Design moderno** - Interface responsiva com componentes reutilizáveis e animações
- ☁️ **Sincronização em nuvem** - Dados armazenados no Firebase Firestore e Storage

## 📁 **Estrutura do Projeto**

```
bytebank-mobile/
├── assets/                # Recursos estáticos (ícones, splash)
├── src/
│   ├── components/        # Componentes reutilizáveis e UI
│   ├── config/            # Configurações
│   │   └── firebase.ts    # Configuração Firebase
│   ├── context/           # Contextos React (estado global)
│   ├── hooks/             # Custom hooks
│   ├── navigation/        # Rotas e navegação
│   ├── screens/           # Telas da aplicação
│   │   ├── auth/          # Telas de autenticação (Login, SignUp)
│   │   └── protected/     # Telas protegidas (Home, Transactions, etc)
│   ├── services/          # Lógica de negócio e APIs
│   ├── store/             # Gerenciamento de estado (Zustand)
│   ├── theme/             # Tema, cores e estilos
│   ├── types/             # Definições TypeScript
│   └── utils/             # Funções utilitárias
├── App.tsx                # Componente raiz
├── package.json           # Dependências do projeto
├── firebase.json          # Configuração Firebase
├── .env                   # Variáveis de ambiente (Firebase)
├── .env.example           # Template das variáveis
├── firestore.rules        # Regras de segurança Firestore
├── storage.rules          # Regras de segurança Storage
├── firebase.json          # Configuração Firebase CLI
└── README.md              # Documentação principal
```

## 🛠️ **Tecnologias Utilizadas**

### **Core**
- **React** 19.1.0
- **React Native** 0.81.5
- **Expo** SDK 54
- **TypeScript** 5.x

### **Firebase & Backend**
- **Firebase** 10.7.1
- **Firebase Auth** - Autenticação
- **Cloud Firestore** - Banco de dados NoSQL
- **Firebase Storage** - Armazenamento de arquivos

### **Navegação & Estado**
- **React Navigation** 7.x (Stack + Bottom Tabs)
- **Zustand** 5.0.9 - Gerenciamento de estado
- **React Hook Form** 7.66.0 - Formulários
- **AsyncStorage** 2.2.0 - Persistência local

### **UI & Estilização**
- **NativeWind** 4.2.1 - Tailwind CSS para React Native
- **Expo Vector Icons** 15.0.3 - Ícones
- **React Native Reanimated** 4.1.1 - Animações
- **React Native Gesture Handler** 2.28.0 - Gestos
- **React Native SVG** 15.12.1 - Gráficos vetoriais
- **Expo Linear Gradient** 15.0.0 - Gradientes

### **Utilitários & Ferramentas**
- **Date-fns** 3.0.0 - Manipulação de datas
- **UUID** 11.1.0 - Geração de IDs únicos
- **Expo SecureStore** 15.0.0 - Armazenamento seguro
- **Expo Image Picker** 17.0.10 - Seleção de imagens
- **React Native DateTimePicker** 8.4.4 - Seletor de data/hora
- **Expo Crypto** 15.0.0 - Criptografia

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

#### **3.1. Criar arquivo de variáveis de ambiente**
```bash
# Copie o arquivo de exemplo
cp .env.example .env
```

#### **3.2. Adicionar credenciais do Firebase**
1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Crie um novo projeto ou use um existente
3. Vá em **Configurações do Projeto** > **Seus aplicativos**
4. Copie as credenciais do Firebase
5. Cole no arquivo `.env`:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=sua-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-storage-bucket.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu-messaging-id
EXPO_PUBLIC_FIREBASE_APP_ID=seu-app-id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=seu-measurement-id
```

> ⚠️ **Importante**: Não compartilhe suas credenciais! O arquivo `.env` está no `.gitignore` e nunca será versionado.

> 💡 **Dica**: Se você não tem acesso ao Firebase Console, solicite os valores das variáveis de ambiente à equipe de desenvolvimento.

#### **3.3. Configurar Firestore e Storage**
No Firebase Console:
1. Habilite **Authentication** > **Email/Password**
2. Crie um banco **Firestore Database** (modo teste)
3. Habilite **Storage** (para upload de recibos)
4. Configure as regras de segurança (veja `firestore.rules` e `storage.rules`)

#### **3.4. Implantar regras de segurança Firebase**
Para implantar as regras de segurança do Firestore e Storage:

```bash
# Instalar Firebase CLI (apenas uma vez)
npm install -g firebase-tools

# Fazer login no Firebase
firebase login

# Selecionar o projeto (se necessário)
firebase use bytebank-mobile

# Implantar todas as regras
firebase deploy --only firestore,storage

# Ou implantar individualmente
firebase deploy --only firestore  # Apenas Firestore
firebase deploy --only storage     # Apenas Storage
```

> ⚠️ **Importante**: Sempre implante as regras após modificá-las para garantir a segurança do aplicativo.

### **4. Executar o projeto**
```bash
npm start
```

### **4. Testar no dispositivo**
- Instale o **Expo Go** no seu celular
- Escaneie o QR Code gerado

## 🔧 **Configurações de Desenvolvimento**

### **Scripts Disponíveis**
```bash
npm start          # Iniciar Expo Dev Server
npm run android    # Executar no Android
npm run ios        # Executar no iOS
npm run web        # Executar na web
npm run build      # Build de produção
```
