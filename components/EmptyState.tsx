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
    <div className="text-center py-12 px-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
      <div className="mx-auto h-12 w-12 text-gray-400 flex items-center justify-center">
        <PlusCircle className="h-8 w-8" />
      </div>
      <h3 className="mt-2 text-sm font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">{description}</p>
      {actionLabel && actionHref && (
        <div className="mt-6">
          <Link
            href={actionHref}
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <PlusCircle className="-ml-0.5 mr-1.5 h-4 w-4" aria-hidden="true" />
            {actionLabel}
          </Link>
        </div>
      )}
    </div>
  );
}
