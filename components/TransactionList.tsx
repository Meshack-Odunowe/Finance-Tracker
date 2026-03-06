'use client';

import { Transaction } from '@/types/finance';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Trash2 } from 'lucide-react';
import { useFinanceStore } from '@/store/useFinanceStore';
import { EmptyState } from './EmptyState';
import { toast } from 'sonner';

interface TransactionListProps {
  transactions: Transaction[];
  limit?: number;
  showDelete?: boolean;
}

export function TransactionList({ transactions, limit, showDelete = false }: TransactionListProps) {
  const deleteTransaction = useFinanceStore((state) => state.deleteTransaction);

  const handleDelete = async (id: string) => {
    try {
      await deleteTransaction(id);
      toast.success('Transaction deleted');
    } catch (error) {
      toast.error('Failed to delete transaction');
    }
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const displayTransactions = limit ? sortedTransactions.slice(0, limit) : sortedTransactions;

  if (transactions.length === 0) {
    return (
      <EmptyState
        title="No transactions yet"
        description="Add your first transaction to start tracking your finances."
        actionLabel="Add Transaction"
        actionHref="/add-transaction"
      />
    );
  }

  return (
    <div className="overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Date</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Description</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Amount</th>
            {showDelete && <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {displayTransactions.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
                {formatDate(transaction.date)}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 font-medium">
                {transaction.description || '—'}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                  {transaction.category}
                </span>
              </td>
              <td className={`whitespace-nowrap px-3 py-4 text-sm text-right font-semibold ${transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                }`}>
                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
              </td>
              {showDelete && (
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <button
                    onClick={() => handleDelete(transaction.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                    aria-label="Delete transaction"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
