'use client';

import { useFinanceStore } from '@/store/useFinanceStore';
import { useHydration } from '@/hooks/useHydration';
import { DashboardSummary } from '@/components/DashboardSummary';
import { SpendingPieChart } from '@/components/SpendingPieChart';
import { CategoryBarChart } from '@/components/CategoryBarChart';
import { BudgetProgress } from '@/components/BudgetProgress';
import { TransactionList } from '@/components/TransactionList';
import {
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateBalance,
  groupTransactionsByCategory,
  calculateBudgetProgress,
} from '@/utils/calculations';

export default function DashboardPage() {
  const isHydrated = useHydration();
  const transactions = useFinanceStore((state) => state.transactions);
  const budgets = useFinanceStore((state) => state.budgets);

  if (!isHydrated) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  const currentDate = new Date();
  
  const totalIncome = calculateTotalIncome(transactions, currentDate);
  const totalExpenses = calculateTotalExpenses(transactions, currentDate);
  const remainingBalance = calculateBalance(transactions, currentDate);
  const categoryData = groupTransactionsByCategory(transactions, currentDate);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your finances for the current month.
        </p>
      </div>

      <DashboardSummary
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        remainingBalance={remainingBalance}
        transactionCount={transactions.length}
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
          <h2 className="text-base font-semibold leading-6 text-gray-900 mb-4">Spending by Category</h2>
          <SpendingPieChart data={categoryData} />
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
          <h2 className="text-base font-semibold leading-6 text-gray-900 mb-4">Category Comparison</h2>
          <CategoryBarChart data={categoryData} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold leading-6 text-gray-900">Recent Transactions</h2>
            <a href="/transactions" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              View all
            </a>
          </div>
          <TransactionList transactions={transactions} limit={5} />
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold leading-6 text-gray-900">Budget Progress</h2>
            <a href="/budget" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Manage
            </a>
          </div>
          <div className="space-y-6">
            {budgets.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No budgets set. Create one to track spending.</p>
            ) : (
              budgets.map((budget) => {
                const { spent } = calculateBudgetProgress(budget.category, transactions, budgets, currentDate);
                return (
                  <BudgetProgress
                    key={budget.category}
                    category={budget.category}
                    spent={spent}
                    limit={budget.limit}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
