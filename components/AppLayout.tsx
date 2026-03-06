'use client';

import { Sidebar } from '@/components/Sidebar';
import { Toaster } from 'sonner';
import { useUIStore } from '@/store/useUIStore';
import { Menu, Wallet } from 'lucide-react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { toggleMobileMenu } = useUIStore();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar handles both desktop and mobile overlay */}
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile top bar */}
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:hidden">
          <div className="flex items-center">
            <Wallet className="h-6 w-6 text-indigo-600 mr-2" />
            <span className="text-lg font-semibold text-gray-900">FinanceTracker</span>
          </div>
          <button
            onClick={toggleMobileMenu}
            className="flex h-10 w-10 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-8">
            {children}
          </div>
        </main>
      </div>

      <Toaster position="top-right" richColors />
    </div>
  );
}
