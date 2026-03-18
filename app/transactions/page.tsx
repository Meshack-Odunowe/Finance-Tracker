'use client';

import { useState, useMemo } from 'react';
import { useFinanceStore } from '@/store/useFinanceStore';
import { useHydration } from '@/hooks/useHydration';
import { TransactionList } from '@/components/TransactionList';
import { DEFAULT_CATEGORIES } from '@/utils/categoryHelpers';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search, Filter, Calendar, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { subDays, startOfMonth, isWithinInterval } from 'date-fns';

export default function TransactionsPage() {
  const isHydrated = useHydration();
  const transactions = useFinanceStore((state) => state.transactions);

  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterType, setFilterType] = useState<string>('All');
  const [filterDateRange, setFilterDateRange] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      // Search
      const matchesSearch =
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase());

      // Category
      const matchesCategory = filterCategory === 'All' || t.category === filterCategory;

      // Type
      const matchesType = filterType === 'All' || t.type === filterType;

      // Date Range
      let matchesDate = true;
      const tDate = new Date(t.date);
      const now = new Date();

      if (filterDateRange === '7days') {
        matchesDate = isWithinInterval(tDate, { start: subDays(now, 7), end: now });
      } else if (filterDateRange === '30days') {
        matchesDate = isWithinInterval(tDate, { start: subDays(now, 30), end: now });
      } else if (filterDateRange === 'thisMonth') {
        matchesDate = isWithinInterval(tDate, { start: startOfMonth(now), end: now });
      }

      return matchesSearch && matchesCategory && matchesType && matchesDate;
    });
  }, [transactions, searchQuery, filterCategory, filterType, filterDateRange]);

  if (!isHydrated) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  const allCategories = Array.from(new Set([
    'All',
    ...DEFAULT_CATEGORIES,
    ...transactions.map(t => t.category)
  ]));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold leading-7 text-slate-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight transition-colors">
            Transactions
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 transition-colors">
            A list of all your income and expenses.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <a
            href="/add-transaction"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all active:scale-95"
          >
            Add Transaction
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white/50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-sm transition-colors shadow-sm">
        <div className="space-y-2">
          <Label htmlFor="search" className="text-[12px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Search
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              id="search"
              type="text"
              placeholder="Search description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category-filter" className="text-[12px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Category
          </Label>
          <Select value={filterCategory} onValueChange={(val) => val && setFilterCategory(val)}>
            <SelectTrigger id="category-filter" className="w-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl h-10">
              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-slate-400" />
                <SelectValue placeholder="All Categories" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 max-h-80">
              {allCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="type-filter" className="text-[12px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Type
          </Label>
          <Select value={filterType} onValueChange={(val) => val && setFilterType(val)}>
            <SelectTrigger id="type-filter" className="w-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl h-10">
              <div className="flex items-center gap-2">
                {filterType === 'income' ? <ArrowUpCircle className="h-3.5 w-3.5 text-emerald-500" /> : filterType === 'expense' ? <ArrowDownCircle className="h-3.5 w-3.5 text-rose-500" /> : <Filter className="h-3.5 w-3.5 text-slate-400" />}
                <SelectValue placeholder="All Types" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <SelectItem value="All">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date-filter" className="text-[12px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Date Range
          </Label>
          <Select value={filterDateRange} onValueChange={(val) => val && setFilterDateRange(val)}>
            <SelectTrigger id="date-filter" className="w-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl h-10">
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <SelectValue placeholder="All Time" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <SelectItem value="All">All Time</SelectItem>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="thisMonth">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <TransactionList transactions={filteredTransactions} showActions={true} />
      </div>
    </div>
  );
}
