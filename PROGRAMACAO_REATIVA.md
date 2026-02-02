# Programação Reativa - ByteBank Mobile

## 📋 Visão Geral

Implementação completa de **Programação Reativa** usando **RxJS** e **Firestore onSnapshot** para atualizações em tempo real no ByteBank Mobile.

## 🎯 Objetivos Alcançados

✅ **RxJS Streams**: BehaviorSubject e Observables para gerenciamento reativo de estado
✅ **Firestore onSnapshot**: Listener em tempo real para mudanças no banco de dados
✅ **Hooks Reativos**: Hooks React customizados para consumir streams
✅ **Operadores RxJS**: Uso de map, filter, debounceTime, distinctUntilChanged
✅ **Performance**: Debounce em buscas, cache reativo, cleanup automático

---

## 🏗️ Arquitetura Reativa

```
Firebase Firestore (onSnapshot)
         ↓
FirebaseTransactionRepository.subscribeToTransactions()
         ↓
TransactionStream (RxJS BehaviorSubject)
         ↓
useTransactionStream() Hook
         ↓
React Components (UI atualiza automaticamente)
```

---

## 📦 Componentes Principais

### 1. TransactionStream (RxJS)

**Arquivo**: `src/infrastructure/streams/TransactionStream.ts`

**Responsabilidades**:
- Gerenciar estado reativo de transações usando BehaviorSubject
- Fornecer Observables para diferentes tipos de dados
- Aplicar operadores RxJS para transformações
- Manter sincronização com Firestore

**Features**:
```typescript
// BehaviorSubjects (mantém último valor)
private transactionsSubject = new BehaviorSubject<Transaction[]>([]);
private loadingSubject = new BehaviorSubject<boolean>(false);
private errorSubject = new Subject<Error | null>();

// Observables públicos
public transactions$: Observable<Transaction[]>
public loading$: Observable<boolean>
public error$: Observable<Error | null>

// Métodos reativos
getTransactionsByType$(type): Observable<Transaction[]>
getTransactionsByCategory$(category): Observable<Transaction[]>
getFinancialSummary$(): Observable<FinancialSummary>
searchTransactions$(searchTerm$): Observable<Transaction[]>
```

**Exemplo de Uso**:
```typescript
import { transactionStream } from '@/infrastructure/streams/TransactionStream';

// Subscribe para mudanças
transactionStream.transactions$.subscribe((transactions) => {
  console.log('Transações atualizadas:', transactions);
});

// Filtrar por tipo reativamente
transactionStream.getTransactionsByType$('income').subscribe((incomes) => {
  console.log('Receitas:', incomes);
});
```

---

### 2. FirebaseTransactionRepository (onSnapshot)

**Arquivo**: `src/infrastructure/repositories/FirebaseTransactionRepository.ts`

**Métodos Reativos Adicionados**:

#### `subscribeToTransactions()`
```typescript
subscribeToTransactions(
  userId: string,
  callback: (transactions: Transaction[]) => void,
  onError?: (error: Error) => void
): Unsubscribe
```

**Funcionamento**:
1. Cria query no Firestore
2. Usa `onSnapshot()` para escutar mudanças
3. Chama callback toda vez que dados mudam
4. Retorna função `unsubscribe` para cleanup

**Exemplo**:
```typescript
const unsubscribe = repository.subscribeToTransactions(
  userId,
  (transactions) => {
    // Atualizado automaticamente quando Firebase muda
    console.log('Novas transações:', transactions);
  },
  (error) => {
    console.error('Erro:', error);
  }
);

// Cleanup
unsubscribe();
```

#### `subscribeToTransaction()`
```typescript
subscribeToTransaction(
  transactionId: string,
  callback: (transaction: Transaction | null) => void,
  onError?: (error: Error) => void
): Unsubscribe
```

Escuta mudanças em uma transação específica.

---

### 3. Hooks Reativos

**Arquivo**: `src/hooks/useTransactionStream.ts`

#### `useTransactionStream()`
Hook principal que conecta Firestore onSnapshot com RxJS streams.

```typescript
export function useTransactionStream() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Inscreve no stream RxJS
    const streamSubscription = transactionStream.transactions$.subscribe(
      setTransactions
    );

    // Inscreve no Firestore onSnapshot
    const unsubscribeFirestore = repository.subscribeToTransactions(
      user.id,
      (transactions) => {
        transactionStream.updateTransactions(transactions);
      }
    );

    // Cleanup automático
    return () => {
      streamSubscription.unsubscribe();
      unsubscribeFirestore();
    };
  }, [user?.id]);

  return { transactions, loading, error };
}
```

