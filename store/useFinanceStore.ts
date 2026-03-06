import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction, Budget } from '../types/finance';

interface FinanceState {
  transactions: Transaction[];
  budgets: Budget[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  setBudget: (budget: Budget) => void;
  deleteBudget: (category: string) => void;
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      transactions: [],
      budgets: [],
      addTransaction: (transaction) => set((state) => ({
        transactions: [
          { ...transaction, id: crypto.randomUUID() },
          ...state.transactions
        ]
      })),
      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter(t => t.id !== id)
      })),
      setBudget: (budget) => set((state) => {
        const existing = state.budgets.findIndex(b => b.category === budget.category);
        if (existing >= 0) {
          const newBudgets = [...state.budgets];
          newBudgets[existing] = budget;
          return { budgets: newBudgets };
        }
        return { budgets: [...state.budgets, budget] };
      }),
      deleteBudget: (category) => set((state) => ({
        budgets: state.budgets.filter(b => b.category !== category)
      })),
    }),
    {
      name: 'finance-storage',
    }
  )
);
