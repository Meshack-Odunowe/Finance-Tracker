'use client';

import { TransactionForm } from '@/components/TransactionForm';

export default function AddTransactionPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Add Transaction
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Record a new income or expense to track your finances.
        </p>
      </div>

      <div className="max-w-2xl">
        <TransactionForm />
      </div>
    </div>
  );
}
