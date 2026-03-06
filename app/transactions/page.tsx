'use client';

import { useState } from 'react';
import { useFinanceStore } from '@/store/useFinanceStore';
import { useHydration } from '@/hooks/useHydration';
import { TransactionList } from '@/components/TransactionList';
import { DEFAULT_CATEGORIES } from '@/utils/categoryHelpers';

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
    <div className="space-y-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Transactions
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            A list of all your income and expenses.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <a
            href="/add-transaction"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add Transaction
          </a>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <label htmlFor="category-filter" className="text-sm font-medium text-gray-700">
          Filter by Category:
        </label>
        <select
          id="category-filter"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="block w-48 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        >
          <option value="All">All Categories</option>
          {DEFAULT_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <TransactionList transactions={filteredTransactions} showDelete={true} />
    </div>
  );
}
