'use client';

import { ArrowDownRight, ArrowUpRight, Wallet, Activity } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { useCurrency } from '@/hooks/useCurrency';

interface DashboardSummaryProps {
  totalIncome: number;
  totalExpenses: number;
  remainingBalance: number;
  transactionCount: number;
}

export function DashboardSummary({
  totalIncome,
  totalExpenses,
  remainingBalance,
  transactionCount,
}: DashboardSummaryProps) {
  const { format } = useCurrency();

  const cards = [
    {
      name: 'Total Balance',
      value: format(remainingBalance),
      icon: Wallet,
      color: remainingBalance >= 0 ? 'text-slate-900 dark:text-white' : 'text-red-600 dark:text-red-400',
      bgColor: 'bg-slate-50 dark:bg-slate-800/50',
      borderColor: 'border-slate-200 dark:border-slate-800',
    },
    {
      name: 'Total Income',
      value: format(totalIncome),
      icon: ArrowUpRight,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50/50 dark:bg-emerald-500/10',
      borderColor: 'border-emerald-100/50 dark:border-emerald-500/20',
    },
    {
      name: 'Total Expenses',
      value: format(totalExpenses),
      icon: ArrowDownRight,
      color: 'text-rose-600 dark:text-rose-400',
      bgColor: 'bg-rose-50/50 dark:bg-rose-500/10',
      borderColor: 'border-rose-100/50 dark:border-rose-500/20',
    },
    {
      name: 'Transactions',
      value: transactionCount.toString(),
      icon: Activity,
      color: 'text-slate-600 dark:text-slate-400',
      bgColor: 'bg-slate-50 dark:bg-slate-800/50',
      borderColor: 'border-slate-200 dark:border-slate-800',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.name}
          className={twMerge(
            'relative overflow-hidden rounded-xl bg-white dark:bg-slate-900 p-5 border shadow-[0_1px_2px_rgba(0,0,0,0.05)] dark:shadow-none transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:hover:border-slate-700',
            card.borderColor
          )}
        >
          <div className="flex flex-col gap-3">
            <div className={twMerge('w-fit rounded-lg p-2', card.bgColor)}>
              <card.icon className={twMerge('h-4 w-4', card.color)} aria-hidden="true" />
            </div>
            <div>
              <dt className="text-[13px] font-medium text-slate-500 dark:text-slate-400">{card.name}</dt>
              <dd className={twMerge('mt-1 text-2xl font-bold tracking-tight transition-colors duration-300', card.color)}>
                {card.value}
              </dd>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
