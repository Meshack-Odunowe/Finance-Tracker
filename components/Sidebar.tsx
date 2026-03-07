'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ReceiptText, PlusCircle, PieChart, Wallet, ChevronLeft, ChevronRight, X, LogOut, Shield } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useUIStore } from '@/store/useUIStore';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Transactions', href: '/transactions', icon: ReceiptText },
  { name: 'Add Transaction', href: '/add-transaction', icon: PlusCircle },
  { name: 'Budget', href: '/budget', icon: PieChart },
  { name: 'Security', href: '/auth/change-password', icon: Shield },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isSidebarCollapsed, toggleSidebar, isMobileMenuOpen, closeMobileMenu } = useUIStore();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        toast.success('Logged out successfully');
        router.push('/auth/login');
        router.refresh();
      }
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const sidebarContent = (
    <div className={twMerge(
      'flex h-full flex-col border-r border-slate-200 bg-[#f8f9fb] transition-all duration-300 ease-in-out',
      isSidebarCollapsed ? 'md:w-[72px]' : 'md:w-64',
      'w-64'
    )}>
      <div className="flex h-14 items-center justify-between px-5 border-b border-transparent">
        <div className="flex items-center overflow-hidden">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 shadow-sm shadow-indigo-200">
            <Wallet className="h-4 w-4 text-white" />
          </div>
          {!isSidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="ml-3 text-[15px] font-semibold text-slate-800 tracking-tight whitespace-nowrap"
            >
              Capital
            </motion.span>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className="hidden md:flex items-center justify-center h-7 w-7 rounded-md hover:bg-slate-200/50 text-slate-400 transition-colors"
        >
          {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-6 overflow-y-auto">
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
                  'group flex items-center px-3 py-1.5 text-[13px] font-medium rounded-md transition-all duration-150',
                  isActive
                    ? 'text-slate-900 bg-slate-200/60'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/40',
                  isSidebarCollapsed ? 'justify-center' : 'justify-start'
                )
              )}
              title={isSidebarCollapsed ? item.name : ''}
            >
              <item.icon
                className={twMerge(
                  clsx(
                    'h-4 w-4 flex-shrink-0 transition-colors',
                    isActive ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-900',
                    isSidebarCollapsed ? 'mr-0' : 'mr-3'
                  )
                )}
                aria-hidden="true"
              />
              {!isSidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -5 }}
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

      <div className="p-4 mt-auto border-t border-slate-200/50 space-y-4">
        {!isSidebarCollapsed && (
          <div className="rounded-xl bg-white p-3 border border-slate-200 shadow-sm">
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">Pro Plan</p>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] font-semibold text-slate-700">Usage Tracker</span>
              <span className="text-[11px] text-indigo-600 font-bold">85%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full" style={{ width: '85%' }} />
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={twMerge(
            "flex items-center px-3 py-1.5 text-[13px] font-medium rounded-md transition-all duration-150 text-slate-500 hover:text-red-600 hover:bg-red-50 w-full",
            isSidebarCollapsed ? "justify-center" : "justify-start"
          )}
        >
          <LogOut className={twMerge("h-4 w-4 shrink-0", isSidebarCollapsed ? "mr-0" : "mr-3")} />
          {!isSidebarCollapsed && <span>Log Out</span>}
        </button>
      </div>
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
