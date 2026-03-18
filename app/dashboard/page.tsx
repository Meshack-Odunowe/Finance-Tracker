'use client';

import { useFinanceStore } from '@/store/useFinanceStore';
import { useHydration } from '@/hooks/useHydration';
import { DashboardSummary } from '@/components/DashboardSummary';
import { SpendingPieChart } from '@/components/SpendingPieChart';
import { CategoryBarChart } from '@/components/CategoryBarChart';
import { BudgetProgress } from '@/components/BudgetProgress';
import { TransactionList } from '@/components/TransactionList';
import { TrendsChart } from '@/components/TrendsChart';
import { CategoryTrendsChart } from '@/components/CategoryTrendsChart';
import { HealthScoreWidget } from '@/components/HealthScoreWidget';
import { InsightsCard } from '@/components/InsightsCard';
import { ActivityTimeline } from '@/components/ActivityTimeline';
import { SavingsGoalProgress } from '@/components/SavingsGoalProgress';

import {
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateBalance,
  groupTransactionsByCategory,
  calculateBudgetProgress,
} from '@/utils/calculations';
import Link from 'next/link';
import { Activity, Target, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const isHydrated = useHydration();
  const state = useFinanceStore();

  const { transactions, budgets, savingsGoals, activityLogs, widgets } = state;

  const isVisible = (name: string) => {
    if (widgets.length === 0) return true;
    return widgets.find(w => w.name === name)?.isVisible ?? true;
  };

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
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
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

      {isVisible('Summary') && (
        <DashboardSummary
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          remainingBalance={remainingBalance}
          transactionCount={transactions.length}
        />
      )}

      {(isVisible('HealthScore') || isVisible('Insights')) && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {isVisible('HealthScore') && (
            <div className="lg:col-span-1">
              <HealthScoreWidget transactions={transactions} budgets={budgets} />
            </div>
          )}
          {isVisible('Insights') && (
            <div className="lg:col-span-2">
              <InsightsCard transactions={transactions} budgets={budgets} />
            </div>
          )}
        </div>
      )}

      {(isVisible('Trends') || isVisible('CategoryTrends')) && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {isVisible('Trends') && <TrendsChart transactions={transactions} />}
          {isVisible('CategoryTrends') && <CategoryTrendsChart transactions={transactions} />}
        </div>
      )}

      {(isVisible('SpendingSplit') || isVisible('CategoryComparison')) && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {isVisible('SpendingSplit') && (
            <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-none transition-colors duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[14px] font-bold text-slate-900 dark:text-white transition-colors">Spending Category Split</h2>
                <div className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-slate-400" />
                </div>
              </div>
              <SpendingPieChart data={categoryData} />
            </div>
          )}

          {isVisible('CategoryComparison') && (
            <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-none transition-colors duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[14px] font-bold text-slate-900 dark:text-white transition-colors">Category Comparison</h2>
                <div className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <Activity className="h-4 w-4 text-slate-400" />
                </div>
              </div>
              <CategoryBarChart data={categoryData} />
            </div>
          )}
        </div>
      )}

      {(isVisible('RecentTransactions') || isVisible('ActivityLog')) && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {isVisible('RecentTransactions') && (
            <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-none overflow-hidden transition-colors duration-300 flex flex-col">
              <div className="flex items-center justify-between p-6 pb-2">
                <h2 className="text-[14px] font-bold text-slate-900 dark:text-white transition-colors uppercase tracking-wider">Recent Transactions</h2>
                <Link href="/transactions" className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1.5 rounded-lg uppercase tracking-widest">
                  View all
                </Link>
              </div>
              <div className="flex-1">
                <TransactionList transactions={transactions} limit={6} showActions={false} />
              </div>
            </div>
          )}

          {isVisible('ActivityLog') && (
            <div className="lg:col-span-1">
              <ActivityTimeline logs={activityLogs} />
            </div>
          )}
        </div>
      )}

      {(isVisible('SavingsGoals') || isVisible('BudgetProgress')) && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {isVisible('SavingsGoals') && (
            <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl">
                    <Target className="h-4 w-4 text-emerald-500" />
                  </div>
                  <h2 className="text-[14px] font-bold text-slate-900 dark:text-white transition-colors uppercase tracking-wider">Savings Goals</h2>
                </div>
                <Link href="/savings-goals" className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 transition-colors bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-md">
                  Manage
                </Link>
              </div>
              <div className="space-y-4">
                {savingsGoals.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <p className="text-[13px] font-bold text-slate-400 dark:text-slate-500">No savings goals yet</p>
                    <Link href="/savings-goals" className="text-xs text-indigo-500 mt-2 font-bold hover:underline">Create your first goal →</Link>
                  </div>
                ) : (
                  savingsGoals.slice(0, 3).map((goal) => (
                    <SavingsGoalProgress key={goal.id} goal={goal} />
                  ))
                )}
              </div>
            </div>
          )}

          {isVisible('BudgetProgress') && (
            <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-none transition-colors duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl">
                    <Activity className="h-4 w-4 text-indigo-500" />
                  </div>
                  <h2 className="text-[14px] font-bold text-slate-900 dark:text-white transition-colors uppercase tracking-wider">Budget Progress</h2>
                </div>
                <Link href="/budget" className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded-md">
                  Manage
                </Link>
              </div>
              <div className="space-y-6">
                {budgets.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <p className="text-[13px] font-bold text-slate-400 dark:text-slate-500">No active budgets</p>
                    <Link href="/budget" className="text-xs text-indigo-500 mt-2 font-bold hover:underline">Set a budget →</Link>
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
          )}
        </div>
      )}
    </div>
  );
}
