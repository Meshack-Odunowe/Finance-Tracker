'use client';

import { Transaction } from '@/types/finance';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Trash2 } from 'lucide-react';
import { useFinanceStore } from '@/store/useFinanceStore';
import { EmptyState } from './EmptyState';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

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
    const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateDiff === 0 && a.createdAt && b.createdAt) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return dateDiff;
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
    <div className="w-full overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-0">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800 transition-colors">
            <th scope="col" className="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 bg-[#fbfbfc] dark:bg-slate-900/50 py-3 pl-4 pr-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 sm:pl-6 transition-colors duration-300">Date</th>
            <th scope="col" className="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 bg-[#fbfbfc] dark:bg-slate-900/50 px-3 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 transition-colors duration-300">Description</th>
            <th scope="col" className="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 bg-[#fbfbfc] dark:bg-slate-900/50 px-3 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 transition-colors duration-300">Category</th>
            <th scope="col" className="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 bg-[#fbfbfc] dark:bg-slate-900/50 px-3 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 transition-colors duration-300">Amount</th>
            {showDelete && <th scope="col" className="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 bg-[#fbfbfc] dark:bg-slate-900/50 py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-slate-900/10 transition-colors duration-300">
          {displayTransactions.map((transaction, idx) => (
            <tr
              key={transaction.id}
              className={twMerge(
                'group hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors',
                idx !== displayTransactions.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''
              )}
            >
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-[13px] text-slate-500 dark:text-slate-400 sm:pl-6 border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
                {formatDate(transaction.date)}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-[13px] text-slate-900 dark:text-slate-200 font-medium border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
                {transaction.description || '—'}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-[13px] text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
                <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700 transition-colors duration-300">
                  {transaction.category}
                </span>
              </td>
              <td className={twMerge(
                'whitespace-nowrap px-3 py-4 text-[13px] text-right font-mono font-semibold border-b border-slate-100 dark:border-slate-800 transition-colors duration-300',
                transaction.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
              )}>
                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
              </td>
              {showDelete && (
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 border-b border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => handleDelete(transaction.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-all p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-500/10"
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
