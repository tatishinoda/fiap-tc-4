# Tech Challenge - Fase 4 - Grupo 17 - 4FRNT

ByteBank: Aplicação Mobile, utilizando React Native (Expo), Firebase Storage e Cloud Firestore.

[![Expo](https://img.shields.io/badge/Expo-%7E54.0.0-000000?style=flat&logo=expo&logoColor=white)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React_Native-0.81.5-61DAFB?style=flat&logo=react&logoColor=white)](https://reactnative.dev/)
[![Firebase Storage](https://img.shields.io/badge/Firebase_Storage-Storage-FFA611?style=flat&logo=firebase&logoColor=white)](https://firebase.google.com/products/storage)
[![Cloud Firestore](https://img.shields.io/badge/Cloud_Firestore-Database-FFA611?style=flat&logo=firebase&logoColor=white)](https://firebase.google.com/products/firestore)

---

## 📱 Sobre o Projeto

O **ByteBank** é uma aplicação mobile de gestão financeira pessoal desenvolvida como Tech Challenge da **Fase 4** do curso de **Pós-Graduação em Front-End Engineering** da **FIAP**.

### Principais Características

- **Gestão Financeira Completa**: CRUD de transações com validação robusta e persistência em tempo real
- **Backend Firebase**: Integração completa com Firestore, Storage e Authentication para escalabilidade e confiabilidade
- **Segurança em Múltiplas Camadas**: Proteção de credenciais, regras de acesso granular e prevenção contra vazamentos
- **Programação Reativa (RxJS)**: Streams assíncronas para sincronização instantânea de dados entre dispositivos
- **Performance Otimizada**: Cache inteligente, retry automático e técnicas avançadas de renderização
- **Arquitetura Escalável**: Clean Architecture com separação de responsabilidades e injeção de dependências
- **Experiência Mobile Nativa**: Interface responsiva com NativeWind e componentes otimizados para iOS/Android

---

## 📚 Evolução do Projeto

Este projeto representa a quarta fase de uma jornada de aprendizado iniciada nas fases anteriores do Tech Challenge:

| Fase | Repositório |
|------|-------------|
| **Fase 1** | [bytebank-fiap](https://github.com/karenkramek/bytebank-fiap) |
| **Fase 2** | [tech-challenge-2](https://github.com/karenkramek/fiap-tech-challenge-2) |
| **Fase 3** | [bytebank-mobile](https://github.com/camp0sfer/bytebank-mobile) |
| **Fase 4** | *Repositório atual* |

---

## 💻 Tecnologias Utilizadas

| Categoria | Tecnologias |
|-----------|-------------|
| **Mobile** | React Native, Expo ~54.0.0 |
| **Linguagem** | TypeScript |
| **Backend** | Firebase (Auth, Firestore, Storage) |
| **Estado** | Zustand, React Query |
| **Programação Reativa** | RxJS (Observables, Operators) |
| **Estilização** | NativeWind (Tailwind CSS) |
| **Arquitetura** | Clean Architecture, SOLID |

---

## 🏗️ Arquitetura & Implementação Técnica

### Estrutura do Projeto

O projeto segue os princípios da **Clean Architecture** e **SOLID**, separando responsabilidades em camadas:

```
bytebank-mobile/
├── assets/                      # Recursos estáticos (ícones, splash screens)
├── docs/                        # Documentação técnica (Segurança, Reatividade)
├── src/
│   ├── domain/                  # 🎯 CAMADA DE DOMÍNIO (Regras de Negócio)
│   │   ├── entities/            # Entidades de domínio (User, Transaction)
│   │   ├── repositories/        # Interfaces dos repositórios (contratos)
│   │   └── usecases/            # Casos de uso da aplicação
│   │       ├── auth/            # Use cases de autenticação
│   │       └── transaction/     # Use cases de transações
│   │
│   ├── infrastructure/          # 🔧 CAMADA DE INFRAESTRUTURA (Implementações)
│   │   ├── config/              # Configurações externas (Firebase)
│   │   ├── mappers/             # Mapeadores (DTO ↔ Entity)
│   │   ├── repositories/        # Implementações concretas dos repositórios
│   │   ├── cache/               # Provider de cache (React Query)
│   │   └── streams/             # Streams RxJS (Programação Reativa)
│   │
│   ├── presentation/            # 🎨 CAMADA DE APRESENTAÇÃO (UI/UX)
│   │   ├── components/          # Componentes reutilizáveis
│   │   ├── hooks/               # Custom hooks (ViewModels)
│   │   ├── navigation/          # Configuração de rotas
│   │   └── screens/             # Telas da aplicação
│   │
│   ├── state/                   # 📦 ESTADO GLOBAL
│   │   ├── store.ts             # Configuração do Zustand
│   │   ├── slices/              # Slices do estado
│   │   └── selectors/           # Seletores otimizados
│   │
│   ├── di/                      # 💉 INJEÇÃO DE DEPENDÊNCIAS
│   │   └── container.ts         # Container de DI (inversão de controle)
│   │
│   ├── theme/                   # 🎨 Tema e estilos
│   ├── types/                   # 📘 TypeScript Definitions
│   └── utils/                   # 🛠️ Funções utilitárias
│
├── App.tsx                      # Componente raiz
├── package.json                 # Dependências do projeto
├── firebase.json                # Configuração Firebase
├── .env                         # Variáveis de ambiente (não versionado)
├── .env.example                 # Template das variáveis
├── firestore.rules              # Regras de segurança Firestore
├── storage.rules                # Regras de segurança Storage
└── README.md                    # Documentação principal
```

**Separação de Responsabilidades**

| Camada | Responsabilidade | Exemplo |
|--------|------------------|---------|
| **Domain** | Regras de negócio puras | Validação de transação, cálculo de saldo |
| **Infrastructure** | Comunicação externa | Firebase, APIs, banco de dados |
| **Presentation** | Interface do usuário | Componentes React, navegação |
| **State** | Gerenciamento de estado | Zustand slices, selectors |
| **DI** | Inversão de controle | Injeção de repositórios |

---

### 🔒 Segurança

**Proteção de Credenciais e Dados**
- **Gitleaks + Husky** - Bloqueia commits com secrets expostos
- **EAS Secrets** - Variáveis de ambiente seguras no servidor Expo
- **Gitignore** - `.env` nunca versionado
- **Firestore Rules** - Acesso granular por usuário autenticado
- **Storage Rules** - Controle rigoroso de upload/download
- **Authentication** - Email/Password com validação de força de senha

**Segurança Web e Aplicação**
- **CSP (Content Security Policy)** - Proteção contra XSS e injeções maliciosas
- **Security Headers** - X-Frame-Options, X-Content-Type-Options, HSTS
- **Rate Limiting** - Proteção contra força bruta
- **NPM Audit** - Monitoramento contínuo de vulnerabilidades

---

### ⚡ Performance e Otimização

**Otimizações de Renderização**
- **useCallback** - Evita re-renders desnecessários em componentes
- **Lazy Loading** - Carregamento sob demanda de componentes
- **FlatList Virtualizado** - Listas otimizadas para grandes volumes de dados

**Cache e Gerenciamento de Requisições**
- **React Query** - Cache inteligente (5 min staleTime, 30 min gcTime)
- **Retry Automático** - 3 tentativas com delay exponencial
- **Refetch Inteligente** - Atualiza dados ao focar app ou reconectar
- **Code Splitting** - Bundle dividido por rotas para carregamento rápido
- **Tree Shaking** - Remoção automática de código não utilizado

**Métricas de Performance**
| Métrica | Valor | Status |
|---------|-------|--------|
| **TTI (Time to Interactive)** | < 3s | ✅ |
| **Tamanho do APK** | ~25MB | ✅ |
| **Tempo de Carregamento** | < 1s | ✅ |

---

### 🌊 Programação Reativa (RxJS)

**Streams em Tempo Real**
- **Observable Pattern** - Firestore snapshots integrados com RxJS
- **Debounce** - Otimiza buscas com delay de 300ms
- **Operators Avançados** - `switchMap`, `debounceTime`, `distinctUntilChanged`
- **Hook Customizado** - `useTransactionStream` para consumir streams reativos

**Benefícios da Abordagem Reativa**
- Atualização instantânea e automática de dados
- Redução significativa de requisições desnecessárias
- Gerenciamento eficiente de estados assíncronos
- Sincronização em tempo real entre dispositivos

> 📖 Guias: [Quick Start](docs/REACTIVE_QUICK_START.md) • [Documentação Técnica](docs/REACTIVE_PROGRAMMING.md)

---

### 🏛️ Princípios de Design e Boas Práticas

**Arquitetura e Padrões**
- **Clean Architecture** - Separação clara de responsabilidades em camadas
- **SOLID Principles** - Código modular, testável e manutenível
- **Dependency Injection** - Inversão de controle com container DI
- **TypeScript Strict Mode** - Tipagem rigorosa em todo o código

**Qualidade e Ferramentas**
- **Error Boundaries** - Tratamento robusto de erros em componentes
- **Form Validation** - React Hook Form com validação completa
- **Async Storage** - Persistência local de dados do usuário
- **Date Handling** - date-fns para manipulação segura de datas
- **Image Picker** - Upload de imagens e recibos com compressão
- **Navigation** - React Navigation com Stack e Bottom Tabs

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js 18+, npm/yarn, Git
- Conta Firebase (gratuita)
- Expo Go App ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))

### Instalação

**1. Clone e instale dependências**
```powershell
git clone https://github.com/tatishinoda/fiap-tc-4.git
cd fiap-tc-4
npm install
```

**2. Configure o Firebase**
```powershell
# Copie o arquivo de exemplo
copy .env.example .env
```

Edite o `.env` com suas credenciais do [Firebase Console](https://console.firebase.google.com/):
```env
EXPO_PUBLIC_FIREBASE_API_KEY=sua_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=seu_projeto_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=seu_app_id
```

**3. Configure serviços do Firebase Console**
- **Authentication** → Ative Email/Password
- **Firestore Database** → Crie database (região: southamerica-east1)
- **Storage** → Ative o serviço

**4. Implante as regras de segurança**
```powershell
npm install -g firebase-tools
firebase login
firebase use seu_projeto_id
firebase deploy --only firestore,storage
```

**5. Inicie o projeto**
```powershell
npm start
```

### Testar no Dispositivo

**Celular (Recomendado)**
1. Instale o Expo Go
2. Conecte na mesma rede Wi-Fi
3. Escaneie o QR Code

**Navegador**
```powershell
npm run web
```

**USB/ADB (Android)**
```powershell
adb devices  # Verificar conexão
npm run android
```

---

## 📦 Geração e Distribuição de APK

### Gerar Build de Produção

```powershell
# 1. Instalar e fazer login no EAS
npm install -g eas-cli
eas login

# 2. Configurar secrets do Firebase no EAS (apenas uma vez)
Get-Content .env | ForEach-Object {
  if ($_ -match '^([^=]+)=(.+)$') {
    eas secret:create --scope project --name $Matches[1] --value $Matches[2] --type string --force
  }
}

# 3. Gerar APK (15-20 min)
eas build --platform android --profile preview
```

### Download do APK

- 📱 [Link do APK (Android)](https://expo.dev/accounts/karenkramek/projects/bytebank-mobile/builds/de8f2872-66ab-4e1d-920e-13b1355ce82e)

---

## ❓ Troubleshooting

| Problema | Solução |
|----------|---------|
| **QR Code não funciona** | `npx expo start --tunnel` |
| **App não atualiza** | `npx expo start -c` (limpa cache) |
| **`adb devices` vazio** | Verifique Depuração USB e cabo |
| **"Firebase not configured"** | Confirme `.env` com todas variáveis preenchidas |
| **Erro de permissão Firestore/Storage** | `firebase deploy --only firestore,storage` |
| **Build EAS falha** | Verifique secrets: `eas secret:list` |

---

## 👥 Integrantes do Grupo

| Nome | Email | RM |
|------|-------|------|
| **Fernanda Raquel Campos Jiacinto** | [fernanda.frcj@gmail.com](mailto:fernanda.frcj@gmail.com) | RM366526 |
| **Kaique Kenichi Furukawa Endo** | [kaiquefurukawa@gmail.com](mailto:kaiquefurukawa@gmail.com) | RM366448 |
| **Karen Cristina Kramek** | [kakakramek@gmail.com](mailto:kakakramek@gmail.com) | RM361140 |
| **Tatiane Gabrielle Marçal Rodrigues da Costa** | [tatiane.costa@alura.com.br](mailto:tatiane.costa@alura.com.br) | RM365215 |

---

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos como parte do Tech Challenge da Fase 4 da Pós-Graduação em Front-End Engineering da FIAP.

---