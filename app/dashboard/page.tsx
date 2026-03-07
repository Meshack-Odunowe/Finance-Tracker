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
import Link from 'next/link';
import { Activity } from 'lucide-react';

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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl transition-colors">
            Dashboard
          </h1>
          <p className="mt-1 text-[13px] text-slate-500 dark:text-slate-400 font-medium transition-colors">
            Personal balance and monthly expenditure overview.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/add-transaction"
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-[13px] font-semibold text-white shadow-sm shadow-indigo-200 dark:shadow-indigo-900/50 hover:bg-indigo-500 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Add Transaction
          </Link>
        </div>
      </div>

      <DashboardSummary
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        remainingBalance={remainingBalance}
        transactionCount={transactions.length}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-none transition-colors duration-300">
          <h2 className="text-[14px] font-bold text-slate-900 dark:text-white mb-6 transition-colors">Spending by Category</h2>
          <SpendingPieChart data={categoryData} />
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-none transition-colors duration-300">
          <h2 className="text-[14px] font-bold text-slate-900 dark:text-white mb-6 transition-colors">Category Comparison</h2>
          <CategoryBarChart data={categoryData} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-none overflow-hidden transition-colors duration-300">
          <div className="flex items-center justify-between p-6 pb-2">
            <h2 className="text-[14px] font-bold text-slate-900 dark:text-white transition-colors">Recent Transactions</h2>
            <Link href="/transactions" className="text-[12px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded-md">
              View all
            </Link>
          </div>
          <TransactionList transactions={transactions} limit={5} />
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-none transition-colors duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[14px] font-bold text-slate-900 dark:text-white transition-colors">Budget Progress</h2>
            <Link href="/budget" className="text-[12px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded-md">
              Manage
            </Link>
          </div>
          <div className="space-y-6">
            {budgets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="h-10 w-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-3 transition-colors">
                  <Activity className="h-5 w-5 text-slate-300 dark:text-slate-500" />
                </div>
                <p className="text-[13px] font-medium text-slate-400 dark:text-slate-500">No active budgets</p>
              </div>
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
