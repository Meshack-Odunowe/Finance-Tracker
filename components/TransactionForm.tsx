'use client';

import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFinanceStore } from '@/store/useFinanceStore';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/utils/categoryHelpers';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const transactionSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  type: z.enum(['income', 'expense']),
  category: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

export function TransactionForm() {
  const addTransaction = useFinanceStore((state) => state.addTransaction);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
      description: '',
      category: '',
    },
  });

  const type = useWatch({ control, name: 'type' });
  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const onSubmit = async (data: TransactionFormValues) => {
    try {
      await addTransaction({
        ...data,
        description: data.description || '',
      });
      toast.success('Transaction added successfully!');
      reset({
        type: data.type,
        date: new Date().toISOString().split('T')[0],
        description: '',
        amount: undefined,
        category: '',
      });
      router.push('/transactions');
    } catch (error) {
      toast.error('Failed to add transaction. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-none animate-in fade-in slide-in-from-bottom-4 duration-500 transition-colors">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <Label htmlFor="type" className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-2 transition-colors">
            Transaction Type
          </Label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select onValueChange={(val) => val && field.onChange(val)} value={field.value}>
                <SelectTrigger id="type" className="w-full h-11 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-[14px]">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="sm:col-span-3">
          <Label htmlFor="amount" className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-2 transition-colors">
            Amount
          </Label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <span className="text-slate-400 dark:text-slate-500 text-sm transition-colors">$</span>
            </div>
            <input
              type="number"
              step="0.01"
              id="amount"
              {...register('amount', { valueAsNumber: true })}
              className="block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 pl-8 pr-4 py-2.5 text-[14px] text-slate-900 dark:text-white transition-all focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
              placeholder="0.00"
            />
          </div>
          {errors.amount && <p className="mt-2 text-xs font-medium text-rose-500">{errors.amount.message}</p>}
        </div>

        <div className="sm:col-span-3">
          <Label htmlFor="category" className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-2 transition-colors">
            Category
          </Label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select onValueChange={(val) => val && field.onChange(val)} value={field.value}>
                <SelectTrigger id="category" className="w-full h-11 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-[14px]">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.category && <p className="mt-2 text-xs font-medium text-rose-500">{errors.category.message}</p>}
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="date" className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-2 transition-colors">
            Date
          </label>
          <input
            type="date"
            id="date"
            {...register('date')}
            className="block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 px-4 py-2.5 text-[14px] text-slate-900 dark:text-white transition-all focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 outline-none"
          />
          {errors.date && <p className="mt-2 text-xs font-medium text-rose-500">{errors.date.message}</p>}
        </div>

        <div className="col-span-full">
          <label htmlFor="description" className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-2 transition-colors">
            Description (Optional)
          </label>
          <input
            type="text"
            id="description"
            {...register('description')}
            className="block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 px-4 py-2.5 text-[14px] text-slate-900 dark:text-white transition-all focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
            placeholder="e.g. Weekly Groceries"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-x-4 pt-4 border-t border-slate-100 dark:border-slate-800 transition-colors">
        <button
          type="button"
          onClick={() => reset()}
          className="px-4 py-2 text-[13px] font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
        >
          Reset
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-indigo-600 px-6 py-2 text-[13px] font-bold text-white shadow-sm shadow-indigo-200 dark:shadow-indigo-900/50 hover:bg-indigo-500 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
        >
          {isSubmitting ? 'Adding...' : 'Add Transaction'}
        </button>
      </div>
    </form>
  );
}
