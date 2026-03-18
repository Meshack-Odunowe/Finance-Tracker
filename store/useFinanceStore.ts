import { create } from 'zustand';
import { Transaction, Budget, SavingsGoal, Category, ActivityLog } from '../types/finance';

interface FinanceState {
  transactions: Transaction[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  categories: Category[];
  activityLogs: ActivityLog[];
  userPreferences: { preferredCurrency: string; themePreference: string } | null;
  widgets: { id?: string; name: string; isVisible: boolean; order: number }[];
  isLoading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
  updatePreferences: (prefs: { preferredCurrency?: string; themePreference?: string }) => Promise<void>;
  toggleWidget: (name: string, isVisible: boolean) => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'userId'>) => Promise<void>;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  setBudget: (budget: Omit<Budget, 'id' | 'userId'>) => Promise<void>;
  deleteBudget: (category: string) => Promise<void>;
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'userId'>) => Promise<void>;
  updateSavingsGoal: (id: string, goal: Partial<SavingsGoal>) => Promise<void>;
  deleteSavingsGoal: (id: string) => Promise<void>;
}

export const useFinanceStore = create<FinanceState>((set) => ({
  transactions: [],
  budgets: [],
  savingsGoals: [],
  categories: [],
  activityLogs: [],
  userPreferences: null,
  widgets: [],
  isLoading: false,
  error: null,

  fetchData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [transactionsRes, budgetsRes, goalsRes, logsRes, categoriesRes, prefsRes, widgetsRes] = await Promise.all([
        fetch('/api/transactions'),
        fetch('/api/budgets'),
        fetch('/api/savings-goals'),
        fetch('/api/activity-logs'),
        fetch('/api/categories'),
        fetch('/api/user/preferences'),
        fetch('/api/user/widgets')
      ]);

      if (!transactionsRes.ok || !budgetsRes.ok) throw new Error('Failed to fetch data');

      const transactions = await transactionsRes.json();
      const budgets = await budgetsRes.json();
      const savingsGoals = goalsRes.ok ? await goalsRes.json() : [];
      const activityLogs = logsRes.ok ? await logsRes.json() : [];
      const categories = categoriesRes.ok ? await categoriesRes.json() : [];
      const userPreferences = prefsRes.ok ? await prefsRes.json() : { preferredCurrency: 'NGN', themePreference: 'light' };
      const widgets = widgetsRes.ok ? await widgetsRes.json() : [];

      set({ transactions, budgets, savingsGoals, activityLogs, categories, userPreferences, widgets, isLoading: false });
    } catch (error) {
      console.error('Fetch error:', error);
      set({ error: 'Failed to fetch financial data', isLoading: false });
      throw error;
    }
  },

  updatePreferences: async (prefs) => {
    try {
      const res = await fetch('/api/user/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prefs),
      });
      if (!res.ok) throw new Error('Failed to update preferences');
      const updatedPrefs = await res.json();
      set((state) => ({
        userPreferences: { ...state.userPreferences, ...updatedPrefs }
      } as any));
    } catch (error) {
      console.error('Update preferences error:', error);
      throw error;
    }
  },

  toggleWidget: async (name, isVisible) => {
    try {
      const res = await fetch('/api/user/widgets', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, isVisible }),
      });
      if (!res.ok) throw new Error('Failed to toggle widget');
      const updatedWidget = await res.json();
      set((state) => ({
        widgets: state.widgets.map(w => w.name === name ? updatedWidget : w)
      } as any));
    } catch (error) {
      console.error('Toggle widget error:', error);
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

  updateTransaction: async (id, transaction) => {
    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction),
      });
      if (!res.ok) throw new Error('Failed to update transaction');
      const updatedTransaction = await res.json();
      set((state) => ({
        transactions: state.transactions.map(t => t.id === id ? updatedTransaction : t)
      }));
    } catch (error) {
      console.error('Update transaction error:', error);
      set({ error: 'Failed to update transaction' });
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

  addSavingsGoal: async (goal) => {
    try {
      const res = await fetch('/api/savings-goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goal),
      });
      if (!res.ok) throw new Error('Failed to add savings goal');
      const newGoal = await res.json();
      set((state) => ({
        savingsGoals: [newGoal, ...state.savingsGoals]
      }));
    } catch (error) {
      console.error('Add savings goal error:', error);
      set({ error: 'Failed to add savings goal' });
      throw error;
    }
  },

  updateSavingsGoal: async (id, goal) => {
    try {
      const res = await fetch(`/api/savings-goals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goal),
      });
      if (!res.ok) throw new Error('Failed to update savings goal');
      const updatedGoal = await res.json();
      set((state) => ({
        savingsGoals: state.savingsGoals.map(g => g.id === id ? updatedGoal : g)
      }));
    } catch (error) {
      console.error('Update savings goal error:', error);
      set({ error: 'Failed to update savings goal' });
      throw error;
    }
  },

  deleteSavingsGoal: async (id) => {
    try {
      const res = await fetch(`/api/savings-goals/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete savings goal');
      set((state) => ({
        savingsGoals: state.savingsGoals.filter(g => g.id !== id)
      }));
    } catch (error) {
      console.error('Delete savings goal error:', error);
      set({ error: 'Failed to delete savings goal' });
      throw error;
    }
  },
}));