**Como funciona**:
1. Firestore onSnapshot detecta mudança no banco
2. Callback é chamado com novos dados
3. Atualiza TransactionStream (RxJS)
4. Stream notifica todos os subscribers
5. React re-renderiza componentes automaticamente

#### Outros Hooks Reativos:

```typescript
// Filtrar por tipo
useTransactionsByType(type: 'income' | 'expense')

// Resumo financeiro reativo
useFinancialSummary()

// Busca com debounce
useTransactionSearch()

// Últimas 5 transações
useRecentTransactions()

// Notificação de novas transações
useNewTransactionNotifications(callback)

// Filtrar por período
useTransactionsByPeriod(startDate, endDate)

// Filtrar por categoria
useTransactionsByCategory(category)
```

---

## 🎨 Exemplo Completo de Uso

### ReactiveTransactionsDemo Component

**Arquivo**: `src/presentation/components/ReactiveTransactionsDemo.tsx`

```tsx
import { useTransactionStream, useFinancialSummary, useRecentTransactions } from '@/hooks/useTransactionStream';

export function ReactiveTransactionsDemo() {
  // Stream reativo - atualiza automaticamente
  const { transactions, loading, error } = useTransactionStream();
  
  // Resumo calculado reativamente
  const summary = useFinancialSummary();
  
  // Últimas 5 transações
  const recentTransactions = useRecentTransactions();

  // Log para ver atualizações em tempo real
  useEffect(() => {
    console.log('🔄 Transações atualizadas:', transactions.length);
  }, [transactions]);

  return (
    <View>
      <Text>Receitas: {formatCurrency(summary.totalIncome)}</Text>
      <Text>Despesas: {formatCurrency(summary.totalExpenses)}</Text>
      <Text>Saldo: {formatCurrency(summary.balance)}</Text>
      
      <FlatList
        data={recentTransactions}
        renderItem={({ item }) => (
          <TransactionItem transaction={item} />
        )}
      />
    </View>
  );
}
```

**Sem refetch manual!** Tudo atualiza automaticamente quando:
- Nova transação é adicionada
- Transação é editada
- Transação é deletada
- Qualquer mudança no Firestore

---

## ⚡ Operadores RxJS Utilizados

### 1. `map` - Transformação de dados
```typescript
getTransactionsByType$(type: 'income' | 'expense'): Observable<Transaction[]> {
  return this.transactions$.pipe(
    map((transactions) => transactions.filter((t) => t.type === type))
  );
}
```

### 2. `filter` - Filtrar valores
```typescript
// Só emite se houver transações
this.transactions$.pipe(
  filter((transactions) => transactions.length > 0)
)
```

### 3. `debounceTime` - Debounce para performance
```typescript
searchTransactions$(searchTerm$: Observable<string>): Observable<Transaction[]> {
  return searchTerm$.pipe(
    debounceTime(300), // Espera 300ms após parar de digitar
    distinctUntilChanged(), // Só emite se mudou
    map((term) => /* busca */)
  );
}
```

### 4. `distinctUntilChanged` - Evita emissões duplicadas
```typescript
searchTerm$.pipe(
  distinctUntilChanged() // Não emite se o valor for igual ao anterior
)
```

---

## 🔄 Fluxo Completo (Tempo Real)

1. **Usuário adiciona transação** no app
2. **Firebase Firestore** é atualizado
3. **onSnapshot** detecta mudança automaticamente
4. **Callback** é chamado com novos dados
5. **TransactionStream (RxJS)** atualiza BehaviorSubject
6. **Observables** notificam todos os subscribers
7. **React Hooks** atualizam estado local
8. **UI re-renderiza** automaticamente
9. **Todos os componentes** veem os dados atualizados

**Tudo isso acontece em tempo real, sem refresh manual!** ⚡

---

## 📊 Benefícios da Implementação

### Performance
✅ Debounce em buscas reduz requisições
✅ Cache reativo evita buscas desnecessárias
✅ Cleanup automático previne memory leaks
✅ Observables compartilhados (BehaviorSubject)

### UX (User Experience)
✅ Atualizações em tempo real
✅ Não precisa fazer pull-to-refresh
✅ UI sempre sincronizada com backend
✅ Feedback instantâneo de mudanças

### Developer Experience
✅ Código declarativo e legível
✅ Separação de responsabilidades clara
✅ Fácil adicionar novos streams
✅ Testável (Observables são fáceis de testar)

### Manutenibilidade
✅ Lógica reativa centralizada (TransactionStream)
✅ Hooks reutilizáveis
✅ Fácil adicionar novos filtros/transformações
✅ Desacoplado do Firebase (pode trocar backend)

---

## 🧪 Como Testar

### 1. Teste Manual - Tempo Real

