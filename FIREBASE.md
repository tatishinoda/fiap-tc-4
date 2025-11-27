# 🔥 Firebase - Backend do ByteBank Mobile

Este documento explica a infraestrutura Firebase atual do **ByteBank Mobile** e o planejamento para futuras funcionalidades.

## ⚙️ **Configuração Inicial**

### 1. **Variáveis de Ambiente**
Copie o arquivo `.env.example` para `.env` e preencha com suas credenciais:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=sua-api-key-aqui
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=seu-app-id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=seu-measurement-id
```

### 2. **Regras de Segurança**
Aplique as regras de segurança no Firebase Console:
- **Firestore**: Copie o conteúdo de `firestore.rules`
- **Storage**: Copie o conteúdo de `storage.rules`

## 📊 **Status Atual do Projeto**

**Projeto Firebase**: `bytebank-mobile-df718`  
**Console**: [https://console.firebase.google.com](https://console.firebase.google.com)  

### ✅ **Funcionalidades Implementadas**
- 🔐 **Registro de usuários** com email/senha
- 🔐 **Login/Logout** com autenticação segura
- 👤 **Perfil de usuário** básico (email, nome)

### 🔄 **Funcionalidades Planejadas**
- 💰 Gestão de transações financeiras
- 📁 Upload de recibos e documentos
- 📊 Dashboard com resumos

## 🛠️ **Serviços Firebase Atualmente Utilizados**

### 🔐 **Firebase Authentication (IMPLEMENTADO)**
- **Função**: Gerenciar registro e login de usuários
- **Método**: Email/Senha
- **Localização no Console**: `Authentication` → `Users`

**Como funciona:**
1. Usuário registra conta → Firebase cria UID único
2. Login validado → Firebase retorna token JWT
3. Token usado para acessar dados protegidos

### 👤 **Cloud Firestore - Coleção `users` (IMPLEMENTADO)**
- **Função**: Armazenar perfis de usuário
- **Localização no Console**: `Firestore Database` → `Data` → `users`

**Estrutura atual:**
```javascript
users/[UID] {
  email: "usuario@email.com",        // Email do registro
  name: "João Silva",                // Nome fornecido
  createdAt: "2025-11-21T10:30:00Z", // Data de criação
  updatedAt: "2025-11-21T10:30:00Z"  // Última atualização
}
```

## 🔐 **Regras de Segurança (IMPLEMENTADAS)**

### **Firestore Security Rules**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários podem acessar apenas seus próprios dados
    match /users/{userId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == userId;
    }
    
    // Negação padrão para outras coleções
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## 🔍 **Como Visualizar os Dados Atuais**

### **1. Acessar o Console Firebase**
1. Acesse: [Firebase Console](https://console.firebase.google.com)
2. Selecione: **bytebank-mobile-df718**

### **2. Ver Usuários Registrados**
1. Vá em: `Authentication` → `Users`
2. Veja: Lista com emails dos usuários cadastrados
3. Informações: UID, email, data de criação

### **3. Ver Perfis no Firestore**
1. Vá em: `Firestore Database` → `Data`
2. Navegue: `users` → `[UID]`
3. Veja: Dados do perfil (email, name, datas)

## 🧪 **Como Testar as Funcionalidades Atuais**

### **🔐 Teste de Registro**
1. Abra o app ByteBank
2. Vá em "Criar conta"
3. Digite: email válido + senha
4. **Verificar no Console:**
   - `Authentication` → novo usuário aparece
   - `Firestore` → nova entrada em `users/[UID]`

### **🔐 Teste de Login/Logout**
1. Faça logout e login novamente
2. **Verificar:** "Last sign-in" atualiza no Authentication
3. **Testar:** Persistência fechando e abrindo o app

## 🚀 **Funcionalidades Futuras (Planejamento)**

### **🔄 Próximas Implementações**

#### **💰 Sistema de Transações**
- **Coleção:** `transactions`
- **Objetivo:** Registrar receitas, despesas e transferências
- **Campos principais:** userId, type, amount, category, date, description

```javascript
// Estrutura planejada
transactions/[transactionId] {
  userId: "[UID]",
  type: "income" | "expense" | "transfer",
  amount: 4550,  // Em centavos (R$ 45,50)
  category: "Alimentação",
  description: "Almoço no restaurante",
  date: "2025-11-21T12:00:00Z",
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

#### **📁 Upload de Arquivos**
- **Serviço:** Firebase Storage
- **Objetivo:** Armazenar recibos e documentos
- **Organização:** Por usuário e tipo

```
gs://bytebank-mobile-df718.appspot.com/
├── receipts/[UID]/
│   └── receipt_YYYYMMDD_HHMMSS.jpg
├── documents/[UID]/
│   └── documento_importante.pdf
└── profiles/[UID]/
    └── avatar.jpg
```

#### **📊 Categorias de Transações**
- **Coleção:** `categories`
- **Objetivo:** Organizar transações
- **Tipos:** Padrão do sistema + personalizadas do usuário

```javascript
// Estrutura planejada
categories/[categoryId] {
  name: "Alimentação",
  icon: "restaurant-outline",
  color: "#F44336",
  type: "expense" | "income",
  userId: null,  // null = categoria padrão
  isDefault: true
}
```

### **🔐 Regras de Segurança Futuras**

Quando implementar transações e storage, as regras serão expandidas:

```javascript
// Regras adicionais planejadas
match /transactions/{transactionId} {
  allow read, write: if request.auth != null 
    && request.auth.uid == resource.data.userId;
}

match /categories/{categoryId} {
  allow read: if request.auth != null;
  allow write: if request.auth != null 
    && request.auth.uid == resource.data.userId;
}
```

### **📱 Storage Security Rules (Futuro)**
```javascript
// Para uploads de arquivos
match /receipts/{userId}/{allPaths=**} {
  allow read, write: if request.auth != null 
    && request.auth.uid == userId;
}
```

---

## 📞 **Próximos Passos**

### **🔄 Para o Desenvolvedor**
1. **Implementar TransactionService** para CRUD de transações
2. **Adicionar tela** de nova transação no app
3. **Configurar Storage** para upload de recibos
4. **Atualizar regras** de segurança conforme novas coleções
5. **Testar** funcionalidades passo a passo

### **📚 Recursos Úteis**
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Native Firebase](https://rnfirebase.io/)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

---

**📍 Status**: Autenticação implementada e funcional  
**🔄 Próximo**: Implementar sistema de transações  
**📝 Atualização**: Novembro 2025
