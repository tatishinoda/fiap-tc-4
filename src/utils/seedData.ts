/**
 * Script de exemplo para popular o Firestore com dados de teste
 * Use este script como referência para criar dados no seu app
 */

import * as TransactionService from '../services/TransactionService';
import { formatCurrency } from './format';

/**
 * Popula o banco com dados de teste para um usuário
 * Execute esta função após o usuário fazer login
 */
export const populateTestData = async (userId: string) => {
  try {
    console.log('🚀 Iniciando população de dados de teste...');

    // 1. Adicionar depósito inicial (salário)
    console.log('💰 Adicionando salário...');
    await TransactionService.createTransaction({
      userId,
      type: 'DEPOSIT',
      amount: 300000, // R$ 3.000,00
      date: new Date('2025-10-13T17:49:25.361Z'),
      description: 'Salário',
    });

    // 2. Criar transação de investimento em ações
    console.log('📈 Criando investimento em ações...');
    await TransactionService.createTransaction({
      userId,
      type: 'INVESTMENT',
      amount: 10000, // R$ 100,00
      date: new Date('2025-10-12T15:43:18.913Z'),
      description: 'Investimento em ações',
      category: 'Ações',
    });

    // 3. Criar transação de investimento em tesouro direto
    console.log('🏦 Criando investimento em tesouro...');
    await TransactionService.createTransaction({
      userId,
      type: 'INVESTMENT',
      amount: 1000, // R$ 10,00
      date: new Date('2025-10-12T22:32:10.240Z'),
      description: 'Tesouro Selic 2028',
      category: 'Tesouro Direto',
    });

    // 4. Adicionar pagamento
    console.log('💳 Criando pagamento...');
    await TransactionService.createTransaction({
      userId,
      type: 'PAYMENT',
      amount: 1500, // R$ 15,00
      date: new Date('2025-10-13T17:51:06.146Z'),
      description: 'Conta de luz',
      category: 'Contas',
    });

    // 5. Adicionar saque/despesa
    console.log('🛒 Adicionando despesa...');
    await TransactionService.createTransaction({
      userId,
      type: 'WITHDRAWAL',
      amount: 5500, // R$ 55,00
      date: new Date('2025-10-13T03:00:00.000Z'),
      description: 'Educação',
      category: 'Educação',
    });

    // 6. Adicionar transferência
    console.log('💸 Criando transferência...');
    await TransactionService.createTransaction({
      userId,
      type: 'TRANSFER',
      amount: 2000, // R$ 20,00
      date: new Date('2025-10-13T10:00:00.000Z'),
      description: 'Transferência para poupança',
      category: 'Poupança',
    });

    // 6. Adicionar depósito extra
    console.log('💵 Adicionando depósito extra...');
    await TransactionService.createTransaction({
      userId,
      type: 'DEPOSIT',
      amount: 5000000, // R$ 50.000,00
      date: new Date('2025-10-13T20:15:39.633Z'),
      description: 'Bônus anual',
    });

    console.log('✅ Dados de teste criados com sucesso!');
    
    // Calcular resumo
    const transactions = await TransactionService.getAllTransactions(userId);
    
    const totalIncome = transactions
      .filter(t => t.type === 'DEPOSIT')
      .reduce((acc, t) => acc + t.amount, 0);
    
    const totalExpense = transactions
      .filter(t => t.type === 'WITHDRAWAL' || t.type === 'PAYMENT' || t.type === 'TRANSFER' || t.type === 'INVESTMENT')
      .reduce((acc, t) => acc + t.amount, 0);
    
    const balance = totalIncome - totalExpense;
    
    const totalInvested = transactions
      .filter(t => t.type === 'INVESTMENT')
      .reduce((acc, t) => acc + t.amount, 0);
    
    console.log('📊 Resumo:');
    console.log(`- Saldo: ${formatCurrency(balance)}`);
    console.log(`- Total investido: ${formatCurrency(totalInvested)}`);
    
    return {
      balance,
      totalInvested,
      message: 'Dados criados com sucesso!',
    };
  } catch (error) {
    console.error('❌ Erro ao popular dados:', error);
    throw error;
  }
};

/**
 * Remove todos os dados de teste de um usuário
 * CUIDADO: Esta função deleta TODOS os dados!
 */
export const clearTestData = async (userId: string) => {
  try {
    console.log('🧹 Limpando dados de teste...');

    // Deletar todas as transações
    const transactions = await TransactionService.getAllTransactions(userId);
    for (const transaction of transactions) {
      await TransactionService.deleteTransaction(transaction.id);
    }

    console.log('✅ Dados limpos com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao limpar dados:', error);
    throw error;
  }
};

/**
 * Exemplo de uso no seu app:
 * 
 * import { populateTestData } from './utils/seedData';
 * 
 * // No componente após login
 * const handlePopulateData = async () => {
 *   try {
 *     await populateTestData(user.id);
 *     alert('Dados de teste criados!');
 *     await refreshTransactions();
 *   } catch (error) {
 *     alert('Erro ao criar dados');
 *   }
 * };
 */
