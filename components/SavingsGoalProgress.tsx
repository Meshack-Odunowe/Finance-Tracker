'use client';

import { SavingsGoal } from '@/types/finance';
import { useCurrency } from '@/hooks/useCurrency';

export function SavingsGoalProgress({ goal }: { goal: SavingsGoal }) {
    const { format } = useCurrency();
    const percentage = Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100);

    return (
        <div className="space-y-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{goal.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                        Target: {format(goal.targetAmount)}
                    </p>
                </div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded-md">
                    {percentage}%
                </span>
            </div>

            <div className="space-y-1.5">
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-indigo-500 dark:bg-indigo-400 transition-all duration-500 ease-out"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <div className="flex justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    <span>{format(goal.currentAmount)}</span>
                    <span>{format(goal.targetAmount - goal.currentAmount)} to go</span>
                </div>
            </div>
        </div>
    );
}
