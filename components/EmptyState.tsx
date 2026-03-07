import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({ title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50 transition-colors duration-300">
      <div className="h-12 w-12 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center mb-4 transition-colors duration-300">
        <PlusCircle className="h-5 w-5 text-slate-400 dark:text-slate-500" />
      </div>
      <h3 className="text-[15px] font-bold text-slate-900 dark:text-white transition-colors">{title}</h3>
      <p className="mt-1.5 text-[13px] text-slate-500 dark:text-slate-400 max-w-[240px] text-center leading-relaxed font-medium transition-colors">{description}</p>
      {actionLabel && actionHref && (
        <div className="mt-6">
          <Link
            href={actionHref}
            className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-[13px] font-semibold text-white shadow-sm shadow-indigo-200 dark:shadow-indigo-900/50 hover:bg-indigo-500 transition-all hover:scale-[1.02]"
          >
            {actionLabel}
          </Link>
        </div>
      )}
    </div>
  );
}
