'use client';

import { TransactionForm } from '@/components/TransactionForm';

export default function AddTransactionPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold leading-7 text-slate-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight transition-colors">
          Add Transaction
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 transition-colors">
          Record a new income or expense to track your finances.
        </p>
      </div>

      <div className="max-w-2xl">
        <TransactionForm />
      </div>
    </div>
  );
}
