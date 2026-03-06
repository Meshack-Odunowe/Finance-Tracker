'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFinanceStore } from '@/store/useFinanceStore';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/utils/categoryHelpers';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

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
    },
  });

  const type = useWatch({ control, name: 'type' });
  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const onSubmit = (data: TransactionFormValues) => {
    addTransaction({
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
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6 md:p-8">
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <label htmlFor="type" className="block text-sm font-medium leading-6 text-gray-900">
            Transaction Type
          </label>
          <div className="mt-2">
            <select
              id="type"
              {...register('type')}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="amount" className="block text-sm font-medium leading-6 text-gray-900">
            Amount
          </label>
          <div className="mt-2 relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              step="0.01"
              id="amount"
              {...register('amount', { valueAsNumber: true })}
              className="block w-full rounded-md border-0 py-1.5 pl-7 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="0.00"
            />
          </div>
          {errors.amount && <p className="mt-2 text-sm text-red-600">{errors.amount.message}</p>}
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="category" className="block text-sm font-medium leading-6 text-gray-900">
            Category
          </label>
          <div className="mt-2">
            <select
              id="category"
              {...register('category')}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          {errors.category && <p className="mt-2 text-sm text-red-600">{errors.category.message}</p>}
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="date" className="block text-sm font-medium leading-6 text-gray-900">
            Date
          </label>
          <div className="mt-2">
            <input
              type="date"
              id="date"
              {...register('date')}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
            />
          </div>
          {errors.date && <p className="mt-2 text-sm text-red-600">{errors.date.message}</p>}
        </div>

        <div className="col-span-full">
          <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
            Description (Optional)
          </label>
          <div className="mt-2">
            <input
              type="text"
              id="description"
              {...register('description')}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Groceries, Rent, etc."
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          onClick={() => reset()}
          className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-700"
        >
          Reset
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
        >
          Add Transaction
        </button>
      </div>
    </form>
  );
}