**Passos**:
1. Abra o app em dois dispositivos/emuladores
2. Adicione uma transação no Dispositivo A
3. **Veja aparecer automaticamente no Dispositivo B** ✨
4. Edite a transação no Dispositivo B
5. **Veja atualizar no Dispositivo A** ✨

### 2. Teste de Busca Reativa

```tsx
function SearchExample() {
  const { searchTerm, setSearchTerm, results } = useTransactionSearch();

  return (
    <View>
      <TextInput
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholder="Buscar..."
      />
      {/* Resultados aparecem com debounce de 300ms */}
      <FlatList data={results} />
    </View>
  );
}
```

### 3. Teste de Performance

```typescript
// Observar quantas vezes renderiza
useEffect(() => {
  console.log('🔄 Componente re-renderizou');
}, [transactions]);

// Com debounce, deve renderizar menos
```

---

## 📈 Comparação: Antes vs Depois

### ❌ ANTES (Sem Programação Reativa)

```typescript
const [transactions, setTransactions] = useState([]);

// Precisa buscar manualmente
useEffect(() => {
  loadTransactions();
}, []);

const handleRefresh = async () => {
  setRefreshing(true);
  await loadTransactions(); // Refetch manual
  setRefreshing(false);
};

// Não atualiza automaticamente
// Precisa pull-to-refresh toda hora
```

### ✅ DEPOIS (Com Programação Reativa)

```typescript
// Atualiza automaticamente!
const { transactions, loading, error } = useTransactionStream();

// Sem refetch manual
// Sem pull-to-refresh necessário
// Sempre sincronizado com Firebase
```

---

## 🎓 Conceitos de Programação Reativa Aplicados

### 1. **Observables**
Streams que emitem valores ao longo do tempo.

### 2. **BehaviorSubject**
Observable que mantém o último valor emitido e entrega para novos subscribers.

### 3. **Operators**
Funções que transformam streams (map, filter, debounceTime, etc.)

### 4. **Subscription**
Conexão com um Observable. Precisa de cleanup (unsubscribe).

### 5. **Hot vs Cold Observables**
- **Cold**: Começa a emitir quando alguém subscreve
- **Hot**: BehaviorSubject é hot (sempre emitindo)

### 6. **Reactive Programming Principles**
- **Push-based**: Dados são "empurrados" para subscribers
- **Declarative**: Você descreve WHAT, não HOW
- **Composable**: Streams podem ser combinados

---

## 📚 Recursos Adicionais

### Documentação:
- [RxJS Official](https://rxjs.dev/)
- [Firestore onSnapshot](https://firebase.google.com/docs/firestore/query-data/listen)
- [React Hooks](https://react.dev/reference/react)

### Operadores RxJS Úteis:
- `map`: Transformar valores
- `filter`: Filtrar valores
- `debounceTime`: Debounce
- `distinctUntilChanged`: Evitar duplicatas
- `switchMap`: Trocar observables
- `combineLatest`: Combinar múltiplos streams
- `merge`: Mesclar streams
- `catchError`: Tratar erros

---

## ✅ Checklist de Requisitos Atendidos

✅ **RxJS Instalado**: npm install rxjs
✅ **BehaviorSubject**: TransactionStream com estado reativo
✅ **Observables**: Múltiplos streams para diferentes dados
✅ **Firestore onSnapshot**: Listener em tempo real
✅ **Hooks Reativos**: 8 hooks customizados criados
✅ **Operadores RxJS**: map, filter, debounceTime, distinctUntilChanged
✅ **Cleanup Automático**: unsubscribe em todos os hooks
✅ **Performance**: Debounce em buscas, cache reativo
✅ **Exemplos**: ReactiveTransactionsDemo component
✅ **Documentação**: Este arquivo completo

---

## 🚀 Próximos Passos (Opcional)

1. **Adicionar mais operadores**: switchMap, combineLatest
2. **WebSocket**: Para notificações push
3. **Offline-first**: Sincronização quando voltar online
4. **Testes unitários**: Testar Observables com RxJS TestScheduler
5. **Redux + RxJS**: redux-observable para side effects
6. **State Machine**: XState para fluxos complexos

---

## 🎉 Conclusão

A implementação de **Programação Reativa** com **RxJS + Firestore onSnapshot** foi **concluída com sucesso**! 

O ByteBank Mobile agora possui:
- ⚡ Atualizações em tempo real
- 🔄 Streams reativos com RxJS
- 📡 Firestore listeners automáticos
- 🎯 Performance otimizada
- 🧩 Código modular e reutilizável

**Requisito da Fase 4 ATENDIDO!** ✅

---

**Autor**: GitHub Copilot  
**Data**: 02 de Fevereiro de 2026  
**Projeto**: ByteBank Mobile - Tech Challenge FIAP Fase 4
