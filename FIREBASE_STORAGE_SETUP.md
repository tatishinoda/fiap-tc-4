# 📦 Firebase Storage e Edição de Transações - ByteBank

## 🎯 Funcionalidades Implementadas

### 1. Armazenamento de Recibos no Firebase Storage

#### Como Funciona:
- **Ao adicionar/editar transação**: usuário pode anexar foto do recibo
- **Upload automático**: foto é enviada para Firebase Storage
- **URL salva**: link do recibo fica associado à transação

#### Configuração Necessária (Uma Vez):

**1. Ativar Firebase Storage:**
```
1. Acesse: https://console.firebase.google.com/
2. Selecione seu projeto ByteBank
3. Menu lateral → Storage
4. Clique em "Começar" se ainda não ativou
5. Escolha localização (ex: southamerica-east1)
```

**2. Aplicar Regras de Segurança:**

Cole no Firebase Console > Storage > Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /transaction-receipts/{userId}/{allPaths=**} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && 
        request.auth.uid == userId &&
        request.resource.size < 10 * 1024 * 1024 && 
        request.resource.contentType.matches('image/.*');
    }
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

**3. Verificar .env:**
```env
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
```

### 2. Edição de Transações

#### Como Usar:

**Na Home:**
- Toque em qualquer transação recente
- Abre tela de edição

**Na Tela de Transações:**
- Toque em qualquer transação da lista
- Abre tela de edição

**Na Tela de Edição:**
- ✏️ Edite tipo, valor, descrição, categoria
- 📷 Adicione/remova recibo
- 💾 Clique "Atualizar" para salvar
- 🗑️ Clique "Deletar Transação" para excluir (com confirmação)

## 📱 Fluxo Completo

### Adicionar Transação com Recibo:
1. Home → Ação rápida (Depósito/Saque/etc)
2. Preencha dados
3. "📷 Adicionar Recibo" → Galeria ou Câmera
4. Foto aparece em preview
5. "Adicionar" → Upload automático ✨

### Editar Transação:
1. Toque na transação (Home ou Transações)
2. Modifique campos desejados
3. Adicione/remova recibo se quiser
4. "Atualizar" → Salva alterações
5. Ou "Deletar" → Remove transação

## 🔧 Detalhes Técnicos

### Arquivos Modificados:
- ✅ [navigation.ts](src/types/navigation.ts) - Rota `EditTransaction`
- ✅ [AddTransactionScreen.tsx](src/screens/protected/AddTransactionScreen.tsx) - Modo edição
- ✅ [RecentTransactions.tsx](src/components/RecentTransactions.tsx) - onPress
- ✅ [HomeScreen.tsx](src/screens/protected/HomeScreen.tsx) - Navegação para edição
- ✅ [TransactionsScreen.tsx](src/screens/protected/TransactionsScreen.tsx) - Navegação para edição
- ✅ [AppNavigator.tsx](src/navigation/AppNavigator.tsx) - Rota registrada
- ✅ [storage.ts](src/utils/storage.ts) - Caminho correto + validações

### Validações Implementadas:
- ✅ Tamanho: máx 10MB
- ✅ Tipo: apenas imagens
- ✅ Segurança: só dono acessa
- ✅ Autenticação obrigatória

### Estrutura no Storage:
```
transaction-receipts/
  ├── {userId-1}/
  │   ├── temp_1234567890_1640000001.jpg
  │   └── temp_1234567891_1640000002.jpg
  └── {userId-2}/
      └── temp_1234567892_1640000003.jpg
```

## 🚨 Solução de Problemas

### Erro: "storage/unauthorized"
✅ Aplique as regras no Console (passo 2)

### Erro: "Imagem muito grande"
✅ Comprima a imagem (máx 10MB)

### Upload não funciona
✅ Verifique internet e autenticação
✅ Veja logs: `npx expo start`

### Transação não abre para editar
✅ Certifique-se que tocou na transação
✅ Verifique se está logado

## 💡 Dicas

- **Recibos são opcionais** - pode criar transação sem foto
- **Edição preserva dados** - só mude o que quiser
- **Deleção pede confirmação** - previne exclusões acidentais
- **URLs seguras** - só quem tem link acessa, mas usuário deve estar autenticado
