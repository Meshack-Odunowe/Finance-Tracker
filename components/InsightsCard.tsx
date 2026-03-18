'use client';

import { Transaction, Budget } from '@/types/finance';
import { generateInsights } from '@/utils/financeCalculations';
import { Lightbulb, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

export function InsightsCard({ transactions, budgets }: { transactions: Transaction[], budgets: Budget[] }) {
    const insights = generateInsights(transactions, budgets);

    const icons = [Lightbulb, TrendingUp, CheckCircle];

    if (insights.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl">
                        <Lightbulb className="h-5 w-5 text-indigo-500" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Financial Insights</h3>
                </div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Add more transactions and set budgets to receive personalized insights.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm h-full dark:shadow-none transition-all hover:shadow-md">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl">
                    <Lightbulb className="h-5 w-5 text-indigo-500" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Smart Insights</h3>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-0.5">Automated Analysis</p>
                </div>
            </div>

            <div className="space-y-4">
                {insights.map((insight, idx) => {
                    const Icon = icons[idx % icons.length];
                    return (
                        <div key={idx} className="flex items-center gap-x-4 p-4 bg-slate-50 dark:bg-slate-800/10 rounded-xl border border-slate-100 dark:border-slate-800 group transition-all hover:bg-white dark:hover:bg-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500/20">
                            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg group-hover:scale-110 transition-transform">
                                <Icon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-snug">
                                {insight}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
