O sistema tem duas uma coleções no Firestore:

### **Users** (Usuários)
```typescript
{
  email: string,
  name: string,
  createdAt: Date,
  updatedAt: Date
}
```

### **Transactions** (Transações)
```typescript
{
  id: string,
  userId: string,
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'PAYMENT' | 'INVESTMENT',
  amount: number,
  date: Date,
  description: string,
  category?: string,
  createdAt: Date,
  updatedAt: Date
}
```