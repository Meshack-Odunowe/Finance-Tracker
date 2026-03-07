'use client';

import { useState } from 'react';
import { useFinanceStore } from '@/store/useFinanceStore';
import { useHydration } from '@/hooks/useHydration';
import { TransactionList } from '@/components/TransactionList';
import { DEFAULT_CATEGORIES } from '@/utils/categoryHelpers';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function TransactionsPage() {
  const isHydrated = useHydration();
  const transactions = useFinanceStore((state) => state.transactions);
  const [filterCategory, setFilterCategory] = useState<string>('All');

  if (!isHydrated) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  const filteredTransactions = filterCategory === 'All'
    ? transactions
    : transactions.filter(t => t.category === filterCategory);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold leading-7 text-slate-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight transition-colors">
            Transactions
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 transition-colors">
            A list of all your income and expenses.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <a
            href="/add-transaction"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all active:scale-95"
          >
            Add Transaction
          </a>
        </div>
      </div>

      <div className="flex items-center space-x-4 bg-white/50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 backdrop-blur-sm transition-colors">
        <Label htmlFor="category-filter" className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Filter by Category:
        </Label>
        <Select value={filterCategory} onValueChange={(val) => val && setFilterCategory(val)}>
          <SelectTrigger id="category-filter" className="w-48 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <SelectItem value="All">All Categories</SelectItem>
            {DEFAULT_CATEGORIES.map((cat: string) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <TransactionList transactions={filteredTransactions} showDelete={true} />
    </div>
  );
}
