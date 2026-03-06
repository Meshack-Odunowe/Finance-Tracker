'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ReceiptText, PlusCircle, PieChart, Wallet } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Transactions', href: '/transactions', icon: ReceiptText },
  { name: 'Add Transaction', href: '/add-transaction', icon: PlusCircle },
  { name: 'Budget', href: '/budget', icon: PieChart },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center px-6 border-b border-gray-200">
        <Wallet className="h-6 w-6 text-indigo-600 mr-2" />
        <span className="text-lg font-semibold text-gray-900">FinanceTracker</span>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={twMerge(
                clsx(
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                )
              )}
            >
              <item.icon
                className={twMerge(
                  clsx(
                    'mr-3 h-5 w-5 flex-shrink-0',
                    isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'
                  )
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
