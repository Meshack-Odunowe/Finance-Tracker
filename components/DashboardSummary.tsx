'use client';

import { ArrowDownRight, ArrowUpRight, DollarSign, Activity } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { twMerge } from 'tailwind-merge';

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
  const cards = [
    {
      name: 'Total Balance',
      value: formatCurrency(remainingBalance),
      icon: DollarSign,
      color: remainingBalance >= 0 ? 'text-slate-900' : 'text-red-600',
      bgColor: 'bg-slate-50',
      borderColor: 'border-slate-200',
    },
    {
      name: 'Total Income',
      value: formatCurrency(totalIncome),
      icon: ArrowUpRight,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50/50',
      borderColor: 'border-emerald-100/50',
    },
    {
      name: 'Total Expenses',
      value: formatCurrency(totalExpenses),
      icon: ArrowDownRight,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50/50',
      borderColor: 'border-rose-100/50',
    },
    {
      name: 'Transactions',
      value: transactionCount.toString(),
      icon: Activity,
      color: 'text-slate-600',
      bgColor: 'bg-slate-50',
      borderColor: 'border-slate-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.name}
          className={twMerge(
            'relative overflow-hidden rounded-xl bg-white p-5 border shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]',
            card.borderColor
          )}
        >
          <div className="flex flex-col gap-3">
            <div className={twMerge('w-fit rounded-lg p-2', card.bgColor)}>
              <card.icon className={twMerge('h-4 w-4', card.color)} aria-hidden="true" />
            </div>
            <div>
              <dt className="text-[13px] font-medium text-slate-500">{card.name}</dt>
              <dd className={twMerge('mt-1 text-2xl font-bold tracking-tight', card.color)}>
                {card.value}
              </dd>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
