'use client';

import { formatCurrency } from '@/utils/formatters';
import { motion } from 'motion/react';

interface BudgetProgressProps {
  category: string;
  spent: number;
  limit: number;
}

export function BudgetProgress({ category, spent, limit }: BudgetProgressProps) {
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
        <span className="text-sm font-medium text-gray-700">{category}</span>
        <div className="text-sm text-gray-500">
          <span className={percentage >= 100 ? 'text-red-600 font-medium' : ''}>
            {formatCurrency(spent)}
          </span>
          {' / '}
          {formatCurrency(limit)}
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
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
