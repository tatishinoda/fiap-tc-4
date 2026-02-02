# 🔄 Programação Reativa - Guia Rápido

## O que foi implementado?

✅ **RxJS** - Biblioteca para programação reativa  
✅ **Firestore onSnapshot** - Listener em tempo real  
✅ **8 Hooks Reativos** - Para diferentes casos de uso  
✅ **Exemplos Práticos** - Componentes demonstrativos  

---

## 🚀 Como Usar

### 1. Hook Principal - Atualizações em Tempo Real

```tsx
import { useTransactionStream } from '@/hooks/useTransactionStream';

function MyComponent() {
  const { transactions, loading, error } = useTransactionStream();
  
  // transactions atualiza AUTOMATICAMENTE quando:
  // - Nova transação é adicionada
  // - Transação é editada
  // - Transação é deletada
  // - Qualquer mudança no Firebase
  
  return (
    <FlatList data={transactions} />
  );
}
```

**Sem refetch manual! Tudo automático!** ⚡

---

### 2. Resumo Financeiro Reativo

```tsx
import { useFinancialSummary } from '@/hooks/useTransactionStream';

function SummaryCard() {
  const summary = useFinancialSummary();
  
  return (
    <View>
      <Text>Receitas: {formatCurrency(summary.totalIncome)}</Text>
      <Text>Despesas: {formatCurrency(summary.totalExpenses)}</Text>
      <Text>Saldo: {formatCurrency(summary.balance)}</Text>
    </View>
  );
}
```

**Calcula automaticamente quando transações mudam!**

---

### 3. Busca com Debounce

```tsx
import { useTransactionSearch } from '@/hooks/useTransactionStream';

function SearchScreen() {
  const { searchTerm, setSearchTerm, results } = useTransactionSearch();
  
  return (
    <View>
      <TextInput
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholder="Buscar..."
      />
      <FlatList data={results} />
    </View>
  );
}
```

**Debounce automático de 300ms! Performance otimizada!**

---

### 4. Transações Recentes

```tsx
import { useRecentTransactions } from '@/hooks/useTransactionStream';

function RecentList() {
  const recentTransactions = useRecentTransactions(); // Últimas 5
  
  return <FlatList data={recentTransactions} />;
}
```

---

### 5. Filtrar por Tipo

```tsx
import { useTransactionsByType } from '@/hooks/useTransactionStream';

function IncomeList() {
  const incomes = useTransactionsByType('income');
  
  return <FlatList data={incomes} />;
}
```

---

### 6. Notificações de Novas Transações

```tsx
import { useNewTransactionNotifications } from '@/hooks/useTransactionStream';

function NotificationDemo() {
  useNewTransactionNotifications((transaction) => {
    Alert.alert('Nova transação!', transaction.description);
  });
  
  return <View>...</View>;
}
```

---

## 📦 Arquivos Principais

```
src/
├── infrastructure/
│   ├── streams/
│   │   └── TransactionStream.ts        ← Stream RxJS
│   └── repositories/
│       └── FirebaseTransactionRepository.ts  ← onSnapshot
├── hooks/
│   └── useTransactionStream.ts         ← 8 hooks reativos
└── presentation/
    └── components/
        ├── ReactiveTransactionsDemo.tsx      ← Exemplo completo
        └── ReactiveSearchExample.tsx         ← Exemplo de busca
```

---

## ⚡ Benefícios

### Performance
- ✅ Debounce em buscas (300ms)
- ✅ Cache reativo
- ✅ Cleanup automático
- ✅ Sem requisições desnecessárias

### UX
- ✅ Atualizações em tempo real
- ✅ Sem necessidade de pull-to-refresh
- ✅ UI sempre sincronizada
- ✅ Feedback instantâneo

### Developer Experience
- ✅ Código declarativo
- ✅ Hooks reutilizáveis
- ✅ Fácil de testar
- ✅ Separação de responsabilidades

---

## 🧪 Testar Tempo Real

1. Abra o app em 2 dispositivos
2. Adicione transação no Dispositivo A
3. **Veja aparecer automaticamente no Dispositivo B** ✨
4. Sem refresh manual!

---

## 📚 Todos os Hooks Disponíveis

| Hook | Descrição |
|------|-----------|
| `useTransactionStream()` | Todas as transações (tempo real) |
| `useFinancialSummary()` | Resumo financeiro reativo |
| `useTransactionSearch()` | Busca com debounce |
| `useRecentTransactions()` | Últimas 5 transações |
| `useTransactionsByType(type)` | Filtrar por income/expense |
| `useTransactionsByCategory(cat)` | Filtrar por categoria |
| `useTransactionsByPeriod(start, end)` | Filtrar por período |
| `useNewTransactionNotifications(cb)` | Notificação de novas |

---

## 🎯 Operadores RxJS Usados

- `map` - Transformar dados
- `filter` - Filtrar valores
- `debounceTime` - Debounce (300ms)
- `distinctUntilChanged` - Evitar duplicatas

---

## ✅ Requisito da Fase 4

**ATENDIDO** ✅

- ✅ RxJS instalado
- ✅ BehaviorSubject implementado
- ✅ Observables criados
- ✅ Firestore onSnapshot
- ✅ Operadores RxJS utilizados
- ✅ Performance otimizada
- ✅ Exemplos práticos
- ✅ Documentação completa

---

## 📖 Documentação Completa

Ver [PROGRAMACAO_REATIVA.md](./PROGRAMACAO_REATIVA.md) para:
- Arquitetura detalhada
- Todos os operadores RxJS
- Exemplos avançados
- Conceitos teóricos
- Comparação antes/depois

---

## 🤝 Contribuindo

Para adicionar novos streams ou operadores:

1. Adicione método no `TransactionStream.ts`
2. Crie hook em `useTransactionStream.ts`
3. Use nos componentes
4. Documente aqui

---

**Projeto**: ByteBank Mobile  
**Tech Challenge**: FIAP - Fase 4  
**Data**: 02 de Fevereiro de 2026
