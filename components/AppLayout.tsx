'use client';

import { Sidebar } from '@/components/Sidebar';
import { Toaster } from 'sonner';
import { useUIStore } from '@/store/useUIStore';
import { Menu, Wallet } from 'lucide-react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { toggleMobileMenu } = useUIStore();

  return (
    <div className="flex h-screen bg-[#fbfbfc] overflow-hidden">
      {/* Sidebar handles both desktop and mobile overlay */}
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile top bar */}
        <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 md:hidden">
          <div className="flex items-center">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600">
              <Wallet className="h-4 w-4 text-white" />
            </div>
            <span className="ml-3 text-[15px] font-semibold text-slate-800 tracking-tight">Capital</span>
          </div>
          <button
            onClick={toggleMobileMenu}
            className="flex h-9 w-9 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <Menu className="h-5 w-5" />
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
