'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Budget } from '@/types/finance';
import { useFinanceStore } from '@/store/useFinanceStore';
import { formatCurrency } from '@/utils/formatters';
import { Edit2, Trash2, Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface BudgetCardProps {
  budget: Budget;
}

const budgetSchema = z.object({
  limit: z.number().positive('Limit must be positive'),
});

type BudgetFormValues = z.infer<typeof budgetSchema>;

export function BudgetCard({ budget }: BudgetCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { setBudget, deleteBudget } = useFinanceStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      limit: budget.limit,
    },
  });

  const onSubmit = async (data: BudgetFormValues) => {
    try {
      await setBudget({ category: budget.category, limit: data.limit });
      setIsEditing(false);
      toast.success('Budget updated successfully');
    } catch (error) {
      toast.error('Failed to update budget');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBudget(budget.category);
      toast.success('Budget deleted successfully');
    } catch (error) {
      toast.error('Failed to delete budget');
    }
  };

  return (
    <div className="bg-white overflow-hidden shadow-sm ring-1 ring-gray-900/5 rounded-xl p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold leading-6 text-gray-900">{budget.category}</h3>
        {!isEditing && (
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-400 hover:text-indigo-600 transition-colors"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
              className="text-gray-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 flex items-start space-x-2">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              step="0.01"
              {...register('limit', { valueAsNumber: true })}
              className="block w-full rounded-md border-0 py-1.5 pl-7 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            {errors.limit && <p className="mt-1 text-xs text-red-600">{errors.limit.message}</p>}
          </div>
          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <X className="h-4 w-4" />
          </button>
        </form>
      ) : (
        <div className="mt-4">
          <p className="text-2xl font-semibold tracking-tight text-gray-900">
            {formatCurrency(budget.limit)}
          </p>
          <p className="mt-1 text-sm text-gray-500">Monthly Limit</p>
        </div>
      )
      }
    </div >
  );
}
