'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ReceiptText, PlusCircle, PieChart, Wallet, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useUIStore } from '@/store/useUIStore';
import { motion, AnimatePresence } from 'motion/react';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Transactions', href: '/transactions', icon: ReceiptText },
  { name: 'Add Transaction', href: '/add-transaction', icon: PlusCircle },
  { name: 'Budget', href: '/budget', icon: PieChart },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar, isMobileMenuOpen, closeMobileMenu } = useUIStore();

  const sidebarContent = (
    <div className={twMerge(
      'flex h-full flex-col border-r border-gray-200 bg-white transition-all duration-300 ease-in-out',
      isSidebarCollapsed ? 'md:w-20' : 'md:w-64',
      'w-64' // Always expanded width for mobile/drawer
    )}>
      <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
        <div className="flex items-center overflow-hidden">
          <Wallet className="h-6 w-6 text-indigo-600 flex-shrink-0" />
          {!isSidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="ml-2 text-lg font-semibold text-gray-900 whitespace-nowrap"
            >
              FinanceTracker
            </motion.span>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className="hidden md:flex items-center justify-center h-8 w-8 rounded-md hover:bg-gray-100 text-gray-500"
        >
          {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
        <button
          onClick={closeMobileMenu}
          className="md:hidden flex items-center justify-center h-8 w-8 rounded-md hover:bg-gray-100 text-gray-500"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => {
                if (window.innerWidth < 768) closeMobileMenu();
              }}
              className={twMerge(
                clsx(
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200',
                  isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
                  isSidebarCollapsed ? 'justify-center' : 'justify-start'
                )
              )}
              title={isSidebarCollapsed ? item.name : ''}
            >
              <item.icon
                className={twMerge(
                  clsx(
                    'h-5 w-5 flex-shrink-0',
                    isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500',
                    isSidebarCollapsed ? 'mr-0' : 'mr-3'
                  )
                )}
                aria-hidden="true"
              />
              {!isSidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="whitespace-nowrap"
                >
                  {item.name}
                </motion.span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex h-full flex-col">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
              className="absolute inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative flex w-full max-w-xs flex-1 flex-col bg-white h-full"
            >
              {sidebarContent}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
