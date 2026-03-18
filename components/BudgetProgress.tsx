'use client';

import { useCurrency } from '@/hooks/useCurrency';
import { motion } from 'motion/react';

interface BudgetProgressProps {
  category: string;
  spent: number;
  limit: number;
}

export function BudgetProgress({ category, spent, limit }: BudgetProgressProps) {
  const { format } = useCurrency();
  const percentage = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;

  let colorClass = 'bg-emerald-500';
  if (percentage >= 100) {
    colorClass = 'bg-red-500';
  } else if (percentage >= 80) {
    colorClass = 'bg-yellow-500';
  }

  return (
    <div className="mb-4">
      <div className="flex justify-between items-end mb-1">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors">{category}</span>
        <div className="text-sm text-slate-500 dark:text-slate-400 transition-colors">
          <span className={percentage >= 100 ? 'text-red-500 dark:text-red-400 font-medium' : ''}>
            {format(spent)}
          </span>
          {' / '}
          {format(limit)}
        </div>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden transition-colors duration-300">
        <motion.div
          className={`h-2.5 rounded-full ${colorClass}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
