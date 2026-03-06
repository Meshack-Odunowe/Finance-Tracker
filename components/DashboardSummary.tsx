'use client';

import { ArrowDownRight, ArrowUpRight, DollarSign, Activity } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

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
      color: remainingBalance >= 0 ? 'text-emerald-600' : 'text-red-600',
      bgColor: remainingBalance >= 0 ? 'bg-emerald-100' : 'bg-red-100',
    },
    {
      name: 'Total Income',
      value: formatCurrency(totalIncome),
      icon: ArrowUpRight,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
    {
      name: 'Total Expenses',
      value: formatCurrency(totalExpenses),
      icon: ArrowDownRight,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      name: 'Transactions',
      value: transactionCount.toString(),
      icon: Activity,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.name}
          className="overflow-hidden rounded-xl bg-white px-4 py-5 shadow-sm border border-gray-100 sm:p-6"
        >
          <div className="flex items-center">
            <div className={`flex-shrink-0 rounded-md p-3 ${card.bgColor}`}>
              <card.icon className={`h-6 w-6 ${card.color}`} aria-hidden="true" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dt className="truncate text-sm font-medium text-gray-500">{card.name}</dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900">{card.value}</dd>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
