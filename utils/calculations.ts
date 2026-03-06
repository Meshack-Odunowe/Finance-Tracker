import { Transaction, Budget } from '../types/finance';
import { isSameMonth, parseISO } from 'date-fns';

export const calculateTotalIncome = (transactions: Transaction[], monthDate?: Date) => {
  return transactions
    .filter(t => t.type === 'income' && (!monthDate || isSameMonth(parseISO(t.date), monthDate)))
    .reduce((sum, t) => sum + t.amount, 0);
};

export const calculateTotalExpenses = (transactions: Transaction[], monthDate?: Date) => {
  return transactions
    .filter(t => t.type === 'expense' && (!monthDate || isSameMonth(parseISO(t.date), monthDate)))
    .reduce((sum, t) => sum + t.amount, 0);
};

export const calculateBalance = (transactions: Transaction[], monthDate?: Date) => {
  const income = calculateTotalIncome(transactions, monthDate);
  const expenses = calculateTotalExpenses(transactions, monthDate);
  return income - expenses;
};

export const groupTransactionsByCategory = (transactions: Transaction[], monthDate?: Date) => {
  const expenses = transactions.filter(t => t.type === 'expense' && (!monthDate || isSameMonth(parseISO(t.date), monthDate)));
  
  const grouped = expenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(grouped).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
};

export const calculateBudgetProgress = (category: string, transactions: Transaction[], budgets: Budget[], monthDate?: Date) => {
  const budget = budgets.find(b => b.category === category);
  const limit = budget ? budget.limit : 0;
  
  const spent = transactions
    .filter(t => t.type === 'expense' && t.category === category && (!monthDate || isSameMonth(parseISO(t.date), monthDate)))
    .reduce((sum, t) => sum + t.amount, 0);

  return { limit, spent };
};
