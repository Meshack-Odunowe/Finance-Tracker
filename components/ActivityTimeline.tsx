'use client';

import { ActivityLog } from '@/types/finance';
import { formatDate } from '@/utils/formatters';
import { Clock, Plus, Trash, Edit, CheckCircle } from 'lucide-react';

const icons = {
    TRANSACTION_ADDED: Plus,
    TRANSACTION_DELETED: Trash,
    TRANSACTION_UPDATED: Edit,
    GOAL_CREATED: CheckCircle,
    BUDGET_EXCEEDED: Clock,
};

export function ActivityTimeline({ logs }: { logs: any[] }) {
    if (logs.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Activity Timeline</h3>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">No activity yet. Your financial events will appear here.</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl">
                    <Clock className="h-4 w-4 text-indigo-500" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Activity Timeline</h3>
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-0.5">Recent Events</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 scrollbar-hide">
                {logs.map((log, idx) => {
                    const Icon = (icons as any)[log.type] || Clock;
                    return (
                        <div key={log.id} className="relative flex items-start gap-4">
                            {idx !== logs.length - 1 && (
                                <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-slate-100 dark:bg-slate-800" />
                            )}
                            <div className="p-1 rounded-full bg-slate-100 dark:bg-slate-800 z-10 transition-transform hover:scale-125 duration-300">
                                <Icon className="h-4 w-4 text-slate-600 dark:text-slate-400 p-0.5" />
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                    {log.description}
                                </p>
                                <time className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
                                    {formatDate(log.createdAt)}
                                </time>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
