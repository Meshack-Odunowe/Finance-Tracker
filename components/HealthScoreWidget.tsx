'use client';

import { Transaction, Budget } from '@/types/finance';
import { calculateHealthScore } from '@/utils/financeCalculations';
import { Activity } from 'lucide-react';

export function HealthScoreWidget({ transactions, budgets }: { transactions: Transaction[], budgets: Budget[] }) {
    const score = calculateHealthScore(transactions, budgets);

    const getStatusColor = (s: number) => {
        if (s >= 80) return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10';
        if (s >= 50) return 'text-amber-500 bg-amber-50 dark:bg-amber-500/10';
        return 'text-rose-500 bg-rose-50 dark:bg-rose-500/10';
    };

    const getStatusText = (s: number) => {
        if (s >= 80) return 'Excellent';
        if (s >= 50) return 'Good';
        return 'Needs Attention';
    };

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-all hover:shadow-md h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
                        <Activity className="h-4 w-4 text-indigo-500" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Health Score</h3>
                </div>
                <span className={`text-[11px] font-bold px-2 py-1 rounded-md ${getStatusColor(score)}`}>
                    {getStatusText(score)}
                </span>
            </div>

            <div className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900 dark:text-white transition-all transform hover:scale-105 duration-300">
                    {score}
                </span>
                <span className="text-lg font-bold text-slate-400 dark:text-slate-500">/ 100</span>
            </div>

            <div className="mt-4 space-y-2">
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-1000 ease-out ${score >= 80 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                        style={{ width: `${score}%` }}
                    />
                </div>
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    Your financial health is based on your savings, budget adherence, and spending.
                </p>
            </div>
        </div>
    );
}
