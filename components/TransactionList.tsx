import { useState } from 'react';
import { Transaction } from '@/types/finance';
import { formatDate } from '@/utils/formatters';
import { Trash2, Edit2, Repeat } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';
import { useFinanceStore } from '@/store/useFinanceStore';
import { EmptyState } from './EmptyState';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';
import { EditTransactionModal } from './EditTransactionModal';
import { ConfirmModal } from './ConfirmModal';

interface TransactionListProps {
  transactions: Transaction[];
  limit?: number;
  showActions?: boolean;
}

export function TransactionList({ transactions, limit, showActions = false }: TransactionListProps) {
  const { format } = useCurrency();
  const deleteTransaction = useFinanceStore((state) => state.deleteTransaction);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingTransactionId, setDeletingTransactionId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deletingTransactionId) return;
    try {
      await deleteTransaction(deletingTransactionId);
      toast.success('Transaction deleted');
    } catch (error) {
      toast.error('Failed to delete transaction');
    } finally {
      setDeletingTransactionId(null);
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
    <>
      <div className="w-full overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 transition-colors">
              <th scope="col" className="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 bg-[#fbfbfc] dark:bg-slate-900/50 py-3 pl-4 pr-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 sm:pl-6 transition-colors duration-300">Date</th>
              <th scope="col" className="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 bg-[#fbfbfc] dark:bg-slate-900/50 px-3 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 transition-colors duration-300">Description</th>
              <th scope="col" className="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 bg-[#fbfbfc] dark:bg-slate-900/50 px-3 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 transition-colors duration-300">Category</th>
              <th scope="col" className="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 bg-[#fbfbfc] dark:bg-slate-900/50 px-3 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 transition-colors duration-300">Amount</th>
              {showActions && <th scope="col" className="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 bg-[#fbfbfc] dark:bg-slate-900/50 py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>}
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
                  <div className="flex items-center gap-x-2">
                    {transaction.description || '—'}
                    {transaction.isRecurring && (
                      <span title={`Recurring: ${transaction.recurrenceType}`}>
                        <Repeat className="h-3.5 w-3.5 text-indigo-500" />
                      </span>
                    )}
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-[13px] text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
                  <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700 transition-colors duration-300">
                    {transaction.category}
                  </span>
                </td>
                <td className={twMerge(
                  'whitespace-nowrap px-3 py-4 text-[13px] text-right font-mono font-semibold border-b border-slate-100 dark:border-slate-800 transition-colors duration-300',
                  transaction.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600'
                )}>
                  {transaction.type === 'income' ? '+' : '-'}{format(transaction.amount)}
                </td>
                {showActions && (
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex justify-end gap-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setEditingTransaction(transaction)}
                        className="text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all p-1.5 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
                        aria-label="Edit transaction"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeletingTransactionId(transaction.id)}
                        className="text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-all p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-500/10"
                        aria-label="Delete transaction"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EditTransactionModal
        transaction={editingTransaction}
        isOpen={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
      />

      <ConfirmModal
        isOpen={!!deletingTransactionId}
        onClose={() => setDeletingTransactionId(null)}
        onConfirm={handleDelete}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        confirmLabel="Delete"
        isDestructive={true}
      />
    </>
  );
}
