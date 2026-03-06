'use client';

import { useState } from 'react';
import { useFinanceStore } from '@/store/useFinanceStore';
import { useHydration } from '@/hooks/useHydration';
import { BudgetCard } from '@/components/BudgetCard';
import { EXPENSE_CATEGORIES } from '@/utils/categoryHelpers';
import { PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function BudgetPage() {
  const isHydrated = useHydration();
  const budgets = useFinanceStore((state) => state.budgets);
  const setBudget = useFinanceStore((state) => state.setBudget);
  const [isAdding, setIsAdding] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newLimit, setNewLimit] = useState('');

  if (!isHydrated) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  const handleAddBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory || !newLimit) return;

    const limitNum = parseFloat(newLimit);
    if (isNaN(limitNum) || limitNum <= 0) {
      toast.error('Please enter a valid positive number for the limit.');
      return;
    }

    if (budgets.some(b => b.category === newCategory)) {
      toast.error('A budget for this category already exists.');
      return;
    }

    setBudget({ category: newCategory, limit: limitNum });
    toast.success('Budget added successfully!');
    setIsAdding(false);
    setNewCategory('');
    setNewLimit('');
  };

  const availableCategories = EXPENSE_CATEGORIES.filter(
    cat => !budgets.some(b => b.category === cat)
  );

  return (
    <div className="space-y-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Budgets
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Set monthly spending limits for your categories.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          {!isAdding && availableCategories.length > 0 && (
            <button
              onClick={() => setIsAdding(true)}
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Add Budget
            </button>
          )}
        </div>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl shadow-sm ring-1 ring-gray-900/5 mb-8 max-w-2xl">
          <h3 className="text-base font-semibold leading-6 text-gray-900 mb-4">Create New Budget</h3>
          <form onSubmit={handleAddBudget} className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="w-full sm:w-1/2">
              <label htmlFor="category" className="block text-sm font-medium leading-6 text-gray-900">
                Category
              </label>
              <select
                id="category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                required
              >
                <option value="">Select a category</option>
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full sm:w-1/2">
              <label htmlFor="limit" className="block text-sm font-medium leading-6 text-gray-900">
                Monthly Limit
              </label>
              <div className="mt-2 relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  id="limit"
                  value={newLimit}
                  onChange={(e) => setNewLimit(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 pl-7 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto mt-4 sm:mt-0">
              <button
                type="submit"
                className="flex-1 sm:flex-none rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setNewCategory('');
                  setNewLimit('');
                }}
                className="flex-1 sm:flex-none rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {budgets.length === 0 && !isAdding ? (
        <div className="text-center py-12 px-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
          <div className="mx-auto h-12 w-12 text-gray-400 flex items-center justify-center">
            <PlusCircle className="h-8 w-8" />
          </div>
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No budgets</h3>
          <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">
            Get started by creating a budget to track your spending limits.
          </p>
          {availableCategories.length > 0 && (
            <div className="mt-6">
              <button
                onClick={() => setIsAdding(true)}
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <PlusCircle className="-ml-0.5 mr-1.5 h-4 w-4" aria-hidden="true" />
                Add Budget
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {budgets.map((budget) => (
            <BudgetCard key={budget.category} budget={budget} />
          ))}
        </div>
      )}
    </div>
  );
}
