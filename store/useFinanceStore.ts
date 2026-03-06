import { create } from 'zustand';
import { Transaction, Budget } from '../types/finance';

interface FinanceState {
  transactions: Transaction[];
  budgets: Budget[];
  isLoading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  setBudget: (budget: Budget) => Promise<void>;
  deleteBudget: (category: string) => Promise<void>;
}

export const useFinanceStore = create<FinanceState>((set) => ({
  transactions: [],
  budgets: [],
  isLoading: false,
  error: null,

  fetchData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [transactionsRes, budgetsRes] = await Promise.all([
        fetch('/api/transactions'),
        fetch('/api/budgets')
      ]);

      if (!transactionsRes.ok || !budgetsRes.ok) throw new Error('Failed to fetch data');

      const transactions = await transactionsRes.json();
      const budgets = await budgetsRes.json();

      set({ transactions, budgets, isLoading: false });
    } catch (error) {
      console.error('Fetch error:', error);
      set({ error: 'Failed to fetch financial data', isLoading: false });
      throw error;
    }
  },

  addTransaction: async (transaction) => {
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction),
      });
      if (!res.ok) throw new Error('Failed to add transaction');
      const newTransaction = await res.json();
      set((state) => ({
        transactions: [newTransaction, ...state.transactions]
      }));
    } catch (error) {
      console.error('Add transaction error:', error);
      set({ error: 'Failed to add transaction' });
      throw error;
    }
  },

  deleteTransaction: async (id) => {
    try {
      const res = await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete transaction');
      set((state) => ({
        transactions: state.transactions.filter(t => t.id !== id)
      }));
    } catch (error) {
      console.error('Delete transaction error:', error);
      set({ error: 'Failed to delete transaction' });
      throw error;
    }
  },

  setBudget: async (budget) => {
    try {
      const res = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(budget),
      });
      if (!res.ok) throw new Error('Failed to save budget');
      const savedBudget = await res.json();
      set((state) => {
        const existing = state.budgets.findIndex(b => b.category === savedBudget.category);
        if (existing >= 0) {
          const newBudgets = [...state.budgets];
          newBudgets[existing] = savedBudget;
          return { budgets: newBudgets };
        }
        return { budgets: [...state.budgets, savedBudget] };
      });
    } catch (error) {
      console.error('Set budget error:', error);
      set({ error: 'Failed to save budget' });
      throw error;
    }
  },

  deleteBudget: async (category) => {
    try {
      const res = await fetch(`/api/budgets/${category}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete budget');
      set((state) => ({
        budgets: state.budgets.filter(b => b.category !== category)
      }));
    } catch (error) {
      console.error('Delete budget error:', error);
      set({ error: 'Failed to delete budget' });
      throw error;
    }
  },
}));
